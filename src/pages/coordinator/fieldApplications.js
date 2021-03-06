import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table, Space} from 'antd';
import { Button, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useHistory, useParams } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {  getFieldApplicationsByPostId} from '../../app/api';
import { apiConfigurations} from '../../slices/userSlice';
import DataPlaceHolder from '../../components/dataPlaceHolder'

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
  // {
  //   title: 'Program',
  //   dataIndex: 'degree_program',
  //   key: 'id',
  //   render: text => <>{text}</>,
  // },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {/* <Button variant="link" size="sm"
            onClick={e => {
              e.preventDefault();
            }}>N/Y
        </Button> */}
      </Space>
    ),
  },
    ];

    const param = useParams()
    const postId = param.id
    const history = useHistory();
    const config = useSelector(apiConfigurations)
    const [fieldApplications, setFieldApplications] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    
    const goToPreviousPage = () => {
        history.goBack()
    }

  const fetchFieldApplications = async () => {
      setIsFetchingData(true)
      try {
        const response = await getFieldApplicationsByPostId(postId, config)
        const unConfirmedApplicantions = response.filter(item => !item.has_reported)
        const valid_data = unConfirmedApplicantions.map(item => {
          return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
        })
        setFieldApplications(valid_data)
        setIsFetchingData(false)
      } catch (error) {
          setIsFetchingData(false)
            console.log('Getting Field Applications By PostId', error.response.data)
        }
    }
  
    useEffect(() => {
        fetchFieldApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >{fieldApplications.length > 0 ? 'Applications of the selected field post' : 'No any application yet.'}</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              {fieldApplications.length > 0 ?
                <Table
                  columns={columns}
                  dataSource={fieldApplications}
                  pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                // column={{ ellipsis: true }}
                /> :
                ''} </>
          }
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
