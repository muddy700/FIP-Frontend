import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch}  from 'react-redux'
import { pullInternshipPosts } from '../../app/api';
import { apiConfigurations } from '../../slices/userSlice';
import { fetchInternshipPosts, selectInternshipPostList } from '../../slices/internshipPostSlice';
// import { changePage, selectAppData } from '../slices/appSlice'

const AvailablePostsPage = () => {

    const config = useSelector(apiConfigurations)
    const dispatch = useDispatch()
    const internshipPosts = useSelector(selectInternshipPostList)

    const getInternshipPosts = async () => {

        try {
            const response = await pullInternshipPosts(config)
            dispatch(fetchInternshipPosts(response))

        } catch (error) {
            console.log({
                'request': 'Fetch Available Internship Posts Request',
                'Error => ': error
            })
         
        }
    }

    useEffect(() => {
       getInternshipPosts()
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
                                title={<h5 > {post.organization_name}</h5>}
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
                                        <Button variant="link">Apply</Button>
                                    </>
                                </Col>
                            </Row>
                        </List.Item>
                    )}
                 />
            </Card.Body>
        </Card>
    )
}

export default AvailablePostsPage
