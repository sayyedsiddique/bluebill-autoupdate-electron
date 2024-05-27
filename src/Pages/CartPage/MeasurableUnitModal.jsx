import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'

const MeasurableUnitModal = (props) => {
    const {t}= useTranslation()
    const[check,setCheck]=useState(props?.measurableQuentity?false:true)
    const[quentity,setQuentity]=useState(props?.measurableQuentity)
    const inputHandler=(e)=>{
     
      let re=/\d{0,2}(\.\d{1,2})?/
      
     if(re.test(e.target.value)){
      setQuentity(e.target.value)
     }
    }

    const handleSubmit=()=>{
      console.log("quentity",quentity)
      props.setMeasurableQuentity(quentity)
      props.setMeasurableUnitModal(false)
      props.handleUnitMeasurable(parseFloat(quentity),check)
    }

  return (
    <Modal
        size="small"
        isOpen={props.measurableUnitModal}
        toggle={() => props.setMeasurableUnitModal(!props.measurableUnitModal)}
      >
        <ModalHeader toggle={() => props.setMeasurableUnitModal(!props.measurableUnitModal)} className="popup-modal">
         Measurable {props.productName} Product
        </ModalHeader>
        <ModalBody className="popup-modal">
         
          <h5>Please enter the quentity in {props?.measurableUnitName}</h5>
          <div>
          <TextField
                  id="outlined-size-small"
                  size="small"
                  name="storeName"
                  defaultValue={quentity && quentity}
                  value={quentity}
                  onChange={inputHandler}
                  inputProps={{ maxLength: 3 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                      marginTop: 5,
                      marginBottom: 5,
                    }}
                  >
                    submit
                  </Button>
          </div>
         

        </ModalBody>
      </Modal>
  )
}

export default MeasurableUnitModal