import React, {useState, useEffect} from 'react'
import {TimeAgo} from '../../components/timeAgo'
import { Card, Row, Col, Button, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { AddAnnouncement, DeleteSingleAnnouncement, fetchAllAnnouncements } from '../../app/api'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import ContentModal from '../../components/contentModal'
import Loader from '../../components/loader'

const AnnouncementsPage = () => {

    const initialAnnouncement = {
        source: '',
        destination: '',
        title: '',
        description: ''
    }
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [alumniAnnouncements, setAlumniAnnouncements] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false)
    const [announcementInfo, setAnnouncementInfo] = useState(initialAnnouncement)
    const [announcementError, setAnnouncementError] = useState('')
    const [isDeletingAnnouncement, setIsDeletingAnnouncement] = useState(false)
    const [activeAnnounce, setActiveAnnounce] = useState({})

    const getAnnouncements = async () => {
        try {
            const response = await fetchAllAnnouncements(config)
            const coordinator_announcements = response.filter(item => item.source === user.designation_id)
            setAlumniAnnouncements(coordinator_announcements)
        } catch (error) {
            console.log({
                'Request': 'Getting Alumni Announcements Request',
                'Error => ' : error.response.data,
            })
        }

    }

    useEffect(() => {
        getAnnouncements()
    }, [])

    const handleAnnouncementForm = (e) => {
        setAnnouncementError('');
        setAnnouncementInfo({
            ...announcementInfo,
            [e.target.name] : e.target.value
        })
    }

    const announcementValidator = () => {
        if (!announcementInfo.title) {
            setAnnouncementError('Announcement title cannot be blank!.')
            return false
        }
        else if (!announcementInfo.description) {
            setAnnouncementError('Announcement description cannot be blank!.')
            return false
        }
        else {
            setAnnouncementError('');
            return true;
        }
    }

    const currentDate = new Date();

    const sendAnnouncement = async (e) => {
        e.preventDefault();
        const isDataValid = announcementValidator()

        if (isDataValid) {
            setIsSendingAnnouncement(true)
            const payload = {
                ...announcementInfo,
                source: user.designation_id,
                destination: 7,
                closing_date: currentDate.toISOString()
            }

            try {
                const response = await AddAnnouncement(payload, config)
                setAlumniAnnouncements([...alumniAnnouncements, response])
                setIsSendingAnnouncement(false)
                setShowModal(false)
                setAnnouncementInfo(initialAnnouncement)
            } catch (error) {
                console.log('Adding Announcement ', error.response.data)
                setIsSendingAnnouncement(false);
                if (error.response.status === 500) {
                    setAnnouncementError('Ooops...!, Some error occured. Try again later.')
                }
                else if (error.response.data.title) {
                    setAnnouncementError('Announcement title cannot be null.')
                }
                else if (error.response.data.description) {
                    setAnnouncementError('Announcement description cannot be null.')
                }
            }
        }
        else {
            console.log('Announcement Form Is Invalid')
        }
    }

    const formTitle = 'Fill announcement details'
    const formContents = <Form onSubmit={sendAnnouncement}>
        <Form.Group controlId="formGridEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
                type="text"
                placeholder="enter title"
                value={announcementInfo.title}
                onChange={handleAnnouncementForm}
                name="title" />
        </Form.Group>
         <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea"
                    placeholder="enter description"
                    value={announcementInfo.description}
                    onChange={handleAnnouncementForm}
                    name="description"
                    aria-label="With textarea" />
        </Form.Group>
        <Row>
            <Col md={9}>
                <Button
                    variant="danger"
                    hidden={!announcementError}
                >{announcementError}</Button>
            </Col>
            <Col md={3}>
                <Button
                    variant="primary"
                    type="submit"
                    style={{float: 'right'}}
                >{isSendingAnnouncement ? <Loader message="Sending..." /> : 'Send'} </Button>
            </Col>
        </Row>
    </Form>

    const deleteAnnouncement = async (record) => {
        setIsDeletingAnnouncement(true)
        try {
            const response = await DeleteSingleAnnouncement(record.id, config)
            console.log(response.length)
            const new_list = alumniAnnouncements.filter(item => item.id !== record.id)
            setAlumniAnnouncements(new_list)
            setIsDeletingAnnouncement(false)
            // setActiveAnnounce({})
        } catch (error) {
            console.log('Deleting Announcement ', error.response.data)
        }
    }

    return (
        
        <div>
            <Card.Header>
               <Message  variant='info' >Latest Announcements</Message>  
            </Card.Header>
            <div className="announcements-container" style={{ backgroundColor: 'white', padding: '1%' }}>
                <Row style={{paddingLeft: '2%', marginBottom: '16px'}}>
                    <Button onClick={e => { e.preventDefault(); setShowModal(true)}}>Add Announcement</Button>
                </Row>
                {alumniAnnouncements.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
                    .map((item) =>
                        <Card
                            onMouseEnter={e => {e.preventDefault(); setActiveAnnounce(item)}}
                            onMouseLeave={e => {e.preventDefault(); setActiveAnnounce({})}}
                            style={{ marginBottom: '16px', borderRadius: '10px ' }}>
                            <Card.Header>
                                <h6>{item.title} </h6>
                            </Card.Header>
                            <Card.Body> {item.description} </Card.Body>
                            <Card.Footer className="text-muted" style={{backgroundColor: ''}}>
                                <Row>
                                    <Col md={6} style={{ backgroundColor: '' }}>
                                        <Button
                                            variant='danger'
                                            hidden={activeAnnounce.id !== item.id}
                                            onClick={e => { e.preventDefault(); setActiveAnnounce(item); deleteAnnouncement(item) }}
                                        >
                                            {isDeletingAnnouncement && activeAnnounce.id === item.id ? <Loader message='Deleting...' /> : 'Delete'}</Button> </Col>
                                    <Col md={6} style={{ textAlign: 'right' }}><small><i><TimeAgo timestamp={item.date_updated} /></i></small> </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    )}
            </div>
            <ContentModal
            show={showModal}
            isTable={false}
            title={formTitle}
            content={formContents}
            onHide={() => { setShowModal(false) }}
            />
        </div>
        
    )
}

export default AnnouncementsPage
