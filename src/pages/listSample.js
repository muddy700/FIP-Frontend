import React from 'react'
import { List, Avatar, Space } from 'antd';
import { Button } from 'react-bootstrap'

import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const listData = [];
for (let i = 0; i < 23; i++) {
  listData.push({
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}

export const ListData = () => {
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                pageSize: 5,
            }}
            dataSource={listData}
            footer={ <div>footer part </div> }
            renderItem={item => (
                <List.Item
                    key={item.title}
                    extra={<>
                        <Button>Apply</Button>
                        <Button>View</Button></>
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<h5 >{item.title}</h5>}
                        // description={item.description}
                    />
                    
                    {item.content}
                </List.Item>
            )}
        />
)
}