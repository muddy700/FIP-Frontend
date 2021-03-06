import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Space, Tag, Table } from 'antd';
import { Button, Row, Col, Card, Modal, FormControl, } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { editMultipleStudentsProfiles, getStudentsByAcademicSupervisor, sendFieldReport} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import XLSX from 'xlsx';
import MarksFormatExport from './marksFormatExport';
import DataPlaceHolder  from '../../components/dataPlaceHolder'

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
        {record.average_marks ?
              <Button
                  onClick={e => {
                      e.preventDefault();
                      setModalShow2(true);
                      setSelectedStudent(record)
                      setFieldScore(record.field_supervisor_marks)
                      setAcademicScore(record.academic_supervisor_marks)
                  }}
                  variant="link"
                >Edit Marks</Button>
          :
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
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [reportMarksError, setReportMarksError] = useState('')
  const [academicMarksError, setAcademicMarksError] = useState('')
  const [fieldMarksError, setFieldMarksError] = useState('')
  
  const fetchStudentsProfiles = async () => {
      setIsFetchingData(true)
      try {
        const response = await getStudentsByAcademicSupervisor(user.userId, config)
        const arrangedArray = response.slice().sort((a, b) => b.date_reported.localeCompare(a.date_reported))
          const valid_data = arrangedArray.map(item => {
            return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
          })
        setStudentsProfiles(valid_data)
        setDisplayArray(valid_data)
        const inprogress_students = valid_data.filter(item => item.student_status)
        prepareData(inprogress_students)
        setIsFetchingData(false)
        } catch (error) {
            console.log(
                'Fetching Students By Academic Supervisor ', error.response.data ) }
    }

    useEffect(() => {
      fetchStudentsProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // const convertLinkToFile = async (fileUrl) => {
  //       const blob = await (await fetch(fileUrl)).blob();
  //       const report_file = new File([blob], `${selectedStudent.registration_number}.pdf`, { type: "application/pdf", lastModified: new Date() });
  //       return report_file
  // }
  
  const reportMarksValidator = () => {
    if (!reportScore) {
      setReportMarksError('Report marks cannot be blank')
      return false;
    }
    else if (reportScore > 100 || reportScore < 0) {
      setReportMarksError('Enter valid marks')
      return false;
    }
    else {
      setReportMarksError('')
      return true;
    }
  }

  const sendReportMarks = async () => {
    const isMarksValid = reportMarksValidator()
    if (isMarksValid) {
      setIsSendingData(true)
      const {
        field_report,
        week_1_logbook,
        week_2_logbook,
        week_3_logbook,
        week_4_logbook,
        week_5_logbook,
        week_6_logbook,
        week_7_logbook,
        week_8_logbook,
        week_9_logbook,
        week_10_logbook,
        academic_supervisor_marks, field_supervisor_marks,
        ...rest } = selectedStudent
      const payload = {
        ...rest,
        report_marks: reportScore,
        average_marks: calculateAverageMarks(),
        marks_grade: calculateGrade(calculateAverageMarks())
      }
        
      try {
        const response = await sendFieldReport(selectedStudent.id, payload, config)
        setSelectedStudent(response)
        const new_list = studentsProfiles.map(item => item.id === response.id ? response : item)
        setStudentsProfiles(new_list)
        setDisplayArray(new_list)
        setReportScore(null)
        setModalShow(false)
        setIsSendingData(false)
      } catch (error) {
        console.log('Sending Report Marks ', error.response.data)
        setIsSendingData(false)
      }
    }
    else {
      console.log('Invalid Report Marks')
    }
        }
        
        const getReportMarks = () => {
          const marks = reportScore ? reportScore : selectedStudent.report_marks ? selectedStudent.report_marks : null;
          return marks;
        }
        
        const getAcademicMarks = () => {
          let marks = null;
          if (reportScore) {
            marks = selectedStudent.academic_supervisor_marks ? selectedStudent.academic_supervisor_marks : null;
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
        return null;
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
        else if(avg > 100 || avg < 0) {
          return 'invalid'
        }
        else  {
          return 'E'
        }
      }
   }

    const academicAndFieldMarksValidator = () => {
    if (academicScore > 100 || academicScore < 0) {
      setAcademicMarksError('Invalid academic marks')
      return false;
    }
    else if (fieldScore > 100 || fieldScore < 0) {
      setFieldMarksError('Invalid field marks')
      return false;
    }
    else {
      setFieldMarksError('')
      setAcademicMarksError('')
      return true;
    }
  }

  const sendAcademicAndFieldMarks = async () => {
    let isMarksValid = academicAndFieldMarksValidator()
    if (isMarksValid) {
      setIsSendingData(true)
      const { field_report,
        week_1_logbook,
        week_2_logbook,
        week_3_logbook,
        week_4_logbook,
        week_5_logbook,
        week_6_logbook,
        week_7_logbook,
        week_8_logbook,
        week_9_logbook,
        week_10_logbook,
        report_marks,
        ...rest } = selectedStudent
    
      const payload = {
        ...rest,
        academic_supervisor_marks: getAcademicMarks(),
        field_supervisor_marks: getFieldMarks(),
        average_marks: calculateAverageMarks(),
        marks_grade: calculateGrade(calculateAverageMarks())
      }

      try {
        const response = await sendFieldReport(selectedStudent.id, payload, config)
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
    else {
      console.log('Invalid Academic Or Field Marks')
    }
  }

    const reportMarksForm = <Row style={{width: '100%', }}>
        <Col md={3}>
          <FormControl
            placeholder="Enter report marks"
            type="number"
            aria-label="Message Content"
            value={reportScore}
            aria-describedby="basic-addon2"
            onChange={e => { setReportMarksError(''); setReportScore(e.target.value)}}
            />
        </Col>
        <Col md={5}><Row>
            <Button
                onClick={e => { e.preventDefault(); sendReportMarks()}}
                disabled={reportMarksError}
            >{isSendingData ? <Loader message='Sending...' /> : 'Save'}
            </Button>
            <Button 
              hidden={!reportMarksError}
              variant='danger' style={{marginLeft: '2px'}}>{reportMarksError}
            </Button></Row>
      </Col>
      <Col md={4}>
        <Message variant='info'>
        <b>Report Marks: </b>
        <span>{selectedStudent.report_marks}</span>
    </Message>
      </Col>
    </Row>

    // const reportMarks = <Message variant='info'>
    //     <b>Report Marks: </b>
    //     <span>{selectedStudent.report_marks}</span>
    // </Message>
    
    const modalTitle2 = 'Academic and Field marks'
    const modalContent2 = <Row style={{width: '100%', }}>
        <Col md={3}>
          <FormControl
            placeholder="Enter academic marks"
            type="number"
            aria-label="Message Content"
            value={academicScore}
            aria-describedby="basic-addon2"
            onChange={e => { setAcademicMarksError(''); setAcademicScore(e.target.value)}}
            />
        </Col>
        <Col md={3}>
          <FormControl
            placeholder="Enter field marks"
            type="number"
            aria-label="Message Content"
            value={fieldScore}
            aria-describedby="basic-addon2"
            onChange={e => { setFieldMarksError(''); setFieldScore(e.target.value)}}
            />
        </Col>
        <Col md={5}>
            <Button
                onClick={e => { e.preventDefault(); sendAcademicAndFieldMarks()}}
                disabled={!academicScore && !fieldScore}
            >{isSendingData ? <Loader message='Sending...' /> : 'Save'}
            </Button>
            <Button 
              hidden={!academicMarksError && !fieldMarksError}
              variant='danger' style={{marginLeft: '2px'}}>{academicMarksError || fieldMarksError}
            </Button>
        </Col>
    </Row>
    
  const convertDataIntoFloat = (data) => {
       const convertedData = data.map(item => {
          return {
            ...item,  report_marks: parseFloat(item.report_marks),
              field_supervisor_marks: parseFloat(item.field_supervisor_marks),
              academic_supervisor_marks: parseFloat(item.academic_supervisor_marks)
          }
       })
      return convertedData;
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

  const checkDataTypes = (dataList) => {
      const reportMarksIsNaN = excelData.find(item => isNaN(item.report_marks) )
      const academicMarksIsNaN = excelData.find(item => isNaN(item.academic_supervisor_marks) )
      const fieldMarksIsNaN = excelData.find(item => isNaN(item.field_supervisor_marks))
    
      const reportMarksIsInvalid = excelData.find(item => (parseFloat(item.report_marks) > 100) || (parseFloat(item.report_marks) < 0) )
      const academicMarksIsInvalid = excelData.find(item => (parseFloat(item.academic_supervisor_marks) > 100) || (parseFloat(item.academic_supervisor_marks) < 0) )
      const fieldMarksIsInvalid = excelData.find(item => (parseFloat(item.field_supervisor_marks) > 100) || (parseFloat(item.field_supervisor_marks) < 0) )
    
      // if (!reportMarksIsNaN.report_marks && (!academicMarksIsNaN.academic_supervisor_marks && !fieldMarksIsNaN.field_supervisor_marks) ) {
      //   setExcelError(``)
      //   setExcelFile(null)
      //   return true
      // }
      // else
        if (reportMarksIsNaN && reportMarksIsNaN.report_marks) {
      // else if (!reportMarksIsNaN.undefined && reportMarksIsNaN) {
        setExcelError(`"${reportMarksIsNaN.registration_number}" has invalid "report_marks" => "${reportMarksIsNaN.report_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (academicMarksIsNaN && academicMarksIsNaN.academic_supervisor_marks) {
      // else if (!academicMarksIsNaN.undefined && academicMarksIsNaN) {
        setExcelError(`"${academicMarksIsNaN.registration_number}" has invalid "academic_marks" => "${academicMarksIsNaN.academic_supervisor_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (fieldMarksIsNaN && fieldMarksIsNaN.field_supervisor_marks) {
      // else if (!fieldMarksIsNaN.undefined && fieldMarksIsNaN) {
        setExcelError(`"${fieldMarksIsNaN.registration_number}" has invalid "field_marks" => "${fieldMarksIsNaN.field_supervisor_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (reportMarksIsInvalid && reportMarksIsInvalid.report_marks) {
      // else if (!fieldMarksIsNaN.undefined && fieldMarksIsNaN) {
        setExcelError(`"${reportMarksIsInvalid.registration_number}" has invalid "report_marks" => "${reportMarksIsInvalid.report_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (academicMarksIsInvalid && academicMarksIsInvalid.academic_supervisor_marks) {
      // else if (!fieldMarksIsNaN.undefined && fieldMarksIsNaN) {
        setExcelError(`"${academicMarksIsInvalid.registration_number}" has invalid "academic_marks" => "${academicMarksIsInvalid.academic_supervisor_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (fieldMarksIsInvalid && fieldMarksIsInvalid.field_supervisor_marks) {
      // else if (!fieldMarksIsNaN.undefined && fieldMarksIsNaN) {
        setExcelError(`"${fieldMarksIsInvalid.registration_number}" has invalid "field_marks" => "${fieldMarksIsInvalid.field_supervisor_marks}"`)
        setExcelFile(null)
        return false
      }
      else if (checkRegNo(excelData)) {
        setExcelError(`Registration number "${checkRegNo(excelData).registration_number}" is incorrect.`)
        setExcelFile(null)
        return false
      }
      else {
        setExcelError('')
        setExcelFile(null)
        return true
    }
  }

    const checkDataColumns = () => {
      const regNoIsMissing = excelData.find(item => !item.registration_number)
      const reportMarksIsMissing = excelData.find(item => !item.report_marks )
      const academicMarksIsMissing = excelData.find(item => !item.academic_supervisor_marks )
      const fieldMarksIsMissing = excelData.find(item => !item.field_supervisor_marks)
      
      if (!excelData.length) {
        setExcelError('Selected file has no data.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('registration_number'))) {
        setExcelError('"registration_number" column is missing or first row has no value for this column.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('report_marks'))) {
        setExcelError('"report_marks" column is missing or first row has no value for this column.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('academic_supervisor_marks'))) {
        setExcelError('"academic_supervisor_marks" column is missing or first row has no value for this column.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('field_supervisor_marks'))) {
        setExcelError('"field_supervisor_marks" column is missing or first row has no value for this column.')
        setExcelFile(null)
        return false
      }
      else if ((!regNoIsMissing && !reportMarksIsMissing) && (!fieldMarksIsMissing && !academicMarksIsMissing)) {
        return checkDataTypes(convertDataIntoFloat(excelData))
      }
      // else if ((regNoIsMissing && regNoIsMissing.hasOwnProperty('registration_number'))  && !regNoIsMissing.registration_number) {
      else if (regNoIsMissing && !regNoIsMissing.registration_number) {
      // else if (!regNoIsMissing.hasOwnProperty('undefined') && (regNoIsMissing && !regNoIsMissing.registration_number)) {
        setExcelError('Some data are missing registration number.')
        setExcelFile(null)
        return false
      }
      // else if (reportMarksIsMissing && reportMarksIsMissing.hasOwnProperty('report_marks') && !reportMarksIsMissing.report_marks) {
      else if (reportMarksIsMissing && !reportMarksIsMissing.report_marks) {
      // else if (!reportMarksIsMissing.undefined && (reportMarksIsMissing && !reportMarksIsMissing.report_marks)) {
        setExcelError(`"${reportMarksIsMissing.registration_number}" is missing "report_marks".`)
        setExcelFile(null)
        return false
      }
      // else if ((academicMarksIsMissing && academicMarksIsMissing.hasOwnProperty('academic_supervisor_marks')) && !academicMarksIsMissing.academic_supervisor_marks) {
      else if (academicMarksIsMissing && !academicMarksIsMissing.academic_supervisor_marks) {
        setExcelError(`"${academicMarksIsMissing.registration_number}" is missing "academic_supervisor_marks".`)
        setExcelFile(null)
        return false
      }
      // else if ((fieldMarksIsMissing && fieldMarksIsMissing.hasOwnProperty('field_supervisor_marks')) && !fieldMarksIsMissing.field_supervisor_marks) {
      else if (fieldMarksIsMissing && !fieldMarksIsMissing.field_supervisor_marks) {
        setExcelError(`"${fieldMarksIsMissing.registration_number}" is missing "field_supervisor_marks".`)
        setExcelFile(null)
        return false
      }
      else {
        return checkDataTypes(convertDataIntoFloat(excelData))
      }
  }
  
  const mergeResultArray = (data) => {
    let merged_array = [];
    
    for (let i = 0; i < studentsProfiles.length; i++){
      let obj = studentsProfiles[i];

      const hasOccured = data.find(item => item.registration_number === obj.registration_number)
      if (hasOccured) {
        obj = {
          ...obj, report_marks: hasOccured.report_marks,
          field_supervisor_marks: hasOccured.field_supervisor_marks,
          academic_supervisor_marks: hasOccured.academic_supervisor_marks
        }
        merged_array.push(obj)
      }
    }
    return merged_array;
  }

  const calculateMultipleAverageAndGrades = (dataList) => {
    let dataWithAverage = dataList.map(item => {
      return {...item, average_marks: ((item.report_marks + item.academic_supervisor_marks + item.field_supervisor_marks) / 3).toFixed(2)}
    })

    let dataWithGrades = dataWithAverage.map(item => {
      return {...item, marks_grade: calculateGrade(item.average_marks)}
    })

    const dataWithoutFieldReport = dataWithGrades.map(item => {
      let { field_report,
        week_1_logbook,
        week_2_logbook,
        week_3_logbook,
        week_4_logbook,
        week_5_logbook,
        week_6_logbook,
        week_7_logbook,
        week_8_logbook,
        week_9_logbook,
        week_10_logbook,
        ...rest } = item;
      return rest
    })
    return dataWithoutFieldReport
  }

  const sendUploadedResults = async () => {
    const isDataCorrectFetched = checkDataColumns()

    if(isDataCorrectFetched) {
      setIsSendingExcelData(true)
      let payloads = mergeResultArray(convertDataIntoFloat(excelData))
      payloads = calculateMultipleAverageAndGrades(payloads)
      try {
        const responses = await editMultipleStudentsProfiles(payloads, config)
        console.log(responses.length)
        fetchStudentsProfiles()
        setExcelData([])
        setExcelFile(null)
        setIsSendingExcelData(false)
        setModalShow3(false)
      } catch (error) {
        console.log('Sending Uploaded Field marks ', error.response.data)
        setIsSendingExcelData(false)
        setExcelError('Some Error Occured.')
      }
    }
    
  }
  
  const fileValidator = (e) => {
    const allowedDocFormats = /(\.xlsx)$/i;
    const uploadedFile = e.target.files[0]
    
    if (!uploadedFile) {
      setExcelError('No file selected')
      setExcelFile(null)
      return false
    }
    else if (!allowedDocFormats.exec(uploadedFile.name)) {
      setExcelError('Unsurpoted File Type. Only excel file is allowed')
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
        //  walk through each sheet to read ??? by default, only the first table is read ???
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
        console.log(' incorrect file type ???');
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
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={displayArray}
                pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                column={{ ellipsis: true }} /> </>
          }
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
            { reportMarksForm}
            {/* {selectedStudent.report_marks ? reportMarks : reportMarksForm} */}
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
