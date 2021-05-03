import React, {useState} from 'react'
import Message from '../../components/message'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Table, Tag, Space } from 'antd';
import { } from 'antd';
import {DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';

const ProjectsPage = () => {
    
    const columns = [
      {
        title: 'S/N',
        dataIndex: 'sn',
        key: 'sn',
        // ellipsis: 'true',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Date Added',
        dataIndex: 'date',
        key: 'date',
        // ellipsis: 'true'
      },
      {
        title: 'Project Title',
        key: 'project_title',
        // ellipsis: 'true',
        dataIndex: 'project_title'
      },
      {
        title: 'Sponsor',
        key: 'sponsor',
        // ellipsis: 'true',
        dataIndex: 'sponsor'
      },
      {
        title: 'Year',
        key: 'year',
        // ellipsis: 'true',
        dataIndex: 'year'
      },
      {
        title: 'Status',
        key: 'status',
        // ellipsis: 'true',
        dataIndex: 'status',
        render: text => <Tag color={text === "pending" ? "lightgray" : 
          text === "recommended" ? "green" : "red"}>
                  {text}
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

const projectsList = [];
for (let i = 0; i < 50; i++) {
  projectsList.push({
      sn: `${i+1}`,
      date: "12/5/2021",
      sponsor: "UDOM",
      project_title: "Field And Internship Post",
      year: 2020,
      status: "recommended",
  });
}

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Projects List</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Button>Add Project</Button>
          <Table columns={columns} dataSource={projectsList} pagination={{pageSize: 5}} column={{ellipsis: true}} />
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
