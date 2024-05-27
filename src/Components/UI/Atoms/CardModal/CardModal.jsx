import React from 'react';
import './CardModal.css';
const CardModal = (props) => {
    return (
        <div className='card_modal_container'>
            {props.children}
        </div>
    );
};

export default CardModal;