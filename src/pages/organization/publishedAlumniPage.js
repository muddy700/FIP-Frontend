import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form, Tooltip } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { fetchAllProjects, fetchPublishedAlumni, fetchAllAlumniSkills, fetchAllRatings, fetchAllSkills } from '../../app/api';
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
    const [allSkills, setAllSkills] = useState([])

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

    const getAllSkills = async () => {
        try {
            const response = await fetchAllSkills(config)
            setAllSkills(response)
        } catch (error) {
            console.log('Get All Skills')
        }
    }

    useEffect(() => {
        getPublishedAlumni();
        getAllProjects();
        getAllAlumniSkills();
        getAllRatings();
        getAllSkills()
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
        let mergedArray = [];

      for(let i = 0; i < publishedAlumni.length; i++) {
          let alu = publishedAlumni[i];

          let alumni_projects = allProjects.filter(item => item.member === alu.alumni)

          if (alumni_projects && alumni_projects.length) {
              alu = { ...publishedAlumni[i], projects: [...alumni_projects ] }
          }
          mergedArray.push(alu)
        }
        // console.log(mergedArray)
        const sortedArray = mergedArray.slice().sort((a, b) => b.projects.length - a.projects.length)
        setFilteredArray(sortedArray)
    }

    const filterBySkills = (e) => {
        const skillId = e.target.value;
        if (skillId === 'all') {
            setFilteredArray(publishedAlumni)
        }
        else {
            let mergedArray = [];

            for (let i = 0; i < publishedAlumni.length; i++) {
                let alu = publishedAlumni[i];

                let alumni_skills = allAlumniSkills.filter(item => item.alumni === alu.alumni)

                if (alumni_skills && alumni_skills.length) {
                    alu = { ...publishedAlumni[i], skills: [...alumni_skills] }
                }
                mergedArray.push(alu)
            }

            let filtered_alumni = [];
            for (let j = 0; j < mergedArray.length; j++) {
                let hasSkill = '';
                hasSkill = mergedArray[j].skills.find(skill => skill.profession === parseInt(skillId));
                if (hasSkill) {
                    filtered_alumni.push(mergedArray[j])
                }
                else {
                    console.log('no skills')
                }
            }
            setFilteredArray(filtered_alumni)
        }
    }

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >{publishedAlumni.length !== 0 ? 'Currently Published Alumni' : 'No Published Alumni Yet'}</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{ marginBottom: '16px', paddingLeft: '1%' }}>
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                filterByNumberOfProjects()
                            }}>sort by number of projects</Button> &nbsp; &nbsp; 
                        <Form.Control as="select"
                            size="md"
                            style={{width: '20%'}}
                            onChange={filterBySkills}>
                            <option value="all">--filter by Skills--</option>
                            {allSkills.map(skill => (
                                <option value={skill.id}>{skill.profession_name} </option>
                            ))}
                        </Form.Control> &nbsp; &nbsp; 
                        <Form.Control 
                            size="md"
                            type="number"
                            style={{width: '25%'}}
                            placeholder='filter by completion year'
                            onChange={filterByCompletionYear}>
                        </Form.Control> &nbsp; &nbsp; 
                        <Form.Control 
                            size="md"
                            type="number"
                            style={{width: '20%'}}
                            placeholder='filter by gpa'
                            onChange={filterByGpa}>
                        </Form.Control>
                </Row>
                <Row style={{ marginBottom: '16px' }}>
                    <Row style={{marginLeft: '35%'}}>{filteredArray.length === 0 ?
                        <Message variant="info">No data matched your filter</Message> : ''}</Row>
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
