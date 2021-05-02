import React from 'react'
import Message from '../../components/message'
import { Button, Row, Col, Card, InputGroup, FormControl, Table } from 'react-bootstrap'

export const PostDetails = () => {
    return (
        <Card >
            <Card.Title>
                <Message  variant='info' >LATEST AVAILABLE POSTS</Message>  
            </Card.Title>
            <Card style={{padding: '16px'}}>
                <Card.Body style={{ padding: 0}}>
                    <Table striped bordered hover>
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
                                    <td className="post-properties">DESCRIPTION</td>
                                    <td>
                                        cdgvf fdsgd fwqe e4r5 rwedwq d eewf ewr qwd w
                                        cdgvf fdsgd fwqe e4r5 rwedwq d eewf ewr qwd w
                                        cdgvf fdsgd fwqe e4r5 rwedwq d eewf ewr qwd w
                                        cdgvf fdsgd fwqe e4r5 rwedwq d eewf ewr qwd w
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                <Card.Footer>
                    <Button>Apply</Button>
                </Card.Footer>
                </Card>
        </Card>
    )
}
