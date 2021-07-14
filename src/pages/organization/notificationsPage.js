import React, {useState, useEffect} from 'react'
import Icon from 'supercons'
import {TimeAgo} from '../../components/timeAgo'
import { Card, Row, Col} from 'react-bootstrap'
import Message from '../../components/message'
import Accordion from 'react-bootstrap/Accordion'

import { useSelector}  from 'react-redux'
import { createNotificationView, getAllNotifications, getAllNotificationsViews } from '../../app/api'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import DataPlaceHolder from '../../components/dataPlaceHolder'

function NotificationsPage() {

    
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [activeItem, setactIveItem] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [views, setViews] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)

    const getNotifications = async () => {
        setIsFetchingData(true)
        try {
            const response = await getAllNotifications(config)
            setNotifications(response)
            getViews()
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'Request': 'Getting All Notifications Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const getViews = async () => {
        try {
            const response = await getAllNotificationsViews(config)
            const required_views = response.filter(item => item.organization === parseInt(user.userId))
            setViews(required_views)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'Request': 'Getting All Notifications Views Request',
                'Error => ' : error.response.data,
            })
        }
    }


    useEffect(() => {
        getNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkViewStatus = (notificationId) => {
        let hasViewed = views.find(item => item.organization === parseInt(user.userId) && item.notification === notificationId)
        return hasViewed;
    }

    const handleOpen = (id) => {
        if (!activeItem) {
            setactIveItem(id)
            sendNotificationView(id)
        }
        else if (id === activeItem) {
            setactIveItem(false)
        } else if (id !== activeItem) {
            setactIveItem(id)
            sendNotificationView(id)
        }
    }
    
    const sendNotificationView = async (notificationId) => {
        //do some 
        let hasViewed = checkViewStatus(notificationId)
        if (hasViewed) {
            //do some
            console.log('has viewed already')
        }
        else {
            const payload = {
                organization: user.userId,
                notification: notificationId
            }
            try {
                const response = await createNotificationView(payload, config)
                console.log('view created')
                setViews([...views, response])
            } catch (error) {
                console.log('Creating Notification View, ', error.response.data)
            }
        }
    }

    return (
        <div>
            <Card.Header>
               <Message  variant='info' >Notifications</Message>  
            </Card.Header>
            <div className="announcements-container" style={{ backgroundColor: 'white', padding: '1%' }}>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        {notifications.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
                            .map((item) =>
                                <Accordion className="announcement-card"  >
                                    <Card >
                                        <Accordion.Toggle as={Card.Header} variant="link" eventKey={item.id.toString()} onClick={e => { e.preventDefault(); handleOpen(item.id) }}>
                                            <Row style={{ display: 'flex' }}>
                                                <Col md={11} xs={10} >
                                                    <h6>{item.title} </h6>
                                                </Col>
                                                <Col md={1} xs={1} >
                                                    {item.id === activeItem ?
                                                        <Icon glyph="down-caret" size={32} />
                                                        : <Icon glyph="right-caret" size={32} />}
                                                </Col>
                                            </Row>
                                        </Accordion.Toggle>
                                        {activeItem === item.id ?
                                            <Accordion.Collapse eventKey={item.id.toString()} ><>
                                                <Card.Body> {item.content} </Card.Body>
                                                <Card.Footer className="text-muted">
                                                    <Row>
                                                        {/* <Col md={6} style={{ backgroundColor: '' }}><small><i>From: {item.sender} </i></small> </Col> */}
                                                        <Col md={{span: 6, offset: 6}} style={{ textAlign: 'right' }}><small><i><TimeAgo timestamp={item.date_updated} /></i></small> </Col>
                                                    </Row>
                                                </Card.Footer></>
                                            </Accordion.Collapse> : ''}
                                    </Card>
                                </Accordion>)}</>
                }
                {notifications.length <= 0 && !isFetchingData? 
                <Message variant='info'>No any notification yet</Message> : ''}
            </div>
        </div>
    )
}

export default NotificationsPage
