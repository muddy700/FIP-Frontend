import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getOrganizationFieldPosts, getProfessions, getPrograms, getFieldPostProfessions, getFieldPostPrograms } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const FieldChances = () => {
  const [page, setPage] = useState(1)

  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
    const [modalShow, setModalShow] = useState(false);
    const [editingMode, setEditingMode] = useState(false)

    const [fieldPosts, setFieldPosts] = useState([])
    const [allSkills, setAllSkills] = useState([])
    const [allPrograms, setAllPrograms] = useState([])
    const [postPrograms, setPostPrograms] = useState([])
    const [postSkills, setPostSkills] = useState([])
    const [filteredArray, setFilteredArray] = useState([])


    const closeModal = () => {
        setModalShow(false)
    }
    
    
  const fetchFieldPosts = async () => {
        try {
          const response = await getOrganizationFieldPosts(user.userId, config)
          const arrangedByDate = response.slice().sort((a, b) => b.date_updated.localeCompare(a.date_updated))
        //   const newPosts = arrangedByDate.filter(post => post.status === 'test')
            setFieldPosts(arrangedByDate)
            // console.log(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Organization Field Posts Request',
                'Error => ': error.response.data
            })
        }
    }
    

    const fetchProfessions = async () => {
        try {
          const response = await getProfessions(config)
            setAllSkills(response)
            // console.log(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Professions Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchallPrograms = async () => {
        try {
          const response = await getPrograms(config)
            setAllPrograms(response)
            // console.log(response)
        } catch (error) {
            console.log({
                'request': 'Fetch allPrograms Request',
                'Error => ': error.response.data
            })
        }
    }

    const fetchFieldPostProfessions = async () => {
        try {
          const response = await getFieldPostProfessions(config)
            setPostSkills(response)
            mergeFieldPostInfo()
            // console.log(response)
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
            mergeFieldPostInfo()
            // console.log(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Field Post Programs Request',
                'Error => ': error.response.data
            })
        }
    }

    const mergeFieldPostInfo = () => {
        let merged_posts = [];

        for (let i = 0; i < fieldPosts.length; i++) {
            let obj = fieldPosts[i];

            let post_programs = postPrograms.filter(item => item.post === obj.id)

            if (post_programs && post_programs.length) {
                obj = {...obj, programs: [...post_programs]}
            }

            let post_skills = postSkills.filter(item => item.post === obj.id)

            if (post_skills && post_skills.length) {
                obj = {...obj, skills: [...post_skills]}
            }

            merged_posts.push(obj)
        }

        setFilteredArray(merged_posts)
        // console.log(merged_posts)
    }

    useEffect(() => {
        fetchFieldPosts();
        fetchProfessions();
        fetchallPrograms();
        fetchFieldPostProfessions();
        fetchFieldPostPrograms();
        mergeFieldPostInfo()
    }, [])

    useEffect(() => {
        mergeFieldPostInfo()
    }, [postPrograms.length && postSkills.length])

    const calculateTotalChances = (chances) => {
        let sum = 0;
        // chances.map(item => )
        for (let i = 0; i < chances.length; i++) {
            sum += chances[i]
        }
        return sum
    }

    const modalTitle = 'Fill Post Informations'
    const modalContent = 
    <Form onSubmit="">
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput1">
          <Form.Label>Job Title</Form.Label>
          <Form.Control as="select"
              size="md"
              disabled={editingMode}
            //   value={newPost.profession}
            //   onChange={onPostFormChange}
              name="profession">
              <option>---Select Job Title---</option>
              {allSkills.map(skill => (
                <option value={skill.id}>{skill.profession_name} </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col} controlId="InternshipPostInput2">
          <Form.Label>Free Chances</Form.Label>
          <FormControl
            placeholder="Enter Free Chances"
            type="number"
            aria-label="Message Content"
            name="post_capacity"
            // value={newPost.post_capacity}
            aria-describedby="basic-addon2"
            // onChange={onPostFormChange}
            />
          </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} controlId="InternshipPostInput3">
          <Form.Label>Post Description</Form.Label>
          <FormControl
            placeholder="post description"
            type="text"
            aria-label="Message Content"
            name="post_description"
            // value={newPost.post_description}
            aria-describedby="basic-addon2"
            // onChange={onPostFormChange}
            />
          </Form.Group>
        <Form.Group as={Col} controlId="InternshipPostInput4">
          <Form.Label>Expiry Date</Form.Label>
          <FormControl
            placeholder="Expiry Date"
            type="date"
            aria-label="Message Content"
            name="expiry_date"
            // value={newPost.expiry_date}
            aria-describedby="basic-addon2"
            // onChange={onPostFormChange}
            />
        </Form.Group>
      </Form.Row>
      <Button
                type="submit"
                disabled
        // variant={editingMode ? 'success' : 'primary'}
                // style={{ float: 'right' }}>{postError !== '' ? 'try again' : editingMode ? 'Save' : 'Send'}
                > send</Button>
      <Button
                variant="danger"
                hidden
        // hidden={postError === '' ? true : false}
            >
                {/* {postError} */}
            </Button>
    </Form> 

    return (
    <Card >
        <Card.Header >
                <Message variant='info' >Currently Field Posts</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{ marginBottom: '16px', paddingLeft: '1%' }}>
                    <Button
                        onClick={e => {
                            e.preventDefault();
                            setModalShow(true)
                        }}
                    >Add Field Post</Button>
                </Row>
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
                                        <span style={{ width: '100%' }}><b>Ref No :</b> &nbsp; {post.reference_number} </span>
                                        <Col md={3}>
                                            <span><b>Total Chances: </b>
                                                {post.post_capacity ? post.post_capacity :
                                                post.programs && post.skills ? (calculateTotalChances(post.programs.map(prog => prog.program_capacity)) + calculateTotalChances(post.skills.map(skil => skil.profession_capacity))) :
                                                post.programs ? calculateTotalChances(post.programs.map(prog => prog.program_capacity)) :
                                                calculateTotalChances(post.skills.map(skil => skil.profession_capacity))
                                                } </span><br />
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
                                        {/* <Link style={{marginLeft: '85%'}} to={{pathname: `/alumni/${post.id}/details` }}> */}
                                            <Button variant="link" >Edit</Button>
                                            <Button variant="link" style={{color:  'red'}}>Delete</Button>
                                        {/* </Link> */}
                                    </Row>
                                </List.Item>
                            )}
                        />
                    </Row>
            </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={false}
        title={modalTitle}
        content={modalContent}
        onHide={closeModal}
      />
            </Card>
    )
}

export default FieldChances
