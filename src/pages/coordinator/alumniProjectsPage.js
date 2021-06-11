import React, {useState, useEffect} from 'react'
import Message from '../../components/message'
import { Card, Row, Col, Button,Form } from 'react-bootstrap'
import { Table, Tag, Space } from 'antd';
import { } from 'antd';
import {DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';
import { useSelector, useDispatch } from 'react-redux'
import  Loader  from '../../components/loader'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { PullProjectsWithoutMembers, recommendProject,} from '../../app/api';



function AlumniProjectsPage() {
    
    const columns = [
      {
        title: 'S/No',
        key: 'index',
        render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
      },
      {
        title: 'Project Title',
        key: 'title',
        // ellipsis: 'true',
        dataIndex: 'title'
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
        dataIndex: 'year',
        render: text => <span>{text.substr(0,4)} </span>
      },
      {
        title: 'Status',
        key: 'status',
        // ellipsis: 'true',
        dataIndex: 'recommendation_status',
        render: text => <Tag color={text ? "green" : "red"}>
                  {text? 'recommended' : 'pending'}
                </Tag>
      },
      {
        title: 'Action',
        // ellipsis: 'true',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                {record.recommendation_status ? '' : <>
                    <Button variant='link'
                        size="sm"
                        onClick={e => {
                            e.preventDefault();
                            setModalShow(true);
                            setModalContent(<object
                                type="application/pdf"
                                data={record.report}
                                width="100%"
                                height="500px"
                            >{record.title}</object>)
                        }}
                    >View Report
                    </Button>
                    <Button
                        variant={activeProject.id === record.id ? 'info' : 'link'}
                        style={{width: 'fitContent'}}
                        size="sm"
                        onClick={e => {
                            e.preventDefault();
                            acceptRecommendationRequest(record);
                            setActiveProject(record)
                        }}
                    >{isLoading && activeProject.id === record.id ? 
                    <Loader message='Loading...' /> : 'Recommend'} 
            </Button> </>}
          </Space>
        ),
      },
  ];
  
    
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)
    const [page, setPage] = useState(1)
    const [modalShow, setModalShow] = useState(false);
    const [allAlumniProjects, setAllAlumniProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [activeProject, setActiveProject] = useState({})
    const [isLoading, setIsLoading] = useState(false)

      
    const getAllProjects = async () => {
        
        try {
            const response = await PullProjectsWithoutMembers(config)
            let sortedArray = response.slice().sort((a, b) => b.date_added.localeCompare(a.date_added))
            setAllAlumniProjects(sortedArray)
            setFilteredProjects(sortedArray)
        } catch (error) {
        console.log({
            'Request': 'Getting All Alumni Projects Request',
            'Error => ' : error.response.data,
        })
        }
    }
  
    useEffect(() => {
        getAllProjects()
    }, [])


    const sortByRecommendationStatus = (value) => {
        // const sortedArray = allAlumniProjects.slice().sort((a, b) => b.date_added.localeCompare(a.date_added))
        let sortedArray = [];
        if (value === 1) {
            sortedArray = allAlumniProjects.filter(item => item.recommendation_status)
        }
        else if (value === 0) {
            sortedArray = allAlumniProjects.filter(item => !item.recommendation_status)
        }
        else {
            sortedArray = allAlumniProjects
        }
        setFilteredProjects(sortedArray)
    }

    const acceptRecommendationRequest = async (record) => {
        setIsLoading(true)
        const blob = await (await fetch(record.report)).blob();
        const report_file = new File([blob], `${record.title}.pdf`, { type: "application/pdf", lastModified: new Date() });

        const payload = new FormData()
        payload.append('id', record.id)
        payload.append('year', record.year)
        payload.append('title', record.title)
        payload.append('sponsor', record.sponsor)
        payload.append('report', report_file)
        payload.append('recommendation_status', true)

        try {
            const response = await recommendProject(record.id, payload, config)
            const newProjectsList = allAlumniProjects.map(item => item.id === response.id ? response : item)
            setAllAlumniProjects(newProjectsList)
            setFilteredProjects(newProjectsList)
            setIsLoading(false)
            setActiveProject({})
        } catch (error) {
            console.log('Accept Project Recommendation Request ', error.response.data)
        }
    }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Projects List</Message>
        </Card.Header>
        <Card.Body style={{ overflowX: 'scroll' }}  >
          <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus(1)} }>Recommended</Button>
          <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus(0)} }>Pending</Button>
          <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus('')} }>All</Button>
          <Table
            columns={columns}
            dataSource={filteredProjects}
            pagination={{ onChange(current) {setPage(current)}, pageSize: 5 }}
            column={{ ellipsis: true }} />
       </Card.Body>
            <ContentModal
                show={modalShow}
                isTable={false}
                title={modalTitle}
                content={modalContent}
                onHide={() => { setModalShow(false); setModalContent(''); setModalTitle('') }}
        />
    </Card>
    )
}

export default AlumniProjectsPage
