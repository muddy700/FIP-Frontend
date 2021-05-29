import React, {useState, useEffect} from 'react'
import { Card, Row, Col, Button, Table, Form, Alert } from 'react-bootstrap'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { selectUserData, saveUser, apiConfigurations } from '../../slices/userSlice'
import { useSelector, useDispatch}  from 'react-redux'
import { editUserProfile, getAlumniProfile } from '../../app/api'
import Loader from '../../components/loader'

const ProfilePage = () => {

    const user = useSelector(selectUserData)
    const dispatch = useDispatch();
    const [alumniProfile, setAlumniProfile] = useState({})
    const config = useSelector(apiConfigurations)
    const [profileImage, setProfileImage] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const getProfile = async () => {
        try {
            const profile = await getAlumniProfile(user.userId, config)
            setAlumniProfile(profile[0])
            // console.log(profile)
        } catch (error) {
            console.log({
                'Request': 'Getting Alumni Profile Request',
                'Error => ' : error,
            })
        }
    }


    useEffect(() => {
        getProfile();
    }, [])

    const handleProfileImage = (e) => {
        setProfileImage(e.target.files[0])
        setIsLoading(false)
        setSuccessMessage('')
    }

    const changeProfileImage = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const { profileId } = user
        
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
                                    <td className="post-properties">REG NO.</td>
                                            <td>{alumniProfile.registration_number}</td>
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
                                <tr>
                                    <td className="post-properties">PROGRAM</td>
                                    <td>{alumniProfile.degree_program}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">COMPLETION YEAR</td>
                                    <td>{alumniProfile.completion_year}</td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                </Card>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{span: 4, offset: 4}}>
                                    <Button style={{width: '100%'}}>Edit Info</Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
                <Col md={{span:4, offset:1}} xs={12} >
                    <Card>
                        <Card.Header style={{textAlign: 'center'}}><b>Photo</b></Card.Header>
                        <Card.Body style={{placeItems: 'center', display: 'grid'}}>
                            <Card.Img src={profileImage ? URL.createObjectURL(profileImage) : user.profile_image} style={{ width: '200px', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>{user.first_name}  { user.last_name}</Card.Title>
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
        </div>
    )
}

export default ProfilePage
