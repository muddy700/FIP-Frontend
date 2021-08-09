import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List } from 'antd';
import { Tooltip } from 'antd';
import { Button, Row, Col, Card } from 'react-bootstrap'
import Message from '../../components/message'
import { useSelector}  from 'react-redux'
import {
    getFieldPostProfessions, getFieldPostPrograms,
    getAllFieldPosts, getStudentProfileInfo,
    SendFieldApplication, getFieldApplicationsByStudentId
    , deleteFieldApplication, editFieldPost, getOrganizationProfiles, editStudentProfileInfo
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import Loader from '../../components/loader'
import DataPlaceHolder  from '../../components/dataPlaceHolder'

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
    const [organizationProfiles, setOrganizationProfiles] = useState([])
    const [showOrganizationInfo, setShowOrganizationInfo] = useState(false)
    const [selectedProfile, setselectedProfile] = useState({})
    const [studentApplications, setStudentApplications] = useState([])
    const [isDeletingApplication, setIsDeletingApplication] = useState(false)
    const [cancellationLimitReached, setCancellationLimitReached] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    
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
        setIsFetchingData(true)
        try {
            const response = await getAllFieldPosts(config)
            const arrangedByDate = response.slice().sort((a, b) => b.date_created.localeCompare(a.date_created))
            const valid_posts = arrangedByDate.filter(post => post.organization !== 38)
            setAllFieldPosts(valid_posts)
            setIsFetchingData(false)
        } catch (error) {
            console.log('Getting All Field Posts ', error.response.data)
        }
    }

        
