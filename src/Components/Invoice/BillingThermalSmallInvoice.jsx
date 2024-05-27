import React, { useEffect, useState, forwardRef } from 'react'
import './ThermalSmallInvoice.css'
import { format } from 'date-fns';
import { trimHandler } from '../../utils/constantFunctions';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from "../../Redux/Product/productSlice";
import jsPDF from 'jspdf';



const BillingThermalSmallInvoice = (({ width,
    height,
    addCart,
    saveTransDetails,
    totalTax,
    totalDiscount,
    componentRef1, }) => {

    const { t } = useTranslation();

    console.log("saveTransDetails...", saveTransDetails);


    function formatDate(date) {
        return format(date, 'dd-MM-yyyy');
    }



    return (
        <div ref={componentRef1} className='text-center small-invoice-container d-flex flex-column justify-content-between' style={{ width: ` ${width}px `, height: ` ${height}px ` }}>
            {/* <h1 className=' text-center invoice-name-heading'>Invoice</h1>
            <hr /> */}
            <div className='pe-1 ps-1 date-and-time-container d-flex justify-content-between'>
                {/* <p>OrderId : {saveTransDetails?.paymentId}</p> */}


                <p className='date-and-time'>{t("Tables.date")} : {formatDate(new Date())}</p>
                <p className="">{t("Tables.time")} : {new Date().toLocaleTimeString()}</p>
            </div>

            <hr />
            <div className='pe-1 ps-1 termal-customerName d-flex justify-content-between '>
                <p>
                    Customer Name : {saveTransDetails?.customerName}
                </p>
                <p>
                    Sales Executive : {saveTransDetails?.salesExecutiveName}
                </p>

                {/* <p>{t("Tables.orderNo")} : {saveTransDetails?.orderNo}</p>
                <p>
                    {t("Tables.waiterName")} : {saveTransDetails?.waiterName}
                </p> */}

            </div>
            <hr></hr>
            <div className='thermal-address'>
                <p>To, Islampura baba chowk<br />
                    Beed,
                    Maharashtra ,
                    Ph: 982221232425
                </p>
            </div>
            <hr />
            <table>
                <thead className='thermal-thead'>
                    <tr>
                        <th>{t("Tables.srNo")}</th>
                        <th style={{ textAlign: "left" }}>{t("Tables.itemName")}</th>
                        <th>{t("Tables.quantity")}</th>
                        <th>{t("Rate")}</th>
                        <th>{t("Amount")}</th>
                    </tr>
                </thead>

                <tbody className='thermal-details'>

                    {addCart &&
                        addCart?.map((item, index) => {
                            return (

                                <tr>
                                    <td>{index + 1}</td>
                                    <td style={{ textAlign: "left" }}>
                                        {trimHandler(item?.productName, 15)}{" "}
                                        <span>
                                            {item?.productName?.length >= 15 ? "..." : null}
                                        </span>{" "}
                                    </td>
                                    <td>{item?.prQuantity}</td>
                                    <td>{item?.sellingPrice.toFixed(2)}</td>
                                    <td>{item?.singleProTotal.toFixed(2)}</td>
                                    {/* <td>{item.Status ? item.Status : "Pending"}</td> */}
                                </tr>

                            );
                        })}

                </tbody>
            </table>
            <hr />
            <div className='pe-1 ps-1 thermal-subtotal-container d-flex justify-content-between '>
                <h5>{t("Tables.subtotal")}</h5>
                <h5>{saveTransDetails?.finaltotalAmount.toFixed(2)}</h5>
            </div>

            <div className='pe-1 ps-1 total-tax-container d-flex justify-content-between'>
                <h6>{t("Tables.tax")}</h6>
                <h6>{totalTax.toFixed(2)}</h6>
            </div>
            <div className='pe-1 ps-1 total-tax-container d-flex justify-content-between'>
                <h6>{t("Tables.discount")}</h6>
                <h6>{totalDiscount.toFixed(2)}</h6>
            </div>
            <hr />
            <div className="pe-1 ps-1 total-amount-container d-flex justify-content-between ">
                <h3>{t("Tables.totalAmount")}</h3>
                <h3>{(saveTransDetails?.finaltotalAmount + totalTax - totalDiscount).toFixed(2)}</h3>

            </div>
            {/* <div className='pe-1 ps-1 total-tax-container d-flex justify-content-between align-items-center"'>
                <h6>Total Tax</h6>
                <h6>{totalTax.toFixed(2)}</h6>
            </div> */}
            <div className="thankyou-container">
                <h5 className='nice-day'>Have a Nice Day</h5>
                <p>Thanks for your kind visit</p>
            </div>


        </div>
    )
})

export default BillingThermalSmallInvoice