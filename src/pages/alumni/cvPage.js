import React from 'react'
import dp from '../../Black2.jpg'
import Message from '../../components/message'
import { Card, Row, Col, Button, Accordion, Form } from 'react-bootstrap'

const CvPage = () => {
    return (
        <Card style={{border:'none'}}>
            {/* <Card.Header >
                <Message variant='info' >CV </Message>
            </Card.Header> */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>Create CV</Card.Header>
                        <Card.Body>
                            <Accordion>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
                                            Personal Informations
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>
                                            <Row>
                                                <Col md={4}>
                                                    <Card style={{ placeItems: 'center', paddingBottom: '12px', marginBottom: '12px' }}>
                                                        <Card.Body>
                                                        <Card.Img src={dp} style={{ width: '100px', height: '100px' }}></Card.Img>
                                                        </Card.Body>
                                                        <Card.Footer style={{padding: 0}}>
                                                            <Button><small>Change Image</small></Button>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Form>
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="formGridEmail">
                                                            <Form.Label>First name</Form.Label>
                                                            <Form.Control type="text" placeholder="first name" />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridPassword">
                                                            <Form.Label>Last Name</Form.Label>
                                                            <Form.Control type="text" placeholder="last name" />
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <Form.Group controlId="formGridAddress1">
                                                            <Form.Label>Phone</Form.Label>
                                                            <Form.Control type="text" placeholder="phone number" />
                                                        </Form.Group>

                                                        <Form.Group controlId="formGridAddress2">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control type="email" placeholder="email" />
                                                        </Form.Group>
                                                        </Form>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col md={{ span: 12, offset: 0 }}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                        <Form.Label>Date Of Birth</Form.Label>
                                                        <Form.Control type="date" placeholder="date of birth" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridPassword">
                                                        <Form.Label>Nationality</Form.Label>
                                                        <Form.Control type="text" placeholder="nationality" />
                                                        </Form.Group>
                                                    </Form.Row>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col md={{ span: 12, offset: 0 }}>
                                                        <Form.Label><b>Address</b></Form.Label>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                        <Form.Label>Country</Form.Label>
                                                        <Form.Control type="text" placeholder="country" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridPassword">
                                                        <Form.Label>City</Form.Label>
                                                        <Form.Control type="text" placeholder="city" />
                                                        </Form.Group>
                                                    </Form.Row>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="1">
                                            Education
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Institution Name</Form.Label>
                                                    <Form.Control type="text" placeholder="first name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Education Level</Form.Label>
                                                      <Form.Control as="select" size="lg">
                                                        <option>---Select Level---</option>
                                                        <option>Primary</option>
                                                        <option>O-Level</option>
                                                        <option>A-Level</option>
                                                        <option>Certificate</option>
                                                        <option>Diploma</option>
                                                        <option>Degree</option>
                                                    </Form.Control>
                                                    </Form.Group>
                                                </Form.Row>
                                                    <Form.Label><b>Time Period</b></Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                    <Form.Control type="month" placeholder="date of birth" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                    <Form.Control type="month" placeholder="nationality" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                                </Row>

                                                </Form>
                                            
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card >
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="2">
                                            Work Experiance
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Company name</Form.Label>
                                                    <Form.Control type="text" placeholder="first name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Job Title</Form.Label>
                                                    <Form.Control type="text" placeholder="last name" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>City</Form.Label>
                                                    <Form.Control type="text" placeholder="first name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Country</Form.Label>
                                                    <Form.Control type="text" placeholder="last name" />
                                                    </Form.Group>
                                                </Form.Row>
                                                    <Form.Label><b>Time Period</b></Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                    <Form.Control type="month" placeholder="date of birth" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                    <Form.Control type="month" placeholder="nationality" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                                </Row>

                                                </Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="3">
                                            Skills
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>
                                            <Form>
                                                 <Form.Check  type="checkbox" id="skill 1" label="Grapgics Design" /> 
                                                 <Form.Check  type="checkbox" id="skill 2" label="System Analyst" /> 
                                                 <Form.Check  type="checkbox" id="skill 3" label="System Administrator" /> 
                                                 <Form.Check  type="checkbox" id="skill 4" label="Security" /> 
                                                 <Form.Check  type="checkbox" id="skill 5" label="Networking" />
                                                <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                                </Row>
                                            </Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey="4">
                                            Certification
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="4">
                                        <Card.Body>
                                            <Form>
                                                 <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Certificate Name</Form.Label>
                                                    <Form.Control type="text" placeholder="first name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Authority</Form.Label>
                                                    <Form.Control type="text" placeholder="last name" />
                                                    </Form.Group>
                                                </Form.Row>
                                                 <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Certificate File</Form.Label>
                                                    <Form.Control type="file" placeholder="first name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Date Of Certification</Form.Label>
                                                    <Form.Control type="month" placeholder="last name" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                                </Row>
                                            </Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header>CV Preview</Card.Header>
                    </Card>
                </Col>
            </Row>

        </Card>
    )
}

export default CvPage

