import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getAlumniApplications, getOrganizationInternshipPosts, getProfessions, pullInternshipPosts } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const InternshipChances = () => {

    
  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Profession',
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
          <Icon glyph="post" size={32} />
        </Button>
        <Button variant="link" size="sm" >
          <Icon glyph="delete" size={32} />
        </Button>
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

  const viewPost = (id) => {
    const postInfo = internshipPosts.find(post => post.id === id)
    setModalMode('')
    setSelectedPost(postInfo)
  }
  
  const showPostForm = () => {
    setModalMode('form')
    setModalShow(true)
    fetchProfessions()
  }

  const handlePostForm = (e) => {
    setNewPost({
      ...newPost,
      [e.target.name] : e.target.value
    })
  }

  const fetchInternshipPosts = async () => {
        try {
            const response = await getOrganizationInternshipPosts(user.userId, config)
            setInternshipPosts(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Organization Internship Posts Request',
                'Error => ': error
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
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Job Title</Form.Label>
              <Form.Control as="select"
                  size="lg"
                  value={newPost.profession_name}
                  onChange={handlePostForm}
                  name="profession">
            <option>---Select Job Title---</option>
            {skills.map(skill => (
              <option value={skill.id}>{skill.profession_name} </option>
            ))}
          </Form.Control>
          </Form.Group>
        </Form.Row>
    </Form> 
  const modalTitle = modalMode === 'form' ? 'Fill Post Details' : "Post Details";
  const modalContent = modalMode === 'form' ? postForm : postDetails;

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have Posted The Following Chances</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}>
                      <Button onClick={showPostForm}>New Post</Button>
                    </Col>
                    <Col md={{ span: 3, offset: 6 }}>
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
          <Table columns={columns} dataSource={internshipPosts} pagination={{pageSize: 5}} column={{ellipsis: true}} />
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={modalMode !== 'form' ? true : false}
        title={modalTitle}
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
        </Card>
    )
}

export default InternshipChances
