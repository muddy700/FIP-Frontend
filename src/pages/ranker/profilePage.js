import React, {useState} from 'react'
import { Card, Row, Col, Button, Table, Form, Alert } from 'react-bootstrap'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { selectUserData, saveUser, apiConfigurations } from '../../slices/userSlice'
import { useSelector, useDispatch}  from 'react-redux'
import { editUserProfile, editUserInfo } from '../../app/api'
import Loader from '../../components/loader'
import ContentModal from '../../components/contentModal'
import dpPlaceHolder from '../../images/default-for-user.png'

const ProfilePage = () => {
    const user = useSelector(selectUserData)
    const { profileId } = user

    const initialProfile = {
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    }

    const dispatch = useDispatch();
    // const [alumniProfile, setAlumniProfile] = useState({})
    const config = useSelector(apiConfigurations)
    const [profileImage, setProfileImage] = useState(null)
    const [fileError, setFileError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoading2, setIsLoading2] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [showProfileForm, setShowProfileForm] = useState(false)
    const [profileChanges, setProfileChanges] = useState(initialProfile)
    const [infoError, setInfoError] = useState('')

    // const getProfile = async () => {
    //     try {
    //         const profile = await getAlumniProfile(user.userId, config)
    //         setAlumniProfile(profile[0])
    //         // console.log(profile)
    //     } catch (error) {
    //         console.log({
    //             'Request': 'Getting Alumni Profile Request',
    //             'Error => ' : error,
    //         })
    //     }
    // }


    // useEffect(() => {
    //     getProfile();
    // }, [])

    const handleProfileImage = (e) => {
        setFileError('')
        setProfileImage(e.target.files[0] ? e.target.files[0] : null)
        setIsLoading(false)
        setSuccessMessage('')
    }

    const validateImageForm = () => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!profileImage) {
      setFileError('Image Cannot Be Blank!')
      return false;
    }
    else if (!allowedExtensions.exec(profileImage.name)) {
      setFileError('Unsupported File Type!')
      setProfileImage(null)
      return false;
    }
    else {
        setFileError('')
      return true;
    }
    }
    
    const changeProfileImage = async (e) => {
        e.preventDefault()

        const isImageValid = validateImageForm()
        if (isImageValid) {
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
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    }
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
                    'Error => ': error.response.data,
                })
                setIsLoading(false)
            }
        }
        else {
        console.log('Invalid Image File')
        }
    }

    const prepareForm = (e) => {
        e.preventDefault()
        setShowProfileForm(true)
        setSuccessMessage('')
        setProfileChanges({
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            email: user.email
        })
    }

    const handleProfileChanges = (e) => {
        setInfoError('')
        setProfileChanges({
            ...profileChanges,
            [e.target.name] : e.target.value
        })
    }

    
    const profileFormValidator = () => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailResult = re.test(profileChanges.email)
        
        // if (!profileChanges.first_name) {
        //     setInfoError('First name cannot be blank.')
        //     return false;
        // }
        // else if (!profileChanges.last_name) {
        //     setInfoError('Last name cannot be blank.')
        //     return false;
        // }
        if (!profileChanges.phone) {
            setInfoError('Phone number cannot be blank.')
            return false;
        }
        else if (profileChanges.phone.length < 10) {
            setInfoError('Enter atleast 10 digits in phone number.')
            return false;
        }
        else if (!profileChanges.email) {
            setInfoError('Email cannot be blank.')
            return false;
        }
        else if (!emailResult) {
            setInfoError('Enter a valid email')
            return false;
        }
        else {
            setInfoError('')
            return true
        }
    }

    const sendProfileChanges = async (e) => {
        e.preventDefault()
        const isDataValid = profileFormValidator()

        if (isDataValid) {
            setIsLoading2(true)
        
            const payload1 = {
                id: user.userId,
                username: user.username,
                first_name: profileChanges.first_name,
                last_name: profileChanges.last_name,
                email: profileChanges.email,
                // password: alumniProfile.pwd
            }

            // const blob = await (await fetch(user.profile_image)).blob();
            // const prof_img = new File([blob], `${user.username}.jpg`, {type:"image/jpeg", lastModified:new Date()});

            const payload2 = new FormData();
            // payload2.append('profile_image', prof_img)
            payload2.append('user', user.userId)
            payload2.append('designation', user.designation_id)
            payload2.append('phone', profileChanges.phone)
            payload2.append('gender', user.gender)
            const config2 = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }

            try {
                const response1 = await editUserInfo(payload1, config)
                try {
                    const response2 = await editUserProfile(profileId, payload2, config2)
                    dispatch(saveUser({
                        ...user,
                        first_name: response1.first_name,
                        last_name: response1.last_name,
                        email: response1.email,
                        phone: response2.phone
                    }))
                    setProfileChanges(initialProfile)
                    setIsLoading2(false)
                    setShowProfileForm(false)
                    setSuccessMessage('Profile Info Updated Successful.')
                }
                catch (error) {
                    console.log({
                        'Request': 'Edit User-Profile-Info Request',
                        'Error => ': error.response.data,
                    })
                    setIsLoading2(false)
                }
            }
            catch (error) {
                console.log({
                    'Request': 'Edit User-Info Request',
                    'Error => ': error.response.data,
                })
                setIsLoading2(false)
            }
        }
        else {
            console.log('Invalid Profile Info')
        }
    }

    const formTitle = 'Edit Profile Info';
    const formContents = <Form onSubmit={sendProfileChanges}>
            {/* <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>First name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter first name"
                        value={profileChanges.first_name}
                        onChange={handleProfileChanges}
                        name="first_name" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter last name"
                        value={profileChanges.last_name}
                        onChange={handleProfileChanges}
                        name="last_name" />
                </Form.Group>
            </Form.Row> */}

            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="enter phone number"
                        value={profileChanges.phone}
                        onChange={handleProfileChanges}
                        name="phone"  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAddress2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter email"
                        value={profileChanges.email}
                        onChange={handleProfileChanges}
                        name="email"  />
                </Form.Group>
            </Form.Row>
            <Row >
                <Col md={{span:6}}>
                <Button
                    hidden={!infoError}
                    variant="danger"
                    style={{ width: '100%' }}
                > {infoError} </Button>
                </Col>
                <Col md={{span:3, offset: 3}}>
                <Button
                    variant="primary"
                    type="submit"
                    style={{ width: '100%' }}
                > {isLoading2 ? <Loader message="Saving Info..." /> : 'Save'} </Button>
                </Col>
            </Row>
    </Form>;

    return (
        <div style={{ paddingBottom: '100px' }}>
            <Alert
                onClose={() => setSuccessMessage('')}
                dismissible
                variant='success'
                style={{textAlign: 'center'}}
                hidden={successMessage === '' ? true : false}
            > {successMessage}</Alert>
            <Row >
                <Col md={7} xs={12} style={{ marginBottom: '50px' }}>
                    <Card>
                        <Card.Header>
                            <Message  variant='info' >Personal Details</Message>  
                        </Card.Header>
                         <Card style={{padding: '16px'}}>
                <Card.Body style={{ padding: 0, overflowX: 'scroll'}}>
                    <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td className="post-properties">USERNAME</td>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">FIRST NAME</td>
                                            <td>{user.first_name} </td>
                                </tr>
                                <tr>
                                    <td className="post-properties">LAST NAME</td>
                                    <td>{user.last_name}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">GENDER</td>
                                    <td>{user.gender} </td>
                                </tr>
                                <tr>
                                    <td className="post-properties">EMAIL</td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">PHONE</td>
                                    <td>{user.phone}</td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                </Card>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{span: 4, offset: 4}}>
                                    <Button
                                        // disabled
                                        style={{ width: '100%' }}
                                        onClick={prepareForm}
                                    >Edit Info</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={{ span: 4, offset: 1 }} xs={12} >
                    
                    <Card>
                        <Card.Header style={{textAlign: 'center'}}><b>Photo</b></Card.Header>
                        <Card.Body style={{placeItems: 'center', display: 'grid'}}>
                            <Card.Img src={profileImage ? URL.createObjectURL(profileImage) : user.profile_image ? user.profile_image : dpPlaceHolder} style={{ width: '90%', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>{user.first_name.toUpperCase()}  { user.last_name.toUpperCase()}</Card.Title>
                        </Card.Body>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{ span: 8, offset: 2 }}>
                                    <Form.File id="formcheck-api-regular">
                                        <Form.File.Input onChange={handleProfileImage} name="profile_image" accept="image/*" />
                                    </Form.File>
                                    <Button
                                        // disabled
                                        style={{ width: '100%', marginTop: '5%' }}
                                        hidden={profileImage ? false : true}
                                        onClick={changeProfileImage}
                                    >{isLoading ? <Loader message="Saving Image..." /> : 'Save'}</Button>
                                     <Button
                                        style={{ width: '100%', marginTop: '5%' }}
                                        variant='danger'
                                        hidden={!fileError}
                                    >{fileError}</Button>
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
            onHide={() => { setShowProfileForm(false) }}
            />
        </div>
    )
}

export default ProfilePage
