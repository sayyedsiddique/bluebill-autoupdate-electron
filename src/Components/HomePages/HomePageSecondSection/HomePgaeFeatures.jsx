import React, { useState } from 'react';
import './HomePgaeFeatures.css';
import { GiCheckMark } from 'react-icons/gi';
import { features } from '../../../Containts/Values';


const HomePgaeFeatures = () => {


    const [selectedFeature, setSelectedFeature] = useState(features[0]);
    console.log('selectedFeature', selectedFeature);
    const [selectedId, setSelectedId] = useState(features[0].id);
    // console.log("selectedId",selectedId);



    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature);
        setSelectedId(feature.id);
    };

    return (
        <>
            <div className='main-feature-content'>
                <div className='main-feature-headings'>
                    <h1 data-aos="fade-up" className='title-head' style={{ textAlign: 'center' }}>
                        Features of Our POS Software?
                    </h1>
                </div>

                {/* <div className='feature-cards'>
                    <ul data-aos="fade-up" className='card-ul' style={{ paddingLeft: '1rem' }}>
                        {features.map((feature) => (
                            <li key={feature.id} id='cardli' onClick={() => handleFeatureClick(feature)} className={selectedId === feature.id ? 'selected' : ''}>
                                {feature.icon}
                                <div className='sp'>
                                    <span className='title' style={{ fontWeight: "600", color: feature.color }}>{feature.title}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div> */}

                <div data-aos="fade-right" className='slider' style={{ margin: '2rem' }}>
                    {selectedFeature && (
                        <div className='two-sections'>
                            <div data-aos="fade-right" className='first'>
                                <h2 id='des'>{selectedFeature.content}</h2>
                                <div data-aos="fade-right" className='second' style={{ paddingLeft: '0rem' }}>
                                    <ul data-aos="fade-right" className='second' style={{ paddingLeft: '0rem' }}>
                                        {selectedFeature.highlights.map((highlight, index) => (
                                            <li key={index} id='bottom'>
                                                <GiCheckMark className='checkMark-icon' />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div data-aos="fade-left" className='sliderRightsideContent' style={{ textAlign: 'right' }}>
                                <img data-aos="fade-left"
                                    src={selectedFeature.image_1}
                                    alt={selectedFeature.alt}
                                    id='Main-img'
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default HomePgaeFeatures;
