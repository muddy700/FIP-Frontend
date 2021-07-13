import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, Button } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations,
    //  selectUserData 
    } from '../../slices/userSlice'
import Loader from '../../components/loader'
import {  editUserProfile, getAllRoles, getAllStaffsProfiles, getUserProfileByUserId } from '../../app/api'
import DataPlaceHolder from '../../components/dataPlaceHolder'
import Message from '../../components/message'

function RolesPage() {

    const config = useSelector(apiConfigurations)
    const [designations, setDesignations] = useState([])
    const [staffsProfiles, setStaffsProfiles] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [selectedStaff, setSelectedStaff] = useState(null)
    const [selectedRole, setSelectedRole] = useState(null)
    const [isSendingData, setIsSendingData] = useState(false)
    const [hasDataSent, setHasDataSent] = useState(false)

    const fetchDesignations = async () => {
        setIsFetchingData(true)
        try {
            const response = await getAllRoles(config)
            const new_roles = response.filter(role => role.designation_name !== 'alumni' && role.designation_name !== 'student' && role.designation_name !== 'organization' && role.designation_name !== 'admin')
            setDesignations(new_roles)
            fetchStaffsProfiles()
        } catch (error) {
            setIsFetchingData(false)
            console.log('Fetching Designations ', error.response.data)
            
        }
    }

    const fetchStaffsProfiles = async () => {
        try {
            const response = await getAllStaffsProfiles(config)
            setStaffsProfiles(response)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log('Fetching Staffs Profiles ', error.response.data)
        }
    }

    
    useEffect(() => {
        fetchDesignations()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = async (e) => {
        e.preventDefault()
        setIsSendingData(true)
        try {
            const profile = await getUserProfileByUserId(selectedStaff, config)
            try {
                const payload = {
                    user: profile[0].user, designation: selectedRole
                }
                const response = await editUserProfile(profile[0].id, payload, config)
                setHasDataSent(true)
                console.log(response.length)
                setIsSendingData(false)
                setSelectedRole(null)
                setSelectedStaff(null)
            } catch (error) {
                setIsSendingData(false)
                console.log('Changing Staff Role ', error.response.data)
            }
        } catch (error) {
            setIsSendingData(false)
            console.log('Gettting Staff Profile ', error.response.data)
        }
    }

    return (
        <Card className="dashboard-container">
            <span
                hidden={!hasDataSent}
            ><Message variant='info'>Role changed successful.</Message>
            </span>
            {isFetchingData ?
                <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                    <Card.Header>
                        <Row>
                            <h3>Change staff role</h3>
                        </Row>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={onFinish}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="InternshipPostInput1">
                                    <Form.Label>Staff</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        //   value={selectedProfession}
                                        onChange={e => { e.preventDefault(); setSelectedStaff(e.target.value); setHasDataSent(false) }}
                                        name="profession">
                                        <option value={null}>---Select Staff---</option>
                                        {staffsProfiles.map(staff => (
                                            <option value={staff.staff}>{staff.staff_first_name} {staff.staff_last_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="InternshipPostInput11">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control as="select"
                                        size="md"
                                        //   value={selectedProfession}
                                        onChange={e => { e.preventDefault(); setSelectedRole(e.target.value); setHasDataSent(false) }}
                                        name="profession">
                                        <option value={null}>---Select Role---</option>
                                        {designations.map(role => (
                                            <option value={role.id}>{role.designation_name} </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Button
                                    type='submit'
                                    disabled={!selectedStaff || !selectedRole}
                                >{isSendingData ? <Loader message='Saving...' /> : 'Save'} </Button>
                            </Form.Row>
                        </Form>
                
                        {/* <Row> */}
                            {/* <Button
                                hidden={!hasDataSent}
                                variant='success'>
                                Role changed successful.
                            </Button> */}
                        {/* </Row> */}
                    </Card.Body> </>
            }
        </Card>
    )
}

export default RolesPage
