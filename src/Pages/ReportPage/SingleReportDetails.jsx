import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import { DEFAULT_IMAGE, STORE_CURRENCY } from '../../Containts/Values';
import { singleTransaction } from '../../Redux/Transaction/TransactionSlice';
import MainContentArea from '../MainContentArea/MainContentArea';
import { getDiscountlist, getMappedDiscountByProdutId, getSingleProductDiscount } from '../../Redux/Discount/discountSlice';
import { getTaxMappedList } from '../../Redux/Tax/taxSlice';
import Button from "@mui/material/Button";


const SingleReportDetails = () => {
    const { t } = useTranslation();

    const loading = useSelector((state) => state.transaction.loading);
    const location = useLocation();
    const navigate = useNavigate();
    const paymentId = location?.state?.paymentId;
    const productId = location?.state?.productId;

    const dispatch = useDispatch();

    const singleTransactionData = useSelector((state) => state.transaction.singleTransactionData)
    console.log("singleTransactionData", singleTransactionData);
    const SingleProductDiscount = useSelector((state) => state.discount.getSingleDiscount);
    // console.log("SingleProductDiscount", SingleProductDiscount);

    const [total, setTotal] = useState(0);
    const [totalTax, setTotalTax] = useState(0);
    const [totalDiscount, setTotalDiscount] = useState(0)
    console.log("totalDiscount..", totalDiscount);

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


    useEffect(() => {
        console.log('dispatching singleTransaction action with paymentId:', paymentId);
        dispatch(singleTransaction(paymentId))
        dispatch(getMappedDiscountByProdutId(productId));
        dispatch(getTaxMappedList())
        dispatch(getDiscountlist(0, 0, "", ""))
        dispatch(getSingleProductDiscount(productId))

    }, [dispatch, paymentId, productId]);


    // useEffect(() => {
    //     let total = 0
    //     singleTransactionData?.map((item) => {
    //         total = (total + (item.salesQuantity * item.salesPrice))

    //     })
    //     setTotal(total)

    //     let taxTotal = 0
    //     singleTransactionData?.map((item) => {
    //         taxTotal = (taxTotal + item.taxValue)
    //     })
    //     setTotalTax(taxTotal)

    // }, [singleTransactionData]);



    useEffect(() => {
        let total = 0;
        let tax = 0;
        let discont = 0;
        singleTransactionData?.map((item) => {
            total = total + item.salesQuantity * item.salesPrice;
            tax = tax + item.taxValue
            discont = discont + item.discountValue * item.salesQuantity
        });
        setTotal(total);
        setTotalTax(tax)
        setTotalDiscount(discont)
    }, [singleTransactionData]);




    return (
        <MainContentArea>
            <div className='cardBox overflow-auto'>
                <div className="d-flex justify-content-end mb-2 p-3">
                    <Button
                        variant="contained"
                        style={{
                            background: "#e3e2e2",
                            color: "dimgray",
                        }}
                        onClick={() => navigate("/report")}
                    >
                        {t("Tables.back")}
                    </Button>
                </div>
                {loading ? <LoadingSpinner /> :
                    <div className="card-body m-3 pt-0 text-Color">
                        <table className="table table-hover">
                            <thead
                                className="table-secondary sticky-top"
                                style={{ zIndex: 0 }}
                            >
                                <tr>
                                    <th>{t("Report.products")}</th>
                                    <th>{t("Report.quantity")}</th>
                                    <th>{t("Report.total")}</th>
                                </tr>
                            </thead>

                            {singleTransactionData?.map(({ imageUrl, productName, salesQuantity, salesPrice }, index) => (
                                <tbody key={index}>
                                    <tr >
                                        <td> <span><img src={imageUrl ?? DEFAULT_IMAGE}
                                            alt="product image"
                                            width="50"
                                            height="50" /> </span>
                                            {productName}
                                        </td>

                                        {defaultLanguage === "ar" ||
                                            defaultLanguage === "عربي"
                                            ? <td>
                                                {/* {salesPrice}*{salesQuantity} */}
                                                {Number.isInteger(salesPrice) ? salesPrice : salesPrice.toFixed(2)}*{salesQuantity}
                                                {CurrencySymbol}

                                            </td>
                                            :
                                            <td>
                                                {CurrencySymbol}
                                                {/* {salesPrice}*{salesQuantity} */}
                                                {Number.isInteger(salesPrice) ? salesPrice : salesPrice.toFixed(2)}*{salesQuantity}
                                            </td>
                                        }

                                        <td>
                                            {defaultLanguage === "ar" ||
                                                defaultLanguage === "عربي"
                                                ? <td>
                                                    {/* {salesPrice * salesQuantity} */}
                                                    {Number.isInteger(salesPrice * salesQuantity) ? (
                                                        <>
                                                            {salesPrice * salesQuantity}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {(salesPrice * salesQuantity).toFixed(2)}
                                                        </>
                                                    )}
                                                    {CurrencySymbol}
                                                </td>
                                                :
                                                <td>
                                                    {CurrencySymbol}
                                                    {/* {salesPrice * salesQuantity} */}
                                                    {Number.isInteger(salesPrice * salesQuantity) ? (
                                                        <>
                                                            {salesPrice * salesQuantity}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {(salesPrice * salesQuantity).toFixed(2)}
                                                        </>
                                                    )}

                                                </td>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                        <div style={{ display: "flex", flex: 'wrap', justifyContent: "space-between" }}>
                            <div style={{ marginLeft: 10, }} className="total-footer text-danger">{t("Report.tax")} :{totalTax}</div>
                            <div className=" total-footer text-success">{t("Report.discount")} : {totalDiscount}</div>
                            <div className=' total-footer text-Color' style={{ marginRight: 15 }}>{t("Report.total")}:
                                {/* {total.toFixed(2)}  */}
                                {Number.isInteger(parseFloat(total + totalTax - totalDiscount)) ? parseFloat(total + totalTax - totalDiscount) : parseFloat(total + totalTax - totalDiscount).toFixed(2)}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </MainContentArea>
    )
}

export default SingleReportDetails;

