import React, {useState, useEffect} from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col, Button, Modal, Form } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice'
import { useHistory, Link, useLocation } from "react-router-dom";
import { getInterviewQuestions, getInterviewQuestionChoices } from '../../app/api'

export const InterviewPage = () => {

    const location = useLocation();
    const history = useHistory();
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const { postId, professionId } = location

    const [showModal, setShowModal] = useState(true)
    const [questions, setQuestions] = useState([])
    const [activeQuestion, setActiveQuestion] = useState({})
    const [attemptedQuestions, setAttemptedQuestions] = useState([])
    const [questionChoices, setQuestionChoices] = useState([])
    const [selectedChoice, setSelectedChoice] = useState('')
    const [applicantAnswers, setApplicantAnswers] = useState([])
    const [markingScheme, setMarkingScheme] = useState([])

    var marks = 0;

    const goToPreviousPage = () => {
        history.goBack()
    }
    
    const findMarks = () => {
        // console.log(markingScheme)
        applicantAnswers.map((answer) => {
            markingScheme.map(item => {
                if (answer.choice === item.id) {
                    console.log('correct')
                }
            })
        })

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
        try {
            const response = await getInterviewQuestions(professionId, config)
            setQuestions(response)
            setActiveQuestion(response[0])
            setAttemptedQuestions([...attemptedQuestions, response[0]])
        } catch (error) {
            console.log({
                'request': 'Fetch Interview Questions Request',
                'Error => ': error
            }) }
    }

    const fetchQuestionChoices = async () => {
        try {
            const response = await getInterviewQuestionChoices(activeQuestion.id, config)
            setQuestionChoices(response)
            setMarkingScheme([...markingScheme, response.find(item => item.isCorrect) ])
        } catch (error) {
            console.log({
                'request': 'Fetch Question Choices Request',
                'Error => ': error
            }) }
    }

    useEffect(() => {
       fetchQuestions()
    }, [professionId])

    useEffect(() => {
      fetchQuestionChoices()
    }, [activeQuestion.id])

    return (
        <Card className="">
            <h1>Interview Page <br />
            post: {postId} <br />
            profession:{professionId} <br />
             user:    {user.userId} <br />
                you have done {attemptedQuestions.length}
            </h1>

            <Card.Body>
                <Modal
                    show={showModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header >
                        <Modal.Title id="contained-modal-title-vcenter">
                            <b>{activeQuestion ? attemptedQuestions.length + '. ' : ''}</b>
                            {activeQuestion ? activeQuestion.question_body : 'no body'} 
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <ul>
                            {questionChoices.map((choice) => (
                            <li key={choice.id} style={{marginTop: '3px'}}>
                                 <Form.Check
                                    type="radio"
                                    id={choice.id}
                                    name="selectedChoice"
                                    label={choice.choice}
                                    value={choice.id}
                                    onChange={handleApplicantAnswers}
                                />
                            </li> ))}
                        </ul>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={changeQuestions}
                        >{attemptedQuestions.length === 5 ? 'Submit' : 'Next'}</Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
            <Button
                variant="secondary"
                style={{marginLeft: '10px'}}
                onClick={goToPreviousPage} >
                Back
            </Button>
        </Card>
    )
}
