import React, {useState, useEffect} from 'react'
import Message from '../../components/message'
import { Card, Row, Col, Button,Form } from 'react-bootstrap'
import { Table, Tag } from 'antd';
import { } from 'antd';
import ContentModal from '../../components/contentModal';
import { useSelector } from 'react-redux'
import  Loader  from '../../components/loader'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { fetchalumniProjects, sendProject,addProjectMember} from '../../app/api';
import DataPlaceHolder from '../../components/dataPlaceHolder';

const ProjectsPage = () => {
    
    const columns = [
      {
        title: 'S/No',
        key: 'index',
        render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
      },
      {
        title: 'Project Title',
        key: 'project_title',
        // ellipsis: 'true',
        dataIndex: 'project_title'
      },
      {
        title: 'Sponsor',
        key: 'project_sponsor',
        // ellipsis: 'true',
        dataIndex: 'project_sponsor'
      },
      {
        title: 'Year',
        key: 'year',
        // ellipsis: 'true',
        dataIndex: 'project_year',
        render: text => <span>{text.substr(0,4)} </span>
      },
      {
        title: 'Recommendation Status',
        key: 'status',
        // ellipsis: 'true',
        dataIndex: 'project_recommendation_status',
        render: text => <Tag color={text === 'accepted' ? "green" : text === 'pending' ? 'lightgray' : "red"}>
                  {text}
                </Tag>
      },
  ];
  
  const initialProjectInfo = {
    title: '',
    year: '',
    sponsor: '',
    report: '',

  }

  const user = useSelector(selectUserData)
  const config = useSelector(apiConfigurations)
  const [page, setPage] = useState(1)
  const [modalShow, setModalShow] = useState(false);
  const [alumniProjects, setalumniProjects] = useState([])
  const [projectInfo, setProjectInfo] = useState(initialProjectInfo)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFetchingData, setIsFetchingData] = useState(false)
  
  const getAlumniProjects = async () => {
      setIsFetchingData(true)
    try {
      const response = await fetchalumniProjects(user.userId, config)
      setalumniProjects(response)
      setIsFetchingData(false)
      // console.log(response)
    } catch (error) {
      setIsFetchingData(false)
      console.log({
        'Request': 'Getting Alumni Projects Request',
        'Error => ' : error.response.data,
      })
    }
  }
  
  const handleProjectInfo = (e) => {
    setErrorMessage('')
    if (e.target.name === 'report') {
      setProjectInfo({
        ...projectInfo,
        report: e.target.files[0]
      })
    } else {
      setProjectInfo({
        ...projectInfo,
        [e.target.name]: e.target.value
      })
    }
  }

  const formValidator = () => {
    const allowedDocFormats = /(\.pdf)$/i;

    if (projectInfo.title === '') {
      setErrorMessage('Project Title Cannot Be Blank!')
      return false;
    }
    else if (projectInfo.year === '') {
      setErrorMessage('Project Year Cannot Be Blank!')
      return false;
    }
    else if (projectInfo.report === '') {
      setErrorMessage('Project report Cannot Be Blank!')
      return false
    }
    else if (!allowedDocFormats.exec(projectInfo.report.name)) {
      setErrorMessage('Unsurpoted File Format. Only pdf file is allowed')
      return false
    }
    else {
      setErrorMessage('')
      return true;
    }
  }

  const submitProject = async (e) => {
    e.preventDefault()
    const isFormValid = formValidator()

    if (isFormValid) {
    setIsLoading(true)

    const payload = new FormData()
    payload.append('title', projectInfo.title)
    payload.append('year', projectInfo.year)
    payload.append('sponsor', projectInfo.sponsor)
    payload.append('report', projectInfo.report)

     const config2 = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${localStorage.getItem('token')}`    }
    }
    try {
      const response = await sendProject(payload, config2)
      try {
        const payload2 = {
          member: user.userId,
          project: response.id 
        }
        const response2 = await addProjectMember(payload2, config)
        console.log(response2.length)
        setModalShow(false);
        setProjectInfo(initialProjectInfo)
        getAlumniProjects()
        setIsLoading(false)

      } catch (error) {
        console.log({
                'Request': 'Add project Member Request',
                'Error => ' : error.response.data,
        })
        setIsLoading(false)
      } 
    } catch (error) {
      console.log({
        'Request': 'Send alumni project Request',
                'Error => ' : error.response.data,
              })
              setIsLoading(false)
              setErrorMessage('Ooops...!, Some error occured. Check your network and try again.')
      }

       } //End Of If Block
    else {
      console.log('Project Form Is Not Valid')
    }
  }

  const modalTitle = "Fill Project Details"
  const modalContent = <Form onSubmit={submitProject}>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label>Project Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="enter projet title"
                        value={projectInfo.title}
                        onChange={handleProjectInfo}
                        name="title" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                        type="month"
                        placeholder="enter year conducted"
                        value={projectInfo.year}
                        onChange={handleProjectInfo}
                        name="year" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="formGridAddress1">
                    <Form.Label>Project Sponsor</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Project sponsor"
                        value={projectInfo.sponsor}
                        onChange={handleProjectInfo}
                        name="sponsor"  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAddress2">
                    <Form.Label>Project Report</Form.Label>
                    <Form.Control
                        type="file"
                        placeholder="enter email"
                        // value={projectInfo.report}
                        onChange={handleProjectInfo}
                        name="report"
                        accept="application/pdf"/>
                </Form.Group>
            </Form.Row>
            <Button
              style={{width: '100%'}}
                      variant="danger"
                      hidden={errorMessage === '' ? true : false}
                    >{errorMessage}</Button>
            <Row >
                <Col md={{span:3, offset: 9}}>
                <Button
                    variant="primary"
                    type="submit"
                    hidden={errorMessage !== '' ? true : false}
                    style={{ width: '100%' }}
                > {isLoading ? <Loader message="Sending Project Info..." /> : 'Send'} </Button>
                </Col>
            </Row>
    </Form>;
  

    useEffect(() => {
      getAlumniProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Projects List</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          <Button onClick={e => { e.preventDefault(); setModalShow(true)} }>Add Project</Button>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={alumniProjects}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
       </Card.Body>
        <ContentModal
          show={modalShow}
          isTable={false}
          title={modalTitle}
          content={modalContent}
          onHide={() => { setModalShow(false); setIsLoading(false) }}
        />
    </Card>
    )
}

export default ProjectsPage
