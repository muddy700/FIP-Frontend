import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Tooltip } from 'antd';
import { Button, Row, Col, Card } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {
    getFieldPostProfessions,
    getFieldPostPrograms, getAllFieldPosts,
    getStaffProfile, getProgramsByDepartmentId,
    getOrganizationProfiles
} from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import DataPlaceHolder from '../../components/dataPlaceHolder'


function FieldPostsPage() {

    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [fieldPosts, setFieldPosts] = useState([])
    const [postPrograms, setPostPrograms] = useState([])
    const [postSkills, setPostSkills] = useState([])
    const [filteredArray, setFilteredArray] = useState([])
    const [displayArray, setDisplayArray] = useState([])
    const [showOrganizationInfo, setShowOrganizationInfo] = useState(false)
    const [organizationProfiles, setOrganizationProfiles] = useState([])
    const [selectedProfile, setselectedProfile] = useState({})
    const [departmentPrograms, setDepartmentPrograms] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    
    const getPrograms = async (departmentId) => {
        try {
            const programs = await getProgramsByDepartmentId(departmentId, config)
            const programsIds = programs.map(item => item.id)
            setDepartmentPrograms(programsIds)
            setIsFetchingData(false)
        } catch (error) {
            console.log({
                'Request': 'Getting Staff Profile Request',
                'Error => ' : error,
            })
        }
    }

    const getProfile = async () => {
        setIsFetchingData(true)
        try {
            const profile = await getStaffProfile(user.userId, config)
            getPrograms(profile[0].department)
        } catch (error) {
            console.log({
                'Request': 'Getting Staff Profile Request',
                'Error => ' : error,
            })
        }
    }

    const fetchFieldPosts = async () => {
        try {
          const response = await getAllFieldPosts(config)
            const arrangedByDate = response.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
            const valid_posts = arrangedByDate.filter(item => item.id !== 32)
            setFieldPosts(valid_posts)
        } catch (error) {
            console.log({
                'request': 'Fetch Organization Field Posts Request',
                'Error => ': error.response.data
            })
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

    
    const mergeFieldPostInfo = () => {
        // console.log('merge-enter')
        let merged_posts = [];
        
        for (let i = 0; i < fieldPosts.length; i++) {
            // console.log('for-loop')
            let obj = fieldPosts[i];

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
        setFilteredArray(merged_posts)
        setDisplayArray(merged_posts)
        // setIsFetchingData(false)
    }

    useEffect(() => {
        getProfile();
        fetchFieldPosts();
        fetchFieldPostProfessions();
        fetchFieldPostPrograms();
        pullOrganizationProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        mergeFieldPostInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postPrograms.length && postSkills.length])

    useEffect(() => {
        setDisplayArray(removeUnMatchedPosts())
        setFilteredArray(removeUnMatchedPosts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filteredArray.length && departmentPrograms.length])

    const calculateTotalChances = (chances) => {
        let sum = 0;
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

    const checkExpiryDate = (postdate) => {
        const currentDate = new Date()
        const closingDate = new Date(postdate)
        if (currentDate > closingDate) return true
        else return false
    }

    const selectGeneralPosts = () => {
        const general_posts = filteredArray.filter(item => item.post_capacity || item.skills)
        setDisplayArray(general_posts)
    }

    const selectDepartmentPosts = () => {
        const posts_with_programs = filteredArray.filter(item => item.programs)
        const department_posts = posts_with_programs.filter(item => departmentPrograms.includes(item.programs[0].program))
        setDisplayArray(department_posts)
    }

    const removeUnMatchedPosts = (postsList) => {
        const qualified_posts = filteredArray.filter(item => item.programs ? departmentPrograms.includes(item.programs[0].program) : item)
        return qualified_posts
    }

    const selectAllPosts = () => {
        setDisplayArray(filteredArray)
    }

            
const pullOrganizationProfiles = async () => {
        try {
            const response = await getOrganizationProfiles(config)
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

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Field Posts</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{paddingLeft: '2%'}}>
                    <Button
                        style={{ marginRight: '3%' }}
                        onClick={e => { e.preventDefault(); selectAllPosts()}}
                    >All Posts</Button>
                    <Button
                        style={{ marginRight: '3%' }}
                        onClick={e => { e.preventDefault(); selectDepartmentPosts()}}
                    >Department Posts</Button>
                    <Button
                        style={{ marginRight: '3%' }}
                        onClick={e => { e.preventDefault(); selectGeneralPosts()}}
                    >General Posts</Button>
                </Row>
                    {isFetchingData ?
                        <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                <Row >
                            <List
                                itemLayout="vertical"
                                style={{ width: '100%' }}
                                size="small"
                                pagination={{ pageSize: 5, }}
                                dataSource={displayArray}
                                renderItem={post => (
                                    <List.Item
                                        key={post.id}
                                        className="list-items"
                                        style={{ padding: 0, }}
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
                                            <Col md={12} >
                                                <Tooltip placement="topLeft" title="View organization profile">   <h4 >
                                                    <Button
                                                        variant="link"
                                                        onClick={e => { e.preventDefault(); selectOrganizationProfile(post.organization) }}
                                                    >{post.organization_name}
                                                    </Button></h4> </Tooltip>
                                                {/* <Button variant='link' ><b>{post.organization_name}</b></Button> */}
                                            </Col>
                                            <Col md={3}>
                                                <span>
                                                    <b>Total Chances: </b>
                                                    {countAllPostChances(post)}
                                                </span><br />
                                                <span>
                                                    <b>Applied: </b>
                                                    {post.applied_chances}
                                                </span><br />
                                                <span>
                                                    <b>Remaining: </b>
                                                    {countAllPostChances(post) - post.applied_chances}
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
                                                        : 'no skills selected'}</span>
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
                                                        : 'no programs selected'}</span>
                                                </span>
                                            </Col>
                                            <Row style={{ display: 'flex', width: '100%', marginTop: '10px' }}>
                                                <Col md={4} >
                                                    <span style={{ paddingLeft: '5%' }}><b>Expiry date: </b> {checkExpiryDate(post.expiry_date) ? <b style={{ color: 'red' }}><i>Closed</i></b> : post.expiry_date}</span>
                                                </Col>
                                                <Col md={{ span: 4, offset: 8 }}>
                                                    {/* <Button
                                                variant="link"
                                                onClick={e => { e.preventDefault(); setSelectedPost(post); deleteSinglePost(post)}}
                                                style={{ color: 'red',  }}>{isDeletingPost && (selectedPost.id === post.id) ? <Loader message='Wait...!' /> : 'Delete'}</Button> */}
                                                    <Link to={{ pathname: `/field_post/${post.id}/applicants` }}>
                                                        <Button variant="link" >View applied students</Button>
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </Row>
                                    </List.Item>
                                )}
                            /> 
                </Row>
                            </> }
       </Card.Body>
        <ContentModal
          show={showOrganizationInfo}
          isTable={true}
          title={infoTitle}
          content={infoTable}
          onHide={() => { setShowOrganizationInfo(false) }}
        />
    </Card>
    )
}

export default FieldPostsPage
