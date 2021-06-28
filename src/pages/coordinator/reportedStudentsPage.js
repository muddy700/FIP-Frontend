import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editMultipleStudentsProfiles, editStudentProfileInfo, getAllReportedStudentsProfiles, getStaffProfile, getUsersProfilesByDesignationId} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import XLSX from 'xlsx';

function ReportedStudentsPage() {
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
  {
    title: 'Date Reported',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'date_reported',
    render: text => <>{text.substr(0,10)}</>,
  },
  {
    title: 'Status',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'student_status',
    render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'Inprogress' : 'Discontinue'}</Tag>,
  },
  {
    title: 'Academic Supervisor',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'academic_supervisor_name',
    render: text => <>{text === 'pending' ? '-' : text}</>,
  },
//   {
//     title: 'Date Reported',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'date_reported',
//     render: text => <>{text.substr(0,10)}</>,
//   },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        {/* <Button variant="link" size="sm" >
          <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); setModalShow(true); viewPost(record.id) }} />
        </Button>
        <Button variant="link" size="sm" >
          <Icon glyph="post" size={32} onClick={e => { e.preventDefault(); showPostForm(record) }} />
        </Button> */}
        {/* <Popconfirm
          title="Are you sure？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={e => { e.preventDefault(); deleteInternshipPost(record.id) }}>
         <Button variant="link" style={{color: 'red'}} size="sm" >
          <Icon glyph="delete" size={32} />
          </Button>
        </Popconfirm> */}
            {/* <Link to={{pathname: "/post_applications", post: record }}> */}
            {record.academic_supervisor_name === 'pending' ?
                <Button
                    onClick={e => { e.preventDefault(); setSelectedStudent(record); setModalShow(true) }}
                    variant="link" >Assign Supervisor</Button> :
                <span>Assigned </span>
            }
        {/* </Link> */}
      </Space>
    ),
  },
    ];

    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [modalShow, setModalShow] = useState(false);
    const [modalShow2, setModalShow2] = useState(false);
    const [studentsProfiles, setStudentsProfiles] = useState([])
    const [displayArray, setDisplayArray] = useState([])
    const [academicSupervisors, setAcademicSupervisors] = useState([])
    const [selectedSupervisor, setSelectedSupervisor] = useState(38)
    const [selectedStudent, setSelectedStudent] = useState({})
    const [isSendingData, setIsSendingData] = useState(false)
    const [staffProfile, setStaffProfile] = useState({})
    const [excelFile, setExcelFile] = useState(null)
    const [excelData, setExcelData] = useState([])
    const [excelError, setExcelError] = useState('')
    const [isSendingExcelData, setIsSendingExcelData] = useState(false)

      const getProfile = async () => {
        try {
            const profile = await getStaffProfile(user.userId, config)
          setStaffProfile(profile[0])
          fetchStudentsProfiles(profile[0]);
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
            const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
            const department_students = arrangedArray.filter(item => item.department === staff.department)
            setStudentsProfiles(department_students)
            setDisplayArray(department_students)
        } catch (error) {
            console.log(
                'Fetching All Students Profiles', error.response.data ) }
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
    }, [])

    const assignAcademicSupervisor = async () => {
        setIsSendingData(true)
        const payload = {
            ...selectedStudent, academic_supervisor: selectedSupervisor,
        }

      try {
          const response = await editStudentProfileInfo(payload, config)
          const new_students_list = studentsProfiles.map(item => item.id === response.id ? response : item)
          setStudentsProfiles(new_students_list)
          setDisplayArray(new_students_list)
          setSelectedStudent({})
          setSelectedSupervisor(38)
          setIsSendingData(false)
          setModalShow(false)
      } catch (error) {
        console.log('Assigning Academic Supervisor ', error.response.data)
        setIsSendingData(false)
      }
    }

    const modalTitle = 'Select academic supervisor'
    const modalContent =  <>
          <Form.Control as="select"
              size="md"
              onChange={e => { setSelectedSupervisor(e.target.value)}}
              name="academic_supervisor">
              <option>---Select Supervisor---</option>
              {academicSupervisors.map(person => (
                <option value={person.user}>{person.username} </option>
              ))}
            </Form.Control>
            <Button
                onClick={assignAcademicSupervisor}
                disabled={selectedSupervisor === 38 ? true : false}
            >{isSendingData ? <Loader message='Sending...' /> : 'Assign'}
            </Button>
  </>;

    const showAllStudents = () => {
        setDisplayArray(studentsProfiles)
    }

    const showAssignedStudents = () => {
        const assigned = studentsProfiles.filter(item => item.academic_supervisor !== 38)
        setDisplayArray(assigned)
    }

    const showUnassignedStudents = () => {
        const unassigned = studentsProfiles.filter(item => item.academic_supervisor === 38)
        setDisplayArray(unassigned)
    }

    const showBySupervisor = (id) => {
        const matched_students = studentsProfiles.filter(item => item.academic_supervisor === parseInt(id))
        setDisplayArray(matched_students)
  }
  
  const mergeStudentInfo = (data) => {
    let merged_students = [];

    for (let i = 0; i < studentsProfiles.length; i++){
      let obj = studentsProfiles[i]

      let isObjIncluded = data.find(item => item.registration_number === obj.registration_number)
      if (isObjIncluded) {
        merged_students.push(obj)
      }
      else {
        console.log('data not found')
      }
    }
    return merged_students
  }

  const sendDiscontinuedStudents = async () => {
    if (!excelData[0].registration_number) {
      setExcelError('Invalid data format. Follow the instruction above.')
      setExcelFile(null)
    }
    else {
      setIsSendingExcelData(true)
      const validData = excelData.filter(item => item.registration_number)
      let payloads = mergeStudentInfo(validData)
      payloads = payloads.map(item => { return { ...item, student_status: false } })

      try {
        const responses = await editMultipleStudentsProfiles(payloads, config)
        fetchStudentsProfiles(staffProfile)
        setIsSendingExcelData(false)
        setModalShow2(false)
      } catch (error) {
        console.log('Sending Discontinued Students ', error.response.data)
        setIsSendingExcelData(false)
      }
    }
  }

  const fileValidator = (e) => {
      const allowedDocFormats = /(\.xlsx)$/i;
      const uploadedFile = e.target.files[0]
      
      if (!uploadedFile) {
          return false
      }
      else if (!allowedDocFormats.exec(uploadedFile.name)) {
        setExcelError('Unsurpoted File Format. Only excel file is allowed')
        setExcelFile(null)
          return false
      }
      else {
        setExcelError('')
        setExcelFile(uploadedFile)
        return true
      }
  }
    
  const handleExcel = (e) => {
    const isFileValid = fileValidator(e)

    if (isFileValid) {
      const { files } = e.target;
      const fileReader = new FileReader();

      fileReader.onload = e => {
      try {
        const { result } = e.target;
        //  the entire excel spreadsheet object is read as a binary stream 
        const workbook = XLSX.read(result, { type: 'binary' });
        //  stores the retrieved data 
        let data = [];
        //  walk through each sheet to read （ by default, only the first table is read ）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            //  using sheet_to_json  method will be excel  into json  data 
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            break; //  if you only take the first table, uncomment the row 
          }
        }
        //  finally obtained and formatted json  data 
        // console.log(data);
        setExcelData(data)
        
      } catch (e) {
        //  here you can throw a hint that the file type error is incorrect 
        console.log(' incorrect file type ！');
      }
    };
    //  open the file in binary mode 
    fileReader.readAsBinaryString(files[0]);
    }
    else {
      console.log('Invalid File Selected')
    }
  }

  const modalTitle2 = 'Instructions'
  const modalContent2 = <>
    <Row style={{paddingLeft: '2%'}}>
      <span>Upload an excel file with only one column named <b>registration_number</b></span>
    </Row> <br />
    <Row >
            <Col >
              <Button variant='danger' hidden={!excelError}>{excelError}</Button>
              {/* <Message variant='danger' hidden={!excelError}>{excelError}</Message> */}
            </Col>
            <Col >
              <label style={{backgroundColor: 'lightgray', height: '100%', borderRadius: '5px', display: 'inline-block', padding: '8px 12px 0px 12px', cursor: 'pointer' }}>
                {excelFile ? excelFile.name : 'Select File'}
                <input type="file" onChange={handleExcel}
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  style={{ display: 'none' }} />
              </label>
          </Col>
          <Col md={2}>
            <Button 
              disabled={!excelFile}
          onClick={e => { e.preventDefault(); sendDiscontinuedStudents()}}
        >{isSendingExcelData ? <Loader message='Uploading...' /> : 'Send'}</Button>
          </Col>

          </Row></>
  
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of students arrival notes</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px'}}>
                    <Button onClick={e => { e.preventDefault(); showAllStudents() }}>All </Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showAssignedStudents() }}>Assigned</Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showUnassignedStudents() }}>Unassigned </Button> &nbsp; &nbsp;
                    <Col md={{ span: 4 }}>
                        <Form.Control as="select"
                        size="md"
                        onChange={e => { showBySupervisor(e.target.value)}}
                        name="academic_supervisor">
                        <option value={38}>---Filter by supervisor---</option>
                        {academicSupervisors.map(person => (
                            <option value={person.user}>{person.username} </option>
                        ))}
                        </Form.Control>
                    </Col>
                    <Button onClick={e => { e.preventDefault(); setModalShow2(true) }}>Upload discontinued </Button> &nbsp; &nbsp;
          </Row>
          
                <hr/>
          <Table
            columns={columns}
            dataSource={displayArray}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={false}
        title={modalTitle}  
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
        <ContentModal
        show={modalShow2}
        isTable={false}
        title={modalTitle2}  
        content={modalContent2}
          onHide={() => { setModalShow2(false); setExcelFile(null); setExcelError('')}}
      />
        </Card>
    )
}

export default ReportedStudentsPage
