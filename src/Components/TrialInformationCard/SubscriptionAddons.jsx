import React from 'react'
import { Checkbox } from '@mui/material'

const SubscriptionAddons = ({addonsData}) => {
    
    return (

        <div>
            {addonsData?.map((value, index) => (
                <div key={index} className='subscription-content mb-3'>
                    <div className='d-flex gap-1'>
                        <Checkbox
                            className="p-0"
                            type="checkbox"
                            size="small"
                        />
                        <p>{value.title}</p>
                    </div>
                    <p className="text-muted d-flex gap-1">
                        <s className="text-danger"> ₹{value.discountedPrice}</s>
                        <span className="text-dark">₹{value.price}/yr/per unit </span>
                    </p>
                </div>
            ))}
        </div>




    )
}

export default SubscriptionAddons
