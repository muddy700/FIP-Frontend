import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch}  from 'react-redux'
import { getAlumniApplications, pullInternshipPosts } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { fetchInternshipPosts, selectInternshipPostList } from '../../slices/internshipPostSlice';
import WarningModal from '../../components/warningModal';

const AvailablePostsPage = () => {

    const config = useSelector(apiConfigurations)
    const dispatch = useDispatch()
    const user = useSelector(selectUserData)
    const internshipPosts = useSelector(selectInternshipPostList)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedOrganization, setSelectedOrganization] = useState('')
    const [profession, setProfession] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const modalTitle = "Warning!"
    const modalContent = "To Apply This Post You Need To Do A Test In A Given Time Limit. And Once You Start You Cannot Abort The Process. To Continue Press 'Start', To Quit Press 'Cancel'"

const getInternshipPosts = async () => {
    try {
        const response1 = await getAlumniApplications(user.userId, config)
        const appliedPostsIds = response1.map(res => res.post)
        try {
            const response2 = await pullInternshipPosts(config)
            const newPosts = response2.filter(post => !appliedPostsIds.includes(post.id))
            const arrangedPosts = newPosts.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
            dispatch(fetchInternshipPosts(arrangedPosts))

        } catch (error) {
            console.log({
                'request': 'Fetch Available Internship Posts Request',
                'Error => ': error
            })
         
        }
    } catch (error) {
        console.log({
            'request': 'Fetch Alumni Applications In Available Post',
            'Error => ': error
        })
    }
}
    
    useEffect(() => {
        getInternshipPosts();
    }, [])

    return (
        
        <Card style={{marginBottom: '10px'}}>
            <Card.Header>
                <Message  variant='info' >Latest Available Posts</Message>  
            </Card.Header>
            <Card.Body style={{padding: '0 16px 16px 16px'}}>
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3, offset: 9 }}>
                                       <InputGroup>
                            <FormControl
                            placeholder="Type To Search"
                            aria-label="Message Content"
                            aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-primary">
                                    <Icon glyph="search" size={20} />
                                </Button>
                            </InputGroup.Append>
                            </InputGroup>
                    </Col>
                </Row>
                <hr/>
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{ pageSize: 5, }}
                    dataSource={internshipPosts}
                    renderItem={post => (
                        <List.Item
                            key={post.id}
                            className="list-items"
                            style={{padding: 0}}
                        >
                            <List.Item.Meta
                                // avatar={<Avatar size="large" src={post.avatar} />}
                                title={<h5 > {post.organization_name} </h5>}
                            />
                            <Row >
                                <Col md={{span: 3, offset: 1}} style={{ display: 'flex' }}>
                                    Profession: &nbsp; <p>{post.profession_name} </p>
                                </Col>
                                <Col md={2} style={{ display: 'flex' }}>
                                    Posts:  &nbsp; <p>{post.post_capacity} </p>
                                </Col>
                                <Col md={2} style={{ display: 'flex' }}>
                                    Expire Date:  &nbsp; <p>{post.expiry_date} </p>
                                </Col>
                                <Col md={3} style={{ display: 'flex' }}>
                                    <>
                                        <Link to={{pathname: "/post_details", postId:post.id, }}>
                                            <Button variant="link" >View Details</Button>
                                        </Link>
                                        <Button
                                            variant="link"
                                            onClick={e => {
                                                e.preventDefault();
                                                setModalShow(true);
                                                setSelectedPost(post.id);
                                                setSelectedOrganization(post.organization)
                                                setProfession(post.profession)
                                            }}
                                        >Apply</Button>
                                    </>
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                 />
            </Card.Body>
        <WarningModal
            show={modalShow}
            title={modalTitle}
            content={modalContent}
            onHide={() => setModalShow(false)}
            closeModal={() => setModalShow(false)}
            postId={selectedPost}
            professionId={profession}
            organizationId={selectedOrganization}
        />
        </Card>
    )
}

export default AvailablePostsPage
