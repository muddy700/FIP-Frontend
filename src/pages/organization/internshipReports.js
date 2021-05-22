import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getAlumniApplications, getOrganizationInternshipPosts, getProcessedApplications, getProfessions, pullInternshipPosts, pushInternshipPost, getSchedules } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import { findAllByDisplayValue } from '@testing-library/dom';

const InternshipReports = () => {
  const initialSchedule = {
    post: '',
    organization: '',
    location: '',
    event_date: '',
    requirements: ''
    
  }
  const [page, setPage] = useState(1)
  const [modalShow, setModalShow] = useState(false)
  const [postSchedule, setPostSchedule] = useState(initialSchedule)

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
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'profession_name'
  },
  {
    title: 'Date Created',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'date_created'
  },
  {
    title: 'Current stage',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'status'
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Link to={{pathname: "/post_applicants", post: record }}>
            <Button variant="link" >View Applicants</Button>
           
        </Link>
        {/* <Button variant="link" onClick={(e) => { e.preventDefault(); setModalShow(true); setPost(record) }} >Add Schedule</Button> */}
      </Space>
    ),
  },
    ];

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [applications, setApplications] = useState([])
    const [internshipPosts, setInternshipPosts] = useState([])
    const [post, setPost] = useState({})

  const handleScheduleForm = (e) => {
    setPostSchedule({
      ...postSchedule,
      [e.target.name] : e.target.value
     })
  }
  
  const getInterviewSchedules = async (e) => {
    try {
      const response = await getSchedules(config)
      console.log(response)
    } catch(error) {
         console.log({
                'request': 'Fetch internship post schedules Request',
                'Error => ': error
            })
    }
   
  }
  
  const submitPostSchedule = async (e) => {
    e.preventDefault()
    // console.log(postSchedule)
    const payload = { ...postSchedule, post: post.id, organization: post.organization }
    console.log(payload)
  }

  const fetchInternshipPosts = async () => {
        try {
          const response = await getOrganizationInternshipPosts(user.userId, config)
          const newPosts = response.filter(post => post.status !== 'test')
          setInternshipPosts(newPosts)
        } catch (error) {
            console.log({
                'request': 'Fetch Processed Internship Posts Request',
                'Error => ': error
            })
        }
  }

      const fetchApplications = async () => {
        try {
          const response = await getProcessedApplications(user.userId, config)
            setApplications(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Processed Applications Request',
                'Error => ': error
            })
        }
    }
    
    useEffect(() => {
      // fetchApplications();
      fetchInternshipPosts()
      getInterviewSchedules()
    }, [])
    
  var modalTitle = `Fill schedule for  ${post.status} `
  const modalContent =
    <Form onSubmit={submitPostSchedule}>
      <Form.Row>
              
              <Form.Group as ={Col} controlId="exampleForm.ControlInput1" >
                <Form.Label>Event Date</Form.Label>
                <Form.Control onChange={handleScheduleForm} name='event_date' type="datetime-local" placeholder="event date" />
              </Form.Group>
               <Form.Group as ={Col} controlId="exampleForm.ControlInput1">
                <Form.Label>Location</Form.Label>
                <Form.Control onChange={handleScheduleForm} name='location' type="text" placeholder="enter interview location" />
              </Form.Group>
        </Form.Row>
          
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Requirement</Form.Label>
                <Form.Control onChange={handleScheduleForm} name='requirements' type="text" placeholder=" " />
           </Form.Group>
           <Button type='submit' >Send</Button>
         </Form>
      

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have Accepted The Following Applicants</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}>
                      {/* <Button>New Post</Button> */}
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
          <Table
            columns={columns}
            dataSource={internshipPosts}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
        </Card.Body>
        <ContentModal
          show={modalShow}
          isTable={false}
          title={modalTitle}
          content={modalContent}
          onHide={() => { setModalShow(false) }}
        />
        </Card>
    )
}

export default InternshipReports
