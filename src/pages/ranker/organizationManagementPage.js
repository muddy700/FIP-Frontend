import React, {useState} from 'react'
import { Card, Button, Col, Form, Row, Alert } from 'react-bootstrap'
import Message from '../../components/message'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { useSelector, useDispatch}  from 'react-redux'
import { createOrganizationProfile, createUser, createUserProfile } from '../../app/api';
import Loader from '../../components/loader';
import ContentModal from '../../components/contentModal';

const OrganizationManagementPage = () => {

    const initialOrganizationInfo = {
        username: '',
        email: '',
        password: '',
        password2: ''
    }

    const config = useSelector(apiConfigurations)
    const [organizationInfo, setOrganizationInfo] = useState(initialOrganizationInfo)
    const [organizationInfoErrorMessage, setOrganizationInfoErrorMessage] = useState('')
    const [isSendingOrganizationInfo, setisSendingOrganizationInfo] = useState(false)
    const [hasOrganizationCreated, setHasOrganizationCreated] = useState(false)
    const [modalShow, setModalShow] = useState(false)

    const handleOrganizationInfoChanges = (e) => {
        setOrganizationInfoErrorMessage('')
        setHasOrganizationCreated(false)
        setHasOrganizationCreated(false)
        setOrganizationInfo({
            ...organizationInfo,
            [e.target.name] : e.target.value
        })
    }

    const organizationInfoValidator = () => {
        if (organizationInfo.username === '') {
            setOrganizationInfoErrorMessage('Username Cannot Be Blank!')
            return false
        }
        else if (organizationInfo.email === '') {
            setOrganizationInfoErrorMessage('Email Cannot Be Blank!')
            return false
        }
        else if (organizationInfo.password === '') {
            setOrganizationInfoErrorMessage('Password Cannot Be Blank!')
            return false
        }
        else if (organizationInfo.password.length < 6) {
            setOrganizationInfoErrorMessage('Enter Atleast Six Characters')
            return false
        }
        else if (organizationInfo.password2 === '') {
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
            organization_id: organizationId
        }
        try {
            const response3 = await createOrganizationProfile(payload3, config)
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

    const createOrganizationAccount = async (e) => {
        e.preventDefault()
        const isOrganizationFormValid = organizationInfoValidator()

        if (isOrganizationFormValid) {
            setisSendingOrganizationInfo(true)
            const { password2, ...payload1 } = organizationInfo
            try {
                const response1 = await createUser(payload1)
                // console.log(response1)
                const payload2 = {
                    user: response1.user.id,
                    designation: 8
                }

                try {
                    const response2 = await createUserProfile(payload2, config)
                    addOrganizationProfile(response1.user.id)
                } catch (error) {
                    console.log('Create Organization Profile Account ', error.response.data)
                    setisSendingOrganizationInfo(false)
                    setOrganizationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again.')
                }
            } catch (error) {
                console.log('Create Organization Account ', error.response.data)
                setisSendingOrganizationInfo(false)
                setOrganizationInfoErrorMessage('Ooops...!, Some Error Occured. Try Again.')
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
                <Form.Group as={Col} controlId="formGridPassword1">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={organizationInfo.username}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter username"
                        autoFocus />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword1">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={organizationInfo.email}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter email"
                    />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridPassword2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={organizationInfo.password}
                        onChange={handleOrganizationInfoChanges}
                        placeholder="Enter Password" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword3">
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
