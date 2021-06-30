import React from 'react'
import '../../styles/alumni.css'
import { Card, Row, Col } from 'react-bootstrap'
import { useSelector}  from 'react-redux'
import { selectUserData } from '../../slices/userSlice'

export const DashboardPage = () => {
    const user = useSelector(selectUserData)
    const currentDate = new Date().toLocaleDateString()

    return (
        <Card className="dashboard-container">
            <Card.Header>
                <Row>
                    <Col md={5}>Logged In As: {user.last_name.toUpperCase()} </Col>
                    <Col md={{ span: 2, offset: 5 }} xs={{ span: 6 }}>{ currentDate }</Col>
                </Row>
            </Card.Header>
        </Card>
    )
}
