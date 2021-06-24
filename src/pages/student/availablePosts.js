import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getFieldPostProfessions, getFieldPostPrograms, getAllFieldPosts, getStudentProfileInfo, SendFieldApplication, getFieldApplicationsByStudentId, deleteFieldApplication, editFieldPost } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import FormItemInput from 'antd/lib/form/FormItemInput';

const AvailablePostsPage = () => {

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    const [allFieldPosts, setAllFieldPosts] = useState([])
    const [postPrograms, setPostPrograms] = useState([])
    const [postSkills, setPostSkills] = useState([])
    const [filteredArray, setFilteredArray] = useState([])
    const [studentInfo, setStudentInfo] = useState({})
    const [isSendingAppplication, setIsSendingAppplication] = useState(false)
    const [selectedPost, setSelectedPost] = useState({})
    const [studentApplications, setStudentApplications] = useState([])
    const [isDeletingApplication, setIsDeletingApplication] = useState(false)
    
    const mergeFieldPostInfo = () => {
        // console.log('merge-enter')
        let merged_posts = [];
        
        for (let i = 0; i < allFieldPosts.length; i++) {
            // console.log('for-loop')
            let obj = allFieldPosts[i];

            let post_programs = postPrograms.filter(item => item.post === obj.id)
            let post_skills = postSkills.filter(item => item.post === obj.id)
            
            if (post_programs && post_programs.length) {
                // console.log('-program')
                obj = {...obj, programs: [...post_programs]}
            }
            
            if (post_skills && post_skills.length) {
                // console.log('-profession')
                obj = {...obj, skills: [...post_skills]}
            }
            
            merged_posts.push(obj)
        }
        
        setFilteredArray(removeUnMatchedPosts(merged_posts))
    }

    const fetchAllFieldPosts = async () => {
        try {
            const response = await getAllFieldPosts(config)
            const arrangedByDate = response.slice().sort((a, b) => b.date_created.localeCompare(a.date_created))
            const valid_posts = arrangedByDate.filter(post => post.organization !== 38)
            setAllFieldPosts(valid_posts)
        } catch (error) {
            console.log('Getting All Field Posts ', error.response.data)
        }
    }

    const fetchFieldPostProfessions = async () => {
        try {
          const response = await getFieldPostProfessions(config)
            setPostSkills(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Field Post Professions Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchFieldPostPrograms = async () => {
        try {
            const response = await getFieldPostPrograms(config)
            setPostPrograms(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Field Post Programs Request',
                'Error => ': error.response.data
            })
        }
    }

    const getStudentProfile = async () => {
        try {
            const response = await getStudentProfileInfo(config)
            setStudentInfo(response[0])
        // fetchFieldPostPrograms(response[0].program);
        } catch (error) {
            console.log('Getting Student Profile Info ', error.response.data)
        }
    }

    const getStudentApplications = async () => {
        try {
            const response = await getFieldApplicationsByStudentId(user.userId, config)
            setStudentApplications(response)
        } catch (error) {
            console.log('Getting Student Applications ', error.response.data)
        }
    }

    useEffect(() => {
        getStudentProfile();
        getStudentApplications();
        fetchAllFieldPosts();
        fetchFieldPostProfessions();
        fetchFieldPostPrograms();
    }, [])

    useEffect(() => {
        mergeFieldPostInfo()
    }, [postPrograms.length && postSkills.length])

    const checkApplicationStatus = (postId) => {
        let hasApplied = '';
        hasApplied = studentApplications.find(item => item.post === postId)
        if (hasApplied) return true
        else return false
    }

    const removeUnMatchedPosts = (postsList) => {
        const qualified_posts = postsList.filter(post => post.programs ? post.programs[0].program === studentInfo.program : post)
        return qualified_posts;
    }

    const calculateTotalChances = (chances) => {
        let sum = 0;
        // chances.map(item => )
        for (let i = 0; i < chances.length; i++) {
            sum += chances[i]
        }
        return sum
    }

    const countAllPostChances = (post) => {
        let sum = 0;

        if (post.post_capacity) {
            sum = post.post_capacity 
        }
        else if (post.programs && post.skills) {
            sum = (calculateTotalChances(post.programs.map(prog => prog.program_capacity)) +
                calculateTotalChances(post.skills.map(skil => skil.profession_capacity)))
        }
        else if (post.programs) {
            sum = calculateTotalChances(post.programs.map(prog => prog.program_capacity))
       }
        else {
            sum = calculateTotalChances(post.skills.map(skil => skil.profession_capacity))
        }
        return sum
    }

    const submitApplication = async (postData) => {
        setIsSendingAppplication(true)
        const payload1 = {
            post: postData.id,
            student: user.userId
        }

        try {
            const response1 = await SendFieldApplication(payload1, config)
            const payload2 = {...postData, applied_chances: postData.applied_chances +1}
            try { 
                const response2 = await editFieldPost(payload2, config)
                const newPostList = filteredArray.map(item => item.id === response2.id ? {...item, applied_chances: response2.applied_chances } : item)
                setFilteredArray(newPostList)
                setStudentApplications([...studentApplications, response1])
                setIsSendingAppplication(false)
            } catch (error) {
                console.log('Editing Field Post ', error.response.data)
                setIsSendingAppplication(false)
            }
        } catch (error) {
            console.log('Sending Field Application ', error.response.data)
            setIsSendingAppplication(false)
        }
    }

    const cancelApplication = async (postData) => {
        setIsDeletingApplication(true)
        const cancelledApplication = studentApplications.find(item => item.post === postData.id)
        try {
            const response1 = await deleteFieldApplication(cancelledApplication.id, config)
            const payload2 = {...postData, applied_chances: (postData.applied_chances - 1)}
            try { 
                const response2 = await editFieldPost(payload2, config)
                const newPostList = filteredArray.map(item => item.id === response2.id ? { ...item, applied_chances: response2.applied_chances } : item)
                setFilteredArray(newPostList)
                const remainingApplications = studentApplications.filter(item => item.id !== cancelledApplication.id)
                setStudentApplications(remainingApplications)
                setIsDeletingApplication(false)
            } catch (error) {
                console.log('Editing Field Post ', error.response.data)
                setIsDeletingApplication(false)
            }
        } catch (error) {
            console.log('Deleting Field Application ', error.response.data)
            setIsDeletingApplication(false)
        }
    }

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >Currently Available Field Posts</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{ marginBottom: '16px' }}>
                        <List
                            itemLayout="vertical"
                            style={{width: '100%'}}
                            size="small"
                            pagination={{ pageSize: 5, }}
                            dataSource={filteredArray}
                            renderItem={post => (
                                <List.Item
                                    key={post.id}
                                    className="list-items"
                                    style={{padding: 0,}}
                                >
                                    <Row
                                        style={{
                                            // border: '1px solid blue',
                                            borderRadius: '5px',
                                            backgroundColor: 'lightgray',
                                            width: '98%',
                                            padding: '1% 3%',
                                            margin: '1% 1%',
                                        }}>
                                        <span style={{ width: '100%' }}>
                                            <h4 style={{color: 'blue'}}>{post.organization_name}</h4>
                                        </span>
                                        <Col md={3}>
                                            <span><b>Free Chances: </b>
                                                {countAllPostChances(post) === post.applied_chances ? <i style={{color: 'red'}}>Post is full</i> : countAllPostChances(post) - post.applied_chances}
                                            </span><br />
                                        </Col>
                                        <Col md={4}>
                                            <span>
                                                <b>Skills: </b>
                                                <span>{post.skills && post.skills.length ? 
                                                <span>
                                                    <ol>{post.skills.map(skill => (
                                                        <li><span>{skill.profession_name}: {skill.profession_capacity}</span></li>))}
                                                    </ol>
                                                </span> 
                                                    : 'Any skills'}</span>
                                            </span>
                                        </Col>
                                        <Col md={5}>
                                            <span>
                                                <b>Programs: </b>
                                                <span>{post.programs && post.programs.length ? 
                                                <span>
                                                    <ol>{post.programs.map(data => (
                                                        <li><span>{data.program_name}: {data.program_capacity}</span></li>))}
                                                    </ol>
                                                </span> 
                                                    : 'All programs'}</span>
                                            </span>
                                        </Col>
                                        <Row style={{display: 'flex', width: '100%'}}>
                                            <Button
                                                variant={checkApplicationStatus(post.id) ? 'success' : 'primary'}
                                                disabled={checkApplicationStatus(post.id) || studentApplications.length ? true : false}
                                                hidden={(countAllPostChances(post) === post.applied_chances) && !checkApplicationStatus(post.id)}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectedPost(post); submitApplication(post)
                                                }}
                                                >{isSendingAppplication && (selectedPost.id === post.id) ? <Loader message='Wait...!' /> : checkApplicationStatus(post.id) ? 'Applied' : 'Apply'}
                                            </Button> &nbsp; &nbsp; &nbsp;
                                            <Button
                                                variant="danger"
                                                hidden={!checkApplicationStatus(post.id)}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setSelectedPost(post); cancelApplication(post)
                                                }}
                                                >{isDeletingApplication && (selectedPost.id === post.id) ? <Loader message='Wait...!' /> : 'Cancel'}
                                            </Button>
                                        </Row>
                                    </Row>
                                </List.Item>
                            )}
                        />
                    </Row>
            </Card.Body>
        {/* <ContentModal
        show={modalShow}
        isTable={false}
        title={postMode === '' ? 'Select Post Category' : modalTitle}
        content={postMode === '' ? postOptions : modalContent}
        onHide={closeModal}
      /> */}
            </Card>
    )
}

export default AvailablePostsPage
