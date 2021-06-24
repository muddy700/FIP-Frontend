import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space, Popconfirm } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form , Modal} from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editFieldApplication, editFieldPost, editStudentProfileInfo, getAllReportedStudents, getFieldApplicationsByPostId, getStudentProfileInfo } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
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

    const fetchAllReportedStudents = async () => {
        try {
            const response = await getAllReportedStudents(config)
            const organization_students = response.filter(item => item.organization === user.userId)
            setReportedStudents(organization_students)
        } catch (error) {
            console.log('Getting All Reported Students', error.response.data)
        }
    }

    useEffect(() => {
        fetchAllReportedStudents();
    }, [])

    const editArrivalNote = async (studentId) => {
      let profile = '';
      try {
        profile = await getStudentProfileInfo(studentId, config)
        const payload = {
          ...profile[0], has_reported: false, organization: 38, date_reported: null, field_report: null
        }

        try {
          const resopnse = await editStudentProfileInfo(payload, config)
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
            <Row style={{width: '100%'}}>
                <Table 
                    columns={columns}
                    dataSource={reportedStudents}
                    pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
                        // column={{ ellipsis: true }}
            />
            </Row>
        </Card.Body>
    </Card>
    )
}

export default FieldReports