const pullOrganizationProfiles = async () => {
        try {
            const response = await getOrganizationProfiles(config)
            // console.log(response)
            setOrganizationProfiles(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Organization Profiles Request',
                'Error => ': error
            })
        }
    }
    
    const selectOrganizationProfile = (id) => {
        const profile = organizationProfiles.find(item => item.organization_id === id)
        setShowOrganizationInfo(true)
        setselectedProfile(profile)
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
        // setIsFetchingData(true)
        try {
            const response = await getStudentProfileInfo(user.userId, config)
            setStudentInfo(response[0])
            getStudentApplications();
            // setIsFetchingData(false)
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
        pullOrganizationProfiles()
        // getStudentApplications();
        fetchAllFieldPosts();
        fetchFieldPostProfessions();
        fetchFieldPostPrograms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        mergeFieldPostInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postPrograms.length && postSkills.length])

    const checkApplicationStatus = (postId) => {
        let hasApplied = '';
        hasApplied = studentApplications.find(item => item.post === postId)
        if (hasApplied) return true
        else return false
    }

    const removeUnMatchedPosts = (postsList) => {
        const qualified_posts = postsList.filter(post => post.programs ? post.programs[0].program === studentInfo.program : post)
        // setIsFetchingData(false)
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

    const addStudentOrganization = async (postInfo) => {
        const { field_report,
          week_1_logbook,
          week_2_logbook,
          week_3_logbook,
          week_4_logbook,
          week_5_logbook,
          ...rest } = studentInfo;
        const payload = { ...rest, organization: postInfo.organization }
        try {
            const response = await editStudentProfileInfo(payload, config)
            setStudentInfo({...studentInfo, organization: response.organization})
        } catch (error) {
           console.log('Adding Student Organization ', error.response.data) 
        }
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
                addStudentOrganization(postData)
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

    const reduceCancellationCount = async () => {
        const { field_report,
          week_1_logbook,
          week_2_logbook,
          week_3_logbook,
          week_4_logbook,
          week_5_logbook,
          ...rest } = studentInfo;
        const payload = {
            ...rest,
            cancellation_count: studentInfo.cancellation_count + 1,
            organization: 38
        }
        try {
            const response = await editStudentProfileInfo(payload, config)
            setStudentInfo({...studentInfo, cancellation_count: response.cancellation_count})
        } catch (error) {
           console.log('Reducing Number Of Cancelling Field Application ', error.response.data) 
        }
    }

    const cancelApplication = async (postData) => {
        if (studentInfo.cancellation_count === 2) {
            setCancellationLimitReached(true)
        }
        else {
            setIsDeletingApplication(true)
            const cancelledApplication = studentApplications.find(item => item.post === postData.id)
            try {
                const response1 = await deleteFieldApplication(cancelledApplication.id, config)
                console.log(response1.length)
                const payload2 = { ...postData, applied_chances: (postData.applied_chances - 1) }
                try {
                    const response2 = await editFieldPost(payload2, config)
                    const newPostList = filteredArray.map(item => item.id === response2.id ? { ...item, applied_chances: response2.applied_chances } : item)
                    setFilteredArray(newPostList)
                    const remainingApplications = studentApplications.filter(item => item.id !== cancelledApplication.id)
                    setStudentApplications(remainingApplications)
                    reduceCancellationCount()
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
    }

    const checkExpiryDate = (postdate) => {
        const currentDate = new Date()
        const closingDate = new Date(postdate)
        if (currentDate > closingDate) return true
        else return false
    }

    const infoTitle = 'Organization Profile'
    var infoTable =  <tbody>
        <tr>
            <td className="post-properties"> ALIAS</td>
        <td>{selectedProfile.organization_name} </td>
        </tr>
        <tr>
            <td className="post-properties">FULL NAME</td>
        <td>{selectedProfile.organization_full_name} </td>
        </tr>
        <tr>
            <td className="post-properties">EMAIL</td>
        <td>{selectedProfile.organization_email} </td>
        </tr>
        <tr>
            <td className="post-properties">ADDRESS</td>
        <td>{selectedProfile.box_address}</td>
        </tr>
        <tr>
            <td className="post-properties"> DESCRIPTION</td>
        <td>{selectedProfile.organization_description} </td>
        </tr>
    </tbody>
    
    const LimitationTitle = <span style={{color: 'red'}}>Request rejected.</span>
    const LimitationMessage = 'You cannot cancel this aplication. Because you have reached a maximum number of cancellation.'

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >Currently Available Field Posts</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Row >
                            <Message variant='info'><b>Cancel Chances:</b> {studentInfo.cancellation_count === 2 ? <span style={{ color: 'red' }}>Limit reached</span> : 2 - studentInfo.cancellation_count} </Message>
                        </Row>
                        <Row style={{ marginBottom: '16px' }}>
                            <List
                                itemLayout="vertical"
                                style={{ width: '100%' }}
                                size="small"
                                pagination={{ pageSize: 5, }}
                                dataSource={filteredArray}
                                renderItem={post => (
                                    <List.Item
                                        key={post.id}
                                        className="list-items"
                                        style={{ padding: 0, }}
                                    >
                                        {/* <List.Item.Meta
                                // avatar={<Avatar size="large" src={post.avatar} />}
                                title={<Tooltip placement="topLeft" title="View organization profile">
                                    <h5 >
                                        <Button
                                            variant="link"
                                            onClick={e => { e.preventDefault(); selectOrganizationProfile(post.organization) }}
                                            >{post.organization_name}
                                            </Button></h5>
                                             </Tooltip>}
                            /> */}
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
                                                <Tooltip placement="topLeft" title="View organization profile">   <h4 >
                                                    <Button
                                                        variant="link"
                                                        onClick={e => { e.preventDefault(); selectOrganizationProfile(post.organization) }}
                                                    >{post.organization_name}
                                                    </Button></h4> </Tooltip>
                                            </span>
                                            <Col md={3}>
                                                <span><b>Free Chances: </b>
                                                    {countAllPostChances(post) === post.applied_chances ? <i style={{ color: 'red' }}>Post is full</i> : countAllPostChances(post) - post.applied_chances}
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
                                            <Row style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
                                                <Col md={4} >
                                                    <span style={{ paddingLeft: '5%' }}><b>Expiry date: </b> {checkExpiryDate(post.expiry_date) ? <b style={{ color: 'red' }}><i>Closed</i></b> : post.expiry_date}</span>
                                                </Col>
                                                <Col md={{ span: 3, offset: 9 }}>
                                                    <Button
                                                        variant={checkApplicationStatus(post.id) ? 'success' : 'primary'}
                                                        disabled={checkApplicationStatus(post.id) || studentApplications.length ? true : false}
                                                        hidden={((countAllPostChances(post) === post.applied_chances) && !checkApplicationStatus(post.id)) || checkExpiryDate(post.expiry_date)}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setSelectedPost(post); submitApplication(post)
                                                        }}
                                                    >{isSendingAppplication && (selectedPost.id === post.id) ? <Loader message='Wait...!' /> : checkApplicationStatus(post.id) ? 'Applied' : 'Apply'}
                                                    </Button> &nbsp; &nbsp;
                                                    <Button
                                                        variant="danger"
                                                        hidden={!checkApplicationStatus(post.id)}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setSelectedPost(post); cancelApplication(post)
                                                        }}
                                                    >{isDeletingApplication && (selectedPost.id === post.id) ? <Loader message='Wait...!' /> : 'Cancel'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </List.Item>
                                )}
                            />
                        </Row> </>
                }
            </Card.Body>
        <ContentModal
          show={showOrganizationInfo}
          isTable={true}
          title={infoTitle}
          content={infoTable}
          onHide={() => { setShowOrganizationInfo(false) }}
        />
        <ContentModal
        show={cancellationLimitReached}
        isTable={false}
        title={LimitationTitle}
        content={LimitationMessage}
        onHide={() => setCancellationLimitReached(false)}
      />
            </Card>
    )
}

export default AvailablePostsPage
