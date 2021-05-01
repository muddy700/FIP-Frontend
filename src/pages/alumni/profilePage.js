import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import dp from '../../Black2.jpg'
import '../../styles/alumni.css'

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
                        <Card.Header style={{textAlign: 'center'}}><b>Personal Info</b></Card.Header>
                        <Card.Body>
                            <Row className="user-info-row">
                                <Col md={4}><b>Reg No:</b></Col> <Col>{userInfo.regNo} </Col>
                            </Row>
                            <Row className="user-info-row">
                                <Col md={4}><b>First Name:</b></Col> <Col>{userInfo.first_Name} </Col>
                            </Row> 
                            <Row className="user-info-row">
                                <Col md={4}><b>Middle Name:</b></Col> <Col>{userInfo.last_name} </Col>
                            </Row>
                            <Row className="user-info-row">
                                <Col md={4}><b>Last Name:</b></Col> <Col>{userInfo.first_Name} </Col>
                            </Row>
                            <Row className="user-info-row">
                                <Col md={4}><b>Email:</b></Col> <Col>user1@gmail.ac.tz nvdfvds vcdds sdcds  </Col>
                            </Row> 
                            <Row className="user-info-row">
                                <Col md={4}><b>Gender:</b></Col> <Col>Male  </Col>
                            </Row> 
                            <Row className="user-info-row">
                                <Col md={4}><b>Degree Program:</b></Col> <Col>CS  </Col>
                            </Row> 
                            <Row className="user-info-row">
                                <Col md={4}><b>Phone:</b></Col> <Col>{userInfo.phone} </Col>
                            </Row>
                            <Row className="user-info-row">
                                <Col md={4}><b>Completion Year:</b></Col> <Col>2010 </Col>
                            </Row>
                        </Card.Body>
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
