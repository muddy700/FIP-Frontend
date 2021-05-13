import React, {useState, useEffect} from 'react'
import { Card, Row, Col, Button, Table } from 'react-bootstrap'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { selectUserData, saveUser, apiConfigurations } from '../../slices/userSlice'
import { useSelector, useDispatch}  from 'react-redux'
import { getAlumniProfile } from '../../app/api'

const ProfilePage = () => {

    const user = useSelector(selectUserData)
    const [alumniProfile, setAlumniProfile] = useState({})
    const config = useSelector(apiConfigurations)

    const getProfile = async () => {

                try {
                    const profile = await getAlumniProfile(user.userId, config)
                    setAlumniProfile(profile[0])
                } catch (error) {
                    console.log({
                        'Request': 'Getting Alumni Profile Request',
                        'Error => ' : error,
                    })
                }
    }


    useEffect(() => {
        getProfile()
    }, [])

    return (
        <div style={{paddingBottom: '100px'}}>
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
                                    <td className="post-properties">NAME</td>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">ADDRESS</td>
                                    <td>{user.email}</td>
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
                            <Card.Img src={user.profile_image} style={{ width: '200px', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>{user.first_name}  { user.last_name}</Card.Title>
                        </Card.Body>
                        <Card.Footer style={{backgroundColor: 'inherit'}}>
                            <Row>
                                <Col md={{span: 8, offset: 2}}>
                                    <Button style={{width: '100%'}}>Change Image</Button>
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
