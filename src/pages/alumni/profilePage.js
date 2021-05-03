import React from 'react'
import { Card, Row, Col, Button, Table } from 'react-bootstrap'
import dp from '../../Black2.jpg'
import '../../styles/alumni.css'
import Message from '../../components/message'

const userInfo = {
    regNo: 'T/UDOM/2010/12345',
    email: 'usee@gmail.com',
    phone: '0789101112',
    first_Name: 'Yazid',
    last_name: 'Mbungi',
    gender: 'Male',
    completion_year: 2010,
    Program: 'Computer Science',

}
const ProfilePage = () => {
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
                                    <td className="post-properties">REG NO.</td>
                                            <td>{userInfo.regNo}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">FIRST NAME</td>
                                    <td>@Database</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">LAST NAME</td>
                                    <td>12</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">GENDER</td>
                                    <td>12/5/2021</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">EMAIL</td>
                                    <td>12/5/2021</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">PHONE</td>
                                    <td>12/5/2021</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">PROGRAM</td>
                                    <td>12/5/2021</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">COMPLETION YEAR</td>
                                    <td> cdgvffdsgdfwqee4r5rwedwqdeewfwqwd w </td>
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
                            <Card.Img src={dp} style={{ width: '200px', height: '200px' }}></Card.Img>
                            <Card.Title style={{ marginTop: '15px' }}>T/UDOM/2010/12345</Card.Title>
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
