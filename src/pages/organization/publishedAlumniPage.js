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
    // const years = ['2016', '2017', '2018', '2019', '2020']


    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)

    //Original States Of Data
    const [publishedAlumni, setPublishedAlumni] = useState([])
    const [allProjects, setAllProjects] = useState([])
    const [allAlumniSkills, setAllAlumniSkills] = useState([])
    const [allRatings, setAllRatings] = useState([])

    //Filter Values
    const [filteredArray, setFilteredArray] = useState([])

    const getPublishedAlumni = async () => {
        try {
            const response = await fetchPublishedAlumni(config)
            setPublishedAlumni(response)
            setFilteredArray(response)
        } catch (error) {
           console.log('Get Published Alumnik ', error.reponse.data) 
        }
    }

    const getAllProjects = async () => {
        try {
            const response = await fetchAllProjects(config)
            const recommended_projects = response.filter(item => item.project_recommendation_status)
            setAllProjects(recommended_projects)
        } catch (error) {
            console.log('Get Recommended Projects')
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

    const filterByGpa = (e) => {
        const gpaPoints = e.target.value;
        const qualifiedAlumni = publishedAlumni.filter(item => item.gpa >= gpaPoints)
        setFilteredArray(qualifiedAlumni)
    }

    const filterByCompletionYear = (e) => {
        const year = e.target.value;
        const qualifiedAlumni = publishedAlumni.filter(item => item.completion_year === year)
        if (!year) setFilteredArray(publishedAlumni)
        else setFilteredArray(qualifiedAlumni)
    }

    const filterByNumberOfProjects = () => {
      
    }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Currently Published Alumni</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{ marginBottom: '16px' }}>
                    <span style={{width: '80%', display: 'flex'}}>
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                filterByNumberOfProjects()
                            }}>By Number Of Projects</Button> &nbsp;
                        <Button>By Skills</Button> &nbsp;
                        <Form.Control 
                            size="md"
                            type="number"
                            style={{width: '15%'}}
                            placeholder='enter year'
                            onChange={filterByCompletionYear}>
                        </Form.Control>
                        <Form.Control 
                            size="md"
                            type="number"
                            style={{width: '15%'}}
                            placeholder='enter gpa'
                            onChange={filterByGpa}>
                        </Form.Control>
                    </span>
                    {/* <InputGroup style={{width: '20%',}}>
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
                    </InputGroup> */}
                </Row>
                <Row style={{ marginBottom: '16px'}}>
                <List
                        itemLayout="vertical"
                        style={{width: '100%'}}
                    size="small"
                    pagination={{ pageSize: 5, }}
                    dataSource={filteredArray}
                    renderItem={profile => (
                        <List.Item
                            key={profile.id}
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
                                <span style={{ width: '100%' }}><b>Name :</b> &nbsp; {profile.first_name} {profile.last_name} </span>
                                <Col md={4}>
                                    <span><b>Program :</b> {profile.degree_program} </span><br />
                                    <span ><b>Completion Year :</b> {profile.completion_year} </span> <br />
                                    <span ><b>Number of projects:</b> {allProjects.filter(item => (item.member === profile.alumni)).length} </span> <br />
                                    <span ><b>GPA: </b>{profile.gpa} </span>
                                </Col>
                                <Col md={4}>
                                <span><b>Skills: </b><ol>{allAlumniSkills.filter(item => item.alumni === profile.alumni).map(skill => (
                                    <li>{skill.profession_name}</li>))}</ol> </span>
                                     </Col>
                                <Col md={4}>
                                    <span style={{ width: '100%' }}>
                                        <b>Ratings: </b>
                                        <span>{allRatings.filter(rate => rate.alumni === profile.alumni).length === 0 ? 'No ratings yet' : ''}</span>
                                        <ol>{allRatings.filter(rate => rate.alumni === profile.alumni)
                                            .map(item => (<li>{item.organization_name} : <i>{desc[item.value - 1 ]}</i></li>
                                ))} </ol></span>
                                 </Col>
                                <Link style={{marginLeft: '85%'}} to={{pathname: `/alumni/${profile.alumni}/details` }}>
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
