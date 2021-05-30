import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editAlumniProfile, editInternshipPost, editMultipleApplications, editSingleApplication, getAlumniProfile, getInternshipApplications, getProcessedApplications, sendInternshipContract, } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader';

const ApprovedAlumni = () => {
  
  // const location = useLocation();
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
    render: text => <>{text}</>,
  },
  {
    title: 'Applicant',
    key: 'applicant',
    dataIndex: 'alumni_name'
  },
  {
    title: 'Job Title',
    key: 'id',
    dataIndex: 'post_profession',
    render: text => <>{text}</>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {record.has_reported ? <>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Release
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); }}>Extend
        </Button></> :
        <Button variant="link" size="sm"
            onClick={e => { e.preventDefault(); setModalShow(true); setSelectedApplication(record)}}>Confirm
        </Button> }
      </Space>
    ),
  },
    ];
  
  const initialContract = {
    alumni: '',
    organization: '',
    finish_date: '',
    profession: ''
  }

  const history = useHistory();
  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
  const [applications, setApplications] = useState([])
  const [filteredArray, setFilteredArray] = useState()
  const [modalShow, setModalShow] = useState(false)
  const [contractInfo, setContractInfo] = useState(initialContract)
  const [selectedApplication, setSelectedApplication] = useState({})
  const [isLoading, setIsLoading] = useState(false)

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

  const changeAlumniStatus = async () => {
    try {
      const profile = await getAlumniProfile(selectedApplication.alumni, config)
      const payload3 = {
        ...profile[0], is_taken: true
      }
      
      try {
        const response = await editAlumniProfile(payload3, config)
        setModalShow(false)
        setContractInfo(initialContract)
        setIsLoading(false)
        fetchPostApplicants()
      } catch (error) { console.log('Edit Approved Alumni Profile Error => ', error.response.data ) }
    } catch (error) { console.log('Get Approved Alumni Profile Error => ', error.response.data ) }
  }

  const handleContractForm = (e) => {
    setContractInfo({
      ...contractInfo,
      [e.target.name] : e.target.value
    })
  }

  const sendContract = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const payload1 = {
      alumni: selectedApplication.alumni,
      organization: user.userId,
      finish_date: contractInfo.finish_date,
      profession: selectedApplication.profession_id
    }

    const payload2 = {
      ...selectedApplication,
      has_reported: true
    }

    try {
      const response1 = await sendInternshipContract(payload1, config)
      try {
        const response2 = await editSingleApplication(payload2, config)
        changeAlumniStatus()
        
      } catch (error) { console.log('Send Has-Reported Error => ', error.response.data ) }

    } catch (error) { console.log('Send Contract Error => ', error.response.data ) }
  }

  const modalTitle = 'Add Contract Info'
  const modalContent = <Form onSubmit={sendContract}>
      <Form.Group as ={Col} controlId="exampleForm.ControlInput1" >
        <Form.Label>Finish Date</Form.Label>
        <Form.Control onChange={handleContractForm} name='finish_date' type="date" placeholder="enter finish date" />
      </Form.Group> <br />
      <Form.Group as={Col} controlId="exampleForm.ControlInput1">
      <Button
          type="submit"
          style={{ float: 'right' }}
          disabled={contractInfo.finish_date === '' ? true : false}
        >{isLoading ? <Loader message="Sending Contract..." /> : 'Send' }</Button>
      </Form.Group>
  </Form>
  

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
                              type="text"
                              aria-label="Message Content"
                              aria-describedby="basic-addon2"
                              // onChange={filterByScore}
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

export default ApprovedAlumni
