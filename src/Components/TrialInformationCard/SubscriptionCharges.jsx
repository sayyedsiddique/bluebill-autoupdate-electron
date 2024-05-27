import React from 'react'
import { Checkbox } from '@mui/material';

const SubscriptionCharges = ({ChargesData}) => {
    

    return (
        <div>
            {ChargesData?.map((value, index) => (
                < div className='subscription-content mb-3' key={index}>
                    <div className='d-flex gap-1'>
                        <Checkbox
                            className="p-0"
                            type="checkbox"
                            size="small"
                        /><p>{value.title}</p>
                    </div>
                    <p className="text-muted"><span className="charges-price text-dark">₹{value.price}</span></p>
                </div>
            ))
            }

        </div >
    )
}

export default SubscriptionCharges
