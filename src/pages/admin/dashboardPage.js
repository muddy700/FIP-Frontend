import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Table, Button, Form, FormControl } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import { editFieldInfo, getFieldInfo } from '../../app/api'
import Message from '../../components/message'
import DataPlaceHolder from '../../components/dataPlaceHolder'
import Loader from '../../components/loader'
import ContentModal from '../../components/contentModal'

export const DashboardPage = () => {
    const initialInfo = {
        start_date: '',
        number_of_weeks: '',
    }

    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const currentDate = new Date().toLocaleDateString()
    const [fieldData, setFieldData] = useState({})
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [fieldChanges, setFieldChanges] = useState(initialInfo)
    const [formError, setFormError] = useState('')
    const [isSendingData, setIsSendingData] = useState(false)
    const [showModal, setShowModal] = useState(false)
        
    const fetchFieldData = async () => {
        setIsFetchingData(true)
      try {
        const response = await getFieldInfo(config)
        setFieldData(response[0])
        setIsFetchingData(false)
      } catch (error) {
        setIsFetchingData(false)
        console.log({ 'Error => ': error.response.data })
      }
    }

    useEffect(() => {
      fetchFieldData();
     // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const prepareForm = () => {
        setShowModal(true)
        setFieldChanges(fieldData)
    }

    const handleFieldChanges = (e) => {
        setFormError('')
        setFieldChanges({
            ...fieldChanges,
            [e.target.name] : e.target.value
        })
    }

    const fieldChangesValidator = () => {
        if (!fieldChanges.start_date) {
            setFormError('Select start date.')
            return false;
        }
        else if (!fieldChanges.number_of_weeks) {
            setFormError('Enter number of weeks.')
            return false;
        }
        else if (fieldChanges.number_of_weeks <= 0 || fieldChanges.number_of_weeks > 15) {
            setFormError('Enter a valid number of weeks.')
            return false;
        }
        else {
            setFormError('')
            return true
        }
    }

    const sendFieldInfo = async (e) => {
        e.preventDefault()
        const isFormValid = fieldChangesValidator()

        if (isFormValid) {
            setIsSendingData(true)
            const {last_date_year_of_study_changed, ...rest} = fieldData
            const payload = {
                ...rest,
                start_date: fieldChanges.start_date,
                number_of_weeks: fieldChanges.number_of_weeks
            }
            try {
                const response = await editFieldInfo(payload, config)
                setFieldData(response)
                setFieldChanges(initialInfo)
                setIsSendingData(false)
                setShowModal(false)
            } catch (error) { 
                console.log('Sending Field Info, ', error.response.data)
                setIsSendingData(false)
                setFormError('Ooops some error occured.Try again.')
            }
        }
        else {
            console.log('Field Info Form Is Not Valid')
        }
    }

    const modalTitle = 'Fill the form below correctly.'
    const modalForm = 
                    <Form onSubmit={sendFieldInfo}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="InternshipPostInput21">
                                <Form.Label>Start date</Form.Label>
                                <FormControl
                                    placeholder="Start date"
                                    type="date"
                                    aria-label="Message Content"
                                    name="start_date"
                                    value={fieldChanges.start_date}
                                    aria-describedby="basic-addon2"
                                    onChange={handleFieldChanges}
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="InternshipPostInput22">
                                <Form.Label>Number of weeks</Form.Label>
                                <FormControl
                                    placeholder="Enter number of weeks"
                                    type="number"
                                    aria-label="Message Content"
                                    name='number_of_weeks'
                                    value={fieldChanges.number_of_weeks}
                                    aria-describedby="basic-addon2"
                                    onChange={handleFieldChanges}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Button 
                                type="submit" 
                                style={{ float: 'right' }}
                                >{isSendingData ? <Loader message='Sending...' /> : 'Save'}</Button>
                            <Button
                                style={{marginLeft: '16px'}}
                                hidden={!formError}
                                variant='danger'
                                > {formError}</Button>
                        </Form.Row>
                    </Form>
    // </
    
    return (
        <Card className="dashboard-container">
            <Card.Header>
                <Row>
                    <Col md={4}>Logged In As: {user.first_name.toUpperCase()} {user.last_name.toUpperCase()} </Col>
                    <Col md={{span: 2, offset:6}} xs={{span: 6}}>{ currentDate }</Col>
                </Row>
            </Card.Header>
            <Card.Body style={{marginTop: '20px'}}>
                <Row>
                    <h3>Field Info</h3>
                </Row>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Row>
                            <Button onClick={e => { e.preventDefault(); prepareForm()}}>Change</Button>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td className="post-properties">Starting date</td>
                                        <td>{fieldData.start_date ? fieldData.start_date : 'Not set'} </td>
                                    </tr>
                                    <tr>
                                        <td className="post-properties">Number of weeks</td>
                                        <td>{fieldData.number_of_weeks ? fieldData.number_of_weeks: 'Not set'} </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Row></>}
                
                    <ContentModal
                        show={showModal}
                        isTable={false}
                        title={modalTitle}
                        content={modalForm}
                        onHide={() => setShowModal(false)}
                    />
            </Card.Body>
        </Card>
    )
}
