import React from 'react'

const EmptyProductsCategoryMessege = () => {
    return (
        <div>

            <div className=" category-empty-cart-container">
                <div className="category-empty-cart-logo">
                    <img
                        src="https://www.shoreexcursioneer.com/mobile/images/mini-empty-cart.png"
                        alt="Empty Cart Logo"
                        width={200}
                    />
                </div>
                <div className="category-empty-cart-messege">
                    <h6>
                        This category doesn't have any products.
                    </h6>
                </div>
            </div>

        </div>
    )
}

export default EmptyProductsCategoryMessege
