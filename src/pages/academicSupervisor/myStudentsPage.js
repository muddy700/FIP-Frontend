import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Icon from 'supercons'
import { Button, Row, Col, Card, Modal, Form, FormControl, } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { editselectedStudentInfo, editStudentProfileInfo, getAllReportedStudentsProfiles, getStudentsByAcademicSupervisor, getUsersProfilesByDesignationId, sendFieldReport} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import XLSX from 'xlsx';
import MarksFormatExport from './marksFormatExport';


function MyStudentsPage() {
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
    title: 'Student Phone',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'phone_number',
    render: text => <>{text}</>,
  },
//   {
//     title: 'Academic Supervisor',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'academic_supervisor_name',
//     render: text => <>{text === 'pending' ? '-' : text}</>,
//   },
  {
    title: 'Status',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'student_status',
    render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'Inprogress' : 'Discontinue'}</Tag>,
  },
  {
      title: 'Report',
      key: 'id',
    // ellipsis: 'true',
    dataIndex: 'field_report',
    render: (text, record) => <>{record.field_report ?
                <Button
            onClick={e =>
            {
                e.preventDefault();
                setModalShow(true);
                setSelectedStudent(record)
                setModalTitle(`${record.registration_number} Report`)
                setModalContent(<object
                    type="application/pdf"
                    data={record.field_report}
                    width="100%"
                    height="400px"
                >{record.registration_number}</object>)
            }}
                    variant="link" >View</Button> :
                <span>Not uploaded</span>}</>,
  },
  {
    title: 'Report Marks',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'report_marks',
    render: text => <>{text ? text : '-'}</>,
  },
  {
    title: 'Academic Marks',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'academic_supervisor_marks',
    render: text => <>{text ? text : '-'}</>,
  },
  {
    title: 'Field Marks',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'field_supervisor_marks',
    render: text => <>{text ? text : '-'}</>,
  },
  {
    title: 'Average',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'average_marks',
    render: text => <>{text ? text : '-'}</>,
    // render: text => <>{text ? Math.round(text) : 'Not'}</>,
  },
  {
    title: 'Grade',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'marks_grade',
    render: text => <>{text ? text : '-'}</>,
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
        <Space size="middle">
            {record.average_marks ? '' :
              <Button
                  onClick={e => {
                      e.preventDefault();
                      setModalShow2(true);
                      setSelectedStudent(record)
                      setFieldScore(record.field_supervisor_marks)
                      setAcademicScore(record.academic_supervisor_marks)
                  }}
                  variant="link"
                >Fill Marks</Button>
            }
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
    const [selectedStudent, setSelectedStudent] = useState({})
    const [isSendingData, setIsSendingData] = useState(false)
    const [reportScore, setReportScore] = useState(null)
    const [academicScore, setAcademicScore] = useState(null)
    const [fieldScore, setFieldScore] = useState(null)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    // const [uploadedData, setUploadedData] = useState([])
    const [marksFormatData, setMarksFormatData] = useState([])
    const [modalShow3, setModalShow3] = useState(false)
    const [isSendingExcelData, setIsSendingExcelData] = useState(false)
    const [excelFile, setExcelFile] = useState(null)
    const [excelError, setExcelError] = useState('')
    const [excelData, setExcelData] = useState([])
    
    const fetchStudentsProfiles = async () => {
        try {
            const response = await getStudentsByAcademicSupervisor(user.userId, config)
            const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
            setStudentsProfiles(arrangedArray)
            setDisplayArray(arrangedArray)
            const inprogress_students = arrangedArray.filter(item => item.student_status)
            prepareData(inprogress_students)
        } catch (error) {
            console.log(
                'Fetching Students By Academic Supervisor ', error.response.data ) }
    }

    useEffect(() => {
        fetchStudentsProfiles();
    }, [])

    const prepareData = (data) => {
    const freshData = data.map(item => {
      return {
        'regNo': item.registration_number,
        'report_marks': item.report_marks,
        'academic_marks': item.academic_supervisor_marks,
        'field_marks': item.field_supervisor_marks
      }
    })
    setMarksFormatData(freshData)
  }

    const showAllStudents = () => {
        setDisplayArray(studentsProfiles)
    }

    const showPassedStudents = () => {
        const passed = studentsProfiles.filter(item => item.student_status)
        setDisplayArray(passed)
    }

    const showFailedStudents = () => {
        const failed = studentsProfiles.filter(item => !item.student_status)
        setDisplayArray(failed)
    }

  const convertLinkToFile = async (fileUrl) => {
        const blob = await (await fetch(fileUrl)).blob();
        const report_file = new File([blob], `${selectedStudent.registration_number}.pdf`, { type: "application/pdf", lastModified: new Date() });
        return report_file
  }
  
  const sendReportMarks = async () => {
        setIsSendingData(true)
        
        const payload = new FormData()
        payload.append('student_status', selectedStudent.student_status)
        payload.append('phone_number', selectedStudent.phone_number)
        payload.append('year_of_study', selectedStudent.year_of_study)
        payload.append('program', selectedStudent.program)
        payload.append('student', selectedStudent.student)
        payload.append('organization', selectedStudent.organization)
        payload.append('field_supervisor', selectedStudent.field_supervisor)
        payload.append('department', selectedStudent.department)
        payload.append('academic_supervisor', selectedStudent.academic_supervisor)
        payload.append('has_reported', selectedStudent.has_reported)
        payload.append('date_reported', selectedStudent.date_reported)
        // payload.append('field_report', '')
        payload.append('field_report', convertLinkToFile(selectedStudent.report_file))
        payload.append('report_marks', reportScore)
        payload.append('academic_supervisor_marks', getAcademicMarks())
        payload.append('field_supervisor_marks', getFieldMarks())
        payload.append('average_marks', calculateAverageMarks())
        payload.append('marks_grade', calculateGrade(calculateAverageMarks()))
        
        const config2 = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        }

        try {
          const response = await sendFieldReport(selectedStudent.id, payload, config2)
            setSelectedStudent(response)
            const new_list = studentsProfiles.map(item => item.id === response.id ? response : item)
            setStudentsProfiles(new_list)
            setDisplayArray(new_list)
            setReportScore(null)
            setIsSendingData(false)
          } catch (error) {
            console.log('Sending Report Marks ', error.response.data)
            setIsSendingData(false)
          }
        }
        
        const getReportMarks = () => {
          const marks = reportScore ? reportScore : selectedStudent.report_marks ? selectedStudent.report_marks : null;
          return marks;
        }
        
        const getAcademicMarks = () => {
          let marks = null;
          if (reportScore) {
            marks = selectedStudent.academic_supervisor_marks ? selectedStudent.academic_supervisor_marks : '';
          }
          else {
            marks = academicScore ? academicScore : null;
          }
          return marks;
        }
        
    const getFieldMarks = () => {
      let marks = null;
      if (reportScore) {
        marks = selectedStudent.field_supervisor_marks ? selectedStudent.field_supervisor_marks : '';
      }
      else {
        marks = fieldScore ? fieldScore : null;
      }
          return marks;
    }

  const calculateAverageMarks = () => {
      if (getReportMarks() && (getFieldMarks() && getAcademicMarks())) {
        const average = (parseFloat(getReportMarks()) + parseFloat(getAcademicMarks()) + parseFloat(getFieldMarks())) / 3
        return average.toFixed(2)
      }
      else {
        return reportScore ? '' : null;
      }
  }

  const calculateGrade = (avg) => {
      if (!avg) {
        return '';
      }
      else {
        if (avg >= 70 && avg <= 100) {
          return 'A'
          }
        else if(avg >= 60 && avg < 70) {
            return 'B+'
          }
        else if(avg >= 50 && avg < 60) {
          return 'B'
        }
        else if(avg >= 40 && avg < 50) {
            return 'C'
        }
        else if(avg >= 35 && avg < 40) {
          return 'D'
        }
        else  {
          return 'E'
        }
      }
   }

  const createPayload = () => {
    if (selectedStudent.report_file) {
      const payload = new FormData()
      payload.append('student_status', selectedStudent.student_status)
      payload.append('phone_number', selectedStudent.phone_number)
      payload.append('year_of_study', selectedStudent.year_of_study)
      payload.append('program', selectedStudent.program)
      payload.append('student', selectedStudent.student)
      payload.append('organization', selectedStudent.organization)
      payload.append('field_supervisor', selectedStudent.field_supervisor)
      payload.append('department', selectedStudent.department)
      payload.append('academic_supervisor', selectedStudent.academic_supervisor)
      payload.append('has_reported', selectedStudent.has_reported)
      payload.append('date_reported', selectedStudent.date_reported)
      payload.append('field_report', convertLinkToFile(selectedStudent.field_report))
      payload.append('report_marks', getReportMarks())
      payload.append('academic_supervisor_marks', getAcademicMarks())
      payload.append('field_supervisor_marks', getFieldMarks())
      payload.append('average_marks', calculateAverageMarks())
      payload.append('marks_grade', calculateGrade(calculateAverageMarks()))

      return payload;
    }
    else {
      const payload = {
        ...selectedStudent,
        report_marks: getReportMarks(),
        academic_supervisor_marks: getAcademicMarks(),
        field_supervisor_marks: getFieldMarks(),
        average_marks: calculateAverageMarks(),
        marks_grade: calculateGrade(calculateAverageMarks())
      }
      return payload;
    }
  }

  const sendAcademicAndFieldMarks = async () => {
        setIsSendingData(true)
        const payload = createPayload()
        const config2 = {
                headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Token ${localStorage.getItem('token')}`}
        }

        try {
            const response = await sendFieldReport(selectedStudent.id, payload, selectedStudent.report_file ? config2 : config)
            const new_list = studentsProfiles.map(item => item.id === response.id ? response : item)
            setStudentsProfiles(new_list)
            setDisplayArray(new_list)
            setAcademicScore(null)
            setFieldScore(null)
            setIsSendingData(false)
            setModalShow2(false)
            setSelectedStudent({})
        } catch (error) {
            console.log('Sending Academic And Fild Marks ', error.response.data)
            setIsSendingData(false)
        }
    }

    const reportMarksForm = <Row style={{width: '100%', }}>
        <Col md={4}>
          <FormControl
            placeholder="Enter report marks"
            type="number"
            aria-label="Message Content"
            value={reportScore}
            aria-describedby="basic-addon2"
            onChange={e => {setReportScore(e.target.value)}}
            />
        </Col>
        <Col>
            <Button
                onClick={e => { e.preventDefault(); sendReportMarks()}}
                disabled={!reportScore}
            >{isSendingData ? <Loader message='Sending...' /> : 'Save'}
            </Button>
        </Col>
    </Row>

    const reportMarks = <Message variant='info'>
        <b>Report Marks: </b>
        <span>{selectedStudent.report_marks}</span>
    </Message>
    
    const modalTitle2 = 'Academic and Field marks'
    const modalContent2 = <Row style={{width: '100%', }}>
        <Col md={4}>
          <FormControl
            placeholder="Enter academic marks"
            type="number"
            aria-label="Message Content"
            value={academicScore}
            aria-describedby="basic-addon2"
            onChange={e => {setAcademicScore(e.target.value)}}
            />
        </Col>
        <Col md={4}>
          <FormControl
            placeholder="Enter field marks"
            type="number"
            aria-label="Message Content"
            value={fieldScore}
            aria-describedby="basic-addon2"
            onChange={e => {setFieldScore(e.target.value)}}
            />
        </Col>
        <Col>
            <Button
                onClick={e => { e.preventDefault(); sendAcademicAndFieldMarks()}}
                disabled={!academicScore && !fieldScore}
            >{isSendingData ? <Loader message='Sending...' /> : 'Save'}
            </Button>
        </Col>
    </Row>
    
  const checkUploadedData = () => {
    if (!excelData[0].registration_number) {
      setExcelError('Invalid data format. Follow the instruction above.')
      setExcelFile(null)
    }
  }

  const sendUploadedResults = async () => {
    const isDataCorrectFetched = checkUploadedData()

    if(isDataCorrectFetched) {
      console.log(excelData)
      // setIsSendingExcelData(true)
      // const validData = excelData.filter(item => item.registration_number)
      // let payloads = mergeStudentInfo(validData)
      // payloads = payloads.map(item => { return { ...item, student_status: false } })

      try {
        // const responses = await editMultipleStudentsProfiles(payloads, config)
        // fetchStudentsProfiles(staffProfile)
        // setIsSendingExcelData(false)
        // setModalShow2(false)
      } catch (error) {
        console.log('Sending Discontinued Students ', error.response.data)
        // setIsSendingExcelData(false)
      }
    }

  }

  const fileValidator = (e) => {
    const allowedDocFormats = /(\.xlsx)$/i;
    const uploadedFile = e.target.files[0]
    
    if (!allowedDocFormats.exec(uploadedFile.name)) {
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
    
  const modalTitle3 = 'Instructions'
  const modalContent3 = <>
    <Row style={{paddingLeft: '2%'}}>
      <span>Upload an excel that has been formatted as the sample template given.</span>
    </Row> <br />
    <Row >
            <Col >
              <Button variant='danger' hidden={!excelError}>{excelError}</Button>
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
          onClick={e => { e.preventDefault(); sendUploadedResults()}}
        >{isSendingExcelData ? <Loader message='Uploading...' /> : 'Send'}</Button>
          </Col>
          </Row></>

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of students assigned to you</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px', }}>
                    <Button onClick={e => { e.preventDefault(); showAllStudents()}}>All </Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showPassedStudents()}}>Inprogress</Button> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); showFailedStudents()}}>Discontinued </Button> &nbsp; &nbsp;
                    <MarksFormatExport studentsList={marksFormatData} /> &nbsp; &nbsp;
                    {/* <Col md={{span:3}}>
                        <label style={{backgroundColor: 'lightblue', height: '100%', borderRadius: '5px', display: 'inline-block', padding: '8px 12px 0px 12px', cursor: 'pointer' }}>
                            Upload Excel
                            <input type="file" onChange={handleExcel} accept="*" style={{ display: 'none' }}/>
                        </label>
                    </Col> */}
                    <Button onClick={e => { e.preventDefault(); setModalShow3(true) }}>Import result </Button> &nbsp; &nbsp;
                </Row>
                <hr/>
          <Table
            columns={columns}
            dataSource={displayArray}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
       
       <Modal  //For Report Preview
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShow}
                onHide={() => { setModalShow(false); setModalTitle(''); setModalContent(''); setSelectedStudent({})}}
        >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {modalTitle}
        </Modal.Title>
      </Modal.Header>
        <Modal.Body>
            {modalContent}
        </Modal.Body>
        <Modal.Footer>
            {selectedStudent.report_marks ? reportMarks : reportMarksForm}
        </Modal.Footer>
    </Modal>
    <ContentModal //Forr Filling Field And Academic Marks
    show={modalShow2}
    isTable={false}
    title={modalTitle2}
    content={modalContent2}
                onHide={() => { setModalShow2(false); setSelectedStudent({}); setAcademicScore(null); setFieldScore(null)}}
    />
    <ContentModal //For Uploading Students Marks
    show={modalShow3}
    isTable={false}
    title={modalTitle3}
    content={modalContent3}
          onHide={() => { setModalShow3(false); setExcelFile(null); setExcelError('')}}
    />
        </Card>
    )
}

export default MyStudentsPage
