import React, {useState, useEffect} from 'react'
import { Card, Row, Col, Table} from 'react-bootstrap'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { selectUserData, apiConfigurations } from '../../slices/userSlice'
import { useSelector}  from 'react-redux'
import { getStudentProfileInfo } from '../../app/api'
import dp from '../../images//default-for-user.png'


const ProfilePage = () => {
    const user = useSelector(selectUserData)
    const [studentProfile, setStudentProfile] = useState({})
    const config = useSelector(apiConfigurations)

    const getProfile = async () => {
        try {
            const profile = await getStudentProfileInfo(user.userId, config)
            setStudentProfile(profile[0])
        } catch (error) {
            console.log({
                'Request': 'Getting Student Profile Request',
                'Error => ' : error,
            })
        }
    }

    useEffect(() => {
        getProfile();
    }, [])

    return (
        <div style={{ paddingBottom: '100px' }}>
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
                                            <td>{studentProfile.registration_number}</td>
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
                                    <td>{studentProfile.degree_program}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">DEPARTMENT</td>
                                    <td>{studentProfile.department_name}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">YEAR OF STUDY</td>
                                    <td>{studentProfile.year_of_study}</td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                </Card>
                    </Card>
                </Col>
                <Col md={{ span: 4, offset: 1 }} xs={12} >
                    
                    <Card>
                        <Card.Header style={{textAlign: 'center'}}><b>Photo</b></Card.Header>
                        <Card.Body style={{placeItems: 'center', display: 'grid'}}>
                            <Card.Img src={user.profile_image ? user.profile_image : dp} style={{ width: '90%', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>{user.first_name.toUpperCase()}  { user.last_name.toUpperCase()}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProfilePage
