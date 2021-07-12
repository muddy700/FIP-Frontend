import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import { Button, Card } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getStudentsByAcademicSupervisor} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import DataPlaceHolder from '../../components/dataPlaceHolder'

function StudentsLogBooks() {
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
  {
    title: 'Week-1',
    key: 'id',
    dataIndex: 'week_1_logbook',
    render: (text, record) => <>{record.week_1_logbook ?
                <Button
                    onClick={e =>
                    {
                        e.preventDefault();
                        setModalShow(true);
                        setModalTitle(`Reg No: ${record.registration_number}, Week: 1, Logbook`)
                        setModalContent(<object
                            type="application/pdf"
                            data={record.week_1_logbook}
                            width="100%"
                            height="400px"
                        >{record.registration_number}</object>)
                    }}
                    variant="link"
                >View</Button> :
                <span>Not uploaded</span>}</>,
  },
  {
    title: 'Week-2',
    key: 'id',
    dataIndex: 'week_2_logbook',
    render: (text, record) => <>{record.week_2_logbook ?
                <Button
                    onClick={e =>
                    {
                        e.preventDefault();
                        setModalShow(true);
                        setModalTitle(`Reg No: ${record.registration_number}, Week: 2, Logbook`)
                        setModalContent(<object
                            type="application/pdf"
                            data={record.week_2_logbook}
                            width="100%"
                            height="400px"
                        >{record.registration_number}</object>)
                    }}
                    variant="link"
                >View</Button> :
                <span>Not uploaded</span>}</>,
  },
  {
    title: 'Week-3',
    key: 'id',
    dataIndex: 'week_3_logbook',
    render: (text, record) => <>{record.week_3_logbook ?
                <Button
                    onClick={e =>
                    {
                        e.preventDefault();
                        setModalShow(true);
                        setModalTitle(`Reg No: ${record.registration_number}, Week: 3, Logbook`)
                        setModalContent(<object
                            type="application/pdf"
                            data={record.week_3_logbook}
                            width="100%"
                            height="400px"
                        >{record.registration_number}</object>)
                    }}
                    variant="link"
                >View</Button> :
                <span>Not uploaded</span>}</>,
  },
  {
    title: 'Week-4',
    key: 'id',
    dataIndex: 'week_4_logbook',
    render: (text, record) => <>{record.week_4_logbook ?
                <Button
                    onClick={e =>
                    {
                        e.preventDefault();
                        setModalShow(true);
                        setModalTitle(`Reg No: ${record.registration_number}, Week: 4, Logbook`)
                        setModalContent(<object
                            type="application/pdf"
                            data={record.week_4_logbook}
                            width="100%"
                            height="400px"
                        >{record.registration_number}</object>)
                    }}
                    variant="link"
                >View</Button> :
                <span>Not uploaded</span>}</>,
  },
  {
    title: 'Week-5',
    key: 'id',
    dataIndex: 'week_5_logbook',
    render: (text, record) => <>{record.week_5_logbook ?
                <Button
                    onClick={e =>
                    {
                        e.preventDefault();
                        setModalShow(true);
                        setModalTitle(`Reg No: ${record.registration_number}, Week: 5, Logbook`)
                        setModalContent(<object
                            type="application/pdf"
                            data={record.week_5_logbook}
                            width="100%"
                            height="400px"
                        >{record.registration_number}</object>)
                    }}
                    variant="link"
                >View</Button> :
                <span>Not uploaded</span>}</>,
  },
    ];

    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [modalShow, setModalShow] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [studentsProfiles, setStudentsProfiles] = useState([])

  
  const fetchStudentsProfiles = async () => {
      setIsFetchingData(true)
      try {
        const response = await getStudentsByAcademicSupervisor(user.userId, config)
        const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
          const valid_data = arrangedArray.map(item => {
            return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
          })
          const inprogress_students = valid_data.filter(item => item.student_status)
        setStudentsProfiles(inprogress_students)
        setIsFetchingData(false)
        } catch (error) {
            console.log(
                'Fetching Students By Academic Supervisor ', error.response.data ) }
    }

    useEffect(() => {
      fetchStudentsProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of your students logbooks</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={studentsProfiles}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
       </Card.Body>
    <ContentModal //For Uploading Students Marks
    show={modalShow}
    isTable={false}
    title={modalTitle}
    content={modalContent}
          onHide={() => { setModalShow(false);}}
    />
        </Card>
    )
}

export default StudentsLogBooks
