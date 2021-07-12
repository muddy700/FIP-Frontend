import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import { Row, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getAllReportedStudentsProfiles} from '../../app/api';
import { apiConfigurations } from '../../slices/userSlice';
import ArrivalNotesExport from './arrivalNotesExport';
import DataPlaceHolder from '../../components/dataPlaceHolder'

function FieldArrivalNotesPage() {
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
//   {
//     title: 'Student Phone',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'phone_number',
//     render: text => <>{text}</>,
//   },
  {
    title: 'Academic Supervisor',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'academic_supervisor_name',
    render: (text, record) => (
       <>{record.academic_supervisor_name === 'pending' ? '-' : record.academic_supervisor_first_name + ' ' + record.academic_supervisor_last_name}</>
    )
  },
//   {
//     title: 'Status',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'student_status',
//     render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'Inprogress' : 'Discontinue'}</Tag>,
//   },
    ];

    
    // const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [studentsProfiles, setStudentsProfiles] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [ExportData, setExportData] = useState([])

  
  const fetchStudentsProfiles = async () => {
      setIsFetchingData(true)
      try {
        const response = await getAllReportedStudentsProfiles(config)
        const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
          const valid_data = arrangedArray.map(item => {
            return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
          })
          const inprogress_students = valid_data.filter(item => item.student_status)
        setStudentsProfiles(inprogress_students)
        prepareData(inprogress_students)
        setIsFetchingData(false)
        } catch (error) {
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
        'organization': item.organization_name,
        'supervisor_first_name': item.academic_supervisor_first_name,
        'supervisor_last_name': item.academic_supervisor_last_name,
      }
    })
    setExportData(freshData)
  }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of students arrival notes</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px', }}>
                    <ArrivalNotesExport studentsList={ExportData} /> &nbsp; &nbsp;
                </Row>
                <hr/>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={studentsProfiles}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
       </Card.Body>
        </Card>
    )
}

export default FieldArrivalNotesPage
