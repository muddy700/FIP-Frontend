import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form , Modal} from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editInternshipPost, editMultipleApplications, getInternshipApplications, processInternshipApplication } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const InternshipApplications = () => {

    
  const columns = [
  {
    title: 'S/No',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
  render: (text, object, index) => index + 1
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
    dataIndex: 'date_applied',
    render: text => <>{text.substr(0,10)}</>
  },
  {
    title: 'Test marks',
    key: 'test_marks',
    // ellipsis: 'true',
    dataIndex: 'test_marks'
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

  
    const location = useLocation();
    const history = useHistory();
    const [modalShow, setModalShow] = useState(false);
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    // const [selectedPost, setSelectedPost] = useState({})
    const [applications, setApplications] = useState([])
    const [selectedAlumni, setSelectedAlumni] = useState([])
    const [discardedAlumni, setDiscardedAlumni] = useState([])
    const [passMarks, setPassMarks] = useState(0)
    const [finalStage, setFinalStage] = useState('')
    const [post, setPost] = useState(location.post)
  
  const stages = [
    {
      id: 1,
      text: 'Practical only'
    },
    {
      id: 2,
      text: 'Oral only'
    },
    {
      id: 3,
      text: 'Practical and oral'
    },
    {
      id: 4,
      text: 'Test only'
    }
  ]

    const goToPreviousPage = () => {
      history.goBack()
      setFinalStage('')
  }
  
  const filterByScore = (e) => {
    const cut_points = e.target.value 
    setPassMarks(cut_points)
    if (!cut_points) {
      setSelectedAlumni([])
      setDiscardedAlumni([])
    }
    else {
      setSelectedAlumni(
        applications.filter(item => item.test_marks >= cut_points))
      
      setDiscardedAlumni(
        applications.filter(item => item.test_marks < cut_points))
    }
  }
  
  const inviteApplicants = async () => {
    setModalShow(false)
    setFinalStage('')

    var newApplications = [];
    if (finalStage.id === 1) {
       newApplications = selectedAlumni.map(item => {
        return { ...item, status: 'practical', final_stage: 'practical'}
       })
    }
    else if (finalStage.id === 2) {
       newApplications = selectedAlumni.map(item => {
        return { ...item, status: 'oral', final_stage: 'oral'}
       })
    }
    else if (finalStage.id === 3) {
       newApplications = selectedAlumni.map(item => {
        return { ...item, status: 'practical', final_stage: 'oral'}
       })
    }
    else if (finalStage.id === 4) {
       newApplications = selectedAlumni.map(item => {
        return { ...item, status: 'accepted', final_stage: 'test'}
       })
    }

    const discardedApplications = discardedAlumni.map(item => {
        return { ...item, status: 'rejected'}
      })

    try {
          const response1 = await editMultipleApplications(newApplications, config)
          // console.log(response1.length)
          try {
                const response2 = await editMultipleApplications(discardedApplications, config)
            // console.log(response2)
            setApplications([])
            setDiscardedAlumni([])
            setSelectedAlumni([])
            setPassMarks(0)
            editProcessedPost()
          } catch (error) {
                  console.log({
                      'request': 'Edit Discarded Internship Applications Request',
                      'Error => ': error
                  })
              }
    } catch (error) {
            console.log({
                'request': 'Edit Qualified Internship Applications Request',
                'Error => ': error
            })
        }
  }

  
  const editProcessedPost = async () => {
    // console.log(nextStage)
    var status = '';
    if (finalStage.id === 1) status = 'practical';
    else if (finalStage.id === 2) status = 'oral';
    else if (finalStage.id === 3) status = 'practical';
    else if (finalStage.id === 4) status = 'completed';

    const payload = {...post, status: status }
        try {
          const response = await editInternshipPost(post.id, payload, config)
          setPost(response)
        } catch (error) {
            console.log({ 
                'request': 'Edit Processed Post Request',
                'Error => ': error
            })
        }

  }
  const modalTitle = "Processing Stages";


  
         
  const modalContent = <><ul>
                            {stages.map((choice) => (
                            <li key={choice.id} style={{marginTop: '3px'}}>
                                 <Form.Check
                                    type="radio"
                                    id={choice.id}
                                    name="selectedChoice"
                                    label={choice.text}
                                    value={choice.id}
                                  onChange={e => { setFinalStage(choice)}}
                                />
                            </li> ))}
  </ul>
    <Button onClick={inviteApplicants} disabled={finalStage === '' ? true : false}>Send</Button>
  </>;
    
  const fetchInternshipApplications = async () => {
        try {
          const response = await getInternshipApplications(post.id, config)
          const arrangedByDate = response.slice().sort((a, b) => b.date_applied.localeCompare(a.date_applied))
          const arrangedByScore = arrangedByDate.slice().sort((a, b) => b.test_marks- a.test_marks)
          const unProcessedApplications = arrangedByScore.filter(item => item.status === 'received')
            setApplications(unProcessedApplications)
        } catch (error) {
            console.log({ 
                'request': 'Fetch Internship Applications Request',
                'Error => ': error
            })
        }
  }
   
    useEffect(() => {
      fetchInternshipApplications()
    }, [])

    return (
    <Card >
        <Card.Header >
          {post.status === 'test' && applications.length !== 0  ?
            <Message variant='info' >Dear {user.username}, You have the following requests for the seleceted post</Message> :
            post.status === 'test' && applications.length === 0 ?
            <Message variant='info' >Dear {user.username}, there is no any request yet</Message> : <>
            <Message variant='success' >All applications have been processed successful.</Message>
           </>
          }
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
            {post.status === 'test' && applications.length !== 0 ?  <>
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 6 }} >Seleceted Applicants &nbsp;
                      <Button>{selectedAlumni.length} </Button>
              <Button
                style={{ marginLeft: '5%' }}
                onClick={e => { e.preventDefault(); setModalShow(true) }}
                disabled={selectedAlumni.length === 0 ? true : false}>Invite Selected</Button>
                    </Col>
                    <Col md={{ span: 4, offset: 2 }}>
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
            dataSource={applications.filter(item => item.test_marks >= passMarks)}
            pagination={{ pageSize: 5 }}
            column={{ ellipsis: true }} />
                     </> : '' }
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

export default InternshipApplications
