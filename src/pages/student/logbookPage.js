import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, Button} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Loader from '../../components/loader'
import Message from '../../components/message'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { getStudentProfileInfo, sendFieldReport } from '../../app/api'
import DataPlaceHolder  from '../../components/dataPlaceHolder'

function LogBookPage() {

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    const [logbookFile, setLogbookFile] = useState(null)
    const [studentProfile, setStudentProfile] = useState({})
    const [fileError, setFileError] = useState('')
    const [isSendingFile, setIsSendingFile] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [activeWeek, setActiveWeek] = useState(1)

    const getStudentProfile = async () => {
        setIsFetchingData(true)
        try {
            const response = await getStudentProfileInfo(user.userId, config)
            setStudentProfile(response[0])
            checkActiveWeek(response[0])
            setIsFetchingData(false)
        } catch (error) {
            console.log('Getting Student Profile Info ', error.response.data)
        }
    }

    const checkActiveWeek = (profile) => {
            if (!profile.week_1_logbook) {
                setActiveWeek(1)
            }
            else if (!profile.week_2_logbook) {
                setActiveWeek(2)
            }
            else if (!profile.week_3_logbook) {
                setActiveWeek(3)
            }
            else if (!profile.week_4_logbook) {
                setActiveWeek(4)
            }
            else if (!profile.week_5_logbook) {
                setActiveWeek(5)
            }
            else {
                setActiveWeek(0)
            }
    }

    useEffect(() => {
        getStudentProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
        
    const handleLogBookFile = (e) => {
        setFileError('')
        setLogbookFile(e.target.files[0] ? e.target.files[0] : null)
    }
    
    const FileValidator = () => {
        const allowedDocFormats = /(\.pdf)$/i;
        
        if (!logbookFile) {
            setFileError('Please select a file')
            return false
        }
        else if (!allowedDocFormats.exec(logbookFile.name)) {
            setFileError('Invalid file format. Only pdf files are allowed.')
            setLogbookFile(null)
            return false
        }
        else {
            setFileError('')
            return true
        }
    }

    const submitLogBook = async () => {
        // e.preventDefault();
        const isLogBookValid = FileValidator()
        if (isLogBookValid) { 
            setIsSendingFile(true)
            const payload = new FormData()
            payload.append('program', studentProfile.program)
            payload.append('student', studentProfile.student)
            payload.append('organization', studentProfile.organization)
            payload.append('field_supervisor', studentProfile.field_supervisor)
            payload.append('department', studentProfile.department)
            payload.append('academic_supervisor', studentProfile.academic_supervisor)
            payload.append('has_reported', studentProfile.has_reported)
            payload.append('student_status', studentProfile.student_status)
            payload.append(`week_${activeWeek}_logbook`, logbookFile)
   
            const config2 = {
                 headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${localStorage.getItem('token')}`
                }
            }

            try { 
                const response = await sendFieldReport(studentProfile.id, payload, config2)
                setStudentProfile(response)
                // checkActiveWeek(response)
                setActiveWeek(activeWeek + 1)
                setLogbookFile(null)
                // setStudentProfile({...studentProfile, logbookFile: response.logbookFile})
                setIsSendingFile(false)
            } catch (error) {
                console.log('Sending Field Report ', error.response.data)
                setIsSendingFile(false)
            }
        }
        else {
            console.log('Invalid Report File')
        }
    }

    return (
        <Card >
        <Card.Header >
                <Message variant='info' >Your logbooks info are listed below.</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        
                        <Row style={{ marginBottom: '16px' }}>
                            <Col md={2}>
                                <span><b>Week 1: </b></span>
                            </Col>
                            {studentProfile.week_1_logbook !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col> :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleLogBookFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitLogBook() }}
                                    >{isSendingFile && activeWeek === 1? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>

                        <Row style={{ marginBottom: '16px' }} hidden={!studentProfile.week_1_logbook}>
                        {/* <Row style={{ marginBottom: '16px' }} hidden={activeWeek < 2}> */}
                            <Col md={2}>
                                <span><b>Week 2: </b></span>
                            </Col>
                            {studentProfile.week_2_logbook !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col> :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleLogBookFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitLogBook() }}
                                    >{isSendingFile && activeWeek === 2 ? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>

                        <Row style={{ marginBottom: '16px' }} hidden={!studentProfile.week_2_logbook}>
                        {/* <Row style={{ marginBottom: '16px' }} hidden={activeWeek < 3}> */}
                            <Col md={2}>
                                <span><b>Week 3: </b></span>
                            </Col>
                            {studentProfile.week_3_logbook !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col> :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleLogBookFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitLogBook() }}
                                    >{isSendingFile && activeWeek === 3 ? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>

                        <Row style={{ marginBottom: '16px' }} hidden={!studentProfile.week_3_logbook}>
                        {/* <Row style={{ marginBottom: '16px' }} hidden={activeWeek < 4}> */}
                            <Col md={2}>
                                <span><b>Week 4: </b></span>
                            </Col>
                            {studentProfile.week_4_logbook !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col> :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleLogBookFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitLogBook() }}
                                    >{isSendingFile && activeWeek === 4 ? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>

                        <Row style={{ marginBottom: '16px' }} hidden={!studentProfile.week_4_logbook}>
                        {/* <Row style={{ marginBottom: '16px' }} hidden={activeWeek < 5}> */}
                            <Col md={2}>
                                <span><b>Week 5: </b></span>
                            </Col>
                            {studentProfile.week_5_logbook !== null ?
                                <Col md={4}>
                                    <Message variant='success'>Uploaded Successfull.</Message>
                                </Col> :
                                <Col md={6}>
                                    <Form.Control
                                        type="file"
                                        onChange={handleLogBookFile}
                                        accept="application/pdf" />
                                    <Button
                                        disabled={!studentProfile.has_reported}
                                        style={{ marginTop: '16px' }}
                                        onClick={e => { e.preventDefault(); submitLogBook() }}
                                    >{isSendingFile && activeWeek === 5 ? <Loader message='Sending...' /> : 'Submit'}
                                    </Button> &nbsp; &nbsp;
                                    <Button
                                        style={{ marginTop: '16px' }}
                                        hidden={!fileError}
                                        variant='danger'>{fileError}</Button>
                                </Col>
                            }
                        </Row>
                         </>
                }
                </Card.Body>
        </Card>
    )
}

export default LogBookPage
