import React, {useState} from 'react'
import dp from '../../Black2.jpg'
import Message from '../../components/message'
import { Card, Row, Col, Button, Accordion, Form } from 'react-bootstrap'

const CvPage = () => {
    const personal_info = {
        'first_name': '',
        last_name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        nationality: '',
        country: '',
        city: '',
        profile_image: null,
    }

    const education = {
        Institution: '',
        Level: '',
        From: '',
        To: ''
    }

    const workExperience = {
        company: '',
        job: '',
        city: '',
        country: '',
        from: '',
        to: ''
    }

    const certificate = {
        name: '',
        authority: '',
        certificate_file: null,
        date_of_certification: ''
    }

    const skillsList = [
        {
            id: 1,
            name: 'Database',
        },
        {
            id: 2,
            name: 'Security',
        },
        {
            id: 3,
            name: 'Networking',
        },
        {
            id: 4,
            name: 'Software Developer',
        }
    ]

    const [personalInfo, setPersonalInfo] = useState(personal_info)
    const [educationInfo, setEducationInfo] = useState(education)
    const [experienceInfo, setExperienceInfo] = useState(workExperience)
    const [certificateInfo, setCertificateInfo] = useState(certificate)
    const [alumniSkills, setAlumniSkills] = useState([])

    const onPersonalInfoChange = (e) => {
        e.preventDefault()
        if (e.target.name === 'profile_image') {
            setPersonalInfo({
                ...personalInfo,
                profile_image: e.target.files[0]
            })
        }
        else {
            setPersonalInfo({
                ...personalInfo,
                [e.target.name]: e.target.value
            })
        }
    }

    const onCertificateInfoChange = (e) => {
        e.preventDefault()
        if (e.target.name === 'certificate_file') {
            setCertificateInfo({
                ...certificateInfo,
                certificate_file: e.target.files[0]
            })
        }
        else {
            setCertificateInfo({
                ...certificateInfo,
                [e.target.name]: e.target.value
            })
        }
    }

    const saveCertificateInfo = (e) => {
        e.preventDefault();
        console.log(certificateInfo)
    }

    const savePersonalInfo = (e) => {
        e.preventDefault()
        console.log(personalInfo)
    }

    const onEducationInfoChange = (e) => {
        e.preventDefault()
        setEducationInfo({
            ...educationInfo,
            [e.target.name] : e.target.value
         })
    }

    const saveEducationInfo = (e) => {
        e.preventDefault();
        console.log(educationInfo)
    }

    const onExperienceInfoChange = (e) => {
        e.preventDefault();
        setExperienceInfo({
            ...experienceInfo,
            [e.target.name] : e.target.value
        })
    }

    const saveExperianceInfo = (e) => {
        e.preventDefault();
        console.log(saveExperianceInfo)
    }

    const handleAlumniSkills = (e) => {
        const name = e.target.value;
        const isThere = alumniSkills.find((skill) => skill === name)

        if (isThere) {
            const newSkills = alumniSkills.filter(skill => skill !== name)
            setAlumniSkills(newSkills)
        }
        else { setAlumniSkills([...alumniSkills, name]) }
    }

    return (    
        <Card style={{border:'none'}}>
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
                                        <Card.Body><Form onSubmit={e => savePersonalInfo(e)}>
                                            <Row>
                                                <Col md={4}>
                                                    <Card style={{ placeItems: 'center', paddingBottom: '12px', marginBottom: '12px' }}>
                                                        <Card.Body>
                                                            <Card.Img
                                                                src={personalInfo.profile_image ? URL.createObjectURL(personalInfo.profile_image) : dp}
                                                                style={{ width: '100px', height: '100px' }}></Card.Img>
                                                        </Card.Body>
                                                        <Card.Footer style={{ padding: 0 }}>
                                                            <Form.File id="formcheck-api-regular">
                                                                <Form.File.Input onChange={onPersonalInfoChange} name="profile_image" accept="image/*" />
                                                            {/* <input type="file" onChange={onPersonalInfoChange} name="profile_image" accept="image/*" /> */}
                                                            </Form.File>
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                        <Form.Label>First name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="first name"
                                                                value={personalInfo.first_name}
                                                                onChange={onPersonalInfoChange}
                                                                name="first_name" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridPassword">
                                                        <Form.Label>Last Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="last name"
                                                                value={personalInfo.last_name}
                                                                onChange={onPersonalInfoChange}
                                                                name="last_name" />
                                                        </Form.Group>
                                                    </Form.Row>

                                                    <Form.Group controlId="formGridAddress1">
                                                        <Form.Label>Phone</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="phone number"
                                                            value={personalInfo.phone}
                                                            onChange={onPersonalInfoChange}
                                                            name="phone"  />
                                                    </Form.Group>

                                                    <Form.Group controlId="formGridAddress2">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="email"
                                                            value={personalInfo.email}
                                                            onChange={onPersonalInfoChange}
                                                            name="email"  />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col md={{ span: 12, offset: 0 }}>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                        <Form.Label>Date Of Birth</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                placeholder="date of birth"
                                                                value={personalInfo.date_of_birth}
                                                                onChange={onPersonalInfoChange}
                                                                name="date_of_birth"  />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridPassword">
                                                        <Form.Label>Nationality</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="nationality"
                                                                value={personalInfo.nationality}
                                                                onChange={onPersonalInfoChange}
                                                                name="nationality"  />
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
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="country"
                                                                value={personalInfo.country}
                                                                onChange={onPersonalInfoChange}
                                                                name="country"  />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridPassword">
                                                        <Form.Label>City</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="city"
                                                                value={personalInfo.city}
                                                                onChange={onPersonalInfoChange}
                                                                name="city"  />
                                                        </Form.Group>
                                                    </Form.Row>
                                                </Col>
                                            </Row>
                                            <Row >
                                                <Col md={12}>
                                                <Button variant="primary" type="submit" style={{width: '100%'}}> Save </Button>
                                                </Col>
                                            </Row></Form>
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
                                            <Form onSubmit={e => saveEducationInfo(e)}>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Institution Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="institution name"
                                                            value={educationInfo.institution}
                                                            onChange={onEducationInfoChange}
                                                            name="Institution" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Education Level</Form.Label>
                                                        <Form.Control as="select"
                                                            size="lg"
                                                            value={educationInfo.level}
                                                            onChange={onEducationInfoChange}
                                                            name="Level">
                                                        <option>---Select Level---</option>
                                                        <option value="primary">Primary</option>
                                                        <option value="O-Level">O-Level</option>
                                                        <option value="A-Level">A-Level</option>
                                                        <option value="Certificate">Certificate</option>
                                                        <option value="Diploma">Diploma</option>
                                                        <option value="Degree">Degree</option>
                                                    </Form.Control>
                                                    </Form.Group>
                                                </Form.Row>
                                                    <Form.Label><b>Time Period</b></Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="start date"
                                                            value={educationInfo.from}
                                                            onChange={onEducationInfoChange}
                                                            name="From" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="nationality"
                                                            value={educationInfo.to}
                                                            onChange={onEducationInfoChange}
                                                            name="To" />
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
                                            <Form onSubmit={e => saveExperianceInfo(e)}>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Company name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="company name"
                                                            value={experienceInfo.company}
                                                            onChange={onExperienceInfoChange}
                                                            name="company" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Job Title</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="job title"
                                                            value={experienceInfo.job}
                                                            onChange={onExperienceInfoChange}
                                                            name="job" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>City</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="city"
                                                            value={experienceInfo.city}
                                                            onChange={onExperienceInfoChange}
                                                            name="city" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Country</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="country"
                                                            value={experienceInfo.country}
                                                            onChange={onExperienceInfoChange}
                                                            name="country" />
                                                    </Form.Group>
                                                </Form.Row>
                                                    <Form.Label><b>Time Period</b></Form.Label>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="start date"
                                                            value={experienceInfo.from}
                                                            onChange={onExperienceInfoChange}
                                                            name="from" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="end date"
                                                            value={experienceInfo.to}
                                                            onChange={onExperienceInfoChange}
                                                            name="to" />
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
                                                {skillsList.map(skill => (
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={skill.id}
                                                        label={skill.name}
                                                        value={skill.name}
                                                        onChange={handleAlumniSkills} />
                                                ))}
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
                                            <Form onSubmit={e => saveCertificateInfo(e)}>
                                                 <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Certificate Name</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="certificate name"
                                                            value={certificateInfo.name}
                                                            onChange={onCertificateInfoChange}
                                                            name="name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Authority</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="authority"
                                                            value={certificateInfo.authority}
                                                            onChange={onCertificateInfoChange}
                                                            name="authority" />
                                                    </Form.Group>
                                                </Form.Row>
                                                 <Form.Row>
                                                    <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>Certificate File</Form.Label>
                                                    <Form.Control type="file" name="certificate_file" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Date Of Certification</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="certification date"
                                                            value={certificateInfo.date_of_certification}
                                                            onChange={onCertificateInfoChange}
                                                            name="date_of_certification" />
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
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <Card.Img
                                        src={personalInfo.profile_image ? URL.createObjectURL(personalInfo.profile_image) : dp}
                                        style={{ width: '70px', height: '70px' }}></Card.Img>
                                </Col>
                                <Col><Card.Title>{personalInfo.first_name}  {personalInfo.last_name}</Card.Title></Col>
                            </Row>   <hr/> 
                            <Card style={{border:'none'}} >
                            <Row>
                                <Col md={4}><b>Personal Informations</b></Col>
                                <Col md={8}>
                                  
                              <Card style={{border:'none'}}>
                                    <Row >
                                        <Col md={5}><small><b>First Name</b></small></Col>
                                        <Col><small>{personalInfo.first_name}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Last Name</b></small></Col>
                                        <Col><small>{personalInfo.last_name}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Phone</b></small></Col>
                                        <Col><small>{personalInfo.phone}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Email</b></small></Col>
                                        <Col><small>{personalInfo.email}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Date of Birth</b></small></Col>
                                        <Col><small>{personalInfo.date_of_birth}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Nationality</b></small></Col>
                                        <Col><small>{personalInfo.nationality}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Country</b></small></Col>
                                        <Col><small>{personalInfo.country}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>City</b></small></Col>
                                        <Col><small>{personalInfo.city}</small></Col>
                                    </Row>
                                 </Card>
                                      
                                </Col>
                                </Row>
                            </Card> <hr/> 
                            {/* <Row>
                                <Col md={4}><b>Education</b></Col>
                                <Col>
                                    {Object.keys(educationInfo).map(key => (
                                            <Row key={key}>
                                                <Col md={5}><small><b>{key}</b></small></Col>
                                                <Col><small>{educationInfo[key]}</small></Col>
                                            </Row>
                                    ))}
                                </Col>
                            </Row> */}
                                
                             <Card style={{border:'none'}}>
                            <Row>
                                <Col md={4}><b>Education</b></Col>
                                <Col md={8}>
                                   
                                <Card style={{border:'none'}}>
                                    <Row >
                                        <Col md={5}><small><b>Institute Name</b></small></Col>
                                        <Col><small>{educationInfo.Institution}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Level</b></small></Col>
                                        <Col><small>{educationInfo.Level}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>From</b></small></Col>
                                        <Col><small>{educationInfo.From}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>To</b></small></Col>
                                        <Col><small>{educationInfo.To}</small></Col>
                                    </Row>
                                </Card><hr /> 
                                <Card style={{border:'none'}}>
                                    <Row >
                                        <Col md={5}><small><b>Institute Name</b></small></Col>
                                        <Col><small>{educationInfo.Institution}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Level</b></small></Col>
                                        <Col><small>{educationInfo.Level}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>From</b></small></Col>
                                        <Col><small>{educationInfo.From}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>To</b></small></Col>
                                        <Col><small>{educationInfo.To}</small></Col>
                                    </Row>
                                </Card>
                                     
                                </Col>
                                </Row>
                            </Card><hr/>
                            
                            {/* <Row>
                                <Col md={4}><b>Work Experiance</b></Col>
                                <Col>
                                    {Object.keys(experienceInfo).map(key => (
                                            <Row key={key}>
                                                <Col md={5}><small><b>{key}</b></small></Col>
                                                <Col><small>{experienceInfo[key]}</small></Col>
                                            </Row>
                                    ))}
                                </Col>
                            </Row> */}
                             <Card style={{border:'none'}}>
                            <Row>
                                <Col md={4}><b>Work Experiance </b></Col>
                                <Col md={8}>
                                   
                                 <Card style={{border:'none'}}>
                                    <Row >
                                        <Col md={5}><small><b>Company</b></small></Col>
                                        <Col><small>{experienceInfo.company}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Job Title</b></small></Col>
                                        <Col><small>{experienceInfo.job}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>City</b></small></Col>
                                        <Col><small>{experienceInfo.city}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>Country</b></small></Col>
                                        <Col><small>{experienceInfo.country}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>From</b></small></Col>
                                        <Col><small>{experienceInfo.from}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={5}><small><b>To</b></small></Col>
                                        <Col><small>{experienceInfo.to}</small></Col>
                                    </Row>
                                        </Card>
                                        
                                    </Col>
                                </Row>
                            </Card><hr/>
                            
                            <Card style={{border:'none'}}>
                            <Row>
                                <Col md={4}><b>Skills</b></Col>
                                <Col md={8}>
                                    <Card style={{border:'none'}} >
                                        <Row >
                                            <Col>
                                                <ul style={{paddingLeft: 0 }}><small>{alumniSkills.map((skill => (
                                                    <li key={skill} > {skill}</li>
                                                )))}</small>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                </Row>
                            </Card><hr/>
                          
                            <Card style={{border:'none'}}  >
                            <Row>
                                <Col md={4}><b>Certification</b></Col>
                                <Col md={8}>
                                    <Card style={{border:'none'}} >
                                        <Row >
                                            <Col md={5}><small><b>Name</b></small></Col>
                                            <Col><small>{certificateInfo.name}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={5}><small><b>Authority</b></small></Col>
                                            <Col><small>{certificateInfo.authority}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={5}><small><b>Date of Certification</b></small></Col>
                                            <Col><small>{certificateInfo.date_of_certification}</small></Col>
                                        </Row>
                                    </Card> <hr />
                                    <Card style={{border:'none'}} >
                                        <Row >
                                            <Col md={5}><small><b>Name</b></small></Col>
                                            <Col><small>{certificateInfo.name}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={5}><small><b>Authority</b></small></Col>
                                            <Col><small>{certificateInfo.authority}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={5}><small><b>Date of Certification</b></small></Col>
                                            <Col><small>{certificateInfo.date_of_certification}</small></Col>
                                        </Row>
                                    </Card>
                                     
                                </Col>
                                </Row>
                            </Card>
{/* 
                            <Row>
                                <Col md={4}><b>Certificates</b></Col>
                                <Col>
                                    {Object.keys(certificateInfo).map(key => {
                                        if (key === "certificate_file") { }
                                        else {
                                            return (
                                                <Row key={key}>
                                                    <Col md={5}><small><b>{key}</b></small></Col>
                                                    <Col><small>{certificateInfo[key]}</small></Col>
                                                </Row>
                                            )
                                        }
                                    })}
                                </Col>
                            </Row> */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

        </Card>
    )
}

export default CvPage

