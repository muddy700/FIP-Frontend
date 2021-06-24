import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space, Popconfirm } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form , Modal} from 'react-bootstrap'
import Message from '../../components/message'
import { useLocation, useHistory, useParams } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editFieldApplication, editFieldPost, getFieldApplicationsByPostId } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'

const FieldApplications = () => {
  
  const [page, setPage] = useState(1)
    
  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
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
                setSelectedApplication(record);
                confirmReporting(record)
            }}>{isConfirming && selectedApplication.id === record.id ? <Loader message='wait...!' /> : 'Confirm Reporting'}
            </Button>
      </Space>
    ),
  },
    ];

    const param = useParams()
    const postId = param.id
    const history = useHistory();
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [fieldApplications, setFieldApplications] = useState([])
    const [selectedApplication, setSelectedApplication] = useState({})
    const [isConfirming, setIsConfirming] = useState(false)
    
  const goToPreviousPage = () => {
      history.goBack()
  }

    const fetchFieldApplications = async () => {
        try {
            const response = await getFieldApplicationsByPostId(postId, config)
            const unConfirmedApplicantions = response.filter(item => !item.has_reported)
            setFieldApplications(unConfirmedApplicantions)
        } catch (error) {
            console.log('Getting All Field Applications', error.response.data)
        }
    }

    const confirmReporting = async (record) => {
        setIsConfirming(true)
      const payload = {
          ...record,
            record, has_reported: true
      }

        try {
            const response = await editFieldApplication(payload, config)
            const newApplicationsList = fieldApplications.filter(item => item.id !== response.id)
            setFieldApplications(newApplicationsList)
            setIsConfirming(false)
        } catch (error) {
            console.log('Confirming Reporting ', error.response.data)
            setIsConfirming(false)
        }
    }

    useEffect(() => {
        fetchFieldApplications();
    }, [])
    
    return (
    <Card >
        <Card.Header >
                <Message variant='info' >Applications of the selected field post</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
            <Row style={{width: '100%'}}>
                <Table 
                    columns={columns}
                    dataSource={fieldApplications}
                    pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
                        // column={{ ellipsis: true }}
            />
            </Row>
             <Button
                variant="secondary"
                onClick={goToPreviousPage} >
                Back
            </Button>
        </Card.Body>
    </Card>
    )
}

export default FieldApplications
