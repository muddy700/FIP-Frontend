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
                    <Col md={4}>Logged In As: {user.first_name.toUpperCase()} {user.last_name.toUpperCase()}  </Col>
                    {/* <Col md={4}>Logged In As: {user.first_name[0].toUpperCase() + user.first_name.substr(1)} {user.last_name[0].toUpperCase() + user.last_name.substr(1)}  </Col> */}
                    <Col md={{span: 2, offset:6}} xs={{span: 6}}>{ currentDate }</Col>
                </Row>
            </Card.Header>
        </Card>
    )
}
