import React from 'react'
import Message from '../../components/message'
import { Button, Row, Col, Card, InputGroup, FormControl, Table } from 'react-bootstrap'

export const PostDetails = () => {
    return (
        <Card >
            <div>
                <Message  variant='info' >Post Details</Message>  
            </div>
            <Card style={{padding: '16px'}}>
                <Card.Body style={{ padding: 0, overflow: 'scroll'}}>
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
                                        cdgvffdsgdfwqee4r5rwedwqdeewfwqwd w
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
