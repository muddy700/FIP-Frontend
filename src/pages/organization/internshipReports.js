import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getAlumniApplications, getOrganizationInternshipPosts, getProcessedApplications, getProfessions, pullInternshipPosts, pushInternshipPost } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const InternshipReports = () => {

  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Name',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'alumni_name'
  },
  {
    title: 'Profession',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'post_profession'
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button variant="link" size="sm" >
            Confirm
        </Button>
      </Space>
    ),
  },
    ];

  const [applications, setApplications] = useState([])
  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)

    
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
      fetchApplications()
    }, [])


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
            dataSource={applications}
            pagination={{ pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
        </Card>
    )
}

export default InternshipReports
