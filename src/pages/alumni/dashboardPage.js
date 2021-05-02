import React from 'react'
import { Card, Button, Row, Col, Form } from 'react-bootstrap'

export const DashboardPage = () => {
    return (
        <Card>
            <Card.Header>
                <Row>
                    <Col md={4}>Logged In As Mbungi</Col>
                    <Col md={{span: 2, offset:6}}>12/05/2021</Col>
                </Row>
            </Card.Header>
        </Card>
    )
}
