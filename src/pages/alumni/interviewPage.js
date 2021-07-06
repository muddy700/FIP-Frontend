import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { Card, Button, Modal, Form } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import { useHistory, useParams } from "react-router-dom";
import DataPlaceHolder from '../../components/dataPlaceHolder';
import { getInterviewQuestions, getInterviewQuestionChoices, sendInternshipApplication } from '../../app/api'

export const InterviewPage = () => {

    const history = useHistory();
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const params = useParams()
    const { postId, professionId, organizationId } = params

    const [showModal, setShowModal] = useState(true)
    const [marks, setMarks] = useState(0)
    const [questions, setQuestions] = useState([])
    const [activeQuestion, setActiveQuestion] = useState({})
    const [attemptedQuestions, setAttemptedQuestions] = useState([])
    const [questionChoices, setQuestionChoices] = useState([])
    const [selectedChoice, setSelectedChoice] = useState('')
    const [applicantAnswers, setApplicantAnswers] = useState([])
    const [isTestDone, setisTestDone] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [isFetchingMultipleChoices, setIsFetchingMultipleChoices] = useState(false)
    // const [timer, setTimer] = useState(60)

    const goToPreviousPage = () => {
        history.goBack()

        setSelectedChoice('')
        setQuestions([])
        setAttemptedQuestions([])
        setApplicantAnswers([])
        setQuestionChoices([])
        setActiveQuestion({})
        setMarks(0)
        setisTestDone(false)
    }
    
    // var seconds = 10;

    // setInterval(() => {
    //     // changeQuestions()
    // }, 1000 * 60);

    const findMarks = () => {
        const correctAnswers = applicantAnswers.filter((answer) => answer.choice === 'true')
        var score = 0;
        if (selectedChoice === 'true') {
            score = (correctAnswers.length + 1) * 20;
            setMarks(score)
        }
        else {
            score = correctAnswers.length * 20;
            setMarks(score)
        }
        saveInternshipApplication(score)
    }

    const changeQuestions = () => {

        const answer = {
            alumni: user.userId,
            question: activeQuestion.id,
            post: postId,
            choice: selectedChoice
        }
        setApplicantAnswers([...applicantAnswers, answer])

        if (attemptedQuestions.length === 5) {
            setShowModal(false)
            findMarks();
        }
        else {
            setSelectedChoice(false)
            var qn = questions[Math.floor(Math.random() * questions.length)]
            const hasAttempted = attemptedQuestions.find(item => item.id === qn.id)
            
            if (hasAttempted) {
                changeQuestions()
            }
            else {
                setActiveQuestion(qn)
                setAttemptedQuestions([...attemptedQuestions, qn])
            }
        }
    }

    const handleApplicantAnswers = (e) => {
        setSelectedChoice(e.target.value)
    }
    
    const fetchQuestions = async () => {
        setIsFetchingData(true)
        try {
            const response = await getInterviewQuestions(professionId, config)
            setQuestions(response)
            var qn = response[Math.floor(Math.random() * response.length)]
            setActiveQuestion(qn)
            setAttemptedQuestions([...attemptedQuestions, qn])
            setIsFetchingData(false)
            
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'request': 'Fetch Interview Questions Request',
                'Error => ': error
            }) }
    }

    const fetchQuestionChoices = async () => {
        setIsFetchingMultipleChoices(true)
        try {
            const response = await getInterviewQuestionChoices(activeQuestion.id, config)
            setQuestionChoices(response)
            setIsFetchingMultipleChoices(false)
        } catch (error) {
            setIsFetchingMultipleChoices(false)
            console.log({
                'request': 'Fetch Question Choices Request',
                'Error => ': error
            }) }
    }

    const saveInternshipApplication = async (score) => {

        const payload = {
            alumni: user.userId,
            post: postId,
            test_marks: score,
            organization: organizationId
        }

        try {
            const response = await sendInternshipApplication(payload, config)
            console.log(response.length)
            setisTestDone(true)
        } catch (error) {
            console.log({
                'request': 'Send Applicant Scores Request',
                'Error => ': error
            }) }
    }

    useEffect(() => {
        fetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [professionId])

    useEffect(() => {
        fetchQuestionChoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions.length ? activeQuestion.id : '' ])

    return (
        <Card className="">
            {isTestDone ?
                <h1>{marks >= 50 ? 'Congratulations, You Got ' : 'Your Marks For The Test Is '}  {marks}% </h1>
                : ''}
            <Card.Body>
                <Modal
                    show={showModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                    <Modal.Header >
                        <Modal.Title id="contained-modal-title-vcenter">{questions.length ? <>
                            <b>{activeQuestion ? attemptedQuestions.length + '. ' : ''} </b>
                           {activeQuestion ? activeQuestion.question_body : 'No questions yet'} </>:
                            <span>Ooops...!</span> }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        {isFetchingMultipleChoices ?
                            <Message variant='info'> <DataPlaceHolder /> </Message> : <> {questions.length ?
                                <ul>
                                    {questionChoices.map((choice) => (
                                        <li key={choice.id} style={{ marginTop: '3px' }}>
                                            <Form.Check
                                                type="radio"
                                                id={choice.id}
                                                name="selectedChoice"
                                                label={choice.choice}
                                                value={choice.isCorrect}
                                                onChange={handleApplicantAnswers}
                                            />
                                        </li>))}
                                </ul> :
                                <Message variant='info'>Sorry!, some error occured. please try again</Message>}</>}
                    </Modal.Body>
                    <Modal.Footer>{questions.length ?
                        <Button
                            variant="secondary"
                            onClick={changeQuestions}
                        >{attemptedQuestions.length === 5 ? 'Submit' : 'Next'}</Button> :
                        <Button
                            variant="secondary"
                            onClick={e => { e.preventDefault(); setShowModal(false) }}
                        >Close</Button>}
                    </Modal.Footer> </>}
                </Modal>
            </Card.Body>
            <Button
                variant="secondary"
                // style={{marginLeft: '10px'}}
                onClick={goToPreviousPage} >
                Exit
            </Button>
        </Card>
    )
}
