import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations,
    //  selectUserData 
    } from '../../slices/userSlice'
import Loader from '../../components/loader'
import { createAlumniProfile, createStaffProfile, createStudentProfileInfo, createUser, createUserProfile, getAllDepartments, getAllRoles, getPrograms } from '../../app/api'

export const UsersPage = () => {
  
    const initialUser = {
        username: '',
        email: '',
        password: '',
        phone: '',
        gender: '',
        designation: '',
    }

    const initialStaff = {
        department: '',
    }

    const initialStudent = {
        phone: '',
        year_of_study: '',
        program: ''
    }

    const initialAlumni = {
        completion_year: '',
        program: '',
        gpa: '',
    }

    // const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [userInfo, setUserInfo] = useState(initialUser)
    const [staffInfo, setStaffInfo] = useState(initialStaff)
    const [studentInfo, setStudentInfo] = useState(initialStudent)
    const [alumniInfo, setAlumniInfo] = useState(initialAlumni)
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isSendingData, setIsSendingData] = useState(false)
    const [designations, setDesignations] = useState([])
    const [programs, setPrograms] = useState([])
    const [departments, setDepartments] = useState([])
    const [isfetchingData, setIsfetchingData] = useState(true)

    const fetchDepartments = async () => {
        setIsfetchingData(true)
        try {
          const response = await getAllDepartments(config)
            setDepartments(response)
            fetchPrograms()
        } catch (error) {
            setIsfetchingData(false)
            console.log({
                'request': 'Fetch Departments Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchPrograms = async () => {
        try {
          const response = await getPrograms(config)
            setPrograms(response)
            fetchDesignations()
        } catch (error) {
            setIsfetchingData(false)
            console.log({
                'request': 'Fetch Programs Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchDesignations = async () => {
        try {
            const response = await getAllRoles(config)
            const new_roles = response.filter(role => role.designation_name === 'student' || role.designation_name === 'alumni' || role.designation_name === 'staff')
            setDesignations(new_roles)
        } catch (error) {
            setIsfetchingData(false)
            console.log('Fetching Designations ', error.response.data)
            
        }
    }

    useEffect(() => {
        fetchDepartments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUserInfoChanges = (e) => {
        clearMessages()
        setUserInfo({
            [e.target.name]: e.target.value
        })
    }

    const handleStaffInfoChanges = (e) => {
        clearMessages()
        setStaffInfo({
            [e.target.name]: e.target.value
        })
    }
    
    const handleStudentInfoChanges = (e) => {
        clearMessages()
        setStudentInfo({
            [e.target.name]: e.target.value
        })
    }

    const handleAlumniInfoChanges = (e) => {
        clearMessages()
        setAlumniInfo({
            [e.target.name]: e.target.value
        })
    }

    const userFormValidator = () => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailResult = re.test(userInfo.email)
        if (!userInfo.username) {
            setFormError('Username cannot be blank')
            return false
        }
        else if (!userInfo.email) {
            setFormError('Email cannot be blank')
            return false
        }
        else if (!emailResult) {
            setFormError('Enter a valid email')
            return false
        }
        else if (!userInfo.password) {
            setFormError('Password cannot be blank')
            return false
        }
        else if (userInfo.password.length < 6) {
            setFormError('Enter atleast 6 characters long')
            return false
        }
        else if (!userInfo.phone) {
            setFormError('phone number cannot be blank')
            return false
        }
        else if (userInfo.phone.length < 10 ) {
            setFormError('Enter atleast 6 characters long')
            return false
        }
        else if (!userInfo.gender) {
            setFormError('gender cannot be blank')
            return false
        }
        else if (!userInfo.designation) {
            setFormError('Select Designation')
            return false
        }
        else if (userInfo.designation === 6) {
            studentFormValidator()
        }
        else if (userInfo.designation === 7) {
            alumniFormValidator()
        }
        else if (userInfo.designation === 5) {
            staffFormValidator()
        }
        else {
            setFormError('')
            return true
        }
    }

    const staffFormValidator = () => {
        if (!staffInfo.department) {
            setFormError('Select department')
            return false
        }
        else {
            setFormError('')
            return true
        }
    }

    const studentFormValidator = () => {
        if (!studentInfo.phone) {
            setFormError('Phone number cannot be blank')
            return false
        }
        else if (studentInfo.phone.length < 10 ) {
            setFormError('Enter atleast 6 characters long')
            return false
        }
        else if (!studentInfo.year_of_study ) {
            setFormError('Year of study cannot be blank')
            return false
        }
        else if (studentInfo.year_of_study > 4 || studentInfo.year_of_study < 1 ) {
            setFormError('Enter valid year of study')
            return false
        }
        else if (!studentInfo.program ) {
            setFormError('Program cannot be blank')
            return false
        }
        else {
            setFormError('')
            return true
        }
    }

    const alumniFormValidator = () => {
        const currentYear = new Date().getFullYear()
        if (!alumniInfo.completion_year) {
            setFormError('Completion year cannot be blank')
            return false
        }
        else if (alumniInfo.completion_year < 2010 || alumniInfo.completion_year > currentYear) {
            setFormError('Enter valid year')
            return false
        }
        else if (!alumniInfo.program ) {
            setFormError('Program cannot be blank')
            return false
        }
        else if (!alumniInfo.gpa ) {
            setFormError('GPA cannot be blank')
            return false
        }
        else if (alumniInfo.gpa > 5 || alumniInfo.gpa < 2) {
            setFormError('Enter valid GPA')
            return false
        }
        else {
            setFormError('')
            return true
        }
    }

    const clearMessages = () => {
        setFormError('')
        setSuccessMessage('')
    }

    const getProgramDepartment = (programId) => {
        let program = programs.find(item => item.id === programId)
        return program.department
    }

    const addStudentProfile = async (data) => {
        const payload = {
            ...studentInfo,
            student: data.user,
            department: getProgramDepartment(studentInfo.program)
        }
        try {// eslint-disable-next-line
            const response = await createStudentProfileInfo(payload, config)
            setStudentInfo(initialStudent)
        } catch (error) {
                console.log('Creating Student Profile ', error.response.data )
            }
    }

    const addAlumniProfile = async (data) => {
        const payload = {
            ...alumniInfo,
            alumni: data.user,
            department: getProgramDepartment(alumniInfo.program)
        }
        try {// eslint-disable-next-line
            const response = await createAlumniProfile(payload, config)
            setAlumniInfo(initialAlumni)
        } catch (error) {
                console.log('Creating Alumni Profile ', error.response.data )
            }
    }

    const addStaffProfile = async (data) => {
        const payload = {
            ...staffInfo,
            staff: data.user,
        }
        try {// eslint-disable-next-line
            const response = await createStaffProfile(payload, config)
            setStaffInfo(initialStaff)
        } catch (error) {
                console.log('Creating Staff Profile ', error.response.data )
            }
    }

    const checkUserType = (data) => {
        if (data.designation === 6) {
            addStudentProfile(data)
        }
        else if (data.designation === 7) {
            addAlumniProfile(data)
        }
        else if (data.designation === 5) {
            addStaffProfile(data)
        }
        // else {
            //do some
        // }
    }

    const addUser = async (e) => {
        e.preventDefault()
        const isUserFormValid = userFormValidator()
        const {phone, gender, designation, ...rest1} = userInfo
        const {username, email, password, ...rest2 } = userInfo;
        const userData = {...rest1}

        if (isUserFormValid) {
            setIsSendingData(true)
            try {
                const response1 = await createUser(userData)
                const profileData = { ...rest2, user: response1.user.id }
                try {
                    const response2 = await createUserProfile(profileData, config)
                    checkUserType(response2)
                    setUserInfo(initialUser)
                    setIsSendingData(false)
                    setSuccessMessage('User Added Successful.')
                } catch (error) {
                    console.log('Creating User Profile ', error.response.data )
                }
            }
            catch (error) {
                setIsSendingData(false)
                console.log('Creating User ', error.response.data )
            }
        }
        else {
            console.log('User Form Is Not Valid')
        }
    }

    return (
        <Card className="dashboard-container">
            <Card.Header>
                <Row>
                    <h3>User Form</h3>
                </Row>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={addUser}>
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput1">
          <Form.Label>Profession</Form.Label>
          <Form.Control as="select"
              size="md"
            //   value={selectedProfession}
            //   onChange={e => { e.preventDefault(); setselectedProfession(e.target.value); clearMessages()}}
              name="profession">
              <option value={null}>---Select Profession---</option>
              {/* {professions.map(skill => (
                <option value={skill.id}>{skill.profession_name} </option>
              ))} */}
          </Form.Control>
        </Form.Group>
                    </Form.Row>
                    
        <Form.Row>
          <Form.Group as={Col} controlId="InternshipPostInput3">
          <Form.Label>Question Body</Form.Label>
            <FormControl as="textarea"
                placeholder="Enter question body"
                type="text"
                aria-label="Message Content"
                name="post_description"
                // value={questionInfo.question_body}
                aria-describedby="basic-addon2"
                // onChange={e => { e.preventDefault(); setQuestionInfo({ ...questionInfo, question_body: e.target.value }); clearMessages() }}
            />
          </Form.Group>
      </Form.Row>
                    
        <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>First Choice (A)</Form.Label>
          <FormControl
            placeholder="Enter First Choice"
            type="text"
            aria-label="Message Content"
            // value={c1.choice}
            aria-describedby="basic-addon2"
            // onChange={e => { e.preventDefault(); setc1({ ...c1, choice: e.target.value}); clearMessages() }}
            />
          </Form.Group>
         {/* </Form.Row> */}
                    
        {/* <Form.Row> */}
        </Form.Row>
    <Form.Row>
            <Button 
                type="submit"
                hidden={formError || successMessage}
                style={{marginBottom: '16px', width: '100%'}}
            >{isSendingData ? <Loader message='sending...!' /> : 'Send'} </Button>
    </Form.Row>
    <Form.Row>
        <Button
            hidden={!formError}
            variant='danger'
            style={{width: '100%', marginBottom: '16px'}}
        >{formError}</Button>
        <Button
            hidden={!successMessage}
            variant='success'
            style={{width: '100%'}}
        >{successMessage}</Button>
    </Form.Row>
        
                    </Form>
            </Card.Body>
        </Card>
    )
}
