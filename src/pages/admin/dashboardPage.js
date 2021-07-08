import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Form, FormControl, Button } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations,
    //  selectUserData 
    } from '../../slices/userSlice'
import Loader from '../../components/loader'
import { addMultipleChoices, addQuestion, getProfessions } from '../../app/api'

export const DashboardPage = () => {
    const initialQuestion = {
        question_body: '',
        profession: ''
    }

    const initialChoice = {
        question: '',
        choice: '',
        isCorrect: ''
    }

    // const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    // const currentDate = new Date().toLocaleDateString()
    const [professions, setprofessions] = useState([])
    const [selectedProfession, setselectedProfession] = useState(null)
    const [questionInfo, setQuestionInfo] = useState(initialQuestion)
    const [c1, setc1] = useState(initialChoice)
    const [c2, setc2] = useState(initialChoice)
    const [c3, setc3] = useState(initialChoice)
    const [c4, setc4] = useState(initialChoice)
    const [isSendingData, setIsSendingData] = useState(false)
    const [formError, setformError] = useState('')

      const fetchProfessions = async () => {
        try {
          const response = await getProfessions(config)
          setprofessions(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Professions Request',
                'Error => ': error
            })
        }
    }

    useEffect(() => {
    //   fetchInternshipPosts()
      fetchProfessions()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const questionFormValidator = () => {
        //do some
        if (!selectedProfession) {
            setformError('Select Profession')
            return false
        }
        else if (!questionInfo.question_body) {
            setformError('Enter question')
            return false
        }
        else if (!c1.choice) {
            setformError('Enter Correct Choice')
            return false
        }
        else if (!c2.choice) {
            setformError('Enter Second Choice')
            return false
        }
        else if (!c3.choice) {
            setformError('Enter Third Choice')
            return false
        }
        else if (!c4.choice) {
            setformError('Enter Fourth Choice')
            return false
        }
        else {
            setformError('')
            return true
        }
    }

    const sendQuestion = async (e) => {
        e.preventDefault()
        const isFormValid = questionFormValidator()

        if (isFormValid) {
            setIsSendingData(true)
            const payload = {...questionInfo, profession: selectedProfession}
            try {
                const response = await addQuestion(payload, config)
                sendMultipleChoices(response.id)
            }
            catch (error) {
                console.log('sending Question ', error.response.data )
            }
        }
        else {
            console.log('Form Is Not Valid')
        }
    }

    const sendMultipleChoices = async (qId) => {

        const payloads = [
            { ...c1, question: qId },
            { ...c2, question: qId },
            { ...c3, question: qId },
            { ...c4, question: qId },]
        try {
            const responseArray = await addMultipleChoices(payloads, config)
            console.log(responseArray)
            // setselectedProfession(null)
            setQuestionInfo(initialQuestion)
            setc1(initialChoice)
            setc2(initialChoice)
            setc3(initialChoice)
            setc4(initialChoice)
            setIsSendingData(false)
        } catch (error) {
            console.log('sending Multiple Choices ', error.response.data )
        }
    }

    return (
        <Card className="dashboard-container">
            <Card.Header>
                <Row>
                    <h3>Question Form</h3>
                </Row>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={sendQuestion}>
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput1">
          <Form.Label>Profession</Form.Label>
          <Form.Control as="select"
              size="md"
              value={selectedProfession}
              onChange={e => { e.preventDefault(); setselectedProfession(e.target.value); setformError('') }}
              name="profession">
              <option value={null}>---Select Profession---</option>
              {professions.map(skill => (
                <option value={skill.id}>{skill.profession_name} </option>
              ))}
          </Form.Control>
        </Form.Group>
                    </Form.Row>
                    
        <Form.Row>
          <Form.Group as={Col} controlId="InternshipPostInput3">
          <Form.Label>Question Body</Form.Label>
            <FormControl as="textarea"
                placeholder="Enter question body"
                type="text"
                aria-label="Message Content"
                name="post_description"
                value={questionInfo.question_body}
                aria-describedby="basic-addon2"
                onChange={e => { e.preventDefault(); setQuestionInfo({ ...questionInfo, question_body: e.target.value }); setformError('') }}
            />
          </Form.Group>
      </Form.Row>
                    
        <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Correct Choice</Form.Label>
          <FormControl
            placeholder="Enter Correct Choice"
            type="text"
            aria-label="Message Content"
            value={c1.choice}
            aria-describedby="basic-addon2"
            onChange={e => { e.preventDefault(); setc1({ ...c1, choice: e.target.value, isCorrect: true}); setformError('') }}
            />
          </Form.Group>
         {/* </Form.Row> */}
                    
        {/* <Form.Row> */}
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Second Choice</Form.Label>
          <FormControl
            placeholder="Enter Choice"
            type="text"
            aria-label="Message Content"
            value={c2.choice}
            aria-describedby="basic-addon2"
            onChange={e => { e.preventDefault(); setc2({ ...c2, choice: e.target.value, isCorrect: false}) ; setformError('')}}
            />
          </Form.Group>
         </Form.Row>
                    
        <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Third Choice</Form.Label>
          <FormControl
            placeholder="Enter Choice"
            type="text"
            aria-label="Message Content"
            value={c3.choice}
            aria-describedby="basic-addon2"
            onChange={e => { e.preventDefault(); setc3({ ...c3, choice: e.target.value, isCorrect: false}); setformError('') }}
            />
          </Form.Group>
        {/* </Form.Row> */}
        {/* <Form.Row> */}
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Fourth Choice</Form.Label>
          <FormControl
            placeholder="Enter Choice"
            type="text"
            aria-label="Message Content"
            value={c4.choice}
            aria-describedby="basic-addon2"
            onChange={e => { e.preventDefault(); setc4({ ...c4, choice: e.target.value, isCorrect: false}) ; setformError('')}}
            />
          </Form.Group>
        </Form.Row>
    <Form.Row>
    <Button
        hidden={!formError}
        variant='danger'
        style={{width: '70%', marginRight: '5%'}}
    >{formError}</Button>
     <Button
        type="submit"
       >{isSendingData ? <Loader message='sending...!' /> : 'Send'} </Button>
        </Form.Row>
        
                    </Form>
            </Card.Body>
        </Card>
    )
}
