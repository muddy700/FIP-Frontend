import React, {useState, useEffect} from 'react'
import { Table, Tag, Space } from 'antd';
import Card   from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'
import Message from '../../components/message';
import '../../styles/alumni.css'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';
import { editInternshipPost, editSingleApplication, getAlumniApplications, getPostSchedule } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { useSelector, useDispatch}  from 'react-redux'

const ResultsPage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [alumniApplications, setAlumniApplications] = useState([])
  const [postSchedule, setPostSchedule] = useState({})
  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
  const [selectedApplication, setSelectedApplication] = useState({})
  const [page, setPage] = useState(1)
  
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
    title: 'Profession',
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
            onClick={e => { e.preventDefault(); setModalShow(true); handlePostSchedule(record.post); setSelectedApplication(record) }}>
            View Schedule
            {/* <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); handlePostSchedule(record.id) }} /> */}
          </Button> : ''}
      </Space>
    ),
  },
  ];

  const handlePostSchedule = async (id) => {
    try {
      const response = await getPostSchedule(id, config)
      // console.log(response)
      setPostSchedule(response[0])
    } catch (error) {
            console.log({
                'request': 'Fetch Post Schedule Request',
                'Error => ': error
            })
    }
  }
  
  const fetchAlumniApplications = async () => {
    try {
      const response = await getAlumniApplications(user.userId, config)
      // console.log(response)
      const newRes = response.slice().sort((a, b) => b.date_applied.localeCompare(a.date_applied))
      setAlumniApplications(newRes)
    } catch (error) {
            console.log({
                'request': 'Fetch Alumni Applications Request',
                'Error => ': error
            })
    }
  }

  useEffect(() => {
    fetchAlumniApplications()
  }, [])

  const confirmAttendance = async () => {
    // console.log(selectedApplication)
    const status = selectedApplication.post_status
    const payload = { ...selectedApplication, confirmation_status: status }
        try {
        const response = await editSingleApplication(payload, config)
            // console.log(response)
          setSelectedApplication(response)
        } catch (error) {
            console.log({
                'request': 'Confirm Applicant Attendance Request',
                'Error => ': error
            }) }
  }

  const modalContent = postSchedule ?   <>
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
      disabled={selectedApplication.confirmation_status === selectedApplication.post_status ? true : false}
      variant={selectedApplication.confirmation_status === selectedApplication.post_status ? 'success' : 'primary'}
    >{selectedApplication.confirmation_status === selectedApplication.post_status ? 'Confirmed' : 'Confirm'}</Button>
          </> : <Message variant="info" >No Schedule Yet</Message>
          
  const modalTitle = "Interview Schedule";

  return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have applied the folloving companies</Message>
        </Card.Header>
        <Card.Body style={{ overflowX:'scroll'}}  >
        <Table
          columns={columns}
          dataSource={alumniApplications}
          pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
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

export default ResultsPage
