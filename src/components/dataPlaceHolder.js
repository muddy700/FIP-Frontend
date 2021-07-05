import {Spinner} from 'react-bootstrap'

const DataPlaceHolder = () => {
    return (
<div style={{width: '100%', height: '100%', display: 'grid', placeItems: 'center'}}>
    <span><Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    /> &nbsp; &nbsp; 
    Please wait...</span>
  </div>
    )
}

export default DataPlaceHolder