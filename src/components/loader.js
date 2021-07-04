import React from 'react'
import {Spinner} from 'react-bootstrap'

const Loader = ({message}) => {
    return (
<span>
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    /> &nbsp; &nbsp; &nbsp;
    {message}
  </span>
    )
}

export default Loader



