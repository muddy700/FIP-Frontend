import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import {
    addJobInvitation, fetchOrganizationInvitations,
    fetchAllRatings, fetchAlumniCertificates,
    fetchalumniProjects, fetchAlumniSkills, fetchCvEducationInfo,
    fetchCvExperienceInfo, fetchCvPersonalInfo, getAlumniProfile,
} from '../../app/api'
import { selectUserData, apiConfigurations } from '../../slices/userSlice'
import { useSelector} from 'react-redux'
import { Card, Row, Col, Button, Form, Modal } from 'react-bootstrap'
import Message from '../../components/message'
import dpPlaceHolder from '../../images/default-for-user.png'
import ContentModal from '../../components/contentModal'
import Loader from '../../components/loader'

const AlumniDetailsPage = () => {
    
    const param = useParams()
    const alumniId = param.id
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)

    const initialInvitation = {
        organization: '',
        alumni: '',
        invitation_message: ''
    }

    const [invitationInfo, setInvitationInfo] = useState(initialInvitation)
    // const [invitationMessage, setInvitationMessage] = useState('')
    const [isSendingInvitation, setIsSendingInvitation] = useState(false)
    const [organizationInvitations, setOrganizationInvitations] = useState([])
    const [hasInvited, setHasInvited] = useState(false)
    const [alumniProfile, setAlumniProfile] = useState({})
    const [alumniPersonalInfo, setAlumniPersonalInfo] = useState({})
    const [alumniEducationInfo, setAlumniEducationInfo] = useState([])
    const [alumniExperienceInfo, setAlumniExperienceInfo] = useState([])
    const [alumniCertificates, setAlumniCertificates] = useState([])
    const [alumniSkills, setAlumniSkills] = useState([])
    const [alumniRatings, setAlumniRatings] = useState([])
    const [activeInfo, setActiveInfo] = useState(0)
    const [alumniProjects, setAlumniProjects] = useState([])
    const [selectedCertificateInfo, setSelectedCertificateInfo] = useState({})
    const [selectedProject, setSelectedProject] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showModal2, setShowModal2] = useState(false)

    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    // console.log(invitationInfo)

    const getProfile = async () => {
        try {
            const profile = await getAlumniProfile(alumniId, config)
            setAlumniProfile(profile[0])
        } catch (error) {
            console.log(alumniProfile.id * 5)
            console.log(organizationInvitations.length)
            console.log({
                'Request': 'Get Published Alumni Profile Request',
                'Error => ' : error.response.data,
            })
        }
    }
   
    const getalumniPersonalInfo = async () => {
        try {
            const response = await fetchCvPersonalInfo(alumniId, config)
            // console.log(response)
            setAlumniPersonalInfo(response[0])
        } catch (error) {
            console.log({
                'Request': 'Get Published Alumni Personal Info Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const getEducationInfo = async () => {
        try {
            const response = await fetchCvEducationInfo(alumniId, config)
            setAlumniEducationInfo(response)
        } catch (error) {
            console.log('Get Published Alumni Education Info ', error.response.data)
        }
    }

    const getExperienceInfo = async () => {
        try {
            const response = await fetchCvExperienceInfo(alumniId, config)
            setAlumniExperienceInfo(response)
        } catch (error) {
            console.log('Get Published Alumni Experience Info ', error.response.data)
        }
    }

    const getCertificates = async () => {
        try {
            const response = await fetchAlumniCertificates(alumniId, config)
            setAlumniCertificates(response)
        } catch (error) {
            console.log('Get Published Alumni Certificates ', error.response.data)
        }
    }

    const getSkills = async () => {
        try {
            const response = await fetchAlumniSkills(alumniId, config)
            setAlumniSkills(response)
        } catch (error) {
            console.log('Get Published Alumni skills ', error.response.data)
        }
    }

    const getRatings = async () => {
        try {
            const response = await fetchAllRatings(config)
            const alumni_ratings = response.filter(item => item.alumni === parseInt(alumniId))
            setAlumniRatings(alumni_ratings)
        } catch (error) {
            console.log('Get Published Alumni Ratings ', error.response.data)
        }
    }

    const getProjects = async () => {
    
        try {
            const response = await fetchalumniProjects(alumniId, config)
            const recommended_projects = response.filter(item => item.project_recommendation_status)
            setAlumniProjects(recommended_projects)
        } catch (error) {
            console.log({
                'Request': 'Get Published Alumni Projects Request',
                'Error => ' : error.response.data,
            })
        }
    }
    
    const getOrganizationInvitations = async () => {
        try {
            const response = await fetchOrganizationInvitations(user.userId, config)
            setOrganizationInvitations(response)
            const has_invited = response.find(item => item.alumni === parseInt(alumniId))
            if(has_invited) setHasInvited(true)
        } catch (error) {
            console.log('Get Organization Invitations', error.response.data)
        }
    }
    
    useEffect(() => {
        getProfile();
        getalumniPersonalInfo();
        getEducationInfo();
        getExperienceInfo();
        getCertificates();
        getSkills();
        getRatings();
        getProjects();
        getOrganizationInvitations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const closeModal = () => {
        setShowModal(false)
        setModalContent('')
        setModalTitle('')
    }


    const handleInvitationForm = (e) => {
        // console.log(e.target.name, e.target.value)
        setInvitationInfo({
            ...invitationInfo,
            [e.target.name]: e.target.value
        })
    }

    const sendInvitation = async (e) => {
        e.preventDefault()
        setIsSendingInvitation(true)
        const payload = {
            ...invitationInfo,
            alumni: alumniId,
            organization: user.userId,
            invitation_message: invitationInfo.invitation_message
        }

        try {
            const response = await addJobInvitation(payload, config)
            console.log(response)
            setIsSendingInvitation(false)
            setHasInvited(true)
            // closeModal()
            setShowModal2(false)
            setInvitationInfo(initialInvitation)
        } catch (error) {
            console.log('Sending Invitation Info From Organization ', error.response.data)
            setIsSendingInvitation(false)
        }
    }

    return (
        <Card>
            <Card.Header style={{padding: '1% 2% 0px 2%', width: '100%'}}>
                <Message variant="info">
                    Alumni Details
                    <Button
                        hidden={hasInvited}
                        style={{ marginLeft: '70%', }}
                        onClick={e => {e.preventDefault(); setShowModal2(true)}}
                    >Invite this alumni</Button>
                    <Button
                        variant="success"
                        style={{ marginLeft: '70%', }}
                        hidden={!hasInvited}
                    >Has already invited</Button>
                </Message>
            </Card.Header>
            <Row style={{padding: '0px 2% 0px 2%'}}>
                <Col md={4}>
                    <Card>
                        <Card.Header style={{backgroundColor: 'lightslategray'}}>
                            <b>Information Category</b>
                        </Card.Header>
                        <Card.Body>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(1)}}
                            > Personal Informations
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(2)}}
                            > Education Informations
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(3)}}
                            > Experience Informations
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(4)}}
                            > Skills Informations
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(5)}}
                            > Projects
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(6)}}
                            > Certifications
                            </Button>
                            <Button
                                variant="link"
                                style={{ marginBottom: '2%', height: '50px', color: 'black', backgroundColor: 'lightgray', width: '100%' }}
                                onClick={e => { e.preventDefault(); setActiveInfo(7)}}
                            > Ratings
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Header style={{ backgroundColor: 'lightslategray' }}>
                            Preview
                {/* <Button size="sm" style={{marginLeft: '40%'}}>Invite</Button> */}
                             
                            </Card.Header>
                        <Card.Body>
                            {activeInfo === 0 ?
                            <Message variant="info" >Select information category to preview</Message> :
                                <Card.Body>
                                    
                                    {/* Personal Particulars */}
                                    {alumniPersonalInfo ? <>
                                    <Row hidden={activeInfo !== 1}>
                                        <Col md={3}>
                                            <Card.Img
                                                src={alumniPersonalInfo ? alumniPersonalInfo.cv_image : dpPlaceHolder}
                                                style={{ width: '70px', height: '70px' }}></Card.Img>
                                        </Col>
                                        <Col>
                                            <Card.Title>{alumniPersonalInfo.first_name} {alumniPersonalInfo.middle_name} {alumniPersonalInfo.last_name}</Card.Title>
                                            {/* <i>Curriculum Vitae</i> */}
                                        </Col>
                                    </Row>
                                    <Card style={{ border: 'none', paddingTop: '5%' }} hidden={activeInfo !== 1}>
                                        <Row>
                                            <b>PERSONAL PARTICULARS</b><hr />
                                        </Row>
                                        <Row>
                                            <Card style={{ border: 'none', width: '100%', paddingLeft: '5%' }}>
                                                <Row >
                                                    <Col md={4}><small><b>First Name</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.first_name}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Middle Name</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.middle_name}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Last Name</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.last_name}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Phone</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.alumni_phone_number}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Email</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.email}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Date of Birth</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.date_of_birth}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Nationality</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.nationality}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Country</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.country}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>City</b></small></Col>
                                                    <Col><small>{alumniPersonalInfo.city}</small></Col>
                                                </Row>
                                            </Card>
                                        </Row>
                                    </Card></> : <span hidden={activeInfo !== 1}>
                                    <Message variant="info">No personal informations yet </Message> </span>}

                                    {/* Education info */}
                                    <Card hidden={activeInfo !== 2} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniEducationInfo.length === 0 ?
                                            <Message variant="info">No education informations yet </Message> :
                                            <b>EDUCATION BACKGROUND</b>}
                                        </Row>
                                        {alumniEducationInfo.map((info, index )=> (
                                        <Row key={info.id} >
                                            <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                                <Row style={{width: '100%'}}>
                                                    <i>Level {index + 1}</i>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Institution</b></small></Col>
                                                    <Col ><small>{info.institution}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4} ><small><b>Level</b></small></Col>
                                                    <Col ><small>{info.education_level}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4} ><small><b>From</b></small></Col>
                                                    <Col><small>{info.start_year}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4} ><small><b>To</b></small></Col>
                                                    <Col><small>{info.completion_year}</small></Col>
                                                </Row>
                                            </Card>
                                        </Row>))}
                                    </Card>
                                    
                                    {/* Experience Info */}
                                    <Card hidden={activeInfo !== 3} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniExperienceInfo.length === 0 ?
                                            <Message variant="info">No experience informations yet </Message> :
                                            <b>EXPERIENCE INFORMATION</b>}
                                        </Row>
                                        
                                {alumniExperienceInfo.map((info, index) => (
                                    <Row key={info.id} >
                                        <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                            <Row style={{width: '100%'}}>
                                                <i>Experience {index + 1}</i>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>Company</b></small></Col>
                                                <Col><small>{info.company_name}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>Job Title</b></small></Col>
                                                <Col><small>{info.job_title}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>City</b></small></Col>
                                                <Col><small>{info.city}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>Country</b></small></Col>
                                                <Col><small>{info.country}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>From</b></small></Col>
                                                <Col><small>{info.start_date}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>To</b></small></Col>
                                                <Col><small>{info.completion_date}</small></Col>
                                            </Row>
                                        </Card>
                                    </Row>))}
                                    </Card>

                                    {/* Skills Info */}

                                    <Card hidden={activeInfo !== 4} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniSkills.length === 0 ?
                                            <Message variant="info">No skills informations yet </Message> :
                                            <b>SKILLS INFORMATION</b>}
                                        </Row>
                                        <Row>
                                            <Col md={{span: 12, offset: 0}}>
                                                <Card style={{border:'none'}} >
                                                    <Row >
                                                        <ol style={{ paddingLeft: '5%', width: '100%' }}><small>
                                                            {alumniSkills.map((skill => (
                                                                <li key={skill.id}>
                                                                    <span style={{width: '80%'}}>{skill.profession_name}</span>
                                                                </li>
                                                        )))}</small>
                                                        </ol>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card>

                                    {/* Projects Info */}

                                    <Card hidden={activeInfo !== 5} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniProjects.length === 0 ?
                                            <Message variant="info">No projects informations yet </Message> :
                                            <b>PROJECTS</b>}
                                        </Row>
                                        {alumniProjects.map((info, index )=> (
                                            <Row
                                                key={info.id}
                                                onMouseEnter={e => { e.preventDefault(); setSelectedProject(info) }}
                                                onMouseLeave={e => { e.preventDefault(); setSelectedProject({}) }}
                                                style={{ marginBottom: '2%' }}
                                            >
                                            <Card style={{ border: 'none', paddingLeft: '20px', width: '100%', }}>
                                                <Row style={{width: '100%'}}>
                                                    <i>Project {index + 1}</i>
                                                <Button
                                                    hidden={info.id !== selectedProject.id}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setShowModal(true)
                                                        // setModalTitle(item.name)
                                                        setModalContent(<object
                                                            type="application/pdf"
                                                            data={`https://res.cloudinary.com/muddy700/raw/upload/v1/${info.project_report}`}
                                                            width="100%"
                                                            height="500px"
                                                        >{info.project_title}</object>)
                                                    }}
                                                    size="sm"
                                                    style={{marginLeft: '75%'}}
                                                >view File</Button>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Title</b></small></Col>
                                                    <Col ><small>{info.project_title}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Year</b></small></Col>
                                                    <Col ><small>{info.project_year}</small></Col>
                                                </Row>
                                                <Row >
                                                    <Col md={4}><small><b>Sponsor</b></small></Col>
                                                    <Col ><small>{info.project_sponsor}</small></Col>
                                                </Row>
                                                    <hr style={{ borderTop: '1px solid black' }}/>
                                            </Card>
                                        </Row>))}


                                    </Card>
                                    {/* Certificate Info */}

                                    <Card hidden={activeInfo !== 6} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniCertificates.length === 0 ?
                                            <Message variant="info">No certification informations yet </Message> :
                                            <b>CERTIFICATES</b>}
                                        </Row>
                                {alumniCertificates.map((item, index) => (
                                    <Row
                                        key={item.id}
                                        onMouseEnter={e => { e.preventDefault(); setSelectedCertificateInfo(item) }}
                                        onMouseLeave={e => { e.preventDefault(); setSelectedCertificateInfo({}) }}
                                    >
                                        <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                            <Row style={{width: '100%'}}>
                                                <i>Certificate {index + 1}</i>
                                                <Button
                                                    hidden={item.id !== selectedCertificateInfo.id}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setShowModal(true)
                                                        setModalTitle(item.name)
                                                        setModalContent(<object
                                                            type="application/pdf"
                                                            data={item.certificate_file}
                                                            width="100%"
                                                            height="500px"
                                                        >{item.name}</object>)
                                                    }}
                                                    size="sm"
                                                    style={{marginLeft: '75%'}}
                                                >view File</Button>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>Name</b></small></Col>
                                                <Col><small>{item.name}</small></Col>
                                            </Row>
                                            <Row >
                                                <Col md={4}><small><b>Authority</b></small></Col>
                                                <Col><small>{item.authority}</small></Col>
                                            </Row>
                                        </Card>
                                    </Row>
                                ))}

                                    </Card>

                                {/* Ratings */}

                                    <Card hidden={activeInfo !== 7} style={{paddingLeft: '3%', border: 'none'}}>
                                        <Row >{alumniRatings.length === 0 ?
                                            <Message variant="info">No ratings informations yet </Message> :
                                            <b>RATINGS</b>}
                                        </Row>
                                        <Row >
                                    <span style={{ width: '100%' }}>
                                        <ol>{alumniRatings
                                            .map(item => (<li>{item.organization_name} : <i>{desc[item.value - 1 ]}</i></li>
                                ))} </ol></span>
                                 </Row>

                                    </Card>

                                </Card.Body>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ContentModal
                show={showModal}
                isTable={false}
                title={modalTitle}
                content={modalContent}
                onHide={() => closeModal()}
            />

            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showModal2}
                onHide={() => setShowModal2(false)}
             >
                <Modal.Header closeButton >Fill invitation descriptions</Modal.Header>
                <Modal.Body>
                    <Form onSubmit={sendInvitation}>
                            <Form.Control
                                as="textarea"
                                placeholder="example, reporting date, reporting instructions, Location "
                                value={invitationInfo.invitation_message}
                                onChange={handleInvitationForm}
                                name="invitation_message"
                                aria-label="With textarea" />
                            <Button
                                disabled={invitationInfo.invitation_message === ''}
                                variant="primary"
                                type="submit"
                                style={{ width: '100%', marginTop: '3%' }}
                            >{isSendingInvitation ?
                                <Loader message="Sending Invitation..." /> : 'Send'}
                            </Button>
                    </Form>
                    </Modal.Body>
                        
              </Modal>
        </Card>
    )
    
}

export default AlumniDetailsPage
