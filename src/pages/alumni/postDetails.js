import React from 'react'
import Message from '../../components/message'
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, Table } from 'react-bootstrap'
import { getPostById } from '../../slices/internshipPostSlice';
import { useSelector}  from 'react-redux'

export const PostDetails = () => {
    const location = useLocation();
    const history = useHistory();

    const goToPreviousPage = () => {
        history.goBack()
    }
    const internship_post = useSelector(state => getPostById(state, location.postId ))
    return (
        <Card >
            <div>
                <Message  variant='info' >Post Details  </Message>  
            </div>
            <Card style={{padding: '16px'}}>
                <Card.Body style={{ padding: 0, overflow: 'scroll'}}>
                    <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td className="post-properties">ORGANIZATION</td>
                                <td>{internship_post.organization_name} </td>
                                </tr>
                                <tr>
                                    <td className="post-properties">JOB TITLE</td>
                                <td>{internship_post.profession_name}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">CAPACITY</td>
                                <td>{internship_post.post_capacity} </td>
                                </tr>
                                <tr>
                                    <td className="post-properties">MINIMUM GPA</td>
                                <td>{internship_post.minimum_gpa} </td>
                                </tr>
                                <tr>
                                    <td className="post-properties">EXPIRE DATE</td>
                                    <td>{internship_post.expiry_date}</td>
                                </tr>
                                <tr>
                                    <td className="post-properties">DESCRIPTION</td>
                                    <td>{internship_post.post_description}</td>
                                </tr>
                            </tbody>
                        </Table>
                </Card.Body>
                <Card.Footer>
                    {/* <Button>Apply</Button> */}
                    <Button
                        variant="secondary"
                        style={{marginLeft: '10px'}}
                        onClick={goToPreviousPage} >
                        Back
                    </Button>
                </Card.Footer>
                </Card>
        </Card>
    )
}
