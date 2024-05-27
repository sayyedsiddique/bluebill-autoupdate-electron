import React, { useEffect, useState } from 'react'
import MainContentArea from '../MainContentArea/MainContentArea'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getInventoryByProductId } from '../../Redux/InventoryManage/InventoryManageSlice';
import { CurrencySymbol, getUTCDate } from '../../Containts/Values';
import moment from 'moment';
import { handleTrim } from '../../utils/constantFunctions';
import Button from "@mui/material/Button";
import { CiEdit } from 'react-icons/ci';
import AddQuantityOfProductModal from '../AddProduct/AddQuantityOfProductModal';
import AlertpopUP from '../../utils/AlertPopUP';

const InventoryProductsDetails = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const productId = location.state?.productId;
    const editproductId = location.state?.prodId;
    const CurrencySymbol = localStorage.getItem("StoreCurrency");
    const productDetails = useSelector((state) => state.InventoryManage.inventoryData);
    const [inventoryDetalisList, setInventoryDetailsList] = useState("")
    console.log("inventoryDetalisList", inventoryDetalisList);
    // console.log("productDetails", inventoryDetalis?.totalQuantitySold);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [apiError, setApiError] = useState("");

    const [isModelVisible, setModelVisible] = useState(false);
    const [editInventory, setEditInventory] = useState("");


    useEffect(() => {
        setInventoryDetailsList(productDetails?.data)
    }, [productDetails?.data])

    useEffect(() => {
        if (editproductId) {
            dispatch(getInventoryByProductId(editproductId));
        } else {
            dispatch(getInventoryByProductId(productId));
        }

    }, [dispatch, editproductId, productId]);



    const HandleEdit = (item) => {
        console.log("item", item);
        setEditInventory(item)
        setModelVisible(true)
    };


    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    // inventory Update sucess popup..
    const handleUpdateSuccess = () => {
        setIsPopupOpen(true);
        setApiError("");
    };



    return (
        <MainContentArea>
            <div className="main-container ">
                <div className=" customerDetails-card" style={{ display: 'flex', justifyContent: "flex-start" }}>
                    <div className="customer-content-Details-card overviewBox">
                        <div className="customer-card-content">
                            <p>{t("Total Quantity Sold")}</p>
                            <h1>{inventoryDetalisList?.totalQuantitySold}0</h1>
                        </div>
                    </div>

                    <div className=" customer-content-Details-card overviewBox">
                        <div className="customer-card-content">
                            <p>{t("Total Profit")}</p>
                            <h1>{inventoryDetalisList?.totalProfit}0</h1>
                        </div>
                    </div>

                    {/* <div className=" customer-content-Details-card overviewBox">
                        <div className="customer-card-content" >
                            <p>{t("CustomerDetails.customerOftheMonth")}</p>
                            <h1>{topBuyersDataList?.length}</h1>
                        </div>
                    </div> */}
                </div>
                <div className="table-cartbox">

                    <div className=" InventoryDetails-headers d-flex justify-content-between  mb-4">
                        <div className="table-heading">
                            <h3>{t("Inventory Product Details")}</h3>
                        </div>
                        <Button
                            variant="contained"
                            style={{
                                background: "#e3e2e2",
                                color: "dimgray",
                            }}
                            onClick={() => navigate("/StockDashboardPage")}
                        >
                            {t("Tables.back")}
                        </Button>
                    </div>
                    <div className='card-body my-3 pt-0'>
                        <table className="table table-hover table-borderless">
                            <thead className="table-secondary sticky-top">
                                <tr>
                                    <th>{t("StockDashboard.lastUpdated")}</th>
                                    <th>{t("StockDashboard.productName")}</th>
                                    <th>{t("StockDashboard.purchasingPrice")}</th>
                                    <th>{t("StockDashboard.quantity")}</th>
                                    <th>{t("StockDashboard.inventoryId")}</th>
                                    {/* <th className='col' style={{ width: "15%" }}>{t("StockDashboard.notes")}</th> */}
                                    <th>{t("Edit")}</th>
                                    {/* <th className='col'>{t("StockDashboard.amount")}</th> */}
                                    {/* <th className='col'>{t("StockDashboard.actions")}</th> */}
                                </tr>
                            </thead>

                            <tbody>
                                {inventoryDetalisList && (
                                    inventoryDetalisList?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{moment(getUTCDate(item?.lastUpdated)).format("DD/MM/YYYY")}</td>
                                            <td>{handleTrim(item?.productName)}</td>
                                            <td style={{ paddingLeft: "2rem" }}>{CurrencySymbol}{item?.purchasingPrice}</td>
                                            <td style={{ paddingLeft: "2rem" }}>{item?.quantity}</td>
                                            <td>{item?.inventoryId}</td>
                                            {/* <td>{item?.notes}</td> */}
                                            <td>
                                                <div className='d-flex'>
                                                    <button className="btn text-Color">
                                                        <CiEdit size={25} onClick={() => HandleEdit(item)} />
                                                    </button>
                                                    {/* <button className="btn text-Color" onClick={() => HandleDelete(item?.productId)}>
                                                        <RiDeleteBin5Line size={25} />
                                                    </button> */}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModelVisible && (
                <AddQuantityOfProductModal
                    isModelVisible={isModelVisible}
                    setshow={setModelVisible}
                    productDetails={editInventory}
                    isEdit={true}
                    handleUpdateSuccess={handleUpdateSuccess}
                />
            )}

            <AlertpopUP
                open={isPopupOpen}
                message={
                    apiError?.length > 0 ? apiError : "Inventory Product updated successfully!"
                }
                severity={apiError?.length > 0 ? "error" : "success"}
                onClose={handleClosePopup}
            />

        </MainContentArea >



    )
}

export default InventoryProductsDetails
