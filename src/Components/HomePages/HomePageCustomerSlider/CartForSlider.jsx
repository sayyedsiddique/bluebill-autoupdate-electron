import React from 'react'
import "./CartForSlider.css";


const CartForSlider = () => {
    return (
        <div>
            <div className="cardSlider-item">
                <div className="feedback_item">
                    <div className="feed_back_author">
                        <div className="media">
                            <div className="img">
                                <img src="https://posbytz.com/wp-content/uploads/2023/09/Sams-Pizza-83x88.png" alt="Sam's PizZa Qatar" />
                            </div>
                            <div className="media-body">
                                <h6>Sam's Pasta Pizza, Qatar</h6>
                            </div>
                        </div>
                        <div className="ratting">
                            <a href="#" class="yellow_star"><i className="ti-star"></i></a><a href="#" class="yellow_star"><i className="ti-star"></i></a><a href="#" className="yellow_star"><i className="ti-star"></i></a><a href="#" className="yellow_star"><i className="ti-star"></i></a><a href="#" className="yellow_star"><i className="ti-star"></i></a>
                        </div>
                    </div>
                    <p style={{textAlign:"start"}}> We are an traditional Italian cuisine based brand. Have been using PosBytz for our Restaurant Management operations and so far there has been no issues with respect to the software and as a owner can able see my business online from anywhere. PosBytz is very easy to use for setting up menu , ingredients/recipes , POS , inventory etc..,</p>
                </div>
            </div>

        </div>

    )
}

export default CartForSlider
