import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Tag, Table} from 'antd';
import { Button, Row, Col, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import { getAllStudents } from '../../app/api';
import { apiConfigurations} from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import XLSX from 'xlsx';

function StudentsManagementsPage() {
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
    title: 'First Name',
    dataIndex: 'first_name',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Phone',
    dataIndex: 'phone_number',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Year of study',
    dataIndex: 'year_of_study',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Program',
    dataIndex: 'degree_program',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Department',
    dataIndex: 'department_name',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Status',
    key: 'id',
    // ellipsis: 'true',
    dataIndex: 'student_status',
    render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'Inprogress' : 'Discontinue'}</Tag>,
  },
  // {
  //   title: 'Action',
  //   // ellipsis: 'true',
  //   key: 'action',
  //   render: (text, record) => (
  //     <Space size="middle">
  //           <span>no action</span>
  //     </Space>
  //   ),
  // },
    ];

    // const excelFormat = [
    //     {
    //         registration_number: 'T/UDOM/2018/06411',
    //         first_name: 'MOHAMED',
    //         last_name: 'MFAUME',
    //         email: 'muddymfaume700@gmail.com',
    //         phone_number: '0717963697',
    //         year_of_study: '3',
    //         degree_program: '5',
    //         department: '2'
    //     },
    // ]

    const config = useSelector(apiConfigurations)
    const [allStudents, setAllStudents] = useState([])
    const [modalShow, setModalShow] = useState(false);
    const [excelFile, setExcelFile] = useState(null)
    const [excelError, setExcelError] = useState('')
    const [excelData, setExcelData] = useState([])
    const [isSendingExcelData, setIsSendingExcelData] = useState(false)

    const fetchAllStudents = async () => {
        try {
            const studentsList = await getAllStudents(config)
          const valid_data = studentsList.map(item => {
            return {...item, registration_number: item.registration_number.replaceAll('-', '/')}
          })
            setAllStudents(valid_data)
        } catch (error) {
            console.log({
                'Request': 'Getting All Students Profiles Request',
                'Error => ' : error.response.data,
            })
        }

    }

    useEffect(() => {
      fetchAllStudents();
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

      const checkDataTypes = (dataList) => {
      const reportMarksIsNaN = excelData.find(item => isNaN(item.report_marks) )
      const academicMarksIsNaN = excelData.find(item => isNaN(item.academic_supervisor_marks) )
      const fieldMarksIsNaN = excelData.find(item => isNaN(item.field_supervisor_marks))
    
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
    //   else if (checkRegNo(excelData)) {
    //     setExcelError(`Registration number "${checkRegNo(excelData).registration_number}" is incorrect.`)
    //     setExcelFile(null)
    //     return false
    //   }
      else {
        setExcelError('')
        setExcelFile(null)
        return true
    }
    }
    
    const checkDataColumns = () => {
      const regNoIsMissing = excelData.find(item => !item.registration_number)
      const fnameIsMissing = excelData.find(item => !item.first_name)
      const lnameIsMissing = excelData.find(item => !item.last_name)
      const emailIsMissing = excelData.find(item => !item.email)
      const phoneIsMissing = excelData.find(item => !item.phone_number)
      const yearIsMissing = excelData.find(item => !item.year_of_study)
      const programIsMissing = excelData.find(item => !item.degree_program)
      const departmentIsMissing = excelData.find(item => !item.department)
      
      if (!excelData.length) {
        setExcelError('Selected file has no data.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('registration_number'))) {
        setExcelError('"registration_number" column is missing.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('first_name'))) {
        setExcelError('"first_name" column is missing.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('last_name'))) {
        setExcelError('"last_name" column is missing.')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('email'))) {
        setExcelError('"email" column is missing')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('phone_number'))) {
        setExcelError('"phone_number" column is missing')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('year_of_study'))) {
        setExcelError('"year_of_study" column is missing')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('degree_program'))) {
        setExcelError('"degree_program" column is missing')
        setExcelFile(null)
        return false
      }
      else if (!(excelData[0].hasOwnProperty('department'))) {
        setExcelError('"department" column is missing')
        setExcelFile(null)
        return false
      }
      else if ((!regNoIsMissing && !fnameIsMissing && !phoneIsMissing && !programIsMissing) && (!lnameIsMissing && !emailIsMissing && !yearIsMissing && !departmentIsMissing)) {
          return checkDataTypes(excelData)
      }
      else if ((regNoIsMissing && regNoIsMissing.hasOwnProperty('registration_number'))  && !regNoIsMissing.registration_number) {
        setExcelError('Some data are missing registration number.')
        setExcelFile(null)
        return false
      }
      else if ((fnameIsMissing && fnameIsMissing.hasOwnProperty('first_name'))  && !fnameIsMissing.first_name) {
        setExcelError(`"${fnameIsMissing.registration_number}" is missing "first_name".`)
        setExcelFile(null)
        return false
      }
      else {
        return checkDataTypes(excelData)
      }
    }
    
    const sendUploadedStudents = async () => {
    const isDataCorrectFetched = checkDataColumns()

    if(isDataCorrectFetched) {
      setIsSendingExcelData(true)
    //   let payloads = mergeResultArray(convertDataIntoFloat(excelData))
      try {
          console.log(excelData)
        // const responses = await editMultipleStudentsProfiles(payloads, config)
        // fetchStudentsProfiles()
        // setExcelData([])
        // setExcelFile(null)
        // setIsSendingExcelData(false)
        // setModalShow3(false)
      } catch (error) {
        console.log('Sending Uploaded Students List ', error.response.data)
        setIsSendingExcelData(false)
      }
    }

    }

  const modalTitle = 'Instructions'
  const modalContent = <>
    <Row style={{paddingLeft: '2%'}}>
      <span>Upload an excel that has been formatted as the template given.</span>
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
        onClick={e => { e.preventDefault(); sendUploadedStudents()}}
    >{isSendingExcelData ? <Loader message='Uploading...' /> : 'Send'}</Button>
        </Col>
    </Row></>

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >List of all students</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                {/* <Row style={{marginBottom: '16px'}}>
                    <StudentsExport studentsList={excelFormat}/> &nbsp; &nbsp;
                    <Button onClick={e => { e.preventDefault(); setModalShow(true)}}>Upload Students List</Button> &nbsp; &nbsp;
                </Row> */}
                <Table
                    columns={columns}
                    dataSource={allStudents}
                    pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
                    column={{ ellipsis: true }} />
       </Card.Body>
        <ContentModal //For Uploading Students Marks
        show={modalShow}
        isTable={false}
        title={modalTitle}
        content={modalContent}
            onHide={() => { setModalShow(false); setExcelFile(null); setExcelError('')}}
        />
        </Card>
    )
}

export default StudentsManagementsPage