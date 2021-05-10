import React, {useState, useEffect} from 'react'
import Message from '../../components/message'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Table, Tag, Space } from 'antd';
import { } from 'antd';
import {DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';
import { useSelector, useDispatch}  from 'react-redux'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { fetchalumniProjects } from '../../app/api';


const ProjectsPage = () => {
    
    const columns = [
      {
        title: 'S/N',
        dataIndex: 'sn',
        key: 'sn',
        // ellipsis: 'true',
        render: text => <a>{text}</a>,
      },
      // {
      //   title: 'Date Added',
      //   dataIndex: 'project_date_created',
      //   key: 'date',
      //   // ellipsis: 'true'
      // },
      {
        title: 'Project Title',
        key: 'project_title',
        // ellipsis: 'true',
        dataIndex: 'project_title'
      },
      {
        title: 'Sponsor',
        key: 'project_sponsor',
        // ellipsis: 'true',
        dataIndex: 'project_sponsor'
      },
      {
        title: 'Year',
        key: 'year',
        // ellipsis: 'true',
        dataIndex: 'project_year'
      },
      {
        title: 'Status',
        key: 'status',
        // ellipsis: 'true',
        dataIndex: 'project_recommendation_status',
        render: record => <Tag color={record.project_recommendation_status ? "green" : "red"}>
                  {record.project_recommendation_status ? "accepted" : "pending"}
                </Tag>
      },
      {
        title: 'Action',
        // ellipsis: 'true',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <Button variant="link"
              size="sm"
              onClick={e => { e.preventDefault(); setModalShow(true) }}>
              <Icon glyph="view" size={32} />
            </Button>
            <Button variant="link"
              size="sm">
              <DownloadOutlined style={{ fontSize: '20px' }} />
            </Button>
            <Button variant="link"
              size="sm">
              <UploadOutlined style={{ fontSize: '20px' }}/>
            </Button>
          </Space>
        ),
      },
      ];
    const [modalShow, setModalShow] = useState(false);
    const modalTitle = "Project Report"
    const modalContent = "Report File"
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [alumniProjects, setalumniProjects] = useState([])
  
  const getAlumniProjects = async () => {

    try {
      const response = await fetchalumniProjects(user.userId, config)
      setalumniProjects(response)
    } catch (error) {
        console.log({
            'Request': 'Getting Alumni Projects Request',
            'Error => ' : error,
        })
    }
  }
    

useEffect(() => {
  getAlumniProjects()
}, [])
  
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Projects List</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          <Button>Add Project</Button>
          <Table columns={columns} dataSource={alumniProjects} pagination={{pageSize: 5}} column={{ellipsis: true}} />
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

export default ProjectsPage
