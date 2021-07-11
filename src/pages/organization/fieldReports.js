import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space } from 'antd';
import { Button, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { editFieldApplication, editStudentProfileInfo, getAllReportedStudents,getStudentProfileInfo } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import DataPlaceHolder from '../../components/dataPlaceHolder';

import Loader from '../../components/loader'

const FieldReports = () => {
  
  const [page, setPage] = useState(1)
    
  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Post Ref No:',
    dataIndex: 'post_reference_number',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Student Reg No:',
    dataIndex: 'registration_number',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
        <Space size="middle">
            {record.has_released ?
                <span style={{color: 'red'}}>Released</span> :
                <Button variant="link" size="sm"
                    onClick={e => {
                        e.preventDefault();
                        setSelectedApplication(record);
                        releaseStudent(record)
                    }}>{isReleasing && selectedApplication.id === record.id ? <Loader message='wait...!' /> : 'Release'}
                </Button>
            }
      </Space>
    ),
  },
    ];

    
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    // const [fieldApplications, setFieldApplications] = useState([])
    const [reportedStudents, setReportedStudents] = useState([])
    const [selectedApplication, setSelectedApplication] = useState({})
    const [isReleasing, setIsReleasing] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)

  const fetchAllReportedStudents = async () => {
      setIsFetchingData(true)
      try {
        const response = await getAllReportedStudents(config)
        const organization_students = response.filter(item => item.organization === user.userId)
        const valid_data = organization_students.map(item => {
          return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
        })
        setReportedStudents(valid_data)
        setIsFetchingData(false)
      } catch (error) {
          setIsFetchingData(false)
            console.log('Getting All Reported Students', error.response.data)
        }
    }

    useEffect(() => {
        fetchAllReportedStudents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const editArrivalNote = async (studentId) => {
      let profile = '';
      try {
        profile = await getStudentProfileInfo(studentId, config)
        const payload = {
          ...profile[0], has_reported: false, organization: 38, date_reported: null, field_report: null
        }

        try {
          const response = await editStudentProfileInfo(payload, config)
          console.log(response.length)
          setIsReleasing(false)
        } catch (error) {
          console.log('Editing Arrival Note ', error.response.data)
          setIsReleasing(false)
        }

      } catch (error) {
        console.log('Getting Student Profile ', error.response.data)
        setIsReleasing(false)
      }
    }

    const releaseStudent = async (record) => {
      setIsReleasing(true)
      const payload = {
          ...record, has_released: true
      }

        try {
            const response = await editFieldApplication(payload, config)
            const newApplicationsList = reportedStudents.map(item => item.id === response.id ? response : item)
            setReportedStudents(newApplicationsList)
            editArrivalNote(response.student)
        } catch (error) {
            console.log('Releasing Student ', error.response.data)
            setIsReleasing(false)
        }

    }

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >All reported students</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={reportedStudents}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
              // column={{ ellipsis: true }}
              /> </>
          }
        </Card.Body>
    </Card>
    )
}

export default FieldReports
