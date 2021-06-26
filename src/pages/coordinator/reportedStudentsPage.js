import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editStudentProfileInfo, getAllReportedStudentsProfiles, getStaffProfile, getUsersProfilesByDesignationId} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'

function ReportedStudentsPage() {
  const [page, setPage] = useState(1)

  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Reg No:',
    dataIndex: 'registration_number',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Organization',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'organization_name',
    // render: text => <Button variant='link'>{text}</Button>,
  },
  {
    title: 'Date Reported',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'date_reported',
    render: text => <>{text.substr(0,10)}</>,
  },
  {
    title: 'Academic Supervisor',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'academic_supervisor_name',
    render: text => <>{text === 'pending' ? '-' : text}</>,
  },
//   {
//     title: 'Date Reported',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'date_reported',
//     render: text => <>{text.substr(0,10)}</>,
//   },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {/* <Button variant="link" size="sm" >
          <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); setModalShow(true); viewPost(record.id) }} />
        </Button>
        <Button variant="link" size="sm" >
          <Icon glyph="post" size={32} onClick={e => { e.preventDefault(); showPostForm(record) }} />
        </Button> */}
        {/* <Popconfirm
          title="Are you sure？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={e => { e.preventDefault(); deleteInternshipPost(record.id) }}>
         <Button variant="link" style={{color: 'red'}} size="sm" >
          <Icon glyph="delete" size={32} />
          </Button>
        </Popconfirm> */}
            {/* <Link to={{pathname: "/post_applications", post: record }}> */}
            {record.academic_supervisor_name === 'pending' ?
                <Button
                    onClick={e => { e.preventDefault(); setSelectedStudent(record); setModalShow(true) }}
                    variant="link" >Assign Supervisor</Button> :
                <span>Assigned </span>
            }
        {/* </Link> */}
      </Space>
    ),
  },
    ];

    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [modalShow, setModalShow] = useState(false);
    const [studentsProfiles, setStudentsProfiles] = useState([])
    const [displayArray, setDisplayArray] = useState([])
    const [academicSupervisors, setAcademicSupervisors] = useState([])
    const [selectedSupervisor, setSelectedSupervisor] = useState(38)
    const [selectedStudent, setSelectedStudent] = useState({})
    const [isSendingData, setIsSendingData] = useState(false)
    const [staffProfile, setStaffProfile] = useState({})

      const getProfile = async () => {
        try {
            const profile = await getStaffProfile(user.userId, config)
          setStaffProfile(profile[0])
          fetchStudentsProfiles(profile[0]);
        } catch (error) {
            console.log({
                'Request': 'Getting Staff Profile Request',
                'Error => ' : error,
            })
        }
    }
    
    const fetchStudentsProfiles = async (staff) => {
        try {
            const response = await getAllReportedStudentsProfiles(config)
            const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
            const department_students = arrangedArray.filter(item => item.department === staff.department)
            setStudentsProfiles(department_students)
            setDisplayArray(department_students)
        } catch (error) {
            console.log(
                'Fetching All Students Profiles', error.response.data ) }
    }

    const fetchAcademicSupervisor = async () => {
        try {
            const response = await getUsersProfilesByDesignationId(5, config)
            setAcademicSupervisors(response)
        } catch (error) {
            console.log(
                'Fetching Academic Supervisors Profiles', error.response.data ) }
    }

    useEffect(() => {
        getProfile();
        fetchAcademicSupervisor();
    }, [])

    const assignAcademicSupervisor = async () => {
        setIsSendingData(true)
        const payload = {
            ...selectedStudent, academic_supervisor: selectedSupervisor,
        }

      try {
          const response = await editStudentProfileInfo(payload, config)
          const new_students_list = studentsProfiles.map(item => item.id === response.id ? response : item)
          setStudentsProfiles(new_students_list)
          setDisplayArray(new_students_list)
          setSelectedStudent({})
          setSelectedSupervisor(38)
          setIsSendingData(false)
          setModalShow(false)
      } catch (error) {
        console.log('Assigning Academic Supervisor ', error.response.data)
        setIsSendingData(false)
      }
    }

    const modalTitle = 'Select academic supervisor'
    const modalContent =  <>
          <Form.Control as="select"
              size="md"
              onChange={e => { setSelectedSupervisor(e.target.value)}}
              name="academic_supervisor">
              <option>---Select Supervisor---</option>
              {academicSupervisors.map(person => (
                <option value={person.user}>{person.username} </option>
              ))}
            </Form.Control>
            <Button
                onClick={assignAcademicSupervisor}
                disabled={selectedSupervisor === 38 ? true : false}
            >{isSendingData ? <Loader message='Sending...' /> : 'Assign'}
            </Button>
  </>;

    const showAllStudents = () => {
        setDisplayArray(studentsProfiles)
    }

    const showAssignedStudents = () => {
        const assigned = studentsProfiles.filter(item => item.academic_supervisor !== 38)
        setDisplayArray(assigned)
    }

    const showUnassignedStudents = () => {
        const unassigned = studentsProfiles.filter(item => item.academic_supervisor === 38)
        setDisplayArray(unassigned)
    }

    const showBySupervisor = (id) => {
        const matched_students = studentsProfiles.filter(item => item.academic_supervisor === parseInt(id))
        setDisplayArray(matched_students)
    }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of students arrival notes</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px'}}>
                    <Button onClick={e => { e.preventDefault(); showAllStudents() }}>All </Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showAssignedStudents() }}>Assigned</Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showUnassignedStudents() }}>Unassigned </Button> &nbsp; &nbsp;
                    <Col md={{ span: 4 }}>
                        <Form.Control as="select"
                        size="md"
                        onChange={e => { showBySupervisor(e.target.value)}}
                        name="academic_supervisor">
                        <option value={38}>---Filter by supervisor---</option>
                        {academicSupervisors.map(person => (
                            <option value={person.user}>{person.username} </option>
                        ))}
                        </Form.Control>
                    </Col>
                </Row>
                <hr/>
          <Table
            columns={columns}
            dataSource={displayArray}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={false}
        title={modalTitle}  
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
        </Card>
    )
}

export default ReportedStudentsPage
