import React, {useState, useEffect} from 'react'
import { Card, Button, Col, Form, Row, Alert } from 'react-bootstrap'
import { apiConfigurations} from '../../slices/userSlice';
import { useSelector}  from 'react-redux'
import { createOrganizationProfile, createUser, createUserProfile, editUserInfo, FetchRegions, getOrganizationProfiles } from '../../app/api';
import Loader from '../../components/loader';
import ContentModal from '../../components/contentModal';
import DataPlaceHolder from '../../components/dataPlaceHolder'
import Message from '../../components/message'
import { Table} from 'antd';


const OrganizationManagementPage = () => {
  const [page, setPage] = useState(1)

  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Name:',
    dataIndex: 'organization_name',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Address',
    dataIndex: 'box_address',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Email',
    dataIndex: 'organization_email',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
  {
    title: 'Region',
    dataIndex: 'region',
    key: 'id',
    // ellipsis: 'true',
    render: text => <>{text}</>,
  },
//   {
//     title: 'Phone',
//     dataIndex: 'phone_number',
//     key: 'id',
//     // ellipsis: 'true',
//     render: text => <>{text}</>,
//   },
//   {
//     title: 'Year of study',
//     dataIndex: 'year_of_study',
//     key: 'id',
//     // ellipsis: 'true',
//     render: text => <>{text}</>,
//   },
//   {
//     title: 'Program',
//     dataIndex: 'degree_program',
//     key: 'id',
//     // ellipsis: 'true',
//     render: text => <>{text}</>,
//   },
//   {
//     title: 'Department',
//     dataIndex: 'department_name',
//     key: 'id',
//     // ellipsis: 'true',
//     render: text => <>{text}</>,
//   },
//   {
//     title: 'Status',
//     key: 'id',
//     // ellipsis: 'true',
//     dataIndex: 'student_status',
//     render: text => <Tag color={text ? 'green' : 'red'}>{text ? 'Inprogress' : 'Discontinue'}</Tag>,
//   },
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

    const initialOrganizationInfo = {
        // username: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: '',
        region: ''
    }

    const config = useSelector(apiConfigurations)
    const [organizationInfo, setOrganizationInfo] = useState(initialOrganizationInfo)
    const [organizationInfoErrorMessage, setOrganizationInfoErrorMessage] = useState('')
    const [isSendingOrganizationInfo, setisSendingOrganizationInfo] = useState(false)
    const [hasOrganizationCreated, setHasOrganizationCreated] = useState(false)
    const [modalShow, setModalShow] = useState(false)
    const [allOrganizations, setAllOrganizations] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [regions, setRegions] = useState([])

    const fetchAllOrganizations = async () => {
      setIsFetchingData(true)
      try {
          const list = await getOrganizationProfiles(config)
          setAllOrganizations(list)
          fetchAllRegions()
      } catch (error) {
          setIsFetchingData(false)
            console.log({
                'Request': 'Getting Organizations Profiles Request',
                'Error => ' : error.response.data,
            })
        }
    }

    const fetchAllRegions = async () => {
      try {
          const response = await FetchRegions()
        //   console.log(response)
          setRegions(response.regions)
        setIsFetchingData(false)
      } catch (error) {
          setIsFetchingData(false)
            console.log({
                'Request': 'Getting All Regions Request',
                'Error => ' : error,
            })
        }
    }

    useEffect(() => {
      fetchAllOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const handleOrganizationInfoChanges = (e) => {
        setOrganizationInfoErrorMessage('')
        setHasOrganizationCreated(false)
        // setHasOrganizationCreated(false)
        setOrganizationInfo({
            ...organizationInfo,
            [e.target.name] : e.target.value
        })
    }

    const organizationInfoValidator = () => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const emailResult = re.test(organizationInfo.email)
        // if (organizationInfo.username === '') {
        //     setOrganizationInfoErrorMessage('Username Cannot Be Blank!')
        //     return false
        // }
        if (!organizationInfo.email) {
            setOrganizationInfoErrorMessage('Email Cannot Be Blank!')
            return false
        }
        else if (!emailResult) {
            setOrganizationInfoErrorMessage('Enter a valid email')
            return false;
        }
        else if (!organizationInfo.region) {
            setOrganizationInfoErrorMessage('Region Cannot Be Blank!')
            return false;
        }
        else if (!organizationInfo.first_name) {
            setOrganizationInfoErrorMessage('Alias Cannot Be Blank!')
            return false
        }
        else if (!organizationInfo.last_name) {
            setOrganizationInfoErrorMessage('Full Name Cannot Be Blank!')
            return false
        }
        else if (!organizationInfo.password) {
            setOrganizationInfoErrorMessage('Password Cannot Be Blank!')
            return false
        }
        else if (organizationInfo.password.length < 6) {
            setOrganizationInfoErrorMessage('Enter Atleast Six Characters')
            return false
        }
        else if (!organizationInfo.password2) {
            setOrganizationInfoErrorMessage('Re-Enter Password')
            return false
        }
        else if (organizationInfo.password !== organizationInfo.password2) {
            setOrganizationInfoErrorMessage('Passwords Did Not Match.')
            return false
        }
        else {
            setOrganizationInfoErrorMessage('')
            return true
        }
    }

    const addOrganizationProfile = async (organizationId) => {
        const payload3 = {
            organization_id: organizationId,
            region: organizationInfo.region
        }
        try {
            const response3 = await createOrganizationProfile(payload3, config)
            console.log(response3.length)
            setAllOrganizations([...allOrganizations, response3])
                  setisSendingOrganizationInfo(false)
                  setOrganizationInfo(initialOrganizationInfo)
                  setHasOrganizationCreated(true)
                  setModalShow(false)
        } catch (error) {
            console.log('Create Organization Profile ', error.response.data)
            setisSendingOrganizationInfo(false)
            setOrganizationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again.')
        }
    }

    const addAliasAndFullName = async (userData) => {
        let { password, ...rest } = userData.user
        const payload3 = {
            ...rest, first_name: organizationInfo.first_name,
            last_name: organizationInfo.last_name
        }
        try {
            const response3 = await editUserInfo(payload3, config)
            console.log(response3.length)
        } catch (error) {
            console.log('Adding Organization Alias And Full name ', error.response.data)
            setisSendingOrganizationInfo(false)
        }
    }

    const createOrganizationAccount = async (e) => {
        e.preventDefault()
        const isOrganizationFormValid = organizationInfoValidator()

        if (isOrganizationFormValid) {
            setisSendingOrganizationInfo(true)
            // console.log(organizationInfo)
            const { password2, ...rest } = organizationInfo
            let payload1 = {...rest, username: organizationInfo.email}
            try {
                const response1 = await createUser(payload1)
                // console.log(response1)
                addAliasAndFullName(response1)
                const payload2 = {
                    user: response1.user.id,
                    designation: 8
                }

                try {
                    const response2 = await createUserProfile(payload2, config)
                console.log(response2.length)
                    addOrganizationProfile(response1.user.id)
                } catch (error) {
                    console.log('Create Organization Profile Account ', error.response.data)
                    setisSendingOrganizationInfo(false)
                    setOrganizationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again.')
                }
            } catch (error) {
                console.log('Create Organization Account ', error.response.data)
                setisSendingOrganizationInfo(false)
                if (error.response.data.username) {
                    setOrganizationInfoErrorMessage('An email already exists.')
                }
                else {
                    setOrganizationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again.')
                }
            }
        }
        else {
            console.log('Organization Info Form Is Not Valid')
        }
    }

    const modalTitle = 'Fill Organization Info'
    const modalContent = 
        <Form onSubmit={e => createOrganizationAccount(e)}>
            <Form.Row>
                {/* <Form.Group as={Col} controlId="formGridPassword1">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={organizationInfo.username}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter username"
                        autoFocus />
                </Form.Group> */}
                <Form.Group as={Col} controlId="formGridPassword1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="text"
                        name="email"
                        value={organizationInfo.email}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter email"
                    />
                </Form.Group>
                    <Form.Group as={Col} controlId="InternshipPostInput17">
                        <Form.Label>Region</Form.Label>
                        <Form.Control as="select"
                            size="md"
                            value={organizationInfo.region}
                            onChange={handleOrganizationInfoChanges}
                            name="region">
                            <option value={null}>---Select Region---</option>
                            {/* {genders && genders.map(skill => ( */}
                            {regions.map(item => (
                                <option value={item}>{item} </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword2">
                    <Form.Label>Alias</Form.Label>
                    <Form.Control
                        type="text"
                        name="first_name"
                        value={organizationInfo.first_name}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter alias"
                        autoFocus />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="last_name"
                        value={organizationInfo.last_name}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter organization full name"
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={organizationInfo.password}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter Password" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword5">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password2"
                        value={organizationInfo.password2}
                        onChange={handleOrganizationInfoChanges}
                        placeholder=" Re-Enter Password" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Button
                    type=""
                    variant='danger'
                    hidden={organizationInfoErrorMessage === '' ? true : false}
                    style={{ width: '100%' }}
                >{organizationInfoErrorMessage}</Button>
            </Form.Row>
            <Form.Row >
                <Button variant="primary" type="submit">
                    {isSendingOrganizationInfo ?
                        <Loader message="Creating Account..." /> : 'Create'}
                </Button>
            </Form.Row>
        </Form>
    

    return (
        <Card style={{padding: '2% 5%'}}>
            {/* <h1>Manage organization Here</h1> <hr  */}
            <Row>
                <Button
                    md={3}
                    onClick={e => { e.preventDefault(); setModalShow(true); setHasOrganizationCreated(false)}}
                    >Add Organization
                </Button>
            </Row>
            <Row style={{paddingTop: '2%'}}>
                 <Alert
                    onClose={() => setHasOrganizationCreated(false)}
                    dismissible
                    variant='success'
                    style={{textAlign: 'center'}}
                    hidden={!hasOrganizationCreated}
                >Organization Created Successfull.</Alert>
            </Row>
            
            <Card.Body style={{ overflowX: 'scroll' }}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              <Table
                columns={columns}
                dataSource={allOrganizations}
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
        </Card>
    )
}

export default OrganizationManagementPage
