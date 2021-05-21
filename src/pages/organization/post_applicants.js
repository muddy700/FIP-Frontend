import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editInternshipPost, editMultipleApplications, editSingleApplication, getInternshipApplications, } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader';

const PostApplicants = () => {
  
  const location = useLocation();
  const [post, setPost] = useState(location.post)

  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Applicant',
    key: 'applicant',
    // ellipsis: 'true',
    dataIndex: 'alumni_name'
  },
  // {
  //   title: 'Date Applied',
  //   key: 'date_created',
  //   // ellipsis: 'true',
  //   dataIndex: 'date_applied'
  // },
  {
    title: post.status === 'practical' ? 'Practical Marks' : post.status === 'oral' ? 'Oral Marks' : '',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: post.status === 'practical' ? 'practical_marks' : 'oral_marks',
    // ellipsis: 'true',
    render: text => <>{text ? text : '-'}</>,
  },
  // {
  //   title: 'Action',
  //   // ellipsis: 'true',
  //   key: 'action',
  //   render: (text, record) => (
  //     <Space size="middle">
  //       <Button variant="link" size="sm"
  //         onClick={e => { e.preventDefault(); updateInternshipApplication(record.id, 1) }}>Accept
  //       </Button>
  //       <Button variant="link" size="sm"
  //         onClick={e => { e.preventDefault(); updateInternshipApplication(record.id, 0) }}>Reject
  //         {/* <Icon glyph="delete" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} /> */}
  //       </Button>
  //     </Space>
  //   ),
  // },
    ];

  
    const history = useHistory();
    const [modalShow, setModalShow] = useState(false);
    const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
  
  const initialApplication = {
    id: '',
    practical_marks: '',
    oral_marks: ''
  }
    // const [selectedPost, setSelectedPost] = useState({})
  const [applications, setApplications] = useState([])
  const [filteredArray, setFilteredArray] = useState()
  const [selectedAlumni, setSelectedAlumni] = useState([])
  const [discardedAlumni, setDiscardedAlumni] = useState([])
  const [passMarks, setPassMarks] = useState(0)
  const [finalStage, setFinalStage] = useState('')
  const [activeApplication, setActiveApplication] = useState(initialApplication)
  const [isSending, setIsSending] = useState(false)
  const [isStageFinished, setIsStageFinished] = useState(false)

  const goToPreviousPage = () => {
    history.goBack()
    setFinalStage('')
    setIsStageFinished(false)
  }
  
  const filterByScore = (e) => {
    const cut_points = e.target.value 
    setPassMarks(cut_points)
    if (!cut_points) {
      setSelectedAlumni([])
      setDiscardedAlumni([])
      setFilteredArray(applications)
    }
    else {
      if (post.status === 'practical') {
        setSelectedAlumni(
          applications.filter(item => item.practical_marks >= cut_points))
        setFilteredArray(
          applications.filter(item => item.practical_marks >= cut_points))
      
        setDiscardedAlumni(
          applications.filter(item => item.practical_marks < cut_points))
      }
      else if (post.status === 'oral') {
        setSelectedAlumni(
          applications.filter(item => item.oral_marks >= cut_points))
        
        setFilteredArray(
          applications.filter(item => item.oral_marks >= cut_points))
      
        setDiscardedAlumni(
          applications.filter(item => item.oral_marks < cut_points))
      }
    }
  }
  
  const inviteApplicants = async () => {
    // setModalShow(false)
    // setFinalStage('')
    console.log(selectedAlumni)
    console.log(discardedAlumni)
    let payloads = [];

    if (post.status === applications[0].final_stage) {
      payloads = selectedAlumni.map(item => {
          return {...item, status: 'accepted'}
        })
    }
    else if (post.status === 'practical' && (post.status !== applications[0].final_stage)) {
      payloads = selectedAlumni.map(item => {
          return {...item, status: 'oral'}
        })
      
    }

    const rejectedPayloads = discardedAlumni.map(item => {
        return {...item, status: 'rejected'}
      })

    try {
          const response1 = await editMultipleApplications(payloads, config)
          // console.log(response1.length)
          try {
                const response2 = await editMultipleApplications(rejectedPayloads, config)
            // console.log(response2)
            setDiscardedAlumni([])
            setSelectedAlumni([])
            setPassMarks(0)
            editProcessedPost()
          } catch (error) {
                  console.log({
                      'request': 'Edit Discarded Internship Applications For Practical Request',
                      'Error => ': error
                  })
              }
    } catch (error) {
            console.log({
                'request': 'Edit Qualified Internship Applications For Practical Request',
                'Error => ': error
            })
        }
  }

  
  const editProcessedPost = async () => {
    // console.log(nextStage)
    let status = '';
    if (post.status === applications[0].final_stage) status = 'completed';
    else if (post.status === 'practical' && (post.status !== applications[0].final_stage)) status = 'oral';

    const payload = {...post, status: status }
        try {
          const response = await editInternshipPost(post.id, payload, config)
          setPost(response)
          setApplications([])
          if(status === 'oral') setIsStageFinished(true)
        } catch (error) {
            console.log({ 
                'request': 'Edit Processed Post Request',
                'Error => ': error
            })
        }

      }
      
  const handleActiveApplication = (e) => {
    setActiveApplication({
      ...activeApplication,
      [e.target.name] : e.target.value
    })
  }

  const sendMarks = async () => {

    setIsSending(true)
    var payload  = applications.find(item => item.id === parseInt(activeApplication.id))
    
    if (post.status === 'practical') {
      payload = {...payload, practical_marks: parseInt(activeApplication.practical_marks)}
    }
    else if (post.status === 'oral') {
      payload = {...payload, oral_marks: parseInt(activeApplication.oral_marks)}
    }

    try {
      const response = await editSingleApplication(payload, config)
      setApplications(applications.filter(item => item.id !== response.id))
      setActiveApplication(initialApplication)
      setIsSending(false)
        } catch (error) {
            console.log({
                'request': 'Sending Applicant Marks Request',
                'Error => ': error
            })
    }
    if (applications.length === 1) {
      setModalShow(false)
      fetchPostApplicants()
    }
  }

  const modalTitle = "Fill Marks";
  const modalContent = <> {isSending ?
    <Loader message="Sending Data...." /> :<>
        <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput1">
          <Form.Label>Applicant</Form.Label>
          <Form.Control as="select"
              size="md"
              // disabled={editingMode}
              // value={newPost.profession}
              onChange={handleActiveApplication}
              name="id">
              <option>---Select Applicant---</option>
              {applications.map(item => (
                <option value={item.id}>{item.alumni_name} </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Marks</Form.Label>
          <FormControl
            placeholder="Enter Marks"
            type="number"
            aria-label="Message Content"
            name={post.status === 'practical' ? 'practical_marks': 'oral_marks'}
            value={post.status === 'practical' ? activeApplication.practical_marks : activeApplication.oral_marks}
            aria-describedby="basic-addon2"
            onChange={handleActiveApplication}
            />
          </Form.Group>
      </Form.Row>
    <Button
      onClick={sendMarks}
      disabled={activeApplication.id !== '' &&
      (activeApplication.oral_marks !== '' || activeApplication.practical_marks !== '') ? false : true}>Send</Button></>}
  </>;

  
    
  const fetchPostApplicants = async () => {
        try {
          const response = await getInternshipApplications(post.id, config)
        //   const arrangedByScore = arrangedByDate.slice().sort((a, b) => b.test_marks- a.test_marks)
          var newApplications = response.filter(item => item.confirmation_status === post.status)
          if (newApplications[0].practical_marks >= 0) {
            newApplications = newApplications.slice().sort((a, b) => b.practical_marks - a.practical_marks)
          }
          else if (newApplications[0].oral_marks >= 0) {
            newApplications = newApplications.slice().sort((a, b) => b.oral_marks - a.oral_marks)
          }
          setApplications(newApplications)
          setFilteredArray(newApplications)

          // console.log(newApplications)
        } catch (error) {
            console.log({ 
                'request': 'Fetch Internship Applications Request',
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
          <Message variant='info' >{isStageFinished ? 'All applications have been processed successfully.' :
            post.status === 'completed' ? 'Processing stages are completed and applicants have been informed. Go to Approved page to see them' :
              applications.length === 0 && (post.status === 'practical' || post.status === 'oral') ? 'No any request yet' : ' You have The Following applicants For The Seleceted Post'}</Message>
          <Button hidden={!isStageFinished }>Add Schedule For Oral Interview</Button>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          {applications.length !== 0 ? <>
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 8 }} >Seleceted Applicants &nbsp;
                      <Button>{selectedAlumni.length} </Button>
              <Button
                style={{ marginLeft: '5%' }}
                onClick={e => { e.preventDefault(); inviteApplicants() }}
                disabled={selectedAlumni.length === 0 ? true : false}>{post.status === applications[0].final_stage ? 'Approve Selected' : 'Invite Selected'}</Button>
              &nbsp;
              <Button
                style={{ marginLeft: '5%' }}
                onClick={e => { e.preventDefault(); setModalShow(true) }}
                  disabled={applications.length === 0
                    // || (post.status === 'practical' && applications[0].practical_marks >= 0)
                    // || (post.status === 'oral' && applications[0].oral_marks >= 0)
                    ? true : false}
              >Fill {post.status} marks </Button>
                    </Col>
                    <Col md={{ span: 4}}>
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
            dataSource={filteredArray}
            pagination={{ pageSize: 5 }}
            column={{ ellipsis: true }} /> </> : '' }
          <Button
                variant="secondary"
                onClick={goToPreviousPage} >
                Back
            </Button> 
       </Card.Body> 
        <ContentModal
          show={modalShow}
          isTable={false}
          title={modalTitle}
          content={modalContent}
          onHide={() => { setModalShow(false); setFinalStage('') }}
        />
        </Card>
    )
}

export default PostApplicants
