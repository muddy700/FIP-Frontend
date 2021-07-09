import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List } from 'antd';
import { Button, Row, Col, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch}  from 'react-redux'
import { getAlumniApplications, getAlumniProfile, getOrganizationProfiles, pullInternshipPosts } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { fetchInternshipPosts, selectInternshipPostList } from '../../slices/internshipPostSlice';
import WarningModal from '../../components/warningModal';
import ContentModal from '../../components/contentModal';
import { Tooltip } from 'antd';
import DataPlaceHolder  from '../../components/dataPlaceHolder'

const AvailablePostsPage = () => {

    const dispatch = useDispatch()
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const internshipPosts = useSelector(selectInternshipPostList)
    const [selectedPost, setSelectedPost] = useState('')
    const [selectedOrganization, setSelectedOrganization] = useState('')
    const [profession, setProfession] = useState('')
    const [modalShow, setModalShow] = useState(false);
    const [organizationProfiles, setOrganizationProfiles] = useState([])
    const [showOrganizationInfo, setShowOrganizationInfo] = useState(false)
    const [selectedProfile, setselectedProfile] = useState({})
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [alumniProfile, setAlumniProfile] = useState({})
    const [doesNotMeetRequirements, setDoesNotMeetRequirements] = useState(false)
    const modalTitle = "Warning!"
    const modalContent = "To apply this post you need to do a test. And once you start the test, you cannot abort the process. To continue press 'Start', to quit press 'Cancel'"
    const cancellationTitle = <span style={{color: 'red'}}>Request rejected.</span>
    const cancellationMessage = 'Your GPA is below the minimum required GPA for this post'

    const getProfile = async () => {
        setIsFetchingData(true)
        try {
            const profile = await getAlumniProfile(user.userId, config)
            setAlumniProfile(profile[0])
            setIsFetchingData(false)
            // console.log(profile)
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'Request': 'Getting Alumni Profile Request',
                'Error => ' : error,
            })
        }
    }

    const getInternshipPosts = async () => {
    setIsFetchingData(true)
    try {
        const response1 = await getAlumniApplications(user.userId, config)
        const appliedPostsIds = response1.map(res => res.post)
        try {
            const response2 = await pullInternshipPosts(config)
            const newPosts = response2.filter(post => !appliedPostsIds.includes(post.id))
            const unProcessedPosts = newPosts.filter(post => post.status === 'test')
            const arrangedPosts = unProcessedPosts.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
            dispatch(fetchInternshipPosts(arrangedPosts))
            setIsFetchingData(false)

        } catch (error) {
            console.log({
                'request': 'Fetch Available Internship Posts Request',
                'Error => ': error
            })
         
        }
    } catch (error) {
        console.log({
            'request': 'Fetch Alumni Applications In Available Post',
            'Error => ': error
        })
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
    
    const infoTitle = 'Organization Profile'
    var infoTable =  <tbody>
                                <tr>
                                    <td className="post-properties">ALIAS</td>
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
                                    <td className="post-properties">ORGANIZATION DESCRIPTION</td>
                                <td>{selectedProfile.organization_description} </td>
                                </tr>
                            </tbody>
    
    const selectOrganizationProfile = (id) => {
        const profile = organizationProfiles.find(item => item.organization_id === id)
        setShowOrganizationInfo(true)
        setselectedProfile(profile)
    }
    
    useEffect(() => {
        getProfile()
        getInternshipPosts();
        pullOrganizationProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkExpiryDate = (postdate) => {
        const currentDate = new Date()
        const closingDate = new Date(postdate)
        if (currentDate > closingDate) return true
        else return false
    }

    const checkRequirements = (post) => {
        if (alumniProfile.gpa >= post.minimum_gpa) {
            setModalShow(true);
            setSelectedPost(post.id);
            setSelectedOrganization(post.organization)
            setProfession(post.profession)
        }
        else {
            setDoesNotMeetRequirements(true)
        }
    }

    return (
        
        <Card style={{marginBottom: '10px'}}>
            <Card.Header>
                <Message  variant='info' >Latest Available Posts</Message>  
            </Card.Header>
            <Card.Body style={{padding: '0 16px 16px 16px'}}>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> :
                    <List
                        itemLayout="vertical"
                        size="small"
                        pagination={{ pageSize: 5, }}
                        dataSource={internshipPosts}
                        renderItem={post => (
                            <List.Item
                                key={post.id}
                                className="list-items"
                                style={{ padding: 0 }}
                            >
                                <List.Item.Meta
                                    // avatar={<Avatar size="large" src={post.avatar} />}
                                    title={<Tooltip placement="topLeft" title="View organization profile">
                                        <h5 >
                                            <Button
                                                variant="link"
                                                onClick={e => { e.preventDefault(); selectOrganizationProfile(post.organization) }}
                                            >{post.organization_name}
                                            </Button></h5>
                                    </Tooltip>}
                                />
                                <Row >
                                    <Col md={{ span: 3, offset: 1 }} style={{ display: 'flex' }}>
                                        Job title: &nbsp; <p>{post.profession_name} </p>
                                    </Col>
                                    <Col md={1} style={{ display: 'flex' }}>
                                        Posts:  &nbsp; <p>{post.post_capacity} </p>
                                    </Col>
                                    <Col md={3} style={{ display: 'flex' }}>
                                        Expire Date:  &nbsp; <p>{post.expiry_date} </p>
                                        {/* Expire Date:  &nbsp; <p>{checkExpiryDate(post.expiry_date) ? <i style={{color: 'red'}}>Closed</i> : post.expiry_date} </p> */}
                                    </Col>
                                    <Col md={3} style={{ display: 'flex' }}>
                                        {checkExpiryDate(post.expiry_date) ? <b><i style={{color: 'red'}}>Closed</i></b>  : <>
                                            <Link to={{ pathname: "/post_details", postId: post.id, }}>
                                                <Button variant="link" >View Details</Button>
                                            </Link><Link>
                                                <Button
                                                    variant="link"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        checkRequirements(post);
                                                    }}
                                                >Apply</Button></Link>
                                        </>}
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />}
            </Card.Body>
        <WarningModal
            show={modalShow}
            title={modalTitle}
            content={modalContent}
            onHide={() => setModalShow(false)}
            closeModal={() => setModalShow(false)}
            postId={selectedPost}
            professionId={profession}
            organizationId={selectedOrganization}
        />
        <ContentModal
          show={showOrganizationInfo}
          isTable={true}
          title={infoTitle}
          content={infoTable}
          onHide={() => { setShowOrganizationInfo(false) }}
        />
        <ContentModal
          show={doesNotMeetRequirements}
          isTable={false}
          title={cancellationTitle}
          content={cancellationMessage}
          onHide={() => { setDoesNotMeetRequirements(false) }}
        />
        </Card>
    )
}

export default AvailablePostsPage


//  <Tooltip placement="top" title={text}>
//         <Button>Top</Button>
//       </Tooltip>