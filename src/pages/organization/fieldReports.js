import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space, Popconfirm } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form , Modal} from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editFieldApplication, editFieldPost, getAllReportedStudents, getFieldApplicationsByPostId } from '../../app/api';
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
        <Button variant="link" size="sm"
            onClick={e => {
              e.preventDefault();
                // setSelectedApplication(record);
                // confirmReporting(record)
                }}>Release
                {/* {isConfirming && selectedApplication.id === record.id ? <Loader message='wait...!' /> : 'Confirm Reporting'} */}
            </Button>
      </Space>
    ),
  },
    ];

    
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    // const [fieldApplications, setFieldApplications] = useState([])
    const [reportedStudents, setReportedStudents] = useState([])
    const [selectedApplication, setSelectedApplication] = useState({})

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
