import React from 'react'

import "../../../StyleSheet/Status.css"
const DeliveryStatus = (props) => {

 const ForTest=()=>{
 alert("helllo")
  }
  
  return (
    <div >
        <p className='deliveryPath' onClick={ForTest}>{props.children}</p>
    </div>
  )
}

export default DeliveryStatus;