import React from 'react'
import Message from '../../components/message'
import Icon from 'supercons'
import { Card, Row, Col, Badge, FormControl,  InputGroup, Button} from 'react-bootstrap'

const messages = [
    {
        source: 'T/UDOM/2017/12300',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.x'
    },
    {
        source: 'T/UDOM/2017/12300',
        date: '2 minutes ago',
        content: 'Hellow Buddies!!.'
    },
    {
        source: 'T/UDOM/2015/55',
        date: '2 minutes ago',
        content: 'Hellow, How U Doin?'
    },
    {
        source: 'T/UDOM/2012/12220',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2012/12220',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni To His/Her Friends Within The System, At A Particular Day'
    },
    {
        source: 'T/UDOM/2015/55',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2012/12220',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni To His/Her Friends Within The System, At A Particular Day'
    },
    {
        source: 'T/UDOM/2015/55',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2015/505',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2015/55',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2015/585',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2015/55',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
    {
        source: 'T/UDOM/2015/575',
        date: '2 minutes ago',
        content: 'This Is What The message Says from A Single Alumni.'
    },
]

const activeAlumni = [
    {
        id: 1,
        regNo: 'T/UDOM/2012/12220'
    },
    {
        id: 2,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 3,
        regNo: 'T/UDOM/2012/12224'
    },
    {
        id: 4,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 5,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 6,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 7,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 8,
        regNo: 'T/UDOM/2012/1222'
    },
    {
        id: 9,
        regNo: 'T/UDOM/2012/1222'
    },
]
const ChatPage = () => {

    const alumni = "T/UDOM/2015/55"
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Row >
                <Col md={8} xs={12} style={{marginBottom: '15px'}}>
                    <div>
                        <Message  variant='info' >Latest Messages</Message>  
                    </div>
                    <Card className="chat-container">
                        <Card.Body className="messages-container" style={{padding: 0}}>
                            { messages.map((message) => (
                                <p className={message.source === alumni ? "outgoing-messages" : "incoming-messages"} key={message.date}>
                                    <span><b>{message.source === alumni ? 'You' : message.source} </b></span>
                                    <p>{message.content} </p>
                                    <span style={{float: 'right'}}><i>{message.date} </i></span>
                                </p>
                            ))}
                        </Card.Body>
                        <InputGroup className="" >
                            <FormControl
                            placeholder="Type a message here..."
                            aria-label="Message Content"
                            aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-primary">
                                    <Icon glyph="send-fill" size={20} />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Card>
                </Col>
                <Col md={{span: 3, offset: 1}} xs={12} style={{marginBottom: '10px'}}>
                    <Card>
                        <Message  variant='info' >ACTIVE ALUMNI <Badge variant="info" style={{float: 'right'}}>15</Badge></Message>  
                        <Card.Body className="active-alumni-list">
                            {activeAlumni.map((item) => (<>
                                <p key={item.id}>{item.regNo}</p> <hr /></>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ChatPage
