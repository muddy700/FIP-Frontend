import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Space, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Icon from 'supercons'
import { Button, Row, Col, Card, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {
  getOrganizationInternshipPosts,
  getProfessions, pushInternshipPost,
  editInternshipPost, removeInternshipPost
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import DataPlaceHolder from '../../components/dataPlaceHolder';
import Loader from '../../components/loader';

const InternshipChances = () => {
  const [page, setPage] = useState(1)

  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Reference Number',
    dataIndex: 'reference_number',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Job Title',
    key: 'professions',
    // ellipsis: 'true',
    dataIndex: 'profession_name'
  },
  {
    title: 'Date Created',
    key: 'date_created',
    // ellipsis: 'true',
    dataIndex: 'date_created'
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button variant="link" size="sm" >
          <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); setModalShow(true); viewPost(record.id) }} />
        </Button>
        <Button variant="link" size="sm" >
          <Icon glyph="post" size={32} onClick={e => { e.preventDefault(); showPostForm(record) }} />
        </Button>
        <Popconfirm
          title="Are you sure？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={e => { e.preventDefault(); deleteInternshipPost(record.id) }}>
         <Button variant="link" style={{color: 'red'}} size="sm" >
          <Icon glyph="delete" size={32} />
          </Button>
        </Popconfirm>
        <Link to={{pathname: `/post_applications`, post: record }}>
        {/* <Link to={{pathname: `/post/${record.id}/applications`, post: record }}> */}
            <Button variant="link" >View Requests</Button>
        </Link>
      </Space>
    ),
  },
    ];

  const initialPost = {
    organization: '',
    profession: '',
    profession_name: '',
    expiry_date: '',
    post_description: '',
    post_capacity: '',
  }

  const [modalShow, setModalShow] = useState(false);
  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
  const [selectedPost, setSelectedPost] = useState({})
  const [internshipPosts, setInternshipPosts] = useState([])
  const [modalMode, setModalMode] = useState('')
  const [newPost, setNewPost] = useState(initialPost)
  const [skills, setSkills] = useState([])
  const [editingMode, setEditingMode] = useState(false)
  // const [postError, setPostError] = useState('')
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [postFormError, setPostFormError] = useState('')

  const viewPost = (id) => {
    const postInfo = internshipPosts.find(post => post.id === id)
    setModalMode('')
    setSelectedPost(postInfo)
  }
  
  const showPostForm = (text) => {
    setModalMode('form')
    setModalShow(true)
    fetchProfessions()
    if (text === 'create') { }
    else {
      setEditingMode(true)
      setNewPost(text)
    }
  }

  const closeModal = () => {
    setModalShow(false)
    setEditingMode(false)
    setNewPost(initialPost)
  }

  const onPostFormChange = (e) => {
    setPostFormError('')
    // setPostError('')
    setNewPost({
      ...newPost,
      [e.target.name]: e.target.value,
      organization: user.userId
    })

  }

  const deleteInternshipPost = async (id) => {
        try {
          const response = await removeInternshipPost(id, config)
          console.log(response.length)
          const newPosts = internshipPosts.filter(item => item.id !== id)
          setInternshipPosts(newPosts)
        } catch (error) {
            console.log({
                'request': 'Delete Internship Post Request',
                'Error => ': error
            })
        }
  }

  const postFormValidator = () => {
    if (!newPost.profession) {
      setPostFormError('Select job title')
      return false
    }
    else if (!newPost.post_capacity) {
      setPostFormError('Enter free chances')
      return false
    }
    else if (!newPost.post_description) {
      setPostFormError('post description cannot be blank.')
      return false
    }
    else if (!newPost.expiry_date) {
      setPostFormError('Select expiry date')
      return false
    }
    else{
      setPostFormError('')
      return true
    }
  }
  const onPostFormSubmit = async (e) => {
    e.preventDefault();
    const isPostFormValid = postFormValidator()
    
    if (isPostFormValid) {
      setIsCreatingPost(true)
      // setPostError('')
      let { profession_name, ...payload } = newPost
      const randomNumber = Math.floor((Math.random() * 1000) + 1);
      const year = new Date().getFullYear()
      
      try {
        var response
        if (editingMode) {
          response = await editInternshipPost(newPost.id, payload, config)
          const newPosts = internshipPosts.map(post => {
            if (post.id === response.id) return response
            else return post
          })
          setInternshipPosts(newPosts)
          setEditingMode(false)
          setIsCreatingPost(false)
        }
        else {
          // const refNo = `FIP/${year}/P331`
          const refNo = `FIPMS/${year}/P${randomNumber}`
          payload = {...payload, reference_number: refNo}
          response = await pushInternshipPost(payload, config)
          setInternshipPosts([
              ...internshipPosts, response ])
        }
                setNewPost(initialPost)
        setModalShow(false)
        setIsCreatingPost(false)
        setModalMode('')
        // setPostError('')
      } catch (error) {
              console.log({
                  'request': 'Send Or Edit Internship Post Request',
                  'Error => ': error.response.data
              })
        if (error.response.data.reference_number) {
          console.log('ref repeated')
          setPostFormError('Ooops...!, some error occured. Please try again')
          // setPostError('Ooops...!, some error occured. Please try again')
          // onPostFormSubmit(e)
              }
        }
    }
    else {
      console.log('Post Form Is Invalid')
    }
  }

  const fetchInternshipPosts = async () => {
    setIsFetchingData(true)
    try {
      const response = await getOrganizationInternshipPosts(user.userId, config)
      const arrangedByDate = response.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
      const newPosts = arrangedByDate.filter(post => post.status === 'test')
      setInternshipPosts(newPosts)
      setIsFetchingData(false)
    } catch (error) {
          setIsFetchingData(false)
            console.log({
                'request': 'Fetch Organization Internship Posts Request',
                'Error => ': error.response.data
            })
        }
  }

  const fetchProfessions = async () => {
        try {
          const response = await getProfessions(config)
          setSkills(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Professions Request',
                'Error => ': error
            })
        }
    }

    useEffect(() => {
      fetchInternshipPosts()
      // fetchProfessions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  const postDetails =  <>
            <tbody>
                <tr>
                    <td className="post-properties">PROFESSION</td>
                    <td>{selectedPost.profession_name}</td>
                </tr>
                <tr>
                    <td className="post-properties">CAPACITY</td>
                    <td>{selectedPost.post_capacity}</td>
                </tr>
                <tr>
                    <td className="post-properties">Date Created</td>
                    <td>{selectedPost.date_created}</td>
                </tr>
                <tr>
                    <td className="post-properties">Expiry Date</td>
                    <td>{selectedPost.expiry_date}</td>
                </tr>
                <tr>
                    <td className="post-properties">Descriptions</td>
                    <td>{selectedPost.post_description}</td>
                </tr>
            </tbody>
        </>
  
  const postForm =
    <Form onSubmit={onPostFormSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput1">
          <Form.Label>Job Title</Form.Label>
          <Form.Control as="select"
              size="md"
              disabled={editingMode}
              value={newPost.profession}
              onChange={onPostFormChange}
              name="profession">
              <option value={null}>---Select Job Title---</option>
              {skills.map(skill => (
                <option value={skill.id}>{skill.profession_name} </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Free Chances</Form.Label>
          <FormControl
            placeholder="Enter Free Chances"
            type="number"
            aria-label="Message Content"
            name="post_capacity"
            value={newPost.post_capacity}
            aria-describedby="basic-addon2"
            onChange={onPostFormChange}
            />
          </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput3">
          <Form.Label>Post Description</Form.Label>
          <FormControl
            placeholder="post description"
            type="text"
            aria-label="Message Content"
            name="post_description"
            value={newPost.post_description}
            aria-describedby="basic-addon2"
            onChange={onPostFormChange}
            />
          </Form.Group>
        <Form.Group as={Col} controlId="InternshipPostInput4">
          <Form.Label>Expiry Date</Form.Label>
          <FormControl
            placeholder="Expiry Date"
            type="date"
            aria-label="Message Content"
            name="expiry_date"
            value={newPost.expiry_date}
            aria-describedby="basic-addon2"
            onChange={onPostFormChange}
            />
        </Form.Group>
      </Form.Row>
      <Button
        type="submit"
        variant={editingMode ? 'success' : 'primary'}
        style={{ float: 'right' }}>{isCreatingPost ? <Loader message='loading...!' /> : editingMode ? 'Save' : 'Send'} </Button>
      {/* <Button
        type="submit"
        variant={editingMode ? 'success' : 'primary'}
        style={{ float: 'right' }}>{postError !== '' ? 'try again' : editingMode ? 'Save' : 'Send'} </Button> */}
      <Button
        variant="danger"
        hidden={!postFormError}
      > {postFormError} </Button>
      {/* <Button
        variant="danger"
        hidden={postError === '' ? true : false}
      > {postError} </Button> */}
    </Form> 
  const modalTitle = modalMode !== 'form' ? "Post Details" : editingMode ? 'Edit post info' : 'Fill Post Details' ;
  const modalContent = modalMode === 'form' ? postForm : postDetails;

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.first_name}, You have posted the following internship chances</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}>
              <Button onClick={e => { e.preventDefault(); showPostForm('create') }}>New Post</Button>
                    </Col>
                    {/* <Col md={{ span: 3, offset: 6 }}>
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
                    </Col> */}
                </Row>
                <hr/>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={internshipPosts.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={modalMode !== 'form' ? true : false}
        title={modalTitle}
        content={modalContent}
        onHide={closeModal}
      />
        </Card>
    )
}

export default InternshipChances
