import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getInternshipApplications } from '../../app/api';
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
          onClick="">Accept
        </Button>
        <Button variant="link" size="sm"
          onClick="">Reject
          {/* <Icon glyph="delete" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} /> */}
        </Button>
      </Space>
    ),
  },
    ];

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
            const response = await getInternshipApplications(config)
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

    // if(filteredApplications.length !== 0  filteredApplications : applications)
    useEffect(() => {
      fetchInternshipApplications()
    }, [])

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have Posted The Following Chances</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}>
                      <Button>New Post</Button>
                    </Col>
                    <Col md={{ span: 4, offset: 5 }}>
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
            dataSource={filteredApplications.length !== 0 ? filteredApplications : applications}
            pagination={{ pageSize: 5 }}
            column={{ ellipsis: true }} />
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
