import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Space, Table } from 'antd';
import { Button, Row, Col, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {
  getOrganizationInternshipPosts,
  // getProcessedApplications
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
// import { findAllByDisplayValue } from '@testing-library/dom';
import DataPlaceHolder from '../../components/dataPlaceHolder';

const InternshipReports = () => {

  const [page, setPage] = useState(1)
  // const [modalShow, setModalShow] = useState(false)

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
          {/* <Button variant="link" >View Applicants</Button> */}
          <Button variant="link" >{record.status === 'completed' ? record.reporting_instructions ? '' : 'Add Reporting instructions' : 'View Applicants'}</Button>
        </Link>
        {/* <Button variant="link" onClick={(e) => { e.preventDefault(); setModalShow(true); setPost(record) }} >Add Schedule</Button> */}
      </Space>
    ),
  },
    ];

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    // const [applications, setApplications] = useState([])
  const [internshipPosts, setInternshipPosts] = useState([])
  const [isFetchingData, setIsFetchingData] = useState(false)
    // const [post, setPost] = useState({})
  
  const fetchInternshipPosts = async () => {
    setIsFetchingData(true)
    try {
      const response = await getOrganizationInternshipPosts(user.userId, config)
      const newPosts = response.filter(post => post.status !== 'test')
      setInternshipPosts(newPosts)
      setIsFetchingData(false)
    } catch (error) {
          setIsFetchingData(false)
          // console.log(applications.length)
            console.log({
                'request': 'Fetch Processed Internship Posts Request',
                'Error => ': error
            })
        }
  }

    //   const fetchApplications = async () => {
    //     try {
    //       const response = await getProcessedApplications(user.userId, config)
    //         setApplications(response)
    //     } catch (error) {
    //         console.log({
    //             'request': 'Fetch Processed Applications Request',
    //             'Error => ': error
    //         })
    //     }
    // }
    
    useEffect(() => {
      // fetchApplications();
      fetchInternshipPosts()
      // getInterviewSchedules();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.first_namae}, You have The Following Applicants</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3 }}>
                      {/* <Button>New Post</Button> */}
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
                dataSource={internshipPosts}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
        </Card.Body>
        {/* <ContentModal
          show={modalShow}
          isTable={false}
          title={modalTitle}
          content={modalContent}
          onHide={() => { setModalShow(false) }}
        /> */}
        </Card>
    )
}

export default InternshipReports
