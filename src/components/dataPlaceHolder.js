import {Spinner} from 'react-bootstrap'

const DataPlaceHolder = () => {
    return (
<div style={{width: '100%', height: '100%', display: 'grid', placeItems: 'center'}}>
        {/* <span>&nbsp; &nbsp; &nbsp; &nbsp;  */}
        <span> 
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          // /> <br />
               /> &nbsp; &nbsp; 
          <i>Please wait...</i>
        </span>
  </div>
    )
}

export default DataPlaceHolder