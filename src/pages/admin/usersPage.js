import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations,
    //  selectUserData 
    } from '../../slices/userSlice'
import Loader from '../../components/loader'
import { createAlumniProfile, createStaffProfile, createStudentProfileInfo, createUser, createUserProfile, editUserInfo, getAllDepartments, getAllRoles, getPrograms } from '../../app/api'
import Message from '../../components/message'
import DataPlaceHolder from '../../components/dataPlaceHolder'

export const UsersPage = () => {
  
    const initialUser = {
        first_name: '',
        last_name: '',
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

    const genders = [
        {id: 1, name: 'Male', alias: 'M'},
        {id: 2, name: 'Female', alias: 'F'},
    ]
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
    const [isFetchingData, setIsFetchingData] = useState(true)
    const [activeForm, setActiveForm] = useState('')
    const [requestError, setRequestError] = useState('')

    const fetchDepartments = async () => {
        setIsFetchingData(true)
        try {
          const response = await getAllDepartments(config)
            setDepartments(response)
            fetchPrograms()
        } catch (error) {
            setIsFetchingData(false)
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
            setIsFetchingData(false)
            console.log({
                'request': 'Fetch Programs Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchDesignations = async () => {
        try {
            const response = await getAllRoles(config)
            const new_roles = response.filter(role => role.designation_name === 'student' || role.designation_name === 'alumni' || role.designation_name === 'academic supervisor')
            setDesignations(new_roles)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log('Fetching Designations ', error.response.data)
            
        }
    }

    useEffect(() => {
        fetchDepartments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleUserInfoChanges = (e) => {
        clearMessages()
        setUserInfo({...userInfo,
            [e.target.name]: e.target.value
        })
        let name = e.target.name
        let value = parseInt(e.target.value)
        if (name === 'designation') {
            if (value === 5) {
                setActiveForm('staff')
                console.log('staff called')
            }
            else if (value === 6) {
                setActiveForm('student')
                console.log('student called')
            }
            else if (value === 7) {
                setActiveForm('alumni')
                console.log('alumni called')
            }
            else {
                setActiveForm('')
            }
        }
    }

    const handleStaffInfoChanges = (e) => {
        clearMessages()
        setStaffInfo({...staffInfo,
            [e.target.name]: e.target.value
        })
    }
    
    const handleStudentInfoChanges = (e) => {
        clearMessages()
        setStudentInfo({...studentInfo,
            [e.target.name]: e.target.value
        })
    }

    const handleAlumniInfoChanges = (e) => {
        clearMessages()
        setAlumniInfo({...alumniInfo,
            [e.target.name]: e.target.value
        })
    }

    const userFormValidator = () => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailResult = re.test(userInfo.email)
        if (!userInfo.first_name) {
            setFormError('First name cannot be blank')
            return false
        }
        else if (!userInfo.last_name) {
            setFormError('Last name cannot be blank')
            return false
        }
        else if (!userInfo.username) {
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
            setFormError('Enter atleast 10 characters long')
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
        else if (parseInt(userInfo.designation) === 6 && !studentFormValidator()) {
            studentFormValidator()
        }
        else if (parseInt(userInfo.designation) === 7 && !alumniFormValidator()) {
            alumniFormValidator()
        }
        else if (parseInt(userInfo.designation) === 5 && !staffFormValidator()) {
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
        if (!studentInfo.year_of_study ) {
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
        setRequestError('')
    }

    const getProgramDepartment = (programId) => {
        let program = programs.find(item => item.id === parseInt(programId))
        return program.department
    }

    const addStudentProfile = async (data) => {
        const payload = {
            ...studentInfo,
            phone: userInfo.phone,
            student: data.user,
            department: getProgramDepartment(studentInfo.program)
        }
        try {// eslint-disable-next-line
            const response = await createStudentProfileInfo(payload, config)
            setStudentInfo(initialStudent)
        } catch (error) {
            setRequestError('Failed To Create Student Profile')
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
            setRequestError('Failed To Create Alumni Profile')
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
            setRequestError('Failed To Create Satff Profile')
            console.log('Creating Staff Profile ', error.response.data )
            }
    }

    const addUserData = async (data) => {
        const payload = {
            id: data.user,
            username: data.username,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name
        }
        try {// eslint-disable-next-line
            const response = await editUserInfo(payload, config)
        } catch (error) {
            setRequestError('Failed To Add UserData')
            console.log('Adding UserData ', error.response.data )
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
        setRequestError('')
        const isUserFormValid = userFormValidator()
        // console.log(userInfo)
        if (isUserFormValid) {
            const {phone, gender, designation, ...rest1} = userInfo
            const {username, email, password, ...rest2 } = userInfo;
            const userData = {...rest1, username: userInfo.username.replaceAll('/', '-')}
            setIsSendingData(true)
            try {
                const response1 = await createUser(userData)
                const profileData = { ...rest2, user: response1.user.id }
                try {
                    const response2 = await createUserProfile(profileData, config)
                    checkUserType(response2)
                    addUserData(response2)
                    setUserInfo(initialUser)
                    setIsSendingData(false)
                    setSuccessMessage('User Added Successful.')
                } catch (error) {
                    setIsSendingData(false)
                    setRequestError('Failed To Create User Profile')
                    console.log('Creating User Profile ', error.response.data )
                }
            }
            catch (error) {
                setIsSendingData(false)
                console.log('Creating User ', error.response.data)
                if (error.response.data.username) {
                    setRequestError('A user with that username already exists.')
                }
            }
        }
        else {
            console.log('User Form Is Not Valid')
        }
    }

    return (
        <Card className="dashboard-container">
            <Card.Header>
                <Row
                    hidden={!requestError}
                    style={{ textAlign: 'center', display: 'grid'}}>
                    <Message variant='danger'>{requestError}</Message>
                </Row>
                <Row>
                    <h3>User Form</h3>
                </Row>
            </Card.Header>
            <Card.Body>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Form onSubmit={addUser}>
                            {/* Inputs For User Data */}
                            <Form.Row>
                                <Form.Group as={Col} controlId="InternshipPostInput21">
                                    <Form.Label>First Name</Form.Label>
                                    <FormControl
                                        placeholder="Enter first name"
                                        type="text"
                                        aria-label="Message Content"
                                        name='first_name'
                                        value={userInfo.first_name}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput22">
                                    <Form.Label>Last Name</Form.Label>
                                    <FormControl
                                        placeholder="Enter last name"
                                        type="text"
                                        aria-label="Message Content"
                                        name='last_name'
                                        value={userInfo.last_name}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="InternshipPostInput23">
                                    <Form.Label>Username</Form.Label>
                                    <FormControl
                                        placeholder="Enter username"
                                        type="text"
                                        aria-label="Message Content"
                                        name='username'
                                        value={userInfo.username}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput24">
                                    <Form.Label>Password</Form.Label>
                                    <FormControl
                                        placeholder="Enter password"
                                        type="password"
                                        aria-label="Message Content"
                                        name='password'
                                        value={userInfo.password}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="InternshipPostInput25">
                                    <Form.Label>Email</Form.Label>
                                    <FormControl
                                        placeholder="Enter email"
                                        type="text"
                                        aria-label="Message Content"
                                        name='email'
                                        value={userInfo.email}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput26">
                                    <Form.Label>Phone</Form.Label>
                                    <FormControl
                                        placeholder="Enter phone number"
                                        type="number"
                                        aria-label="Message Content"
                                        name='phone'
                                        value={userInfo.phone}
                                        aria-describedby="basic-addon2"
                                        onChange={handleUserInfoChanges}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="InternshipPostInput17">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        value={userInfo.gender}
                                        onChange={handleUserInfoChanges}
                                        name="gender">
                                        <option value={null}>---Select Gender---</option>
                                        {/* {genders && genders.map(skill => ( */}
                                        {genders.map(item => (
                                            <option value={item.alias}>{item.name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput18">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        value={userInfo.designation}
                                        onChange={handleUserInfoChanges}
                                        name="designation">
                                        <option value={null}>---Select Role---</option>
                                        {/* {genders && genders.map(skill => ( */}
                                        {designations.map(item => (
                                            <option value={item.id}>{item.designation_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            {/* Inputs For Staff Data */}
                            <Form.Row hidden={activeForm !== 'staff'}>
                                <Form.Group as={Col} controlId="InternshipPostInput29">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        value={staffInfo.department}
                                        onChange={handleStaffInfoChanges}
                                        name="department">
                                        <option value={null}>---Select Department---</option>
                                        {/* {genders && genders.map(skill => ( */}
                                        {departments.map(item => (
                                            <option value={item.id}>{item.department_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>

                            {/* Inputs For Student Data */}
                            <Form.Row hidden={activeForm !== 'student'}>
                                <Form.Group as={Col} controlId="InternshipPostInput20">
                                    <Form.Label>Program</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        value={studentInfo.program}
                                        onChange={handleStudentInfoChanges}
                                        name="program">
                                        <option value={null}>---Select Program---</option>
                                        {/* {genders && genders.map(skill => ( */}
                                        {programs.map(item => (
                                            <option value={item.id}>{item.program_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput221">
                                    <Form.Label>Year of study</Form.Label>
                                    <FormControl
                                        placeholder="Enter year of study"
                                        type="number"
                                        aria-label="Message Content"
                                        name='year_of_study'
                                        value={studentInfo.year_of_study}
                                        aria-describedby="basic-addon2"
                                        onChange={handleStudentInfoChanges}
                                    />
                                </Form.Group>
                            </Form.Row>

                            {/* Inputs For Alumni Data */}
                            <Form.Row hidden={activeForm !== 'alumni'}>
                                <Form.Group as={Col} controlId="InternshipPostInput222">
                                    <Form.Label>Program</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        value={studentInfo.program}
                                        onChange={handleAlumniInfoChanges}
                                        name="program">
                                        <option value={null}>---Select Program---</option>
                                        {/* {genders && genders.map(skill => ( */}
                                        {programs.map(item => (
                                            <option value={item.id}>{item.program_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput223">
                                    <Form.Label>Completion Year</Form.Label>
                                    <FormControl
                                        placeholder="Enter completion year"
                                        type="number"
                                        aria-label="Message Content"
                                        name='completion_year'
                                        value={alumniInfo.completion_year}
                                        aria-describedby="basic-addon2"
                                        onChange={handleAlumniInfoChanges}
                                    />
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput224">
                                    <Form.Label>GPA</Form.Label>
                                    <FormControl
                                        placeholder="Enter gpa"
                                        type="number"
                                        aria-label="Message Content"
                                        name='gpa'
                                        value={alumniInfo.gpa}
                                        aria-describedby="basic-addon2"
                                        onChange={handleAlumniInfoChanges}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Button
                                    type="submit"
                                    hidden={formError || successMessage}
                                    style={{ marginBottom: '16px', width: '100%' }}
                                >{isSendingData ? <Loader message='sending...!' /> : 'Send'} </Button>
                            </Form.Row>
                            <Form.Row>
                                <Button
                                    hidden={!formError}
                                    variant='danger'
                                    style={{ width: '100%', marginBottom: '16px' }}
                                >{formError}</Button>
                                <Button
                                    hidden={!successMessage}
                                    variant='success'
                                    style={{ width: '100%' }}
                                >{successMessage}</Button>
                            </Form.Row>
                    
                        </Form></>}
            </Card.Body>
        </Card>
    )
}
