import React, {useState, useEffect} from 'react'
import { Table, Tag, Space } from 'antd';
import Card   from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'
import {Form, Modal}  from 'react-bootstrap'
import Message from '../../components/message';
import '../../styles/alumni.css'
import ContentModal from '../../components/contentModal';
import {
  editJobInvitation, editSingleApplication,
  fetchAlumniInvitations, getAlumniApplications,
  getPostSchedule
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { useSelector}  from 'react-redux'
import DataPlaceHolder from '../../components/dataPlaceHolder';

const ResultsPage = () => {

  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)

  const [modalShow, setModalShow] = useState(false);
  const [alumniApplications, setAlumniApplications] = useState([])
  const [postSchedule, setPostSchedule] = useState({})
  const [selectedApplication, setSelectedApplication] = useState({})
  const [page, setPage] = useState(1)
  const [activeContent, setActiveContent] = useState('schedule')
  
  const [alumniInvitations, setAlumniInvitations] = useState([])
  const [page2, setPage2] = useState(1)
  const [modalShow2, setModalShow2] = useState(false);
  const [modal2Title, setModal2Title] = useState('')
  const [modal2Content, setModal2Content] = useState('')
  const [rejectedInvitation, setRejectedInvitation] = useState({})
  const [rejectionMessage, setRejectionMessage] = useState('')
  const [hasAcceptedAny, setHasAcceptedAny] = useState(false)
  const [isFetchingData, setIsFetchingData] = useState(false)
  
  const columns2 = [
    {
      title: 'S/No',
      key: 'index',
      render: (value, object, index) => (page2 - 1) * 5 + (index + 1),
    },
    {
      title: 'Organization',
      dataIndex: 'organization_name',
      key: 'organization',
      // ellipsis: 'true'
    },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
          <Button variant="link"
            size="sm"
            onClick={e => {
            e.preventDefault();
            setModalShow2(true);
            setModal2Content(record.invitation_message);
            setModal2Title(`From ${record.organization_name}`)
          }}>
          View Message
          </Button>
        {record.status !== 'received' || hasAcceptedAny ?
          <Button
            variant="link"
            style={{ color: `${record.status === 'accepted' ? 'green' : 'red'}` }}
          >{record.status === 'accepted' ? 'Accepted' : record.status === 'rejected' ? 'Rejected' : ''}</Button> : <>
            <Button variant="link"
              size="sm"
              onClick={e => {
                e.preventDefault();
                acceptInvitation(record);
              }}> Accept
            </Button>
            <Button variant="link"
              size="sm"
              style={{ color: 'red' }}
              onClick={e => {
                e.preventDefault();
                setModalShow2(true)
                setRejectedInvitation(record);
              }}>
              Reject
          </Button>  </>
        }
          
      </Space>
    ),
  },
    
  ];

  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Organization',
    dataIndex: 'organization_name',
    key: 'organization',
    // ellipsis: 'true'
  },
  {
    title: 'Job title',
    key: 'professions',
    // ellipsis: 'true',
    dataIndex: 'post_profession'
  },
  {
    title: 'Status',
    key: 'status',
    // ellipsis: 'true',
    dataIndex: 'status',
    render: text => <Tag color={text === "received" ? "processing" : 
      text === "practical" || text === 'oral' || text === 'accepted' ? 'success' : "error"}>
      {text === 'practical' ? 'Qualified for practical interview' :
        text === 'oral' ? 'Qualified for oral interview' :
          text === 'rejected' ? 'Not qualified' : text}
            </Tag>
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {record.status === 'practical' || record.status === 'oral' ? 
          <Button variant="link"
            size="sm"
            onClick={e => { e.preventDefault(); setModalShow(true); handlePostSchedule(record); setSelectedApplication(record); setActiveContent('schedule') }}>
            View Schedule
            {/* <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); handlePostSchedule(record.id) }} /> */}
          </Button> : ''}
        {record.status === 'accepted'? 
          <Button variant="link"
            size="sm"
            onClick={e => { e.preventDefault(); setModalShow(true); handlePostSchedule(record); setActiveContent('instructions') }}>
            {record.has_reported ? '' : 'View reporting instructions'}
            {/* <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); handlePostSchedule(record.id) }} /> */}
          </Button> : ''}
          
      </Space>
    ),
  },
  ];

  const handlePostSchedule = async (record) => {
    try {
      const response = await getPostSchedule(record.post, config)
      response[0].post_stage === record.status ?
        setPostSchedule(response[0]) :
        response[0].post_stage === 'completed' ?
        setPostSchedule(response[0]) :
      setPostSchedule({})
    } catch (error) {
            console.log({
                'request': 'Fetch Post Schedule Request',
                'Error => ': error
            })
    }
  }
  
  const fetchAlumniApplications = async () => {
    setIsFetchingData(true)
    try {
      const response = await getAlumniApplications(user.userId, config)
      // console.log(response)
      const newRes = response.slice().sort((a, b) => b.date_applied.localeCompare(a.date_applied))
      setAlumniApplications(newRes)
      getAlumniInvitations()
      setIsFetchingData(false)
    } catch (error) {
            console.log({
                'request': 'Fetch Alumni Applications Request',
                'Error => ': error
            })
    }
  }

  const getAlumniInvitations = async () => {
    try {
      const response = await fetchAlumniInvitations(user.userId, config)
      setAlumniInvitations(response)
      const has_accepted = response.find(item => item.status === 'accepted')
      if(has_accepted) setHasAcceptedAny(true)
    } catch (error) {
      console.log('Get Alumni Invitations ', error.response.data)
    }
  }


  useEffect(() => {
    fetchAlumniApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmAttendance = async () => {
    // console.log(selectedApplication)
    const status = selectedApplication.post_status
    const payload = { ...selectedApplication, confirmation_status: status }
        try {
        const response = await editSingleApplication(payload, config)
            // console.log(response)
            setModalShow(false)
          setSelectedApplication(response)
        } catch (error) {
            console.log({
                'request': 'Confirm Applicant Attendance Request',
                'Error => ': error
            }) }
  }


  const acceptInvitation = async (record) => {
    const payload = {...record, status: 'accepted' }
    try {
      const response = await editJobInvitation(payload, config)
      console.log(response.length)
      // const newInvitationList = alumniInvitations.map(item => item.id === response.id ? response : item)
      // setAlumniInvitations(newInvitationList)
      getAlumniInvitations()
    } catch (error) {
      console.log('Accepting Job Invitation ', error.response.data)
    }
  }

  
  const rejectInvitation = async () => {
    const payload = {
      ...rejectedInvitation,
      status: 'rejected',
      rejection_message: rejectionMessage
    }
    try {
      const response = await editJobInvitation(payload, config)
      console.log(response.length)
      getAlumniInvitations()
      setModalShow2(false)
      setModal2Content('')
      setModal2Title('')
      setRejectedInvitation({})
      setRejectionMessage('')
    } catch (error) {
      console.log('Rejecting Job Invitation ', error.response.data)
    }
  }

  const closeModal2 = () => {
    setModalShow2(false)
    setModal2Content('')
    setModal2Title('')
    setRejectedInvitation({})
    setRejectionMessage('')
  }

  const modalContent = postSchedule.id ?   <>
            <tbody>
                <tr>
                    <td className="post-properties">ORGANIZATION</td>
                    <td>{postSchedule.organization_name} </td>
                </tr>
                <tr>
                    <td className="post-properties">Location</td>
                    <td>{postSchedule.location}</td>
                </tr>
                <tr>
                    <td className="post-properties">Date</td>
                    <td>{postSchedule.event_date}</td>
                </tr>
                <tr>
                    <td className="post-properties">Requirements</td>
                    <td>{postSchedule.requirements} </td>
                </tr>
            </tbody>  <br />
          <Button
      onClick={confirmAttendance}
      hidden={postSchedule.post_stage === 'completed' ? true : false}
      disabled={selectedApplication.confirmation_status === selectedApplication.post_status ? true : false}
      variant={selectedApplication.confirmation_status === selectedApplication.post_status ? 'success' : 'primary'}
    >{selectedApplication.confirmation_status === selectedApplication.post_status ? 'Confirmed' : 'Confirm'}</Button>
  </> : <Message variant="info" >{activeContent === 'schedule' ? 'No Schedule Yet' : 'No Instructions Yet'}</Message>
          
  const modalTitle = activeContent === 'instructions' ? 'Reporting Instructions' : "Interview Schedule";

  return (
    <>
    <Card style={{marginBottom: '32px'}}>
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have applied the folloving companies</Message>
        </Card.Header>
        <Card.Body style={{ overflowX:'scroll'}}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> :
            <Table
              columns={columns}
              dataSource={alumniApplications}
              pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
              column={{ ellipsis: true }} />
          }
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={true}
        title={modalTitle}
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
    </Card>
    <Card style={{width: '100%'}}>
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have been invited with the following companies</Message>
        </Card.Header>
        <Card.Body style={{ overflowX:'scroll'}}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> :
            <Table
              columns={columns2}
              dataSource={alumniInvitations}
              pagination={{ onChange(current) { setPage2(current) }, pageSize: 5 }}
              column={{ ellipsis: true }} />
          }
        </Card.Body>
         <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={modalShow2}
                onHide={() => closeModal2()}
             >
          <Modal.Header closeButton >
            {modal2Title ? modal2Title : 'Enter reason(s) for rejecting this offer(if any)'}</Modal.Header>
          <Modal.Body>
            {modal2Content ? modal2Content : <>
              <Form.Control as="textarea"
                placeholder="enter reason "
                value={rejectionMessage}
                onChange={e => { setRejectionMessage(e.target.value) }}
                aria-label="With textarea" />
              <Button
                variant="primary"
                // disabled={rejectionMessage === ''}
                onClick={e => { e.preventDefault(); rejectInvitation() }}
                style={{ width: '100%', marginTop: '3%' }}>Confirm
                  </Button> </>}
                </Modal.Body>
                        
              </Modal>
    </Card>
  </>
    )
}

export default ResultsPage
