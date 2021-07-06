import React, {useState, useEffect} from 'react'
import Message from '../../components/message'
import { Card, Row, Button } from 'react-bootstrap'
import { Table, Tag, Space } from 'antd';
import { } from 'antd';
import ContentModal from '../../components/contentModal';
import { useSelector} from 'react-redux'
import  Loader  from '../../components/loader'
import { apiConfigurations, } from '../../slices/userSlice';
import { PullProjectsWithoutMembers, recommendProject,} from '../../app/api';
import DataPlaceHolder from '../../components/dataPlaceHolder'

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
        render: text => <Tag color={text === 'accepted' ? "green" : text === 'pending' ? 'lightgray' : "red"}>
                  {text}
                </Tag>
      },
      {
        title: 'Action',
        // ellipsis: 'true',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                {record.recommendation_status === 'accepted' || record.recommendation_status === 'rejected' ? '' : <>
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
                    </Button>
                    <Button
                        variant={activeProject.id === record.id ? 'info' : 'link'}
                        style={{width: 'fitContent', color: 'red'}}
                        size="sm"
                        onClick={e => {
                            e.preventDefault();
                            rejectRecommendationRequest(record);
                            setActiveProject(record)
                        }}
                    >{isRejecting && activeProject.id === record.id ? 
                    <Loader message='Loading...' /> : 'Reject'} 
                    </Button>
                </>}
          </Space>
        ),
      },
  ];
    
    const config = useSelector(apiConfigurations)
    const [page, setPage] = useState(1)
    const [modalShow, setModalShow] = useState(false);
    const [allAlumniProjects, setAllAlumniProjects] = useState([])
    const [filteredProjects, setFilteredProjects] = useState([])
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState('')
    const [activeProject, setActiveProject] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [isRejecting, setIsRejecting] = useState(false)

      
    const getAllProjects = async () => {
        setIsFetchingData(true)
        try {
            const response = await PullProjectsWithoutMembers(config)
            let sortedArray = response.slice().sort((a, b) => b.date_added.localeCompare(a.date_added))
            setAllAlumniProjects(sortedArray)
            setFilteredProjects(sortedArray)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log({
            'Request': 'Getting All Alumni Projects Request',
            'Error => ' : error.response.data,
        })
        }
    }
  
    useEffect(() => {
        getAllProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const sortByRecommendationStatus = (value) => {
        // const sortedArray = allAlumniProjects.slice().sort((a, b) => b.date_added.localeCompare(a.date_added))
        let sortedArray = [];
        if (value === 1) {
            sortedArray = allAlumniProjects.filter(item => item.recommendation_status === 'pending')
        }
        else if (value === 2) {
            sortedArray = allAlumniProjects.filter(item => item.recommendation_status === 'rejected')
        }
        else if (value === 3) {
            sortedArray = allAlumniProjects.filter(item => item.recommendation_status === 'accepted')
        }
        else {
            sortedArray = allAlumniProjects
        }
        console.log(sortedArray)
        setFilteredProjects(sortedArray)
    }

    const acceptRecommendationRequest = async (record) => {
        setIsLoading(true)

        const { report, ...rest } = record;
        const payload = {...rest, recommendation_status: 'accepted'}

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

    const rejectRecommendationRequest = async (record) => {
        setIsRejecting(true)

        const { report, ...rest } = record;
        const payload = {...rest, recommendation_status: 'rejected'}

        try {
            const response = await recommendProject(record.id, payload, config)
            const newProjectsList = allAlumniProjects.map(item => item.id === response.id ? response : item)
            setAllAlumniProjects(newProjectsList)
            setFilteredProjects(newProjectsList)
            setIsRejecting(false)
            setActiveProject({})
        } catch (error) {
            console.log('Rejecting Project Recommendation Request ', error.response.data)
        }
    }

    return (
    <Card >
        <Card.Header >
          <Message variant='info' >Projects List</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
                <Row style={{marginBottom: '16px'}}>
                    <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus(1)} }>Pending</Button>
                    <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus(2)} }>Rejected</Button>
                    <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus(3)} }>Recommended</Button>
                    <Button style={{marginRight: '3%'}} onClick={e => { e.preventDefault(); sortByRecommendationStatus('')} }>All</Button>
                </Row>
                {isFetchingData ?
                    <Message variant='info'> <DataPlaceHolder /> </Message> : <>
                        <Table
                            columns={columns}
                            dataSource={filteredProjects}
                            pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                            column={{ ellipsis: true }} /> </>
                }
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
