import React, { useEffect, useState } from 'react'
import MainContentArea from '../MainContentArea/MainContentArea'
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { addInventoryProduct, deleteInventoryByProductId, deleteInventoryProduct, getInventoryAllProductList, getInventoryByProductId, } from '../../Redux/InventoryManage/InventoryManageSlice';
import { getUTCDate } from '../../Containts/Values';
import moment from 'moment';
import Swal from 'sweetalert2';
import AlertpopUP from '../../utils/AlertPopUP';
import { handleTrim, showPopupHandleClick } from '../../utils/constantFunctions';
import { useNavigate } from 'react-router-dom';
import AddQuantityOfProductModal from '../AddProduct/AddQuantityOfProductModal';

const StockDashboardPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const productData = useSelector((state) => state.product.productData);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const inventorymanageData = useSelector((state) => state.InventoryManage.inventoryData);
  console.log("inventorymanageData", inventorymanageData);
  const [inventoryDataList, setInventoryDataList] = useState([]);
  console.log("inventoryDataList", inventoryDataList);
  // console.log("inventorymanageData", inventorymanageData);
  const [apiError, setApiError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("");

  const [isModelVisible, setModelVisible] = useState(false);
  const [editInventory, setEditInventory] = useState("");



  // data set in state varaible...
  useEffect(() => {
    setInventoryDataList(inventorymanageData?.data)
  }, [inventorymanageData?.data])


  // call getInventoryAllProductList api...
  useEffect(() => {
    dispatch(getInventoryAllProductList());

  }, [dispatch]);



  const handleClose = () => {
    setIsPopupOpen(false);
  };

  //Inventory product delete successfully popup
  const productDeleteSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
    );

  };


  const HandleEdit = (item) => {
    console.log("item", item);
    setEditInventory(item)
    setModelVisible(true)

  };



  const HandleDelete = async (id) => {
    const selectDelete = inventoryDataList?.find((item) => {
      // console.log('Delete Product ID:', id);
      // console.log("item?.ProductId", item?.ProductId);
      // console.log("inventoryDataList?.data", inventoryDataList?.data);
      return item?.productId === id;
    });
    console.log("selectDelete", selectDelete);
    const deleteData = {
      inventoryId: selectDelete.inventoryId,
      isDeleted: 1,
      lastUpdated: getUTCDate(),
      notes: "",
      productId: selectDelete?.productId,
      purchasingPrice: parseInt(selectDelete?.purchasingPrice),
      quantity: Number(selectDelete?.quantity),
      productName: selectDelete?.productName
    };

    if (isOnline) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            deleteInventoryByProductId(deleteData, productDeleteSuccess, selectDelete?.productId)
          );
        }
      });
    }
  }

  return (
    <MainContentArea>
      <div className='main-container'>
        <div className='header-container'>
          <div className='' style={{ height: "400px", width: "100%" }}>
            {/* <div className='card cardradius'> */}
            <div className="table-cartbox">
              <div className='card-body my-3 pt-0'>
                <table className="table table-hover table-borderless">
                  <thead className="table-secondary sticky-top">
                    <tr>
                      <th>{t("StockDashboard.lastUpdated")}</th>
                      <th>{t("StockDashboard.productName")}</th>
                      <th>{t("StockDashboard.purchasingPrice")}</th>
                      <th>{t("StockDashboard.quantity")}</th>
                      <th>{t("StockDashboard.inventoryId")}</th>
                      {/* <th>{t("StockDashboard.notes")}</th> */}
                      <th>{t("Delete")}</th>
                      {/* <th>{t("StockDashboard.amount")}</th> */}
                      {/* <th>{t("StockDashboard.actions")}</th> */}
                    </tr>
                  </thead>

                  <tbody>
                    {inventoryDataList && inventoryDataList.length > 0 ? (
                      inventoryDataList.map((item, index) => (
                        <tr
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate("/InventoryProductsDetails", {
                              state: { productId: item.productId },
                            })
                          }
                        >
                          <td>{moment(getUTCDate(item?.lastUpdated)).format("DD/MM/YYYY")}</td>
                          <td>{handleTrim(item?.productName)}</td>
                          <td style={{ paddingLeft: "2rem" }}>{CurrencySymbol}{item?.purchasingPrice}</td>
                          <td style={{ paddingLeft: "2rem" }}>{item?.quantity}</td>
                          <td>{item?.inventoryId}</td>
                          {/* <td>{item?.notes}</td> */}

                          <div className="d-flex">
                            {/* <button
                              className="btn text-Color"
                              onClick={(event) => {
                                event.stopPropagation();
                                HandleEdit(item);
                              }}
                            >
                              <CiEdit size={25} />
                            </button> */}
                            <button
                              className="btn text-Color"
                              onClick={(event) => {
                                event.stopPropagation();
                                HandleDelete(item?.productId);
                              }}
                            >
                              <RiDeleteBin5Line size={25} />
                            </button>
                          </div>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">No data available</td>
                      </tr>
                    )}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>


      {isModelVisible && (
        <AddQuantityOfProductModal
          isModelVisible={isModelVisible}
          setshow={setModelVisible}
          productDetails={editInventory}
          isEdit={true}
        />
      )}

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : "Inventory Product deleted successfully!"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />

    </MainContentArea>

  )
}

export default StockDashboardPage
