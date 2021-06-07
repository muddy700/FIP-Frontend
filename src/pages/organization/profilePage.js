import React, {useState, useEffect} from 'react'
import { Card, Row, Col, Button, Table, Form, Alert,InputGroup, FormControl } from 'react-bootstrap'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { selectUserData, saveUser, apiConfigurations } from '../../slices/userSlice'
import { useSelector, useDispatch}  from 'react-redux'
import { editOrganizationProfile, editUserInfo, editUserProfile, getAlumniProfile, getOrganizationProfile } from '../../app/api'
import Loader from '../../components/loader'
import ContentModal from '../../components/contentModal'
import dpPlaceHolder from '../../images/default-for-user.png'

const ProfilePage = () => {
    
    const initialProfile = {
        username: '',
        phone: '',
        email: '',
        box_address: '',
        organization_description: ''
    }

    const [profileInfo, setProfileInfo] = useState(initialProfile)
    const user = useSelector(selectUserData)
    const { profileId } = user
    const [organizationProfile, setOrganizationProfile] = useState({})
    const config = useSelector(apiConfigurations)
    const [profileImage, setProfileImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoading2, setIsLoading2] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const dispatch = useDispatch();
    const [showProfileForm, setShowProfileForm] = useState(false)


    const getProfile = async () => {

        try {
            const profile = await getOrganizationProfile(user.userId, config)
            // setAlumniProfile(profile[0])
            // console.log(profile[0])
            setOrganizationProfile(profile[0])
        } catch (error) {
            console.log({
                'Request': 'Getting Organization Profile Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const prepareEditingForm = () => {
        setProfileInfo({
            username: user.username,
            phone: user.phone,
            box_address: organizationProfile.box_address,
            organization_description: organizationProfile.organization_description,
            email: user.email
        })
        setShowProfileForm(true)
    }

    const handleProfileForm = (e) => {
        setProfileInfo({
            ...profileInfo,
            [e.target.name] : e.target.value
        })
    }

    const saveProfileInfo = async (e) => {
        e.preventDefault()
        setIsLoading2(true)
        // console.log(profileInfo)
        const payload1 = {
            id: user.userId,
            username: profileInfo.username,
            email: profileInfo.email,
            password: organizationProfile.pwd
        }

        const payload2 = {
            ...organizationProfile,
            box_address: profileInfo.box_address,
            organization_description: profileInfo.organization_description
        }

        const blob = await (await fetch(user.profile_image)).blob();
        const prof_img = new File([blob], `${user.username}.jpg`, {type:"image/jpeg", lastModified:new Date()});

        const payload3 = new FormData();
        if(user.profile_image) payload3.append('profile_image', prof_img)
        payload3.append('user', user.userId)
        payload3.append('designation', user.designation_id)
        payload3.append('phone', profileInfo.phone)
        payload3.append('gender', user.gender)

        const config3 = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${localStorage.getItem('token')}`    }
        }

        try {
            const response1 = await editUserInfo(payload1, config)
            // console.log(response1)
            try {
                const response2 = await editOrganizationProfile(payload2, config)
                setOrganizationProfile(response2)
                try {
                    const response3 = await editUserProfile(profileId, payload3, config3)
                    dispatch(saveUser({
                        ...user,
                        email: response1.email,
                        username: response1.username,
                        phone: response3.phone
                    }))
                    setProfileInfo(initialProfile)
                    setIsLoading2(false)
                    setSuccessMessage('Profile Info Updated Successful')
                    setShowProfileForm(false)

                } catch (error) {
                    console.log('Edit User-Profile Request ', error.response.data)
                    setIsLoading2(false)
                }
                
            } catch (error) {
                console.log('Edit Organization-Profile Request', error.response.data)
                setIsLoading2(false)
            }
            
        } catch (error) {
            console.log('Edit Organization-Info Request', error.response.data)
            setIsLoading2(false)}
    }

    const formTitle = "Edit Profile Info"
    const formContents = <Form onSubmit={saveProfileInfo}>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter organization name"
                        value={profileInfo.username}
                        onChange={handleProfileForm}
                        name="username" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter last name"
                        value={profileInfo.box_address}
                        onChange={handleProfileForm}
                        name="box_address" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter phone number"
                        value={profileInfo.phone}
                        onChange={handleProfileForm}
                        name="phone"  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAddress2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="enter email"
                        value={profileInfo.email}
                        onChange={handleProfileForm}
                        name="email"  />
            </Form.Group>
            </Form.Row>
            <Form.Group>
                <Form.Label>Organization description</Form.Label>
                <Form.Control as="textarea"
                    placeholder="enter description"
                    value={profileInfo.organization_description}
                    onChange={handleProfileForm}
                    name="organization_description"
                    aria-label="With textarea" />
            </Form.Group>

            <Row >
                <Col md={{span:3, offset: 9}}>
                <Button
                    variant="primary"
                    type="submit"
                    style={{ width: '100%' }}
                > {isLoading2 ? <Loader message="Saving Info..." /> : 'Save'} </Button>
                </Col>
            </Row>
    </Form>;

    useEffect(() => {
        getProfile()
    }, [])

    const handleProfileImage = (e) => {
        setProfileImage(e.target.files[0])
        setIsLoading(false)
        setSuccessMessage('')
    }

    const changeProfileImage = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        
        const payload = new FormData();
        payload.append('profile_image', profileImage)
        payload.append('user', user.userId)
        payload.append('designation', user.designation_id)
        payload.append('phone', user.phone)
        payload.append('gender', user.gender)

        try {
            const config2 = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`    }
            }
            const response = await editUserProfile(profileId, payload, config2)
            dispatch(saveUser({
                ...user,
                profile_image: response.profile_image
            }))
            setIsLoading(false)
            setProfileImage(null)
            setSuccessMessage('Profile image changed successful.')
        } catch (error) {
            console.log({
                'Request': 'Edit Profile-Image Request',
                'Error => ' : error.response.data,
            })
            setIsLoading(false)
        }
    }

    return (
        <div style={{paddingBottom: '100px'}}>
            <Alert
                onClose={() => setSuccessMessage('')}
                dismissible
                variant='success'
                style={{textAlign: 'center'}}
                hidden={successMessage === '' ? true : false}
            > {successMessage}</Alert>
            <Row >
                <Col md={8} xs={12} style={{ marginBottom: '50px' }}>
                    <Card>
                        <Card.Header>
                            <Message  variant='info' >Organization Details</Message>  
                        </Card.Header>
                         <Card style={{padding: '16px'}}>
                <Card.Body style={{ padding: 0, overflowX: 'scroll'}}>
                    <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td className="post-properties">NAME</td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">ADDRESS</td>
                                    <td>{organizationProfile.box_address}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">EMAIL</td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">PHONE</td>
                                    <td>{user.phone}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">ORGANIZATION DESCRIPTION</td>
                                    <td>{organizationProfile.organization_description}</td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                </Card>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{span: 4, offset: 4}}>
                                    <Button
                                        onClick={prepareEditingForm}
                                        style={{ width: '100%' }}>Edit Info</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={{ span: 4, offset: 0 }} xs={12} >
                    <Card>
                        <Card.Header style={{textAlign: 'center'}}><b>Logo</b></Card.Header>
                        <Card.Body style={{placeItems: 'center', display: 'grid'}}>
                            <Card.Img src={profileImage ? URL.createObjectURL(profileImage) : user.profile_image ? user.profile_image : dpPlaceHolder} style={{ width: '90%', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>{user.username}</Card.Title>
                        </Card.Body>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{ span: 8, offset: 2 }}>
                                    <Form.File id="formcheck-api-regular">
                                        <Form.File.Input onChange={handleProfileImage} name="profile_image" accept="image/*" />
                                    </Form.File>
                                    <Button
                                        style={{ width: '100%', marginTop: '5%' }}
                                        hidden={profileImage ? false : true}
                                        onClick={changeProfileImage}
                                    >{isLoading ? <Loader message="Saving Image..." /> : 'Save'}</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
            <ContentModal
            show={showProfileForm}
            isTable={false}
            title={formTitle}
            content={formContents}
                onHide={() => { setShowProfileForm(false); setProfileInfo(initialProfile) }}
            />

        </div>
    )
}

export default ProfilePage
