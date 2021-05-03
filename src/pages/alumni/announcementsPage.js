import { Divider } from 'antd'
import React, {useState} from 'react'
import Icon from 'supercons'
import { Card, Row, Col } from 'react-bootstrap'
import Message from '../../components/message'
import Accordion from 'react-bootstrap/Accordion'

const announcementList = [
    {
        id: 1,
        source: 'Admin',
        title: 'Announcement Title Appears Here So That EveryOne Can See It Clearly',
        date: '2 days ago',
        contents: "On friday we will have technical issue we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER On friday we will have technical issue, we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER"
    },
    {
        id: 2,
        source: 'Admin',
        title: 'Announcement Title Appears Here So That EveryOne Can See It Clearly',
        date: '2 days ago',
        contents: "On friday we will have technical issue we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER On friday we will have technical issue, we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER"
    },
    {
        id: 3,
        source: 'Admin',
        title: 'Announcement Title Appears Here So That EveryOne Can See It Clearly',
        date: '2 days ago',
        contents: "On friday we will have technical issue we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER On friday we will have technical issue, we announce you that, the system will be down for 3 hoursFEHFUEHFEHRQEGRYQEGRGYYRQEQYRER"
    }
]
const AnnouncementsPage = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [activeItem, setactIveItem] = useState(null)
    const ida = 1;

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
                {announcementList.map((item) =>
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
                                    <Card.Body> {item.contents} </Card.Body>
                                    <Card.Footer className="text-muted">
                                        <Row>
                                            <Col md={6} style={{ backgroundColor: '' }}><small><i>From: {item.source} </i></small> </Col>
                                            <Col md={6} style={{ textAlign: 'right' }}><small><i>{item.date}</i></small> </Col>
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
