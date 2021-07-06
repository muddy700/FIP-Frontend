import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import { Row, Card } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getStudentsByAcademicSupervisor} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import SummaryExport from './summaryExport';
import DataPlaceHolder  from '../../components/dataPlaceHolder'

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

    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [studentsProfiles, setStudentsProfiles] = useState([])
    const [displayArray, setDisplayArray] = useState([])
    const [exportData, setExportData] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)

  const fetchStudentsProfiles = async () => {
      setIsFetchingData(true)
      try {
        const response = await getStudentsByAcademicSupervisor(user.userId, config)
        const processed_students = response.filter(item => item.average_marks)
        setStudentsProfiles(processed_students)
        setDisplayArray(processed_students)
        prepareData(processed_students)
        setIsFetchingData(false)
        console.log(studentsProfiles.length)
      } catch (error) {
          setIsFetchingData(false)
            console.log(
                'Fetching Students By Academic Supervisor ', error.response.data ) }
    }

    useEffect(() => {
        fetchStudentsProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


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
                  <SummaryExport studentsList={exportData}/> &nbsp; &nbsp;
                  {/* <Button onClick={e => { e.preventDefault(); }}>Export as Pdf </Button> &nbsp; &nbsp; */}
                </Row>
                <hr/>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={displayArray}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} />
            </>
          }
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
