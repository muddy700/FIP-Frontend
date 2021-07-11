import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import { Button, Row, Col, Card, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getAllReportedStudentsProfiles, getProgramsByDepartmentId, getStaffProfile, getUsersProfilesByDesignationId} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import SummaryExport from './summaryExport';
import DataPlaceHolder from '../../components/dataPlaceHolder'

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
    const [departmentPrograms, setDepartmentPrograms] = useState([])
    const [exportData, setExportData] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    
  const getPrograms = async (departmentId) => {
      setIsFetchingData(true)
      try {
        const programs = await getProgramsByDepartmentId(departmentId, config)
        // const programsIds = programs.map(item => item.id)
        setDepartmentPrograms(programs)
        setIsFetchingData(false)
      } catch (error) {
        setIsFetchingData(false)
        console.log({
                'Request': 'Getting Staff Profile Request',
                'Error => ' : error,
            })
        }
    }
  
    const getProfile = async () => {
        try {
            const profile = await getStaffProfile(user.userId, config)
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
          const valid_data = department_students.map(item => {
            return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
          })
          setStudentsProfiles(valid_data)
          setDisplayArray(valid_data)
          prepareData(valid_data)
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                              <option value={person.user}>{person.first_name} {person.last_name} </option>
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
                </Row>
                <hr/>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={displayArray}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
       </Card.Body>
        </Card>
    )
}

export default ResultSummaryPage