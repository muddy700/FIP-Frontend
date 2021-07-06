import React, {useEffect, useState} from 'react'
import Message from '../../components/message'
import Icon from 'supercons'
import { Card, Row, Col, Badge, FormControl,  InputGroup, Button} from 'react-bootstrap'
import db from '../../firebase'
import { useSelector}  from 'react-redux'
import { selectUserData } from '../../slices/userSlice'
import { TimeAgo } from '../../components/timeAgo'
import DataPlaceHolder from '../../components/dataPlaceHolder';

const ChatPage = () => {

    const msg = {
        source: '',
        content: '',
        date_created: ''
    }
    const user = useSelector(selectUserData)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState(msg)
    const [activeAlumni, setActiveAlumni] = useState([])
    const messagesRef = db.collection('messages');
    const usersRef = db.collection('users');
    // const [hasDuplicate, sethasDuplicate] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    
    const onMessageChange = (e) => {
        e.preventDefault()
        setMessage({
            ...message,
            [e.target.name] : e.target.value
        })
    }

    const sendMessage = (e) => {
        e.preventDefault()
        const currentTime = new Date();
        const dateCreated = currentTime.toISOString();
        const messageData = {
            source: user.username,
            date_created: dateCreated,
            content: message.content
        }
        messagesRef.add(messageData)
        .then((docRef) => {
                setMessage(msg);
            })
            .catch((error) => {
                console.error("Error Sending Message : ", error);
            });

    }

    const fetchMessages = () => {
        setIsFetchingData(true)
        var messageResponse = messagesRef.orderBy("date_created");
        messageResponse.onSnapshot(snapshot => (
            setMessages(  snapshot.docs.map((doc) => doc.data()  ))
            ));
        fetchUsers();
    }

    const fetchUsers = () => {
        usersRef.onSnapshot(snapshot => (
            setActiveAlumni(  snapshot.docs.map((doc) => doc.data() ))
        ));
        setIsFetchingData(false)
    }

    // const removeRepeatedAlumni = () => {
    //     const newUsers1 = activeAlumni.map(item => item.username)
    //     const newUsers2 = [...new Set(newUsers1)]
        // console.log(newUsers2)
        // setActiveAlumni(newUsers2)
        // newUsers1.length !== newUsers2.length ? setActiveAlumni(newUsers2) : <> </>
        // return newUsers
    // }

    // removeRepeatedAlumni()

    useEffect(() => {
        fetchMessages();
        // fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Row >
                <Col md={8} xs={12} style={{marginBottom: '15px'}}>
                    <Card.Header>
                        <Message  variant='info' >Latest Messages</Message>  
                    </Card.Header>
                    <Card className="chat-container">
                        {isFetchingData ?
                            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Card.Body className="messages-container" style={{padding: 0}}>
                            { messages.map((message) => (
                                <div className={message.source === user.username ? "outgoing-messages" : "incoming-messages"} key={message.date}>
                                    <span><b>{message.source === user.username ? 'You' : message.source} </b></span>
                                    <small>{message.content} </small>
                                    <span style={{float: 'right', marginLeft: '3%'}}><i><TimeAgo timestamp={message.date_created} /> </i></span>
                                </div>
                            ))}
                        </Card.Body>
                        <InputGroup className="" >
                            <FormControl
                            placeholder="Type a message here..."
                            aria-label="Message Content"
                            aria-describedby="basic-addon2"
                            name="content"
                            value={message.content}
                            onChange={onMessageChange}
                            />
                            <InputGroup.Append>
                                <Button
                                    disabled={message.content === ''}
                                    variant="outline-primary"
                                    onClick={e => sendMessage(e)}
                                    >
                                    <Icon glyph="send-fill" size={20} />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup> </>
                        }
                    </Card>
                </Col>
                <Col md={{span: 3, offset: 1}} xs={12} style={{marginBottom: '10px'}}>
                    <Card>
                        {/* <Card.Header> */}
                        <Message variant='info' >ONLINE ALUMNI<Badge variant="info" style={{ float: 'right' }}> {activeAlumni.length} </Badge></Message>
                        {/* </Card.Header> */}
                        <Card.Body className="active-alumni-list">
                            {isFetchingData ?
                                <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                                    {activeAlumni.map((item) => (<>
                                        <div key={item.id}>{item.username === user.username ? 'You' : item.username}</div> <hr /></>
                                    ))} </>
                            }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ChatPage
