import React from 'react'
import { Card,Row, Col } from 'react-bootstrap'

const ProfilePage = () => {
    return (
        <div>
            <Row >
                <Col md={6} xs={12} style={{ backgroundColor: 'red', height: '300px', marginBottom: '50px', padding: '10px' }}>
                    <Card>
                    <h6>info</h6>
                    </Card>
                </Col>
                <Col md={2} ></Col>
                <Col md={4} xs={12} style={{ backgroundColor: 'green', height: '100px', padding: '10px' }}>
                    <Card>
                    <h1>image</h1>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProfilePage
