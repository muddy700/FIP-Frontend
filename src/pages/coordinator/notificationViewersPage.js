import React, {useState, useEffect} from 'react'
import '../../App.css'
import { Table } from 'antd';
import { Button, Card} from 'react-bootstrap'
import Message from '../../components/message'
import { useHistory, useParams } from 'react-router-dom';
import { useSelector}  from 'react-redux'
import {  getAllNotificationsViews } from '../../app/api';
import { apiConfigurations} from '../../slices/userSlice';
import DataPlaceHolder from '../../components/dataPlaceHolder'
import { TimeAgo } from '../../components/timeAgo';

function NotificationViewersPage() { 
  
  const [page, setPage] = useState(1)
    
  const columns = [
  {
    title: 'S/No',
    key: 'index',
    render: ( value, object, index) =>  (page - 1) * 5 + (index+1),
  },
  {
    title: 'Organization',
    dataIndex: 'organization_name',
    key: 'id',
    render: text => <>{text}</>,
  },
  {
    title: 'Time Viewed',
    dataIndex: 'date_created',
    key: 'id',
    render: text => <><TimeAgo timestamp={text} /></>,
  },
    ];

    const param = useParams()
    const notificationId = param.id
    const history = useHistory();
    const config = useSelector(apiConfigurations)
    const [views, setViews] = useState([])
    // const [organizations, setOrganizations] = useState([])
    const [isFetchingData, setIsFetchingData] = useState(false)
    
    const goToPreviousPage = () => {
        history.goBack()
    }

    // const getOrganizations = async () => {
    //   setIsFetchingData(true)
    //     try {
    //         const response = await getOrganizationProfiles(config)
    //         setOrganizations(response)
    //         getViews()
    //     } catch (error) {
    //         setIsFetchingData(false)
    //         console.log({
    //             'Request': 'Getting All Notifications Request',
    //             'Error => ' : error.response.data,
    //         })
    //     }
    // }

    const getViews = async () => {
      setIsFetchingData(true)
        try {
            const response = await getAllNotificationsViews(config)
            const required_views = response.filter(item => item.notification === parseInt(notificationId))
            setViews(required_views)
            setIsFetchingData(false)
        } catch (error) {
            setIsFetchingData(false)
            console.log({
                'Request': 'Getting All Notifications Views Request',
                'Error => ' : error.response.data,
            })
        }
    }

    useEffect(() => {
        getViews();
        // getOrganizations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
    <Card >
        <Card.Header >
          <Message variant='info' >{views.length > 0 ? 'The following organizations have viewed the notification' : 'No any organization that viewed the notification yet.'}</Message>
        </Card.Header>
            <Card.Body style={{ overflowX: 'scroll' }}  >
          {isFetchingData ?
            <Message variant='info'> <DataPlaceHolder /> </Message> : <>
              {views.length > 0 ?
                <Table
                  columns={columns}
                  dataSource={views}
                  pagination={{ onChange(current) { setPage(current) }, pageSize: 5 }}
                // column={{ ellipsis: true }}
                /> :
                ''} </>
          }
             <Button
                variant="secondary"
                onClick={goToPreviousPage} >
                Back
            </Button>
       </Card.Body>
        </Card>
    )
}

export default NotificationViewersPage
