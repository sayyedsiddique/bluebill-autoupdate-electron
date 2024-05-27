import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./customerDetails.css";
import { BiSearch } from "react-icons/bi";
import {
  GET_CUSTOMER,
  getUTCDate,
  pageSizeForPag,
  retrieveObj,
  SERVER_URL,
  startOfMonth,
  UPSERT_CUSTOMER,
} from "../../Containts/Values";
import CustomerModal from "./CustomerModal";
import Swal from "sweetalert2";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  addCustomer,
  deleteCustomer,
  deleteCustomerById,
  getCustomerList,
  getTopBuyers,
} from "../../Redux/Customer/customerSlice";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import { TiArrowSortedDown } from "react-icons/ti";
import { getSortArrow, handleReload, showPopupHandleClick, sortTableDataHandler } from "../../utils/constantFunctions";
import AlertpopUP from "../../utils/AlertPopUP";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import debounce from "lodash/debounce";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import { getTopSellingProduct } from "../../Redux/Product/productSlice";
let userToken = localStorage.getItem("userToken");

function CustomersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const CustomerData = useSelector((state) => state.customer.customerData);
  const topBuyersDataList = useSelector((state) => state.customer.topBuyersData);
  console.log("topBuyersDataList007", topBuyersDataList);
  const isLoading = useSelector((state) => state.customer.loading);
  const customerApi = window.customerApi;
  const [isLoaded, setIsLoaded] = useState(true);
  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  console.log("data... ", data);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [customerPostRes, setCustomerPostRes] = useState({});
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder);
  const [apiError, setApiError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("")
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageNumber... ", pageNumber);
  const [isReloading, setIsReloading] = useState(false);


  // State variables for infiniteScroll
  const [customersList, setCustomersList] = useState([]);

  const { t } = useTranslation();

  const fetchApi = async () => {
    // let userToken = await localStorage.getItem("userToken");
    try {
      let Result = await axios.get(`${SERVER_URL}${GET_CUSTOMER}`, {
        headers: { Authorization: `Bearer ${userToken} ` },
      });
      Result.data && setdata(Result.data);
      setIsLoaded(false);
    } catch (error) {
      console.log(error);
      setIsLoaded(false);
    }
  };


  // apiError state empty after 3 second
  // and user redirect to /unit page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);




  // set redux data in state
  useEffect(() => {
    CustomerData?.customer?.length > 0 && setdata(CustomerData?.customer);
  }, [CustomerData?.customer]);

  // get all customer list from api
  useEffect(() => {
    if (isOnline) {
      // fetchApi();
      dispatch(getCustomerList(pageNumber, pageSizeForPag, ""));
    } else {
      const customerListData = customerApi?.customerDB?.getAllCustomers();
      setdata(customerListData);
      setIsLoaded(false);
    }
  }, [customerPostRes]);



  useEffect(() => {
    const startDate = getUTCDate();
    const endStart = getUTCDate(startOfMonth(new Date()));
    dispatch(getTopBuyers(startDate, endStart));
  }, []);

  // for open edit customer modal
  const editCustomer = (id) => {
    const newdata = data.find((item) => {
      return item.customerId === id;
    });

    // get customer by id from sqlite database
    // customerApi?.customerDB?.getCategoryDetailsById(1696255892953);

    setshow(true);
    setIsEdit(true);
    seteditData(newdata);
  };

  // for open add customer modal
  const handleAddCustomer = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  // for delete customer
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => {
      return item.customerId === id;
    });

    const deleteData = {
      customerId: selectDelete.customerId,
      isDeleted: 1,
      customerName: selectDelete.customerName,
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
          dispatch(deleteCustomer(deleteData, customerCreationSuccess, setPopUpMessage));
          // axios
          //   .post(`${SERVER_URL}${UPSERT_CUSTOMER}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     fetchApi();
          //   });
        }
      });
    } else {
      // delete customer by id from sqlite database
      const result = customerApi?.customerDB?.updateCustomer(deleteData);
      const customerList = customerApi?.customerDB?.getAllCustomers();
      setdata(customerList);
    }


  };

  const customerCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/Customers"
    ); //for popUp msg
  };


  const handleClose = () => {
    setIsPopupOpen(false);
  };


  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getCustomerList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getCustomerList(p, pageSizeForPag, ""));
    } else {
      const customerList = customerApi?.customerDB?.getAllCustomers();
      setdata(customerList);
    }
    setPageNumber(p);
  };


  return (
    <MainContentArea>
      <>
        <div className="main-container ">
          <div className=" customerDetails-card">
            <div className="customer-content-Details-card overviewBox">
              <div className="customer-card-content">
                <p>{t("CustomerDetails.totalCustomerCount")}</p>
                <h1>{CustomerData?.totalCustomer}</h1>
              </div>
            </div>

            <div className=" customer-content-Details-card overviewBox">
              <div className="customer-card-content">
                <p>{t("CustomerDetails.newCustomerCount")}</p>
                <h1>0</h1>
              </div>
            </div>

            <div className=" customer-content-Details-card overviewBox">
              <div className="customer-card-content" >
                <p>{t("CustomerDetails.customerOftheMonth")}</p>
                <h1>{topBuyersDataList?.length}</h1>
              </div>
            </div>
          </div>

          <div className="table-cartbox">
            <div>
              <ReloadButton
                isReloading={isReloading}
                reloadHandler={() =>
                  handleReload(
                    isReloading,
                    setIsReloading,
                    () => dispatch(getCustomerList(pageNumber, pageSizeForPag, "", ""))
                  )
                }
              />
            </div>
            <div className="header-container">
              <div className="table-heading">
                <h3>{t("CustomerDetails.customersList")}</h3>
              </div>
              <div className="search-container">
                <input
                  type="Search"
                  className="form-control"
                  placeholder={t("CustomerDetails.search")}
                  aria-label="Search"
                  onChange={serachHander}
                />
                <BiSearch className="searchIcon" />
              </div>

              {show && (
                <CustomerModal
                  fetchApi={fetchApi}
                  isModelVisible={show}
                  customerData={editData}
                  setshow={setshow}
                  setCustomerPostRes={setCustomerPostRes}
                />
              )}

              <div>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                  onClick={handleAddCustomer}
                >
                  {t("CustomerDetails.addCustomers")}
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div>
                <LoadingSpinner />
              </div>
            ) : (
              <div className="row">
                {data && data[0] !== undefined ? (
                  // <div className="card cardradius">
                  <div className="pt-0 my-3 card-body">
                    <table className="table table-hover table-borderless ">
                      <thead className="table-secondary sticky-top">
                        <tr>
                          <th className="Name-cursor"
                            onClick={() => setdata(sortTableDataHandler(data, sortOrder, setSortOrder))}
                          >{t("CustomerDetails.customersName")}{getSortArrow(sortOrder)}</th>
                          {/* <th className="dnon">{t("CustomerDetails.email")}</th> */}
                          <th className="dnon">
                            {t("CustomerDetails.contactNo")}
                          </th>
                          <th className="dnon" style={{ width: "25%" }}>{t("CustomerDetails.address")}</th>
                          {/* <th className="dnon">{t("CustomerDetails.city")}</th> */}
                          {/* <th className="dnon">{t("CustomerDetails.state")}</th> */}
                          {/* <th className="dnon">{t("CustomerDetails.country")}</th> */}
                          <th className="dnon">{t("CustomerDetails.edit")}</th>
                          <th className="dnon">{t("CustomerDetails.delete")}</th>
                        </tr>
                      </thead>

                      {data
                        ?.filter((item) =>
                          item.customerName.toLowerCase().includes(search)
                        )
                        ?.map(
                          (
                            {
                              customerName,
                              email,
                              mobileNumber,
                              address,
                              city,
                              state,
                              country,
                              customerId,
                            },
                            index
                          ) => (
                            <tbody key={index}>
                              <tr>
                                <td>{customerName}</td>
                                {/* <td className="dnon">{email ? (email?.length > 10
                                  ? email?.substring(0, 10) + '...'
                                  : email) : ""}</td> */}
                                <td className="dnon">{mobileNumber}</td>
                                <td className="dnon">{address ? address : "-"}</td>
                                {/* <td className="dnon">{city ? city : "-"}</td> */}
                                {/* <td className="dnon">{state ? state : "-"}</td> */}
                                {/* <td className="dnon"> {country ? country : "-"}</td> */}
                                <td>
                                  <button
                                    className="btn btnclass1"
                                    onClick={() => editCustomer(customerId)}
                                  >
                                    <CiEdit size={25} />
                                  </button></td>

                                <td>
                                  <button
                                    className="btn btnclass"
                                    onClick={() => HandleDelete(customerId)}
                                  >
                                    <RiDeleteBin5Line size={25} />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}
                    </table>
                  </div>
                  // </div>
                ) : (
                  <NoOnlineOrderItem orderStatus={"Customer Data"} />
                )}
              </div>
            )}
            {console.log("totalCustomer ", CustomerData?.totalCustomer / 5)}

            {isOnline && CustomerData?.totalCustomer > 0 && (
              <Pagination
                count={Math.ceil(CustomerData?.totalCustomer / 5)}
                // color="primary"
                onChange={paginationHandler}
              />
            )}
          </div>
        </div>
      </>

      {show && (
        <ErrorBoundary>
          <CustomerModal
            // fetchApi={fetchApi}
            isModelVisible={show}
            customerData={editData}
            isEdit={isEdit}
            setshow={setshow}
            customerCreationSuccess={customerCreationSuccess}
            setPopUpMessage={setPopUpMessage}
          />
        </ErrorBoundary>
      )}


      <AlertpopUP
        open={isPopupOpen}
        message={apiError?.length > 0 ? apiError : popUpMessage

        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />
    </MainContentArea>
  );
}

export default CustomersPage;
