import React from 'react'
import { Table, Tag, Space } from 'antd';

  
const columns = [
  {
    title: 'S/N',
    dataIndex: 'sn',
    key: 'sn',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Organization',
    dataIndex: 'organization',
    key: 'organization',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Professions',
    key: 'professions',
    dataIndex: 'professions',
    render: professions => (
      <>
        {professions.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render: text =>  <Tag color="green">
              {text}
            </Tag>
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <a>Confirm </a>
        <a>Drop</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    sn: '1',
    organization: 'John Brown',
    address: 'New York No. 1 Lake Park',
    professions: ['nice', 'developer'],
    status: 'pending',
  },
  {
    key: '2',
    sn: '2',
    organization: 'John Brown',
    address: 'New York No. 1 Lake Park',
    professions: ['nice', 'developer'],
    status: 'pending',
  },
  {
    key: '3',
    sn: '3',
    organization: 'John Brown',
    address: 'New York No. 1 Lake Park',
    professions: ['nice', 'developer'],
    status: 'pending',
  },
];

const ResultsPage = () => {
  return (
       <div>
            <h1>Result Page</h1>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}

export default ResultsPage
