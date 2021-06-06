import React, {useState, useEffect} from 'react'
import dp from '../../Black2.jpg'
import Message from '../../components/message'
import { Card, Row, Col, Button, Accordion, Form, Alert } from 'react-bootstrap'
import {
    fetchCvPersonalInfo, sendCvPersonalInfo,
    editCvPersonalInfo, fetchCvEducationInfo,
    sendCvEducationInfo, editCvEducationInfo,
    fetchCvExperienceInfo, sendCvExperienceInfo,
    editCvExperienceInfo, fetchAlumniCertificates,
    editAlumniCertificate, sendAlumniCertificate,
    fetchAlumniSkills, fetchAllSkills, addAlumniSkills,
    dropAlumniSkill
} from '../../app/api'
import { useSelector, useDispatch}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import Loader from '../../components/loader'
import ContentModal from '../../components/contentModal'

const CvPage = () => {
    const initial_personal_info = {
        first_name: '',
        middle_name: '',
        last_name: '',
        alumni_phone_number: '',
        email: '',
        date_of_birth: '',
        nationality: '',
        country: '',
        city: '',
        cv_image: null,
        uploaded_image: null
    }

    const initialEducationInfo = {
        institution: '',
        education_level: '',
        start_year: '',
        completion_year: ''
    }

    const initialWorkExperience = {
        company_name: '',
        job_title: '',
        city: '',
        country: '',
        start_date: '',
        completion_date: ''
    }

    const initialCertificateInfo = {
        name: '',
        authority: '',
        certificate_file: null,
        // date_of_certification: ''
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

     const config2 = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${localStorage.getItem('token')}`    }
    }
    
    const [personalInfo, setPersonalInfo] = useState(initial_personal_info)
    const [isSendingProfileInfo, setIsSendingProfileInfo] = useState(false)
    const [personalInfoErrorMessage, setPersonalInfoErrorMessage] = useState('')
    const [hasPersonalInfoSaved, setHasPersonalInfoSaved] = useState(false)
    const [hasPersonalInfoChanged, setHasPersonalInfoChanged] = useState(false)
    
    const [educationInfo, setEducationInfo] = useState(initialEducationInfo)
    const [educationInfoSet, setEducationInfoSet] = useState([])
    const [isSendingEducationInfo, setIsSendingEducationInfo] = useState(false)
    const [educationInfoErrorMessage, setEducationInfoErrorMessage] = useState('')
    const [hasEducationInfoSaved, setHasEducationInfoSaved] = useState(false)
    const [hasEducationInfoChanged, setHasEducationInfoChanged] = useState(false)
    const [selectedEducationLevel, setSelectedEducationLevel] = useState({})
    const [isEditingEducationLevel, setIsEditingEducationLevel] = useState(false)
    
    const [experienceInfo, setExperienceInfo] = useState(initialWorkExperience)
    const [experienceInfoSet, setExperienceInfoSet] = useState([])
    const [isSendingExperienceInfo, setIsSendingExperienceInfo] = useState(false)
    const [experienceInfoErrorMessage, setExperienceInfoErrorMessage] = useState('')
    const [hasExperienceInfoSaved, setHasExperienceInfoSaved] = useState(false)
    const [hasExperienceInfoChanged, setHasExperienceInfoChanged] = useState(false)
    const [selectedExperienceInfo, setSelectedExperienceInfo] = useState({})
    const [isEditingExperienceInfo, setisEditingExperienceInfo] = useState(false)
    
    const [allSkills, setAllSkills] = useState([])
    const [alumniSkills, setAlumniSkills] = useState([])
    const [knownSkills, setKnownSkills] = useState([])
    const [newSkills, setNewSkills] = useState([])
    const [isSendingSkills, setIsSendingSkills] = useState(false)
    const [skillsErrorMessage, setSkillsErrorMessage] = useState('')
    const [hasSkillsInfoSaved, setHasSkillsInfoSaved] = useState(false)
    const [hasSkillsInfoChanged, setHasSkillsInfoChanged] = useState(false)
    const [selectedSkill, setSelectedSkill] = useState({})

    const [certificateInfo, setCertificateInfo] = useState(initialCertificateInfo)
    const [certificatesList, setCertificatesList] = useState([])
    const [isSendingCertificate, setIsSendingCertificate] = useState(false)
    const [certificateErrorMessage, setCertificateErrorMessage] = useState('')
    const [hasCertificateInfoSaved, setHasCertificateInfoSaved] = useState(false)
    const [hasCertificateInfoChanged, setHasCertificateInfoChanged] = useState(false)
    const [selectedCertificateInfo, setselectedCertificateInfo] = useState({})
    const [isEditingCertificateInfo, setisEditingCertificateInfo] = useState(false)
    
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [activeForm, setActiveForm] = useState(null)
    const [modalShow, setModalShow] = useState(false)


    const changeActiveForm = (formId) => {
        if (activeForm === formId) {
            setActiveForm(null)
        }
        else {
            setActiveForm(formId)
        }
    }

    const modalTitle = 'Full Cv Preview'
    const modalContent = 'CV Contents'

    const getCvPersonalInfo = async () => {
        try {
            const response = await fetchCvPersonalInfo(user.userId, config)
            if (response.length === 0) {
                setPersonalInfo({
                    ...personalInfo,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    alumni: user.userId,
                    email: user.email,
                    alumni_phone_number: user.phone,
                    profile: user.profileId
                })
            }
            // else console.log(response)
            else {
                setPersonalInfo({
                ...response[0],
                uploaded_image: null})
            }
        } catch (error) {
            console.log('Get Cv-Personal-Info Request: ', error)
        }
    }

    const getCvEducationInfo = async () => {
        try {
            const response = await fetchCvEducationInfo(user.userId, config)
            setEducationInfoSet(response)
        } catch (error) {
            console.log('Get Cv Education Info Set', error.response.data)
        }
    }

    const getCvExperienceInfo = async () => {
        try {
            const response = await fetchCvExperienceInfo(user.userId, config)
            setExperienceInfoSet(response)
        } catch (error) {
            console.log('Get Cv Experience Info Set ', error.response.data)
        }
    }

    const getAlumniCertificates = async () => {
        try {
            const response = await fetchAlumniCertificates(user.userId, config)
            setCertificatesList(response)
        } catch (error) {
            console.log('Get Alumni Certificates ', error.response.data)
        }
    }

    const getAlumniSkills = async () => {
        try {
            const response = await fetchAlumniSkills(user.userId, config)
            setAlumniSkills(response)
            const skillsIds = response.map(skill => skill.profession)
            setKnownSkills(skillsIds)
        } catch (error) {
            console.log('Get Alumni skills ', error.response.data)
        }
    }

    const getAllSkills = async () => {
        try {
            const response = await fetchAllSkills(config)
           setAllSkills(response)
        } catch (error) {
            console.log('Get All Skills ', error.response.data)
        }
    }
    

    useEffect(() => {
        getCvPersonalInfo();
        getCvEducationInfo();
        getCvExperienceInfo();
        getAlumniCertificates();
        getAlumniSkills();
        getAllSkills();
    }, [])

    const onPersonalInfoChange = (e) => {
        // e.preventDefault()
        setHasPersonalInfoSaved(false)
        setPersonalInfoErrorMessage('')
        setHasPersonalInfoChanged(true)
        if (e.target.name === 'cv_image') {
            setPersonalInfo({
                ...personalInfo,
                uploaded_image: e.target.files[0]
            })
        }
        else {
            setPersonalInfo({
                ...personalInfo,
                [e.target.name]: e.target.value
            })
        }
    }

    const personalInfoValidator = () => {
        if (personalInfo.date_of_birth === '') {
            setPersonalInfoErrorMessage('Enter date of birth')
            return false
        }
        else if(personalInfo.nationality === '') {
            setPersonalInfoErrorMessage('Enter nationality')
            return false
        }
        else if(personalInfo.city === '') {
            setPersonalInfoErrorMessage('Enter city')
            return false
        }
        else if(personalInfo.country === '') {
            setPersonalInfoErrorMessage('Enter country')
            return false
        }
        else {
            setPersonalInfoErrorMessage('')
            return true
        }
    }

    const savePersonalInfo = async (e) => {
        e.preventDefault()
        const isPersonalInfoFormValid = personalInfoValidator()

        if (isPersonalInfoFormValid) {
            setIsSendingProfileInfo(true)
            var image_file;
            var blob;
            if (personalInfo.uploaded_image !== null) {
                image_file = personalInfo.uploaded_image
                console.log('called......1')
            }
            else if (personalInfo.cv_image === null) {
                blob = await (await fetch(user.profile_image)).blob();
                image_file = new File([blob], `${user.username}.jpg`, {type:"image/jpeg", lastModified:new Date()});
                console.log('called......2')
            }
            else if (personalInfo.cv_image !== null)  {
                console.log('called......3')
                blob = await (await fetch(personalInfo.cv_image)).blob();
                image_file = new File([blob], `${user.username}.jpg`, { type: "image/jpeg", lastModified: new Date() });
            }
            else console.log('else called')

            const payload = new FormData()
            payload.append('alumni', user.userId)
            payload.append('profile', personalInfo.profile)
            payload.append('cv_image', image_file)
            payload.append('middle_name', personalInfo.middle_name)
            payload.append('date_of_birth', personalInfo.date_of_birth)
            payload.append('nationality', personalInfo.nationality)
            payload.append('country', personalInfo.country)
            payload.append('city', personalInfo.city)

            try {
                var response;
                if (personalInfo.id) {
                    response = await editCvPersonalInfo(personalInfo.id, payload, config2)
                }
                else {
                    response = await sendCvPersonalInfo(payload, config2)
                }
                setIsSendingProfileInfo(false)
                setHasPersonalInfoSaved(true)
                setHasPersonalInfoChanged(false)
                setPersonalInfo({...response, uploaded_image: null})

            } catch (error) {
                console.log('Send Or Edit Cv-Personal-Info Request: ', error.response.data)
                setIsSendingProfileInfo(false)
                setPersonalInfoErrorMessage('Ooops...!, Some Error Occured. Try Again')
            }
        }
        else {
            console.log('Personal Info Form Is Not Valid')
        }
    }

    const onEducationInfoChange = (e) => {
        // e.preventDefault()
        setEducationInfoErrorMessage('')
        setHasEducationInfoChanged(true)
        setHasEducationInfoSaved(false)
        if (e.target.value === '-select-') {
            setEducationInfo({
                ...educationInfo,
                education_level: ''
            })
         }
        else {
            setEducationInfo({
                ...educationInfo,
                [e.target.name] : e.target.value
             })
        }
    }

    const educationInfoValidator = () => {
        if (educationInfo.institution === '') {
            setEducationInfoErrorMessage('Enter Institution name')
            return false
        }
        else if (educationInfo.education_level === '') {
            setEducationInfoErrorMessage('Select Education Level')
            return false
        }
        else if (educationInfo.start_year === '') {
            setEducationInfoErrorMessage('Select Start year')
            return false
        }
        else if (educationInfo.completion_year === '') {
            setEducationInfoErrorMessage('Select Completion year')
            return false
        }
        else {
            setEducationInfoErrorMessage('')
            return true
        }
    }

    const saveEducationInfo = async (e) => {
        e.preventDefault();

        const isEducationInfoFormValid = educationInfoValidator()

        if (isEducationInfoFormValid) {
            setIsSendingEducationInfo(true)
            const payload = {
                ...educationInfo,
                alumni: user.userId
            }
            try {
                var response
                if (isEditingEducationLevel) {
                    response = await editCvEducationInfo(educationInfo.id, payload, config)
                    setIsEditingEducationLevel(false)
                    setSelectedEducationLevel({})
                    const newSet = educationInfoSet.map(info => info.id === response.id ? response : info)
                    setEducationInfoSet(newSet)
                }
                else {
                    response = await sendCvEducationInfo(payload, config)
                    setEducationInfoSet([
                        ...educationInfoSet,
                        response])
                }
                setHasEducationInfoChanged(false)
                setHasEducationInfoSaved(true)
                setEducationInfo(initialEducationInfo)
                setIsSendingEducationInfo(false)

            } catch (error) {
                console.log('Send Or Edit CV Education Info ', error.response.data)
                setIsSendingEducationInfo(false)
                setEducationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again')
            }

        }
        else {console.log('Education Info Form Is Not Valid') }
    }
    
    const onExperienceInfoChange = (e) => {
        // e.preventDefault();
        setExperienceInfoErrorMessage('')
        setHasExperienceInfoChanged(true)
        setHasExperienceInfoSaved(false)
        setExperienceInfo({
            ...experienceInfo,
            [e.target.name] : e.target.value
        })
    }

    const experienceInfoValidator = () => {
        if (experienceInfo.company_name === '') {
            setExperienceInfoErrorMessage('Enter Company Name')
            return false
        }
        else if (experienceInfo.job_title === '') {
            setExperienceInfoErrorMessage('Enter Job Title')
            return false
        }
        else if (experienceInfo.start_date === '') {
            setExperienceInfoErrorMessage('Select Start Date')
            return false
        }
        else if (experienceInfo.completion_date === '') {
            setExperienceInfoErrorMessage('Select Completion Date')
            return false
        }
        else if (experienceInfo.country === '') {
            setExperienceInfoErrorMessage('Enter Country')
            return false
        }
        else if (experienceInfo.city === '') {
            setExperienceInfoErrorMessage('Enter City')
            return false
        }
        else {
            setExperienceInfoErrorMessage('')
            return true
        }
    }

    const saveExperianceInfo = async (e) => {
        e.preventDefault();
        const isExperienceFormValid = experienceInfoValidator()

        if (isExperienceFormValid) {
            setIsSendingExperienceInfo(true)
            const payload = {
                ...experienceInfo,
                alumni: user.userId
            }
            try {
                var response;
                if (isEditingExperienceInfo) {
                    response = await editCvExperienceInfo(experienceInfo.id, payload, config)
                    const newSet = experienceInfoSet.map(info => info.id === response.id ? response : info)
                    setExperienceInfoSet(newSet)
                    setisEditingExperienceInfo(false)
                }
                else {
                    response = await sendCvExperienceInfo(payload, config)
                    setExperienceInfoSet([
                        ...experienceInfoSet,
                        response
                    ])
                    setIsSendingExperienceInfo(false)
                    setHasExperienceInfoSaved(true)
                    setHasExperienceInfoChanged(false)
                    setExperienceInfo(initialWorkExperience)
                }
            } catch (error) {
                console.log('Send Or Edit CV Experience Info ', error.response.data)
                setIsSendingExperienceInfo(false)
                setExperienceInfoErrorMessage('Ooops...!, Some Error Occured. Try Again')
            }
        }
        else {
            console.log('CV Experience Form Is Not Valid')
        }
    }
    
    const onAlumniSkillChange = (e) => {
        const skillId = e.target.value;
        setHasSkillsInfoChanged(true)
        setHasSkillsInfoSaved(false)
        setSkillsErrorMessage('')
        const isThere = newSkills.find(id => id === skillId)

        if (isThere) {
            const freshSkills = newSkills.filter(id => id !== skillId)
            setNewSkills(freshSkills)
        }
        else setNewSkills([...newSkills, skillId]) 
    }

    const saveAlumniSkills = async (e) => {
        e.preventDefault();
        if (newSkills.length === 0) {
            console.log('No Skill Selected')
            setSkillsErrorMessage('No Skill Selected')
        }
        else {
            setIsSendingSkills(true)
            const payloads = newSkills.map(item => {
                return {
                    alumni: user.userId,
                    profession: item
                }
            })
            try {
                const responseArray = addAlumniSkills(payloads, config)
                setNewSkills([])
                setHasSkillsInfoSaved(true)
                setHasSkillsInfoChanged(false)
                setIsSendingSkills(false)
                getAlumniSkills()
                getAllSkills()
            } catch (error) {
                console.log('Send Alumni Skills ', error.response.data)
                setIsSendingSkills(false)
                setSkillsErrorMessage('Ooops...!, Some Error Occured. Try Again')
            }
        }
    }


    const deleteAlumniSkill = async () => {
        try {
            const response = await dropAlumniSkill(selectedSkill.id, config)
            const remainingSkills = alumniSkills.filter(skill => skill.id !== selectedSkill.id)
            setAlumniSkills(remainingSkills)
            const remainingIds = knownSkills.filter(id => id !== selectedSkill.profession)
            setKnownSkills(remainingIds)
            setSelectedSkill({})
            setHasSkillsInfoSaved(false)
        } catch (error) {
            console.log('Delete Alumni Skill ', error.response.data)            
        }
    }

    const onCertificateInfoChange = (e) => {
        // console.log(e.target)
        // e.preventDefault()
        setHasCertificateInfoSaved(false)
        setHasCertificateInfoChanged(true)
        setCertificateErrorMessage('')
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

    const certificateFormValidator = () => {
        if (certificateInfo.name === '') {
            setCertificateErrorMessage('Enter Certificate Name')
            return false
        }
        else if (certificateInfo.authority === '') {
            setCertificateErrorMessage('Enter Certificate Authority')
            return false
        }
        else if (certificateInfo.certificate_file === null) {
            setCertificateErrorMessage('Select Certificate')
            return false
        }
        else {
            setCertificateErrorMessage('')
            return true
        }
    }

    const saveCertificateInfo =async (e) => {
        e.preventDefault();
        const isCertificateFormValid = certificateFormValidator()

        if (isCertificateFormValid) {
            setIsSendingCertificate(true)
            var response;
            var payload = new FormData()
            payload.append('alumni', user.userId)
            payload.append('name', certificateInfo.name)
            payload.append('authority', certificateInfo.authority)

            try {
                if (isEditingCertificateInfo) {

                    const blob = await (await fetch(certificateInfo.certificate_file)).blob();
                    const pdf_file = new File([blob], `${certificateInfo.name}.pdf`, { type: "application/pdf", lastModified: new Date() });
                    payload.append('certificate_file', pdf_file)

                    response = await editAlumniCertificate(certificateInfo.id, payload, config2)
                    const newSet = certificatesList.map(item => item.id === response.id ? response : item)
                    setCertificatesList(newSet)
                    setisEditingCertificateInfo(false)
                }
                else {
                    payload.append('certificate_file', certificateInfo.certificate_file)
                    response = await sendAlumniCertificate(payload, config2)
                    setCertificatesList([
                        ...certificatesList,
                        response
                    ])
                }
                setHasCertificateInfoSaved(true)
                setHasCertificateInfoChanged(false)
                setCertificateInfo(initialCertificateInfo)
                setIsSendingCertificate(false)
                
            } catch (error) {
                console.log('Send Or Edit Alumni Certificate ', error.response.data)
                setIsSendingCertificate(false)
                setCertificateErrorMessage('Ooops...!, Some Error Occured. Try Again')
            }
            
        }
        else {
            console.log('Certificate Form Is Not Valid')
        }
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
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            variant="link"
                                            eventKey="0"
                                            onClick={e => { e.preventDefault(); changeActiveForm(0)}}
                                        >
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
                                                                src={personalInfo.uploaded_image ? URL.createObjectURL(personalInfo.uploaded_image) :
                                                                    personalInfo.cv_image ? personalInfo.cv_image : user.profile_image}
                                                                style={{ width: '100px', height: '100px' }}></Card.Img>
                                                        </Card.Body>
                                                        <Card.Footer style={{ padding: 0 }}>
                                                            <Form.File id="formcheck-api-regular">
                                                                <Form.File.Input onChange={onPersonalInfoChange} name="cv_image" accept="image/*" />
                                                            {/* <input type="file" onChange={onPersonalInfoChange} name="cv_image" accept="image/*" /> */}
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
                                                                disabled
                                                                placeholder="first name"
                                                                value={personalInfo.first_name}
                                                                onChange={onPersonalInfoChange}
                                                                name="first_name" />
                                                        </Form.Group>

                                                        <Form.Group as={Col} controlId="formGridEmail">
                                                        <Form.Label>Middle name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="middle name"
                                                                value={personalInfo.middle_name}
                                                                onChange={onPersonalInfoChange}
                                                                name="middle_name" />
                                                        </Form.Group>
                                                    </Form.Row>

                                                        <Form.Group controlId="formGridPassword">
                                                        <Form.Label>Last Name</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                disabled
                                                                placeholder="last name"
                                                                value={personalInfo.last_name}
                                                                onChange={onPersonalInfoChange}
                                                                name="last_name" />
                                                        </Form.Group>

                                                    <Form.Group controlId="formGridAddress1">
                                                        <Form.Label>Phone</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            disabled
                                                            placeholder="phone number"
                                                            value={personalInfo.alumni_phone_number}
                                                            onChange={onPersonalInfoChange}
                                                            name="alumni_phone_number"  />
                                                    </Form.Group>

                                                    <Form.Group controlId="formGridAddress2">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            disabled
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
                                                    <Button
                                                        disabled={!hasPersonalInfoChanged}
                                                        hidden={hasPersonalInfoSaved}
                                                        variant={personalInfoErrorMessage === '' ? "primary" : 'danger'}
                                                        type="submit"
                                                        style={{ width: '100%' }}
                                                    >{personalInfoErrorMessage !== '' ? personalInfoErrorMessage : isSendingProfileInfo ? 
                                                            <Loader message="Saving Info..." /> : 'Save'}
                                                    </Button>
                                                     <Alert
                                                        onClose={() => setHasPersonalInfoSaved(false)}
                                                        dismissible
                                                        variant='success'
                                                        style={{textAlign: 'center'}}
                                                        hidden={!hasPersonalInfoSaved}
                                                    >Your Personal Info Saved Successfull.</Alert>
                                                </Col>
                                            </Row></Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            variant="link" eventKey="1"
                                            onClick={e => { e.preventDefault(); changeActiveForm(1) }}
                                        >
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
                                                            name="institution" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Education Level</Form.Label>
                                                        <Form.Control as="select"
                                                            size="md"
                                                            value={educationInfo.education_level}
                                                            onChange={onEducationInfoChange}
                                                            name="education_level">
                                                        <option>-select-</option>
                                                        <option value="Primary">Primary</option>
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
                                                            placeholder="start year"
                                                            value={educationInfo.start_year}
                                                            onChange={onEducationInfoChange}
                                                            name="start_year" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="completion_year"
                                                            value={educationInfo.completion_year}
                                                            onChange={onEducationInfoChange}
                                                            name="completion_year" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                    <Button
                                                        disabled={!hasEducationInfoChanged}
                                                        hidden={hasEducationInfoSaved}
                                                        variant={educationInfoErrorMessage === '' ? "primary" : 'danger'}
                                                        type="submit"
                                                        style={{ width: '100%' }}
                                                    >{educationInfoErrorMessage !== '' ? educationInfoErrorMessage : isSendingEducationInfo ? 
                                                        <Loader message="Saving Info..." /> : 'Save'}
                                                    </Button>
                                                     <Alert
                                                        onClose={() => setHasEducationInfoSaved(false)}
                                                        dismissible
                                                        variant='success'
                                                        style={{textAlign: 'center'}}
                                                        hidden={!hasEducationInfoSaved}
                                                    >Your Education Info Saved Successfull.</Alert>
                                                </Col>
                                                </Row>

                                                </Form>
                                            
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card >
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            variant="link" eventKey="2"
                                            onClick={e => { e.preventDefault(); changeActiveForm(2) }}
                                        >
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
                                                            value={experienceInfo.company_name}
                                                            onChange={onExperienceInfoChange}
                                                            name="company_name" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Job Title</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="job title"
                                                            value={experienceInfo.job_title}
                                                            onChange={onExperienceInfoChange}
                                                            name="job_title" />
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
                                                            value={experienceInfo.start_date}
                                                            onChange={onExperienceInfoChange}
                                                            name="start_date" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="end date"
                                                            value={experienceInfo.completion_date}
                                                            onChange={onExperienceInfoChange}
                                                            name="completion_date" />
                                                    </Form.Group>
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                    <Button
                                                        disabled={!hasExperienceInfoChanged}
                                                        hidden={hasExperienceInfoSaved}
                                                        variant={experienceInfoErrorMessage === '' ? "primary" : 'danger'}
                                                        type="submit"
                                                        style={{ width: '100%' }}
                                                    >{experienceInfoErrorMessage !== '' ? experienceInfoErrorMessage : isSendingExperienceInfo ? 
                                                        <Loader message="Saving Info..." /> : 'Save'}
                                                    </Button>
                                                     <Alert
                                                        onClose={() => setHasExperienceInfoSaved(false)}
                                                        dismissible
                                                        variant='success'
                                                        style={{textAlign: 'center'}}
                                                        hidden={!hasExperienceInfoSaved}
                                                    >Your Experience Info Saved Successfull.</Alert>
                                                </Col>
                                                </Row>

                                                </Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            variant="link" eventKey="3"
                                            onClick={e => { e.preventDefault(); changeActiveForm(3) }}
                                        >
                                            Skills
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>
                                            <Form onSubmit={e => saveAlumniSkills(e)}>
                                                {allSkills.filter(item => !knownSkills.includes(item.id))
                                                    .map(skill => (
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={skill.id}
                                                        label={skill.profession_name}
                                                        value={skill.id}
                                                        onChange={onAlumniSkillChange} />
                                                ))}
                                                <Row >
                                                <Col md={12}>
                                                    <Button
                                                        disabled={!hasSkillsInfoChanged}
                                                        hidden={hasSkillsInfoSaved}
                                                        variant={skillsErrorMessage === '' ? "primary" : 'danger'}
                                                        type="submit"
                                                        style={{ width: '100%' }}
                                                    >{skillsErrorMessage !== '' ? skillsErrorMessage : isSendingSkills ? 
                                                        <Loader message="Saving Info..." /> : 'Save'}
                                                    </Button>
                                                     <Alert
                                                        onClose={() => setHasSkillsInfoSaved(false)}
                                                        dismissible
                                                        variant='success'
                                                        style={{textAlign: 'center'}}
                                                        hidden={!hasSkillsInfoSaved}
                                                    >Your Skills Info Saved Successfull.</Alert>
                                                </Col>
                                                </Row>
                                            </Form>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header style={{backgroundColor: 'white'}}>
                                        <Accordion.Toggle
                                            as={Card.Header}
                                            variant="link" eventKey="4"
                                            onClick={e => { e.preventDefault(); changeActiveForm(4) }}
                                        >
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
                                                        <Form.Control
                                                            type="file"
                                                            name="certificate_file"
                                                            // value={certificateInfo.certificate_file.name}
                                                            onChange={onCertificateInfoChange}
                                                            accept="application/pdf" />
                                                    </Form.Group>

                                                    {/* <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>Date Of Certification</Form.Label>
                                                        <Form.Control
                                                            type="month"
                                                            placeholder="certification date"
                                                            value={certificateInfo.date_of_certification}
                                                            onChange={onCertificateInfoChange}
                                                            name="date_of_certification" />
                                                    </Form.Group> */}
                                                </Form.Row>
                                                <Row >
                                                <Col md={12}>
                                                    <Button
                                                        disabled={!hasCertificateInfoChanged}
                                                        hidden={hasCertificateInfoSaved}
                                                        variant={certificateErrorMessage === '' ? "primary" : 'danger'}
                                                        type="submit"
                                                        style={{ width: '100%' }}
                                                    >{certificateErrorMessage !== '' ? certificateErrorMessage : isSendingCertificate ? 
                                                        <Loader message="Saving Info..." /> : 'Save'}
                                                    </Button>
                                                     <Alert
                                                        onClose={() => setHasCertificateInfoSaved(false)}
                                                        dismissible
                                                        variant='success'
                                                        style={{textAlign: 'center'}}
                                                        hidden={!hasCertificateInfoSaved}
                                                    >Your Certificate Info Saved Successfull.</Alert>
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
                        <Card.Header>
                            CV Preview
                            <Button
                                style={{ float: 'right' }}
                                onClick={e => { e.preventDefault(); setModalShow(true)}}
                            >Full Preview</Button>
                        </Card.Header>
                        <Card.Body>
                            <Row hidden={activeForm !== null} style={{alignItems: 'center'}}>
                                <Message variant="info">
                                    Select any part of the CV to preview your details.
                                </Message>
                            </Row>
                            <Row hidden={activeForm !== 0}>
                                <Col md={3}>
                                    <Card.Img
                                        src={personalInfo.uploaded_image ? URL.createObjectURL(personalInfo.uploaded_image) :
                                            personalInfo.cv_image ? personalInfo.cv_image : user.profile_image}
                                        style={{ width: '70px', height: '70px' }}></Card.Img>
                                </Col>
                                <Col>
                                    <Card.Title>{personalInfo.first_name} {personalInfo.middle_name} {personalInfo.last_name}</Card.Title>
                                    <i>Curriculum Vitae</i>
                                </Col>
                            </Row>
                            {/* <hr/>  */}
                            <Card style={{ border: 'none', paddingTop: '5%' }} hidden={activeForm !== 0}>
                            <Row>
                                <b>PERSONAL PARTICULARS</b><hr />
                            </Row>
                            <Row>     
                              <Card style={{border:'none',width: '100%', paddingLeft: '5%'}}>
                                    <Row >
                                        <Col md={4}><small><b>First Name</b></small></Col>
                                        <Col><small>{personalInfo.first_name}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Middle Name</b></small></Col>
                                        <Col><small>{personalInfo.middle_name}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Last Name</b></small></Col>
                                        <Col><small>{personalInfo.last_name}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Phone</b></small></Col>
                                        <Col><small>{personalInfo.alumni_phone_number}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Email</b></small></Col>
                                        <Col><small>{personalInfo.email}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Date of Birth</b></small></Col>
                                        <Col><small>{personalInfo.date_of_birth}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Nationality</b></small></Col>
                                        <Col><small>{personalInfo.nationality}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>Country</b></small></Col>
                                        <Col><small>{personalInfo.country}</small></Col>
                                    </Row>
                                    <Row >
                                        <Col md={4}><small><b>City</b></small></Col>
                                        <Col><small>{personalInfo.city}</small></Col>
                                    </Row>
                                 </Card>
                                </Row>
                            </Card>
                            {/* <hr /> */}
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
                                
                            
                             <Card style={{border:'none'}} hidden={activeForm !== 1}>
                                <Row >
                                    <b>EDUCATION BACKGROUND</b>
                                </Row>
                                <Row hidden={educationInfoSet.length !== 0 || hasEducationInfoChanged} style={{paddingTop: '5%'}}>
                                    <Message variant='info'>You don't have any education info yet. Fill the form to preview</Message>
                                </Row>
                                <Row hidden={!hasEducationInfoChanged}>    
                                    <Card style={{border:'none', paddingLeft: '20px'}}>
                                        <Row >
                                            <Col ><small><b>Institution</b></small></Col>
                                            <Col><small>{educationInfo.institution}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col ><small><b>Level</b></small></Col>
                                            <Col><small>{educationInfo.education_level}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col ><small><b>From</b></small></Col>
                                            <Col><small>{educationInfo.start_year}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col ><small><b>To</b></small></Col>
                                            <Col><small>{educationInfo.completion_year}</small></Col>
                                        </Row>
                                    </Card>
                                </Row>
                                {educationInfoSet.map((info, index )=> (
                                    <Row
                                        key={info.id}
                                        onMouseEnter={e => { e.preventDefault(); setSelectedEducationLevel(info) }}
                                        onMouseLeave={e => { e.preventDefault(); setSelectedEducationLevel({}) }}
                                    >
                                        <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                            <Row style={{width: '100%'}}>
                                                <i>Level {index + 1}</i>
                                                <Button
                                                    hidden={info.id !== selectedEducationLevel.id}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setEducationInfo(selectedEducationLevel);
                                                        setIsEditingEducationLevel(true);
                                                        setHasEducationInfoSaved(false)
                                                    }}
                                                    size="sm"
                                                    style={{marginLeft: '75%'}}
                                                >Edit</Button>
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
                            {/* <hr/> */}
                            
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
                             <Card style={{border:'none'}} hidden={activeForm !== 2}>
                                <Row >
                                    <b>WORK EXPERIENCE</b>
                                </Row>
                                <Row hidden={experienceInfoSet.length !== 0 || hasExperienceInfoChanged} style={{paddingTop: '5%'}}>
                                    <Message variant='info'>You don't have any work experience yet. Fill the form to preview</Message>
                                </Row>
                                <Row hidden={!hasExperienceInfoChanged}> 
                                    <Card style={{border:'none', paddingLeft: '20px', width: '100%'}}>
                                        <Row >
                                            <Col md={4}><small><b>Company</b></small></Col>
                                            <Col><small>{experienceInfo.company_name}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>Job Title</b></small></Col>
                                            <Col><small>{experienceInfo.job_title}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>City</b></small></Col>
                                            <Col><small>{experienceInfo.city}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>Country</b></small></Col>
                                            <Col><small>{experienceInfo.country}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>From</b></small></Col>
                                            <Col><small>{experienceInfo.start_date}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>To</b></small></Col>
                                            <Col><small>{experienceInfo.completion_date}</small></Col>
                                        </Row>
                                    </Card>
                                </Row>
                                {experienceInfoSet.map((info, index) => (
                                    <Row
                                        key={info.id}
                                        onMouseEnter={e => { e.preventDefault(); setSelectedExperienceInfo(info) }}
                                        onMouseLeave={e => { e.preventDefault(); setSelectedExperienceInfo({}) }}
                                    >
                                        <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                            <Row style={{width: '100%'}}>
                                                <i>Experience {index + 1}</i>
                                                <Button
                                                    hidden={info.id !== selectedExperienceInfo.id}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setExperienceInfo(selectedExperienceInfo);
                                                        setisEditingExperienceInfo(true);
                                                        setHasExperienceInfoSaved(false)
                                                    }}
                                                    size="sm"
                                                    style={{marginLeft: '75%'}}
                                                >Edit</Button>
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
                            {/* <hr/> */}
                            
                            <Card style={{border:'none'}} hidden={activeForm !== 3}>
                                <Row>
                                    <b>SKILLS</b>
                                </Row>
                                <Row hidden={alumniSkills.length !== 0 } style={{paddingTop: '5%'}}>
                                    <Message variant='info'>You don't have any skill yet. Fill the form to preview</Message>
                                </Row>
                                <Row>
                                    <Col md={{span: 12, offset: 0}}>
                                        <Card style={{border:'none'}} >
                                            <Row >
                                                <ul style={{ paddingLeft: 0, width: '100%' }}><small>
                                                    {alumniSkills.map((skill => (
                                                        <li
                                                            key={skill.id}
                                                            style={{ backgroundColor: `${ skill.id === selectedSkill.id ? 'lightgray' : '' }`, display: 'flex', paddingLeft: '4%'}}
                                                            onMouseEnter={e => { e.preventDefault(); setSelectedSkill(skill) }}
                                                            onMouseLeave={e => { e.preventDefault(); setSelectedSkill({}) }}
                                                        >
                                                            <span style={{width: '80%'}}>{skill.profession_name}</span>
                                                            <Button
                                                                hidden={skill.id !== selectedSkill.id}
                                                                onClick={e => {
                                                                    e.preventDefault();
                                                                    deleteAlumniSkill();
                                                                }}
                                                                size="sm"
                                                                variant="danger"
                                                            >Delete</Button>
                                                        </li>
                                                )))}</small>
                                                </ul>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card>
                            <Card style={{border:'none'}} hidden={activeForm !== 4}>
                            <Row>
                                <b>CERTIFICATIONS</b>
                            </Row>
                            <Row hidden={certificatesList.length !== 0 || hasCertificateInfoChanged} style={{paddingTop: '5%'}}>
                                <Message variant='info'>You don't have any certificate yet. Fill the form to preview</Message>
                            </Row>
                                <Row hidden={!hasCertificateInfoChanged}>
                                    <Card style={{border:'none', width: '100%', paddingLeft: '20px'}} >
                                        <Row >
                                            <Col md={4}><small><b>Name</b></small></Col>
                                            <Col><small>{certificateInfo.name}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>Authority</b></small></Col>
                                            <Col><small>{certificateInfo.authority}</small></Col>
                                        </Row>
                                        <Row >
                                            <Col md={4} ><small><b>Certificate File</b></small></Col>
                                            <Col><small>{ certificateInfo.certificate_file !== null ? certificateInfo.certificate_file.name : 'No File Selected'}</small></Col>
                                        </Row>
                                    </Card>
                                </Row>
                                {certificatesList.map((item, index) => (
                                    <Row
                                        key={item.id}
                                        onMouseEnter={e => { e.preventDefault(); setselectedCertificateInfo(item) }}
                                        onMouseLeave={e => { e.preventDefault(); setselectedCertificateInfo({}) }}
                                    >
                                        <Card style={{ border: 'none', paddingLeft: '20px', width: '100%' }}>
                                            <Row style={{width: '100%'}}>
                                                <i>Certificate {index + 1}</i>
                                                <Button
                                                    hidden={item.id !== selectedCertificateInfo.id}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setCertificateInfo(selectedCertificateInfo);
                                                        setisEditingCertificateInfo(true);
                                                        setHasCertificateInfoSaved(false)
                                                    }}
                                                    size="sm"
                                                    style={{marginLeft: '75%'}}
                                                >Edit</Button>
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
            <ContentModal
                show={modalShow}
                isTable={false}
                title={modalTitle}
                content={modalContent}
                onHide={() => setModalShow(false)}
            />

        </Card>
    )
}

export default CvPage