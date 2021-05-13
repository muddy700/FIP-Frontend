import React, {useState, useEffect} from 'react'
import '../../App.css'
import { List, Avatar, Space, Tag, Table } from 'antd';
import Icon from 'supercons'
import { Button, Row, Col, Card, InputGroup, FormControl } from 'react-bootstrap'
import Message from '../../components/message'
import { Link } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import { getAlumniApplications, getOrganizationInternshipPosts, pullInternshipPosts } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import ContentModal from '../../components/contentModal';

const InternshipChances = () => {

    
  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Profession',
    key: 'professions',
    // ellipsis: 'true',
    dataIndex: 'profession_name'
  },
  {
    title: 'Date Created',
    key: 'date_created',
    // ellipsis: 'true',
    dataIndex: 'date_created'
  },
  {
    title: 'Action',
    // ellipsis: 'true',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); setModalShow(true) }}>
          <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} />
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); setModalShow(true) }}>
          <Icon glyph="edit" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} />
        </Button>
        <Button variant="link" size="sm"
          onClick={e => { e.preventDefault(); setModalShow(true) }}>
          <Icon glyph="delete" size={32} onClick={e => { e.preventDefault(); viewPost(record.id) }} />
        </Button>
      </Space>
    ),
  },
    ];

    const [modalShow, setModalShow] = useState(false);
    const config = useSelector(apiConfigurations)
    const user = useSelector(selectUserData)
    const [selectedPost, setSelectedPost] = useState({})
    const [internshipPosts, setInternshipPosts] = useState([])

    const viewPost = () => {

    }

    const fetchInternshipPosts = async () => {
        try {
            const response = await getOrganizationInternshipPosts(user.userId, config)
            setInternshipPosts(response)
        } catch (error) {
            console.log({
                'request': 'Fetch Organization Internship Posts Request',
                'Error => ': error
            })
        }
    }

    useEffect(() => {
      fetchInternshipPosts()
    }, [])

  const modalContent =  <>
            <tbody>
                <tr>
                    <td className="post-properties">ORGANIZATION</td>
                    <td>{selectedPost.organization_name} </td>
                </tr>
                <tr>
                    <td className="post-properties">PROFESSION</td>
                    <td>{selectedPost.post_profession}</td>
                </tr>
                <tr>
                    <td className="post-properties">CAPACITY</td>
                    <td>{selectedPost.post_capacity}</td>
                </tr>
                <tr>
                    <td className="post-properties">ORGANIZATION ADDRESS</td>
                    <td> cdgvffdsgdfwqee4r5rwedwqdeewfwqwd w </td>
                </tr>
            </tbody>
        </>
  const modalTitle = "Post Details";

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have Posted The Following Chances</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                
                <Row style={{marginBottom: '16px'}}>
                    <Col md={{ span: 3, offset: 9 }}>
                                       <InputGroup>
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
                    </Col>
                </Row>
                <hr/>
          <Table columns={columns} dataSource={internshipPosts} pagination={{pageSize: 5}} column={{ellipsis: true}} />
       </Card.Body>
        <ContentModal
        show={modalShow}
        isTable={true}
        title={modalTitle}
        content={modalContent}
        onHide={() => setModalShow(false)}
      />
        </Card>
    )
}

export default InternshipChances
