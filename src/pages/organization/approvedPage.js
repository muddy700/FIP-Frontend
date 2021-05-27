import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editInternshipPost, editMultipleApplications, editSingleApplication, getInternshipApplications, getProcessedApplications, } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader';

const ApprovedAlumni = () => {
  
  const location = useLocation();
const [page, setPage] = useState(1)
  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Post Ref No:',
    dataIndex: 'post_reference',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Applicant',
    key: 'applicant',
    // ellipsis: 'true',
    dataIndex: 'alumni_name'
  },
  {
    title: 'Job Title',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'post_profession',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Confirm
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Release
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Extend
        </Button>
         {/* <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Reject */}
          {/* <Icon glyph="delete" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} /> */}
        {/* </Button>  */}
      </Space>
    ),
  },
    ];

  
    const history = useHistory();
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
  
  const initialApplication = {
    id: '',
    practical_marks: '',
    oral_marks: ''
  }
  const [applications, setApplications] = useState([])
  const [filteredArray, setFilteredArray] = useState()

  const goToPreviousPage = () => {
    history.goBack()
  }
  
  const filterByScore = (e) => {
    const cut_points = e.target.value 
  }
  
  const inviteApplicants = async () => { }
  
  const editProcessedPost = async () => { }
      
  const handleActiveApplication = (e) => { }

  const sendMarks = async () => { }

  const fetchPostApplicants = async () => {
        try {
          const response = await getProcessedApplications(user.userId, config)
          var newApplications = response.filter(item => item.status === 'accepted')
          setApplications(newApplications)
          setFilteredArray(newApplications)

        } catch (error) {
            console.log({ 
                'request': 'Fetch Approved Internship Applications Request',
                'Error => ': error
            })
        }
  }
   
    useEffect(() => {
      fetchPostApplicants()
    }, [])

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >{applications.length === 0 ? 'You have not approved any applicant yet' : 'You have approved the following applicants'}</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          {applications.length !== 0 ? <>
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 4}}>
                        <InputGroup>
                            <FormControl
                            placeholder="Enter to search"
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
            dataSource={filteredArray}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} /> </> : '' }
       </Card.Body> 
        </Card>
    )
}

export default ApprovedAlumni
