import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getInternshipApplications, processInternshipApplication } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const InternshipApplications = () => {

    
  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Applicant',
    key: 'applicant',
    // ellipsis: 'true',
    dataIndex: 'alumni_name'
  },
  {
    title: 'Date Applied',
    key: 'date_created',
    // ellipsis: 'true',
    dataIndex: 'date_applied'
  },
  {
    title: 'Test Score',
    key: 'test_score',
    // ellipsis: 'true',
    dataIndex: 'test_score'
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); updateInternshipApplication(record.id, 1) }}>Accept
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); updateInternshipApplication(record.id, 0) }}>Reject
          {/* <Icon glyph="delete" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} /> */}
        </Button>
      </Space>
    ),
  },
    ];

  
    const location = useLocation();
    const history = useHistory();
    const { postId } = location
    const [modalShow, setModalShow] = useState(false);
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [selectedPost, setSelectedPost] = useState({})
    const [applications, setApplications] = useState([])
    var filteredApplications = [];

  const viewPost = (id) => {
    // const postInfo = internshipPosts.find(post => post.id === id)
    // setSelectedPost(postInfo)

    }

    const goToPreviousPage = () => {
        history.goBack()
  }
  
    const filterByScore = (e) => {
        const passMark = e.target.value
        // console.log(passMark)
        filteredApplications = applications.filter((item) => item.test_score >= passMark)
        setApplications(filteredApplications)
    }

  const modalTitle = "Post Details";
  const modalContent = "Post Contents";
    
  const fetchInternshipApplications = async () => {
        try {
            const response = await getInternshipApplications(postId, config)
            const arrangedByDate = response.slice().sort((a, b) => b.date_applied.localeCompare(a.date_applied))
            const arrangedByScore = arrangedByDate.slice().sort((a, b) => b.test_score - a.test_score)
            setApplications(arrangedByScore)
        } catch (error) {
            console.log({
                'request': 'Fetch Internship Applications Request',
                'Error => ': error
            })
        }
  }
  
  const updateInternshipApplication = async (id, status) => {
    const updatedApplications = applications.map(item => {
      if (item.id === id) {
        if (status === 0) return { ...item, status: 'rejected' }
        else return { ...item, status: 'accepted' }
      }
      else return item
    })

    const payload = updatedApplications.find(item => item.id === id);
        try {
          const response = await processInternshipApplication(id, payload, config)
          console.log(response)
        } catch (error) {
            console.log({
                'request': 'Edit Internship Applications Request',
                'Error => ': error
            })
        }
    }

    // if(filteredApplications.length !== 0  filteredApplications : applications)
    useEffect(() => {
      fetchInternshipApplications()
    }, [])

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have The Following Requests For The Seleceted Post</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}> Applicants &nbsp;
                      <Button>{applications.length}</Button>
                    </Col>
                    <Col md={{ span: 4, offset: 8 }}>
                        <InputGroup>
                            <FormControl
                            placeholder="Enter Cut-Off Point"
                            type="number"
                            aria-label="Message Content"
                            aria-describedby="basic-addon2"
                            onChange={filterByScore}
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
            dataSource={applications}
            pagination={{ pageSize: 5 }}
            column={{ ellipsis: true }} />
          <Button
                variant="secondary"
                onClick={goToPreviousPage} >
                Back
            </Button>
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={true}
        title={modalTitle}
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
        </Card>
    )
}

export default InternshipApplications
