import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space, Popconfirm } from 'antd';

import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form, Modal } from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {
  editAlumniProfile,
  editSingleApplication,
  getAlumniProfile,
  getOrganizationContracts,
  getProcessedApplications,
  sendInternshipContract,
  editInternshipContract,
  sendAlumniRatings
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader';
import { Rate } from 'antd';

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

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
        {record.has_reported && record.has_released ? 
          <span style={{ color: 'red' }}>Released</span> : record.has_reported ? <>
            <Popconfirm title="Are you sure？"
              onConfirm={e => { e.preventDefault(); releaseAlumni(record) }}>
          <Button variant="link" size="sm"
            >Release
          </Button>
        </Popconfirm>
        <Button variant="link" size="sm"
            onClick={e => { e.preventDefault(); selectContract(record.alumni) }}>View Contract
        </Button>
        <Button variant="link" size="sm"
            onClick={e => {
              e.preventDefault();
              setContractInfo(organizationContracts.find(item => item.alumni === record.alumni))
              setModalShow(true)
              setActiveContents('editing-form')
            }}>Extend
        </Button></> :
        <Button variant="link" size="sm"
            onClick={e => {
              e.preventDefault();
              setModalShow(true);
              setActiveContents('form')
              setSelectedApplication(record)
            }}>Confirm
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

  const ratingInfo = {
    alumni: '',
    organization: '',
    value: ''
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
  const [isReleasing, setIsReleasing] = useState(false)
  const [organizationContracts, setOrganizationContracts] = useState([])
  const [activeContents, setActiveContents] = useState('')
  const [activeContract, setActiveContract] = useState({})
  const [showRateModal, setShowRateModal] = useState(false)
  const [rateValue, setRateValue] = useState(0)
  const [ratingPayload, setRatingPayload] = useState(ratingInfo)
  const [isRating, setIsRating] = useState(false)

  const fetchPostApplicants = async () => {
    try {
      const response = await getProcessedApplications(user.userId, config)
      var newApplications = response.filter(item => item.status === 'accepted' && item.reporting_instructions === 'True' )
      // var newApplications2 = newApplications.filter(item => item.reporting_instructions === 'True')
      setApplications(newApplications)
      setFilteredArray(newApplications)

    } catch (error) {
        console.log({ 
            'request': 'Fetch Approved Internship Applications Request',
            'Error => ': error.response.data
        })
    }
  }

   
  const handleRateValue = (value) => {
    setRateValue(value)
    setRatingPayload({
      ...ratingPayload, value: value
    })
  }
  
  const sendRatings = async () => {
    setIsRating(true)
    
    try {
      const response = await sendAlumniRatings(ratingPayload, config)
      setShowRateModal(false)
      setIsRating(false)
      setRateValue(0)
      setRatingPayload(ratingInfo)
      
    } catch (error) {
        console.log({ 
            'request': 'Send Ratings Request',
            'Error => ': error.response.data
        })
    }
  }

  const selectContract = (alumniId) => {
    const contract = organizationContracts.find(item => item.alumni === alumniId)
    setActiveContract(contract)
    setActiveContents('contract')
    setModalShow(true)
  }

  const fetchOrganizationContracts = async () => {
    try {
      const response = await getOrganizationContracts(user.userId, config)
      setOrganizationContracts(response)
    } catch (error) {
        console.log({ 
            'request': 'Fetch Organization Contracts Request',
            'Error => ': error.response.data
        })
      
    }
  }

  useEffect(() => {
    fetchPostApplicants();
    fetchOrganizationContracts();
  }, [])

  const releaseAlumni = async (record) => {
    setShowRateModal(true)
    setIsReleasing(true)
    setRatingPayload({
      ...ratingPayload,
      alumni: record.alumni,
      organization: record.organization
    })

    const payload1 = {
      ...record,
      has_released: true
    }

    try {
      const response1 = await editSingleApplication(payload1, config)

      try {
        const profile = await getAlumniProfile(record.alumni, config)
        const payload2 = {...profile[0], is_taken: false, organization: 38 }
        
        try {
          const response2 = await editAlumniProfile(payload2, config)
          fetchPostApplicants()
          setIsReleasing(false)

        }
        catch (error) {
          console.log('Edit Alumni-Profile-Release Error => ', error.response.data)
          setIsReleasing(false)
        }

      }
      catch (error) {
        console.log('Get Alumni-Profile-Release Error => ', error.response.data)
        setIsReleasing(false)
      }
    }
    catch (error) {
      console.log('Send Has-Released Error => ', error.response.data)
      setIsReleasing(false)
    }

  }
  
  const changeAlumniStatus = async () => {
    try {
      const profile = await getAlumniProfile(selectedApplication.alumni, config)
      const payload3 = {
        ...profile[0], is_taken: true,
        organization: selectedApplication.organization
      }
      
      try {
        const response = await editAlumniProfile(payload3, config)
        setModalShow(false)
        setContractInfo(initialContract)
        setIsLoading(false)
        fetchPostApplicants()
        fetchOrganizationContracts()
      } catch (error) { console.log('Edit Approved Alumni Profile Error => ', error.response.data ) }
    } catch (error) { console.log('Get Approved Alumni Profile Error => ', error.response.data ) }
  }

  const handleContractForm = (e) => {
    setContractInfo({
      ...contractInfo,
      [e.target.name] : e.target.value
    })
  }

  const editContract = async () => {
    try {
      const response = await editInternshipContract(contractInfo, config)
      setIsLoading(false)
      setContractInfo(initialContract)
      setModalShow(false)
      setActiveContents('')
      setActiveContract({})
      fetchOrganizationContracts()
    } catch (error) {
      console.log('Edit Internship Contract Error => ', error.response.data)
    }
  }

  const sendContract = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (contractInfo.id) editContract()
    else {
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
        
        } catch (error) { console.log('Send Has-Reported Error => ', error.response.data) }

      } catch (error) { console.log('Send Contract Error => ', error.response.data) }
      
    }
  }

  const modalTitle = activeContents === 'form' ? 'Add Contract Info' :
    activeContents === 'editing-form' ? 'Edit Contract Info' :
    `${activeContract.alumni_name} contract`
  
  const modalForm = <Form onSubmit={sendContract}>
      <Form.Group as ={Col} controlId="exampleForm.ControlInput1" >
        <Form.Label>Finish Date</Form.Label>
      <Form.Control
        onChange={handleContractForm}
        name='finish_date' type="date"
        placeholder="enter finish date"
        value={contractInfo.finish_date} />
      </Form.Group> <br />
      <Form.Group as={Col} controlId="exampleForm.ControlInput1">
      <Button
          type="submit"
          style={{ float: 'right' }}
          disabled={contractInfo.finish_date === '' ? true : false}
        >{isLoading ? <Loader message="Sending Contract..." /> : 'Send' }</Button>
      </Form.Group>
  </Form>
  
  const modalContract =
    <tbody>
                <tr>
                    <td className="post-properties">Employer</td>
                    <td>{activeContract.organization_name} </td>
                </tr>
                <tr>
                    <td className="post-properties">Employee</td>
                    <td>{activeContract.alumni_name}</td>
                </tr>
                <tr>
                    <td className="post-properties">Start Date</td>
                    <td>{activeContract.start_date}</td>
                </tr>
                <tr>
                    <td className="post-properties">Finish Date</td>
                    <td>{activeContract.finish_date} </td>
                </tr>
            </tbody>

 return (
    <Card >
        <Card.Header >
       <Message variant='info' >{applications.length === 0 ? 'You have not approved any applicant yet' : 'You have approved the following applicants'}</Message>
       {/* <Button onClick={() => setShowRateModal(true)}>show</Button> */}
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          {applications.length !== 0 ? <>
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 4, offset: 8}}>
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
          isTable={activeContents === 'form' || activeContents === 'editing-form' ? false : true}
          title={modalTitle}
          content={activeContents === 'form' || activeContents === 'editing-form' ? modalForm : modalContract}
          onHide={() => { setModalShow(false); setActiveContents(''); setActiveContract({}); setContractInfo(initialContract) }}
        />
        
     <Modal
        show={showRateModal}
       onHide={() => { setShowRateModal(false); setRateValue(0); setRatingPayload(ratingInfo); setIsRating(false) }}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
     > {isReleasing ?
         <Modal.Body>
           <Loader message="Releasing..." />
         </Modal.Body>
        : <>
         <Modal.Header>Rate This Alumni Performance</Modal.Header>
         <Modal.Body style={{ backgroundColor: 'lightblue' }}>
             {isRating ?
               <Loader message="Rating..." /> :
               <span>
                 <Rate style={{ color: 'blue' }} tooltips={desc} onChange={handleRateValue} value={rateValue} />
                 {rateValue ? <span className="ant-rate-text">{desc[rateValue - 1]}</span> : ''}
               </span>}
         </Modal.Body>
         <Modal.Footer>
           <Button onClick={() => { setShowRateModal(false);  setRateValue(0); setRatingPayload(ratingInfo); setIsRating(false) }}>Skip</Button>
           <Button
             disabled={rateValue === 0 ? true : false}
             onClick={sendRatings}
           >Rate</Button>
         </Modal.Footer> </>}
      </Modal>
        </Card>
    )
}

export default ApprovedAlumni
