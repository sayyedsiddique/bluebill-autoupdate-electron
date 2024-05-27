import React, { useState } from 'react';
import './HomePageAskQuestionSection.css';
import { MdPlayArrow } from "react-icons/md";
import { IoMdArrowDropup } from "react-icons/io";
import { BiSolidRightArrow } from "react-icons/bi";
import { BiSolidUpArrow } from "react-icons/bi";
import { IoMdArrowDropright } from "react-icons/io";
import { questions } from '../../../Containts/Values';


const HomePageAskQuestionSection = () => {

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAnswer = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };



    return (
        <div className='faq-container'>
            <h1 data-aos="fade-up"
                data-aos-anchor-placement="top-bottom" style={{ textAlign: "center" }}>Frequently Asked Questions (FAQ)</h1>
            <div data-aos="fade-up"
                data-aos-anchor-placement="top-bottom" className='asked-question-container'>
                {questions.map((Question, index) => (
                    <div data-aos="fade-up"
                        data-aos-anchor-placement="top-bottom" className='' style={{ borderBottom: "1px solid #d5d8dc" }} key={index}>
                        <div
                            className={`asked-question ${activeIndex === index ? 'active' : ''}`}
                            onClick={() => toggleAnswer(index)}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{activeIndex === index ? <IoMdArrowDropup /> : <IoMdArrowDropright />}</span>
                            <h6>{Question.title}</h6>
                        </div>
                        <div>
                            <p>{activeIndex === index ? Question.answer : ''}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePageAskQuestionSection;
