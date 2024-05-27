import React from 'react'
import { FcCheckmark } from 'react-icons/fc'

const SubscriptionFeatures = ({FeaturesData}) => {


    return (
        <>
            {FeaturesData?.map((value, index) => (
                <p className="subscription-content mb-3" key={index}>
                    <FcCheckmark /> {value}
                </p>
            ))}

        </>



    )
}

export default SubscriptionFeatures
