import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Space, Tag, Table} from 'antd';
import { Button, Row, Col, Card, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { editMultipleStudentsProfiles, editStudentProfileInfo, getAllReportedStudentsProfiles, getStaffProfile, getUsersProfilesByDesignationId} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import XLSX from 'xlsx';
import DataPlaceHolder from '../../components/dataPlaceHolder'

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
    render: (text, record) => (
       <>{record.academic_supervisor_name === 'pending' ? '-' : record.academic_supervisor_first_name + ' ' + record.academic_supervisor_last_name}</>
    )
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
            {!record.student_status ? '' : record.academic_supervisor_name === 'pending' ?
                <Button
                    onClick={e => { e.preventDefault(); setSelectedStudent(record); setModalShow(true) }}
                    variant="link" >Assign Supervisor</Button> :
                <span>Assigned </span>
            }
      </Space>
    ),
  },
    ];

    const targetAssignmentInfo = {
      supervisor: null,
      organization: null
    }
  
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
    const [organizationList, setOrganizationList] = useState([])
    const [assignByOrganization, setAssignByOrganization] = useState(false)
    const [targetInfo, setTargetInfo] = useState(targetAssignmentInfo)
    const [isAssigningMultiple, setIsAssigningMultiple] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
  
  const getProfile = async () => {
        setIsFetchingData(true)
        try {
          const profile = await getStaffProfile(user.userId, config)
          setStaffProfile(profile[0])
          fetchStudentsProfiles(profile[0]);
          fetchAcademicSupervisor(profile[0])
          setIsFetchingData(false)
        } catch (error) {
          setIsFetchingData(false)
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
            const valid_data = department_students.map(item => {
              return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
            })
            setStudentsProfiles(valid_data)
            setDisplayArray(valid_data)
            const ids = department_students.map(item => item.organization)
            const uniqueIds = Array.from(new Set(ids))
            fetchOrganizationList(uniqueIds)
        } catch (error) {
            console.log(
                'Fetching All Students Profiles', error.response.data ) }
    }

    const fetchAcademicSupervisor = async (staff) => {
        try {
          const response = await getUsersProfilesByDesignationId(5, config)
          // console.log(response)
          // console.log(staff.department)
          // const department_supervisors = response.filter(item => item.department === staff.department)
          // const department_supervisors = response.filter(item => item.department === staff.department)
            setAcademicSupervisors(response)
        } catch (error) {
            console.log(
                'Fetching Academic Supervisors Profiles', error.response.data ) }
  }
  
    const fetchOrganizationList = async (ids) => {
        try {
          const response = await getUsersProfilesByDesignationId(8, config)
          const valid = response.filter(item => ids.includes(item.user))
            setOrganizationList(valid)
        } catch (error) {
            console.log(
                'Fetching User Profiles By Designation', error.response.data ) }
    }

    useEffect(() => {
      getProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const assignAcademicSupervisor = async () => {
      setIsSendingData(true)
      const { field_report, ...rest } = selectedStudent;
        const payload = {
            ...rest, academic_supervisor: selectedSupervisor,
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
    if (id === 'all') {
      setDisplayArray(studentsProfiles)
    }
    else {
      const matched_students = studentsProfiles.filter(item => item.academic_supervisor === parseInt(id))
      setDisplayArray(matched_students)
    }
  }

  const showByOrganization = (id) => {
    if (id === 'all') {
      setDisplayArray(studentsProfiles)
    }
    else {
      const matched_students = studentsProfiles.filter(item => item.organization === parseInt(id))
      setDisplayArray(matched_students)
    }
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

    const checkRegNo = (dataList) => {
    let invalidData = [];

    for (let i = 0; i < dataList.length; i++) {
      let obj = dataList[i];

      let hasMatched = studentsProfiles.find(item => item.registration_number === obj.registration_number)

      if (hasMatched) { }
      else {
        invalidData.push(obj)
      }
    }
    return invalidData.find(item => (!item.undefined && item.registration_number))
  }

  const sendDiscontinuedStudents = async () => {
    if (!excelData.length) {
      setExcelError('Selected file has no data.')
      setExcelFile(null)
    }
    else if (!excelData[0].hasOwnProperty('registration_number')) {
      setExcelError('"registration_number" column is missing. Follow the instruction above.')
      setExcelFile(null)
    }
      else if (checkRegNo(excelData)) {
        setExcelError(`Registration number "${checkRegNo(excelData).registration_number}" is incorrect.`)
        setExcelFile(null)
        return false
      }
    else {
      setIsSendingExcelData(true)
      const validData = excelData.filter(item => item.registration_number)
      let payloads = mergeStudentInfo(validData)
      payloads = payloads.map(item => {
        let { field_report, ...rest } = item;
        return { ...rest, student_status: false }
      })

      try {
        const responses = await editMultipleStudentsProfiles(payloads, config)
        console.log(responses.length)
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
  
  const assignMultipleStudents = async () => {
    setIsAssigningMultiple(true)
    const targetStudents = studentsProfiles.filter(item => item.organization === targetInfo.organization)
    const payloads = targetStudents.map(item => {
      let { field_report, ...rest } = item;
      return { ...rest, academic_supervisor: targetInfo.supervisor }
    })

    try {
      let responses = await editMultipleStudentsProfiles(payloads, config)
      fetchStudentsProfiles(staffProfile)
      console.log(responses.length)
      setTargetInfo(targetAssignmentInfo)
      setAssignByOrganization(false)
      setIsAssigningMultiple(false)
    } catch (error) {
      console.log('Assigning Multiple Students By Organization ', error.response.data)
    }
  }

  const handleTargetInfo = (e) => {
    if (e.target.value === 'all') {
      setTargetInfo({...targetInfo, [e.target.name]: null})
     }
    else {
      setTargetInfo({...targetInfo,
        [e.target.name] : parseInt(e.target.value)
      })
    }
  }

  const asssignmentTitle = 'Select supervisor with target organization '
  const assignmentForm = <Row>
    <Col md={{ span: 4 }}>
      <Form.Control as="select"
        size="md"
        onChange={handleTargetInfo}
        name="organization">
        <option value='all'>---select organization---</option>
        {organizationList.map(person => (
            <option value={person.user}>{person.first_name}</option>
        ))}
      </Form.Control>
    </Col>
    <Col md={{ span: 4 }}>
      <Form.Control as="select"
        size="md"
        onChange={handleTargetInfo}
        name="supervisor">
        <option value='all'>---select supervisor---</option>
        {academicSupervisors.map(person => (
            <option value={person.user}>{person.first_name} {person.last_name} </option>
        ))}
      </Form.Control>
    </Col>
    <Col md={{ span: 3 }}>
      <Button
        disabled={!targetInfo.supervisor || !targetInfo.organization}
        onClick={e => { e.preventDefault(); assignMultipleStudents()}}
      >{isAssigningMultiple ? <Loader message='Assigning...' /> : 'Assign'}</Button>
    </Col>
  </Row>
  
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
                    <Col md={{ span: 3 }}>
                        <Form.Control as="select"
                        size="md"
                        onChange={e => { showBySupervisor(e.target.value)}}
                        name="academic_supervisor">
                        <option value='all'>---by supervisor---</option>
                        {academicSupervisors.map(person => (
                            <option value={person.user}>{person.first_name} {person.last_name} </option>
                        ))}
                        </Form.Control>
                    </Col>
                    <Col md={{ span: 3 }}>
                        <Form.Control as="select"
                        size="md"
                        onChange={e => { showByOrganization(e.target.value)}}
                        name="academic_supervisor">
                        <option value='all'>---by organization---</option>
                        {organizationList.map(person => (
                            <option value={person.user}>{person.first_name}</option>
                        ))}
                        </Form.Control>
                    </Col>
          </Row>
          <Row>
              <Button onClick={e => { e.preventDefault(); setAssignByOrganization(true)}}>Assign by organization </Button> &nbsp; &nbsp;
              <Button onClick={e => { e.preventDefault(); setModalShow2(true) }}>Upload discontinued </Button> &nbsp; &nbsp;
          </Row>
          
                <hr/>
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={displayArray}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
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
        <ContentModal
        show={assignByOrganization}
        isTable={false}
        title={asssignmentTitle}  
        content={assignmentForm}
          onHide={() => { setAssignByOrganization(false); setTargetInfo(targetAssignmentInfo)}}
      />
        </Card>
    )
}

export default ReportedStudentsPage
