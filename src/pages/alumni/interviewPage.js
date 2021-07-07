import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import Message from '../../components/message'
import { Card, Button, Modal, Form } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import { useHistory, useParams } from "react-router-dom";
import DataPlaceHolder from '../../components/dataPlaceHolder';
import Countdown from "react-countdown";

import { getInterviewQuestions, getInterviewQuestionChoices, sendInternshipApplication, getAlumniApplications } from '../../app/api'

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
    const [hasTestSubmitted, setHasTestSubmitted] = useState(false)
    const [hasAlreadyDidTest, setHasAlreadyDidTest] = useState(false)
    
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
    
    const pullAlumniApplications = async () => {
        setIsFetchingData(true)
        try {
            const response = await getAlumniApplications(user.userId, config)
            const hasApplied = response.find(item => item.alumni === user.userId && item.post === parseInt(postId))
            if (hasApplied) {
                setHasAlreadyDidTest(true)
                setShowModal(false)
            }
            else {
                fetchQuestions()
            }
            setIsFetchingData(false)
        } catch (error) {
            console.log('Getting Alumni Applications ', error.response.data)
        }
    }

    const findMarks = () => {
        setHasTestSubmitted(true)
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
        localStorage.setItem(`${attemptedQuestions.length}`, e.target.value)
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

    const clearLocalStorage = () => {

        for (let i = 1; i <= 5; i++){
                localStorage.removeItem(i)
            }
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
            clearLocalStorage()
            setisTestDone(true)
        } catch (error) {
            console.log({
                'request': 'Send Applicant Scores Request',
                'Error => ': error
            }) }
        }

        useEffect(() => {
            // fetchQuestions();
            pullAlumniApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [professionId])

    useEffect(() => {
        fetchQuestionChoices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questions.length ? activeQuestion.id : '' ])

    const timeFinished = () => {
        if (hasTestSubmitted) {
            console.log('Test Already Submitted ')
        }
        else {
            console.log('Test Was Still Pending')
            setShowModal(false);
            let answers = [];
            for (let i = 1; i <= 5; i++){
                answers.push(localStorage.getItem(i))
            }
            const correct_answers = answers.filter(item => item === 'true')
            let score = 0;
            score = correct_answers.length * 20;
            setMarks(score)
            saveInternshipApplication(score)
            clearLocalStorage()
            setRemainder(0)
        }
    }

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a complete state
            return <span>Time is over!.</span>;
        } else {
            // Render a countdown
            return (
                <span>
                {hours}:{minutes}:{seconds}
            </span>
            );
        }
    };

    const [remainder, setRemainder] = useState(<Countdown date={Date.now() + 1000 * 60 * 2} renderer={renderer} onComplete={timeFinished} />)
    
    return (
        <Card className="">
            {isTestDone ?
                <Message variant='info'><span>{marks >= 50 ? <h3>Congratulations, you got {marks}%.</h3> : <h3>Your marks for the test is {marks}%</h3>}</span></Message> :
                hasAlreadyDidTest ?
                <Message variant='info'><h3>You already did this test</h3></Message> :
                ''}
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
                            <Card.Header style={{ background: 'lightcyan', textAlign: 'right', fontFamily: 'bold' }} > Time remaining {remainder}</Card.Header>
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
