import React, {useState} from 'react'
import { Table, Tag, Space } from 'antd';
import Card   from 'react-bootstrap/Card'
import Button  from 'react-bootstrap/Button'
import Message from '../../components/message';
import '../../styles/alumni.css'
import Icon from 'supercons'
import ContentModal from '../../components/contentModal';

const data = [
  {
    key: '1',
    sn: '1',
    organization: 'John Brown',
    professions: 'developer',
    status: 'pending',
  },
  {
    key: '2',
    sn: '2',
    organization: 'John Brown',
    professions: 'developer',
    status: 'rejected',
  },
  {
    key: '3',
    sn: '3',
    organization: 'John Brown Mka csd ncsdc',
    professions: 'nice', 
    status: 'accepted',
  },
  {
    key: '4',
    sn: '4',
    organization: 'John Brown',
    professions: 'nice', 
    status: 'pending',
  },
  {
    key: '5',
    sn: '5',
    organization: 'John Brown',
    professions: 'nice',
    status: 'accepted',
  },
  {
    key: '6',
    sn: '6',
    organization: 'John Brown',
    professions: 'nice',
    status: 'pending',
  },
];

const ResultsPage = () => {
  const [modalShow, setModalShow] = useState(false);
  
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
    dataIndex: 'organization',
    key: 'organization',
    // ellipsis: 'true'
  },
  {
    title: 'Professions',
    key: 'professions',
    // ellipsis: 'true',
    dataIndex: 'professions'
  },
  {
    title: 'Status',
    key: 'status',
    // ellipsis: 'true',
    dataIndex: 'status',
    render: text => <Tag color={text === "pending" ? "lightgray" : 
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
          <Icon glyph="view" size={32} />
        </Button>
        {record.status === 'accepted' ? <>
        <Button size="sm" variant="link">Confirm</Button>
        <Button variant="danger" size="sm">Drop</Button></> : ''}
      </Space>
    ),
  },
  ];

  const modalContent =  <>
            <tbody>
                <tr>
                    <td className="post-properties">ORGANIZATION</td>
                    <td>Softnet</td>
                </tr>
                <tr>
                    <td className="post-properties">PROFESSION</td>
                    <td>@Database</td>
                </tr>
                <tr>
                    <td className="post-properties">CAPACITY</td>
                    <td>12</td>
                </tr>
                <tr>
                    <td className="post-properties">EXPIRE DATE</td>
                    <td>12/5/2021</td>
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
          <Message variant='info' >Dear Timotheo, You have applied the folloving companies</Message>
        </Card.Header>
        <Card.Body style={{ overflowX:'scroll'}}  >
          <Table columns={columns} dataSource={data} pagination={{pageSize: 5}} column={{ellipsis: true}} />
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
