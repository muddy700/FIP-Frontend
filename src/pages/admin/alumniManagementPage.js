import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Tag, Table} from 'antd';
import { Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getAllAlumni} from '../../app/api';
import { apiConfigurations } from '../../slices/userSlice';

function AlumniManagementPage() {
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
    title: 'Email',
    dataIndex: 'email',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Completion Year',
    dataIndex: 'completion_year',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Program',
    dataIndex: 'degree_program',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Department',
    dataIndex: 'department_name',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Publication Status',
    key: 'id',
    dataIndex: 'is_public',
    render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'published' : 'hidden'}</Tag>,
  },
  {
    title: 'Organization',
    key: 'id',
    dataIndex: 'organization_name',
    render: text => <>{text === 'pending' ? '---' : text}</>,
  },
];

    const config = useSelector(apiConfigurations)
    const [allAlumni, setAllAlumni] = useState([])
    
    const fetchAllAlumni = async () => {
        try {
            const alumniList = await getAllAlumni(config)
            setAllAlumni(alumniList)
        } catch (error) {
            console.log({
                'Request': 'Getting All Alumni Profiles Request',
                'Error => ' : error.response.data,
            })
        }

    }

    useEffect(() => {
      fetchAllAlumni();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of all Alumni</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Table
                    columns={columns}
                    dataSource={allAlumni}
                    pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
                    column={{ ellipsis: true }} />
       </Card.Body>
        </Card>
    )
}

export default AlumniManagementPage
