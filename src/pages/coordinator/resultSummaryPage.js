import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Icon from 'supercons'
import { Button, Row, Col, Card, Modal, Form, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editselectedStudentInfo, editStudentProfileInfo, getAllReportedStudents, getAllReportedStudentsProfiles, getProgramsByDepartmentId, getStaffProfile, getStudentsByAcademicSupervisor, getUsersProfilesByDesignationId, sendFieldReport} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import SummaryExport from './summaryExport';

import ExportExcel from "react-export-excel";

const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelFile.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelFile.ExcelColumn;

function ResultSummaryPage() {
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
//   {
//     title: 'Organization',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'organization_name',
//     // render: text => <Button variant='link'>{text}</Button>,
//   },
//   {
//     title: 'Student Phone',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'phone_number',
//     render: text => <>{text}</>,
//   },
//   {
//     title: 'Report Marks',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'report_marks',
//     render: text => <>{text ? text : 'Not marked'}</>,
//   },
//   {
//     title: 'Academic Marks',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'academic_supervisor_marks',
//     render: text => <>{text ? text : 'Not'}</>,
//   },
//   {
//     title: 'Field Marks',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'field_supervisor_marks',
//     render: text => <>{text ? text : 'Not'}</>,
//   },
  {
    title: 'Average',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'average_marks',
    render: text => <>{text ? Math.round(text) : 'Not'}</>,
  },
  {
    title: 'Grade',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'marks_grade',
    render: text => <>{text ? text : 'Not'}</>,
  },
//   {
//     title: 'Action',
//     // ellipsis: 'true',
//     key: 'action',
//     render: (text, record) => (
//         <Space size="middle">
           
//       </Space>
//     ),
//   },
    ];

      const years = [
        {id:1, value:1, name: 'First Year'},
        {id:2, value:2, name: 'Second year'},
        {id:3, value:3, name: 'Third year'},
      ]
      
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [studentsProfiles, setStudentsProfiles] = useState([])
    const [displayArray, setDisplayArray] = useState([])
    const [academicSupervisors, setAcademicSupervisors] = useState([])
    const [staffProfile, setStaffProfile] = useState({})
    const [departmentPrograms, setDepartmentPrograms] = useState([])
    const [exportData, setExportData] = useState([])
    
    const getPrograms = async (departmentId) => {
        try {
            const programs = await getProgramsByDepartmentId(departmentId, config)
            // const programsIds = programs.map(item => item.id)
            setDepartmentPrograms(programs)
        } catch (error) {
            console.log({
                'Request': 'Getting Staff Profile Request',
                'Error => ' : error,
            })
        }
    }
  
    const getProfile = async () => {
        try {
            const profile = await getStaffProfile(user.userId, config)
          setStaffProfile(profile[0])
          fetchStudentsProfiles(profile[0]);
          getPrograms(profile[0].department)
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
          const processed_students = response.filter(item => item.average_marks)
          const department_students = processed_students.filter(item => item.department === staff.department)
          setStudentsProfiles(department_students)
          setDisplayArray(department_students)
          prepareData(department_students)
      } catch (error) {
          console.log(
              'Fetching Students By Academic Supervisor ', error.response.data ) }
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

    const showAllStudents = () => {
      setDisplayArray(studentsProfiles)
      prepareData(studentsProfiles)
    }

  const showBySupervisor = (id) => {
    if (id === 'all') {
        setDisplayArray(studentsProfiles)
        prepareData(studentsProfiles)
      }
    else {
      const matched_students = studentsProfiles.filter(item => item.academic_supervisor === parseInt(id))
      setDisplayArray(matched_students)
      prepareData(matched_students)
      }
  }
  
  const showByProgram = (id) => {
    if (id === 'all') {
      setDisplayArray(studentsProfiles)
      prepareData(studentsProfiles)
    }
    else {
      const matched_students = studentsProfiles.filter(item => item.program === parseInt(id))
      setDisplayArray(matched_students)
      prepareData(matched_students)
    }
  }
  
  const showByYearOfStudy = (year) => {
    if (year === 'all') {
      setDisplayArray(studentsProfiles)
      prepareData(studentsProfiles)
    }
    else {
      const matched_students = studentsProfiles.filter(item => item.year_of_study === year)
      setDisplayArray(matched_students)
      prepareData(matched_students)
     }
  }

  const prepareData = (data) => {
    const freshData = data.map(item => {
      return {
        'regNo': item.registration_number,
        'avg': item.average_marks,
        'grade': item.marks_grade
      }
    })
    setExportData(freshData)
  }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of processed students</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px'}}>
                  <Button onClick={e => { e.preventDefault(); showAllStudents() }}>All </Button> &nbsp; &nbsp;
                  <Col md={{ span: 3 }}>
                        <Form.Control as="select"
                          size="md"
                          onChange={e => { showBySupervisor(e.target.value)}}
                          name="academic_supervisor">
                          <option value='all'>---by supervisor---</option>
                          {academicSupervisors.map(person => (
                              <option value={person.user}>{person.username} </option>
                          ))}
                        </Form.Control>
                  </Col>
                  <Col md={{ span: 3 }}>
                        <Form.Control as="select"
                          size="md"
                          onChange={e => { showByProgram(e.target.value)}}
                          name="academic_supervisor">
                          <option value='all'>---by program---</option>
                          {departmentPrograms.map(item => (
                              <option value={item.id}>{item.program_name} </option>
                          ))}
                        </Form.Control>
                  </Col>
                  <Col md={{ span: 3 }}>
                        <Form.Control as="select"
                          size="md"
                          onChange={e => { showByYearOfStudy(e.target.value)}}
                          name="academic_supervisor">
                          <option value='all'>---by year of study---</option>
                          {years.map(item => (
                              <option value={item.value}>{item.name} </option>
                          ))}
                        </Form.Control>
                  </Col>
                  <SummaryExport studentsList={exportData}/> &nbsp; &nbsp;
                  {/* <Button onClick={e => { e.preventDefault(); prepareData()}}>Export as Excel </Button> &nbsp; &nbsp; */}
                  {/* <Button onClick={e => { e.preventDefault(); }}>Export as Pdf </Button> &nbsp; &nbsp; */}
                </Row>
                <hr/>
          <Table
            columns={columns}
            dataSource={displayArray}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
       
      
    {/* <ContentModal
    show={modalShow2}
    isTable={false}
    title={modalTitle2}
    content={modalContent2}
                onHide={() => { setModalShow2(false); setSelectedStudent({}); setAcademicScore(null); setFieldScore(null)}}
    /> */}
        </Card>
    )
}

export default ResultSummaryPage


