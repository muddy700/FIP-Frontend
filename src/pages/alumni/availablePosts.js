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
import QuestionsModal from '../../components/warningModal';
import WarningModal from '../../components/warningModal';
// import { changePage, selectAppData } from '../slices/appSlice'

const AvailablePostsPage = () => {

    const config = useSelector(apiConfigurations)
    const dispatch = useDispatch()
    const user = useSelector(selectUserData)
    const internshipPosts = useSelector(selectInternshipPostList)
    const [selectedPost, setSelectedPost] = useState('')
    const [profession, setProfession] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [appliedPostIds, setAppliedPostIds] = useState([])
    const modalTitle = "Warning!"
    const modalContent = "To Apply This Post You Need To Do A Test In A Given Time Limit. And Once You Start You Cannot Abort The Process. To Continue Press 'Start', To Quit Press 'Cancel'"

    
  const fetchAlumniApplications = async () => {
    try {
        const response = await getAlumniApplications(user.userId, config)
        const newRes = response.map(res => res.post)
        setAppliedPostIds(newRes)
    } catch (error) {
        console.log({
            'request': 'Fetch Alumni Applications In Available Post',
            'Error => ': error
        })
    }
}

const getInternshipPosts = async () => {
        try {
            const response = await pullInternshipPosts(config)
            const newPosts = response.filter(post => !appliedPostIds.includes(post.id))
            const newRes = newPosts.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
            dispatch(fetchInternshipPosts(newRes))

        } catch (error) {
            console.log({
                'request': 'Fetch Available Internship Posts Request',
                'Error => ': error
            })
         
        }
    }
    
    if(appliedPostIds.length !== 0) getInternshipPosts()
    
    useEffect(() => {
        fetchAlumniApplications()
        // getInternshipPosts();
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
                                title={<h5 > {post.organization_name} {post.id} </h5>}
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
                                        <Link to={{pathname: "/post_details", postId:post.id }}>
                                            <Button variant="link" >View Details</Button>
                                        </Link>
                                        <Button
                                            variant="link"
                                            onClick={e => {
                                                e.preventDefault();
                                                setModalShow(true);
                                                setSelectedPost(post.id);
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
        />
        </Card>
    )
}

export default AvailablePostsPage
