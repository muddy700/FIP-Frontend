import React, {useState, useEffect} from 'react'
import {TimeAgo} from '../../components/timeAgo'
import { Card, Row, Col, Button, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { createNotification, deleteNotification, getAllNotifications } from '../../app/api'
import { apiConfigurations } from '../../slices/userSlice'
import ContentModal from '../../components/contentModal'
import Loader from '../../components/loader'
import DataPlaceHolder from '../../components/dataPlaceHolder'

function NotificationsPage() {

    const initialNotification = {
        title: '',
        content: ''
    }
    
    // const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [notifications, setNotifications] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [activeNotification, setActiveNotification] = useState({})
    const [isDeletingNotification, setIsDeletingNotification] = useState(false)
    const [notificationInfo, setNotificationInfo] = useState(initialNotification)
    const [notificationError, setNotificationError] = useState('')
    const [isSendingNotification, setIsSendingNotification] = useState(false)
    
    const getNotifications = async () => {
        setIsFetchingData(true)
        try {
            const response = await getAllNotifications(config)
            setNotifications(response)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'Request': 'Getting All Notifications Request',
                'Error => ' : error.response.data,
            })
        }
    }

    useEffect(() => {
        getNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteSingleNotification = async (record) => {
        setIsDeletingNotification(true)
        try {
            const response = await deleteNotification(record.id, config)
            console.log(response.length)
            const new_list = notifications.filter(item => item.id !== record.id)
            setNotifications(new_list)
            setIsDeletingNotification(false)
            setActiveNotification({})
        } catch (error) {
            console.log('Deleting Announcement ', error.response.data)
        }
    }

    const handleNotificationChanges = (e) => {
        setNotificationError('')
        setNotificationInfo({
            ...notificationInfo,
            [e.target.name] : e.target.value
        })
    }

    const notificationValidator = () => {
        if (!notificationInfo.title) {
            setNotificationError('Title cannot be blank')
            return false;
        }
        else if (!notificationInfo.content) {
            setNotificationError('Description cannot be blank')
            return false;
        }
        else {
            setNotificationError('')
            return true
        }
    }

    const sendNotification = async (e) => {
        e.preventDefault()
        const isDataValid = notificationValidator()
        if (isDataValid) {
            setIsSendingNotification(true)
            try {
                const response = await createNotification(notificationInfo, config)
                setNotifications([...notifications, response])
                setIsSendingNotification(false)
                setNotificationInfo(initialNotification)
                setShowModal(false)
            } catch (error) {
                console.log('Creating Notification ', error.response.data)
            }
        }
        else {
            console.log('notification info form is not valid')
        }
    }


    const formTitle = 'Fill notification details'
    const formContents = <Form onSubmit={sendNotification}>
        <Form.Group controlId="formGridEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control
                type="text"
                placeholder="enter title"
                value={notificationInfo.title}
                onChange={handleNotificationChanges}
                name="title" />
        </Form.Group>
         <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea"
                    placeholder="enter description"
                    value={notificationInfo.content}
                    onChange={handleNotificationChanges}
                    name="content"
                    aria-label="With textarea" />
        </Form.Group>
        <Row>
            <Col md={9}>
                <Button
                    variant="danger"
                    hidden={!notificationError}
                >{notificationError}</Button>
            </Col>
            <Col md={3}>
                <Button
                    variant="primary"
                    type="submit"
                    style={{float: 'right'}}
                >{isSendingNotification ? <Loader message="Sending..." /> : 'Send'} </Button>
            </Col>
        </Row>
    </Form>

    return (
        <div>
            <Card.Header>
               <Message  variant='info' >Notifications</Message>  
            </Card.Header>
            <div className="announcements-container" style={{ backgroundColor: 'white', padding: '1%' }}>
                <Row style={{paddingLeft: '2%', marginBottom: '16px'}}>
                    <Button onClick={e => { e.preventDefault(); setShowModal(true)}}>Add Notification</Button>
                </Row>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        {notifications.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
                            .map((item) =>
                                <Card
                                    onMouseEnter={e => { e.preventDefault(); setActiveNotification(item) }}
                                    onMouseLeave={e => { e.preventDefault(); setActiveNotification({}) }}
                                    style={{ marginBottom: '16px', borderRadius: '10px ' }}>
                                    <Card.Header>
                                        <h6>{item.title} </h6>
                                    </Card.Header>
                                    <Card.Body> {item.content} </Card.Body>
                                    <Card.Footer className="text-muted" style={{ backgroundColor: '' }}>
                                        <Row>
                                            <Col md={6} style={{ backgroundColor: '' }}>
                                                <Button
                                                    variant='danger'
                                                    hidden={activeNotification.id !== item.id}
                                                    onClick={e => { e.preventDefault(); setActiveNotification(item); deleteSingleNotification(item) }}
                                                >
                                                    {isDeletingNotification && activeNotification.id === item.id ? <Loader message='Deleting...' /> : 'Delete'}
                                                </Button>
                                                <Link to={{ pathname: `/notification/${item.id}/viewers` }}>
                                                <Button
                                                    // variant='link'
                                                    style={{marginLeft: '2%'}}
                                                    hidden={activeNotification.id !== item.id}
                                                > View status
                                                </Button>
                                                </Link>
                                            </Col>
                                            <Col md={6} style={{ textAlign: 'right' }}><small><i><TimeAgo timestamp={item.date_created} /></i></small> </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            )} </>}
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

export default NotificationsPage
