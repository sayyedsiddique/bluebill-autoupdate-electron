import "./CartProductItem.css";
import defaultImage from '../../assets/images/default-image.png'
import { STORE_CURRENCY, } from "../../Containts/Values";


import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { handleTrim } from "../../utils/constantFunctions";

const CartProductItem = ({ item, handleDelete, index, handleDecrement, MeasurableOpen, handleIncrement,

    measurableUnitName,
}) => {
    const defaultLang = useSelector((state) => state.language.language);
    const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
    const CurrencySymbol = (localStorage.getItem("StoreCurrency"));

    useEffect(() => {
        defaultLang && setDefaultLanguage(defaultLang?.name);
    }, [defaultLang?.name]);

    // getting local storage default language
    useEffect(() => {
        const localStorageLang = localStorage.getItem("defaultLang");
        if (localStorageLang === "ar") {
            setDefaultLanguage("Arabic");
        } else if (localStorageLang === "en") {
            setDefaultLanguage("English");
        }
    }, [localStorage.getItem("defaultLang")]);


    return (
        <div className="product-item-main-section">
            <div className="product-item-main-container d-flex justify-content-between align-items-center ">
                <div className="d-flex  align-items-center">
                    <img src={item?.imageUrl ? item?.imageUrl : defaultImage} alt="" width="60" height="60" style={{ borderRadius: "10px" }} />
                    <div className="" style={{ marginLeft: "0.6rem" }}>
                        <h6 className="product-item-list mb-2">
                            {/* {item.productName[0].toUpperCase() + item.productName.slice(1)}
                            {item.productName.length >= 20 ? "..." : null} */}
                            {handleTrim(item?.productName)}

                        </h6>
                        <span className="product-item-amount">
                            {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
                                <>
                                    {item.sellingPrice}{CurrencySymbol}
                                </>
                            ) : (
                                <>
                                    {CurrencySymbol}{item.sellingPrice}
                                </>
                            )}
                        </span>
                    </div>
                </div>

                <div className=" text-center">
                    {/* <span>{STORE_CURRENCY}{item.prQuantity * item.sellingPrice}</span> */}
                    <span className="product-item-amount">
                        {defaultLanguage === "ar" || defaultLanguage === "عربي"
                            ? <>{item.prQuantity * item.sellingPrice}{CurrencySymbol}</>
                            : <>{CurrencySymbol}{item.prQuantity * item.sellingPrice}</>
                        }

                    </span>

                    <div className="product-item-quantity">
                        {item?.isMeasurable ? (
                            <button
                                className="product-item btn quentitybotton"
                                onClick={() => handleDelete(index)}
                            >
                                x
                            </button>
                        ) : (
                            <button
                                className=" product-item btn quentitybotton"
                                style={{ border: "1px solid" }}
                                onClick={() => handleDecrement(index)}
                            >
                                -
                            </button>
                        )}
                        <span className="p-1">{item.prQuantity}</span>
                        <button
                            className="product-item btn quentitybotton"
                            style={{
                                backgroundColor: "rgb(255, 75, 75)",
                                color: "white",
                                border: "none"
                            }}
                            onClick={() =>
                                item?.isMeasurable
                                    ? MeasurableOpen(item, item.prQuantity, measurableUnitName)
                                    : handleIncrement(index)
                            }
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* <button onClick={() => handleDelete(index)} className=" product-item btn btn-danger delete-btn">x</button> */}
            </div >

        </div >
    )
}

export default CartProductItem;