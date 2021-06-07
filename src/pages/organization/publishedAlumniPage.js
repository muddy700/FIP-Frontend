import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form, Tooltip } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { fetchAllProjects, fetchPublishedAlumni, fetchAllAlumniSkills, fetchAllRatings } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';
import { findAllByDisplayValue } from '@testing-library/dom';

function PublishedAlumniPage() {

const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];


    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [publishedAlumni, setPublishedAlumni] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allAlumniSkills, setAllAlumniSkills] = useState([])
    const [allRatings, setAllRatings] = useState([])

    const getPublishedAlumni = async () => {
        try {
            const response = await fetchPublishedAlumni(config)
            setPublishedAlumni(response)
        } catch (error) {
           console.log('Get Published Alumnik ', error.reponse.data) 
        }
    }

    const getAllProjects = async () => {
        try {
            const response = await fetchAllProjects(config)
            setAllProjects(response)
        } catch (error) {
            console.log('Get All Projects')
        }
    }

    const getAllAlumniSkills = async () => {
        try {
            const response = await fetchAllAlumniSkills(config)
            setAllAlumniSkills(response)
        } catch (error) {
            console.log('Get All Alumni Skills')
        }
    }

    const getAllRatings = async () => {
        try {
            const response = await fetchAllRatings(config)
            setAllRatings(response)
        } catch (error) {
            console.log('Get All Ratings')
        }
    }

    useEffect(() => {
        getPublishedAlumni();
        getAllProjects();
        getAllAlumniSkills();
        getAllRatings()
    }, [])


    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Currently Published Alumni</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{ marginBottom: '16px' }}>
                    <span style={{width: '80%'}}>
                        <Button>Filter By Projects</Button> &nbsp;
                        <Button>Filter By Skills</Button> &nbsp;
                        <Button>Filter By GPA</Button> &nbsp;
                    </span>
                    <InputGroup style={{width: '20%',}}>
                        <FormControl
                        placeholder="Type To Search"
                        aria-label="Message Content"
                        aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                            <Button variant="outline-primary">
                                <Icon glyph="search" size={20} />
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Row>
                {/* {publishedAlumni.map(person => (
                    <h5 key={person.id}>{person.registration_number}</h5>
                ))} */}
                <Row style={{ marginBottom: '16px' }}>
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{ pageSize: 5, }}
                    dataSource={publishedAlumni}
                    renderItem={profile => (
                        <List.Item
                            key={profile.id}
                            className="list-items"
                            style={{padding: 0,}}
                        >
                            {/* <List.Item.Meta
                                title={<h5><Button variant="link"
                                        >{profile.registration_number}
                                        </Button></h5>}
                            /> */}
                            <Row
                                style={{
                                    // border: '1px solid blue',
                                    borderRadius: '5px',
                                    backgroundColor: 'lightgray',
                                    width: '98%',
                                    paddingLeft: '3%',
                                    margin: '1% 1%',
                                }}>
                                <span style={{width: '100%'}}>Name: &nbsp; {profile.registration_number} </span>
                                <span style={{width: '100%'}}> &nbsp; Program: {profile.degree_program} </span>
                                <span style={{width: '100%'}}> &nbsp; Completion Year: {profile.completion_year} </span>
                                <span style={{width: '100%'}}> &nbsp; Number of projects: {allProjects.filter(item => (item.member === profile.alumni && item.project_recommendation_status)).length} </span>
                                <span style={{width: '100%'}}> &nbsp; GPA: {profile.gpa} </span>
                                <span style={{ width: '100%' }}> &nbsp; Skills: <ol>{allAlumniSkills.filter(item => item.alumni === profile.alumni).map(skill => (
                                    <li>{skill.profession_name}</li>))}</ol> </span>
                                <span style={{ width: '100%' }}> &nbsp; Ratings: <ol>{allRatings.filter(rate => rate.alumni === profile.alumni).map(item => (
                                    <li>{item.organization_name} : {desc[item.value - 1 ]}</li>
                                ))} </ol></span>
                                <Link to={{pathname: "/post_details", postId:profile.id, }}>
                                    <Button variant="link" >More Details</Button>
                                </Link>
                            </Row>
                        </List.Item>
                    )}
                 />
                </Row>
        </Card.Body>
        {/* <ContentModal
          show={modalShow}
          isTable={false}
          title={modalTitle}
          content={modalContent}
          onHide={() => { setModalShow(false) }}
        /> */}
        </Card>
    )
}

export default PublishedAlumniPage
