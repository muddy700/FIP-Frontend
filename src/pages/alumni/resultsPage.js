import React, {useState, useEffect} from 'react'
import { Table, Tag, Space } from 'antd';
import Card   from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'
import Message from '../../components/message';
import '../../styles/alumni.css'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';
import { getAlumniApplications } from '../../app/api';
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { useSelector, useDispatch}  from 'react-redux'

const ResultsPage = () => {
  const [modalShow, setModalShow] = useState(false);
  const [alumniApplications, setAlumniApplications] = useState([])
  const [activeApplication, setActiveApplication] = useState({})
  const config = useSelector(apiConfigurations)
  const user = useSelector(selectUserData)
  
  const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    // ellipsis: 'true',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Organization',
    dataIndex: 'organization_name',
    key: 'organization',
    // ellipsis: 'true'
  },
  {
    title: 'Profession',
    key: 'professions',
    // ellipsis: 'true',
    dataIndex: 'post_profession'
  },
  {
    title: 'Status',
    key: 'status',
    // ellipsis: 'true',
    dataIndex: 'status',
    render: text => <Tag color={text === "received" ? "lightgray" : 
      text === "accepted" ? "green" : "red"}>
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
          <Icon glyph="view" size={32} onClick={e => { e.preventDefault(); viewApplication(record.id) }} />
        </Button>
        {record.status === 'accepted' ? <>
        <Button size="sm" variant="link">Confirm</Button>
        <Button variant="danger" size="sm">Drop</Button></> : ''}
      </Space>
    ),
  },
  ];

  const viewApplication = (id) => {
    console.log(id)
    const selectedApplication = alumniApplications.find((application) => application.id === id)
    setActiveApplication(selectedApplication)
  }
  const fetchAlumniApplications = async () => {
    try {
      const response = await getAlumniApplications(user.userId, config)
      const newRes = response.slice().sort((a, b) => b.date_applied.localeCompare(a.date_applied))
      setAlumniApplications(newRes)
    } catch (error) {
            console.log({
                'request': 'Fetch Alumni Applications Request',
                'Error => ': error
            })
    }
  }

  useEffect(() => {
    fetchAlumniApplications()
  }, [])

  const modalContent =  <>
            <tbody>
                <tr>
                    <td className="post-properties">ORGANIZATION</td>
        <td>{activeApplication.organization_name} </td>
                </tr>
                <tr>
                    <td className="post-properties">PROFESSION</td>
        <td>{activeApplication.post_profession}</td>
                </tr>
                <tr>
                    <td className="post-properties">CAPACITY</td>
                    <td>{activeApplication.post_capacity}</td>
                </tr>
                <tr>
                    <td className="post-properties">ORGANIZATION ADDRESS</td>
                    <td>
                        cdgvffdsgdfwqee4r5rwedwqdeewfwqwd w
                    </td>
                </tr>
            </tbody>
        </>
  const modalTitle = "Application Details";

  return (
    <Card >
        <Card.Header >
          <Message variant='info' >Dear {user.username}, You have applied the folloving companies</Message>
        </Card.Header>
        <Card.Body style={{ overflowX:'scroll'}}  >
          <Table columns={columns} dataSource={alumniApplications} pagination={{pageSize: 5}} column={{ellipsis: true}} />
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

export default ResultsPage
