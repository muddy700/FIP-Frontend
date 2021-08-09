import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, Button} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import Message from '../../components/message'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { getStudentProfileInfo, sendFieldReport } from '../../app/api'
import DataPlaceHolder  from '../../components/dataPlaceHolder'

export const FieldInfoPage = () => {

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    const [field_report, setField_report] = useState(null)
    const [studentProfile, setStudentProfile] = useState({})
    const [fileError, setFileError] = useState('')
    const [isSendingReport, setIsSendingReport] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)

    const getStudentProfile = async () => {
        setIsFetchingData(true)
        try {
            const response = await getStudentProfileInfo(user.userId, config)
            setStudentProfile(response[0])
            setIsFetchingData(false)
        } catch (error) {
            console.log('Getting Student Profile Info ', error.response.data)
        }
    }

    useEffect(() => {
        getStudentProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    const handleReportFile = (e) => {
        setFileError('')
        setField_report(e.target.files[0])
    }
    

    const reportValidator = () => {
        const allowedDocFormats = /(\.pdf)$/i;
        
        if (!field_report) {
            setFileError('Please select a file')
            return false
        }
        else if (!allowedDocFormats.exec(field_report.name)) {
            setFileError('Invalid file format. Only pdf files are allowed.')
            return false
        }
        else {
            setFileError('')
            return true
        }
    }

    const submitReport = async () => {
        // e.preventDefault();
        const isReportValid = reportValidator()
        if (isReportValid) { 
            setIsSendingReport(true)
            const payload = new FormData()
            payload.append('student_status', studentProfile.student_status)
            payload.append('phone_number', studentProfile.phone_number)
            payload.append('year_of_study', studentProfile.year_of_study)
            payload.append('program', studentProfile.program)
            payload.append('student', studentProfile.student)
            payload.append('organization', studentProfile.organization)
            payload.append('field_supervisor', studentProfile.field_supervisor)
            payload.append('department', studentProfile.department)
            payload.append('academic_supervisor', studentProfile.academic_supervisor)
            payload.append('has_reported', studentProfile.has_reported)
            payload.append('date_reported', studentProfile.date_reported)
            payload.append('field_report', field_report)
   
            const config2 = {
                 headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }

            try {
                const response = await sendFieldReport(studentProfile.id, payload, config2)
                setStudentProfile({...studentProfile, field_report: response.field_report})
                setIsSendingReport(false)
            } catch (error) {
                console.log('Sending Field Report ', error.response.data)
                setIsSendingReport(false)
            }
        }
        else {
            console.log('Invalid Report File')
        }
    }
    
    return (
        <Card >
        <Card.Header >
                <Message variant='info' >Your field informations</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Row style={{ marginBottom: '16px' }}>
                            <Col md={2}>
                                <span><b>Organization: </b></span>
                            </Col>
                            <Col md={4}>
                                <span>{studentProfile.organization_name === 'pending' ? '---' : studentProfile.organization_name}</span>
                            </Col>
                        </Row>

                        <Row style={{ marginBottom: '16px' }}>
                            <Col md={2}>
                                <span><b>Field Report: </b></span>
                            </Col>
                            {
                                !studentProfile.week_5_logbook ?
                                <Col md={4}>
                                    <Message variant='info'>You must upload all logbooks so as to be able to upload your field report.</Message>
                                </Col> :
                                studentProfile.field_report !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col>
                                :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleReportFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitReport() }}
                                    >{isSendingReport ? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>
                        <Row style={{ marginBottom: '16px' }}>
                            <Col md={2}>
                                <span><b>Academic Supervisor: </b></span>
                            </Col>
                            {studentProfile.academic_supervisor === 38 ?
                                <Col md={4}>
                                    <Message variant='info'>Not assigned yet.</Message>
                                </Col> :
                                <Col md={8}>
                                    {/* <span><b>Full Name:</b> {studentProfile.academic_supervisor_name}</span> <br /> */}
                                    <span><b>Full Name:</b> {studentProfile.academic_supervisor_first_name} {studentProfile.academic_supervisor_last_name}</span> <br />
                                    <span><b>Email:</b> {studentProfile.academic_supervisor_email}</span> <br />
                                </Col>
                            }
                    
                        </Row> </>
                }
                </Card.Body>
        </Card>
    )
}
