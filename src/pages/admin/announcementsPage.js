import { Divider } from 'antd'
import React, {useState, useEffect} from 'react'
import Icon from 'supercons'
import {TimeAgo} from '../../components/timeAgo'
import { Card, Row, Col } from 'react-bootstrap'
import Message from '../../components/message'
import Accordion from 'react-bootstrap/Accordion'
import { useSelector}  from 'react-redux'
import { fetchDesignationAnnouncements } from '../../app/api'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'

const AnnouncementsPage = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [activeItem, setactIveItem] = useState(null)
    const [alumniAnnouncements, setAlumniAnnouncements] = useState([])
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    const getAnnouncements = async () => {
        try {
            const response = await fetchDesignationAnnouncements(user.designation_id, config)
            setAlumniAnnouncements(response)
        } catch (error) {
            console.log({
                'Request': 'Getting Alumni Announcements Request',
                'Error => ' : error,
            })
        }

    }

    useEffect(() => {
        getAnnouncements()
    }, [])

    const handleOpen = (id) => {
        if (!activeItem) {
            setactIveItem(id)
        }
        else if (id === activeItem) {
            setactIveItem(false)
        } else if (id !== activeItem) {
            setactIveItem(id)
        }
    }
    
    return (
        
        <div>
            <Card.Header>
               <Message  variant='info' >Latest Announcements</Message>  
            </Card.Header>
            <div className="announcements-container">
                {alumniAnnouncements.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
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
                                    <Card.Body> {item.description} </Card.Body>
                                    <Card.Footer className="text-muted">
                                        <Row>
                                            <Col md={6} style={{ backgroundColor: '' }}><small><i>From: {item.sender} </i></small> </Col>
                                            <Col md={6} style={{ textAlign: 'right' }}><small><i><TimeAgo timestamp={item.date_updated} /></i></small> </Col>
                                        </Row>
                                    </Card.Footer></>
                                </Accordion.Collapse> : ''}
                        </Card>
                    </Accordion>)}
            </div>
        </div>
        
    )
}

export default AnnouncementsPage
