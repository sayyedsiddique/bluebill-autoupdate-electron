import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ButtonToolbar, Modal, ModalBody, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  ADD_TAX_MAPPING,
  GET_PRODUCT_DATA,
  SERVER_URL,
  STOREID,
  getUTCDate,
  toppings,
} from "../../Containts/Values";
import { getProductList } from "../../Redux/Product/productSlice";
import { removeTaxOnProduct } from "../../Redux/Tax/taxSlice";
import { useTranslation } from "react-i18next";
import AlertpopUP from "../../utils/AlertPopUP";
import { Checkbox, Button } from "@mui/material";

let userToken = localStorage.getItem("userToken");

const TaxMapping = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useNavigate();
  const mappedTaxApi = window.mappedTaxApi;
  const productApi = window.productApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline... ", isOnline);

  const { applyTax, mapData, setshow, getTaxMappedList } = props;
  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const isLoading = useSelector((state) => state.tax.mappedTaxListLoading);
  const productData = useSelector((state) => state.product.productData);

  const [product, setproduct] = useState([]);
  console.log("product... ", product);
  const [isCheckValue, setisCheckValue] = useState(true);
  const [allProductCheck, setAllProductCheck] = useState(true);
  const [taxMappedProducts, settaxMappedProducts] = useState([]);
  console.log("taxMappedProducts... ", taxMappedProducts);
  const [taxNotMappedProduct, setTaxNotMappedProduct] = useState([]);
  const [checkedProductArr, setCheckProductArr] = useState([]);
  console.log("checkedProductArr... ", checkedProductArr);
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);
  console.log("CommanMappedTaxDataListR... ", mappedTaxDataList);
  const [productList, setProductList] = useState([]);
  console.log("CommaProductListR... ", productList);

  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");

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

  // mapped tax data comes from api it store in this state
  useEffect(() => {
    mappedTaxList?.length > 0 && setMappedTaxDataList(mappedTaxList);
    productData?.product?.length > 0 && setProductList(productData?.product);
  }, [productData?.product]);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    if (isOnline) {
      dispatch(getTaxMappedList());
      dispatch(getProductList(0, 0, ""));
    } else {
      const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();
      mappedTaxData && setMappedTaxDataList(mappedTaxData);
      const productListData = productApi?.productDB?.getProductsList();
      productListData && setProductList(productListData);
    }
  }, []);

  // Get product list
  // useEffect(() => {
  //   if (productData.length === 0) {
  //     dispatch(getProductList());
  //   }
  // }, [productData]);

  // Set product list in state
  useEffect(() => {
    let newArr = [];

    productList &&
      productList?.map((item) => {
        let obj = {
          ...item,
          isCheck: false,
        };
        newArr.push(obj);
      });

    setproduct(newArr);
  }, [productList]);

  // Filter tax array with product id
  // in the product isCheck property added with true value
  useEffect(() => {
    let taxMappedProduct = [];
    let selectedTax = [];
    mappedTaxDataList &&
      mappedTaxDataList?.filter((taxItem) => {
        if (taxItem?.taxId === applyTax.taxId) {
          selectedTax.push(taxItem);
        }
      });

    selectedTax &&
      selectedTax?.map((taxItem) => {
        product &&
          product?.map((prodItem) => {
            if (taxItem?.productId === prodItem?.productId) {
              let newObj = {
                ...prodItem,
                isCheck: true,
                taxId: taxItem?.taxId,
                storeId: taxItem?.storeId,
              };
              taxMappedProduct.push(newObj);
            }
          });
      });
    settaxMappedProducts(taxMappedProduct);
  }, [mappedTaxDataList, product]);

  // submit button disable or enable when user checkout
  useEffect(() => {
    // it's check whole array if someone value equal
    // then it return a true value
    let checkedValue =
      taxMappedProducts &&
      taxMappedProducts.some((item) => {
        return item.isCheck === false;
      });

    // if user uncheck the value then we enable the button
    if (checkedValue === true) {
      setisCheckValue(false);
      setAllProductCheck(true);
    } else {
      setisCheckValue(true);
      setAllProductCheck(false);
    }
  }, [taxMappedProducts, isCheckValue]);

  // apply tax on product button handler
  const handleOnChange = (e) => {
    const { name, checked } = e.target;

    let arr = [...taxMappedProducts];
    let checkedProductsArr = [...checkedProductArr];

    if (checked === true) {
      let onlyCheckedProd = [
        ...checkedProductsArr.filter((item, index) => index !== Number(name)),
      ];
      setCheckProductArr(onlyCheckedProd);

      arr &&
        arr?.map((item, itemIndex) => {
          if (itemIndex === Number(name)) {
            arr[itemIndex].isCheck = checked;
          }
        });
    } else {
      arr &&
        arr?.map((item, itemIndex) => {
          if (itemIndex === Number(name)) {
            arr[itemIndex].isCheck = checked;
            checkedProductsArr.push(arr[itemIndex]);
          }
        });

      setCheckProductArr(checkedProductsArr);
    }

    settaxMappedProducts(arr);
  };

  const allCheckhandler = (e) => {
    const { checked } = e.target;

    let arr = [...taxMappedProducts];
    let checkedProductsArr = [];

    arr &&
      arr?.map((item, itemIndex) => {
        arr[itemIndex].isCheck = checked;
        checkedProductsArr.push(arr[itemIndex]);
      });

    if (checked === false) {
      setisCheckValue(checked);
      setCheckProductArr(checkedProductsArr);
    } else {
      setisCheckValue(checked);
      setCheckProductArr([]);
    }
    setAllProductCheck(checked);
    settaxMappedProducts(arr);
    setTaxNotMappedProduct(arr);
  };

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setshow(false); // Redirect to tax list page
    }, 2000); // Show popup for 2 seconds
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    handleClick(); //for popUp show when api will be failure.
    setApiError(`An error occurred: ${error}`);
  };

  const taxRemovedOnProductSuccess = () => {
    handleClick(); //for popUp show

    // Swal.fire({
    //   icon: "success",
    //   title: "Tax removed successfully from the product.",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     setshow(false);
    //   }
    // });
  };

  const ApplyTax = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Are you sure you want to remove tax from this product?",
      showCancelButton: true,
      confirmButtonColor: "var(--light-blue-color)",
      confirmButtonText: "Yes, remove it!",
    }).then((res) => {
      if (res?.isConfirmed) {
        console.log("yesChala");
        if (isOnline) {
          console.log("onlineChala");
          checkedProductArr.length > 0 &&
            dispatch(
              removeTaxOnProduct(checkedProductArr, taxRemovedOnProductSuccess)
            );
        } else {
          for (let i = 0; i <= checkedProductArr?.length; i++) {
            if (checkedProductArr[i]?.isCheck === false) {
              console.log("offlineChala");
              // it's soft delete functionality
              let taxPayload = {
                taxId: checkedProductArr[i]?.taxId,
                productId: checkedProductArr[i]?.productId,
                storeId: checkedProductArr[i]?.storeId,
                lastUpdate: getUTCDate(),
                isSync: 0,
                isDeleted: 1,
              };
              // console.log("singlePayloadR... ", taxPayload);
              // const result =
              //   taxPayload &&
              //   mappedTaxApi?.mappedTaxDB?.updateMappedTax(taxPayload);
              // taxRemovedOnProductSuccess();
              // taxPayload.push(payload);

              // i am currently using hard delete
              console.log("taxPayload... ", taxPayload);
              const result =
                taxPayload &&
                mappedTaxApi?.mappedTaxDB?.deleteMappedTax(
                  taxPayload?.productId
                );
              taxRemovedOnProductSuccess();
              // taxPayload.push(payload);
            }
          }
        }
      }
    });
  };

  return (
    <div>
      <Modal
        size="small"
        isOpen={props.isModelVisible}
        toggle={() => props.setshow(!props.isModelVisible)}
      >
        <ModalHeader
          toggle={() => props.setshow(!props.isModelVisible)}
          style={{
            backgroundColor: "var(--topHeader-bg-color)",
            color: " var(--text-color)",
          }}
        >
          {t("TaxDetails.remove")} {applyTax && applyTax?.taxName}{" "}
          {applyTax && applyTax?.taxValue}% {t("TaxDetails.tax")}
          <Button
            className="btn btn-primary ms-2"
            variant="contained"
            style={{
              background: "var(--main-bg-color)",
              color: "var(--white-color)",
              fontsize: " 22px",
            }}
            onClick={(e) => ApplyTax(e)}
            disabled={isCheckValue}
          >
            {t("TaxDetails.submit")}
          </Button>
        </ModalHeader>
        {isLoading ? (
          <LoadingSpinner spinnerSize="small" />
        ) : (
          <ModalBody style={{ backgroundColor: "var(--topHeader-bg-color)" }}>
            <form action="">
              <table class="table">
                <thead>
                  <tr>
                    <th>
                      <Checkbox
                        className="p-0"
                        type="checkbox"
                        checked={allProductCheck}
                        size="small"
                        onChange={allCheckhandler}
                      />
                      {/* <input
                        type="checkbox"
                        checked={allProductCheck}
                        onChange={allCheckhandler}
                      /> */}
                    </th>
                    <th scope="col">{t("TaxDetails.productName")}</th>
                    <th scope="col">{t("TaxDetails.beforeTax")}</th>
                    <th scope="col">{t("TaxDetails.afterTax")}</th>
                  </tr>
                </thead>
                {taxMappedProducts &&
                  taxMappedProducts?.map((item, index) => {
                    return (
                      <tbody>
                        <tr>
                          <td>
                            <div className="tax-product-name">
                              <Checkbox
                                className="p-0"
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={item.isCheck}
                                size="small"
                                name={index}
                                onChange={handleOnChange}
                              />
                              {/* <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={item.isCheck}
                                name={index}
                                onChange={handleOnChange}
                              /> */}
                            </div>
                          </td>
                          <td>
                            <label for="" className="ps-2">
                              {item?.productName}
                            </label>
                          </td>
                          {/* <td>
                            {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                              <td>
                                {item?.sellingPrice}
                                {CurrencySymbol}
                              </td>
                            ) : (
                              <td>
                                {CurrencySymbol}
                                {item?.sellingPrice}
                              </td>
                            )}
                          </td> */}
                          {item.isCheck === true ? (
                            <td>
                              <strike>
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
                                  <td>
                                    {item?.sellingPrice}
                                    {CurrencySymbol}
                                  </td>
                                ) : (
                                  <td>
                                    {CurrencySymbol}
                                    {item?.sellingPrice}
                                  </td>
                                )}
                              </strike>
                            </td>
                          ) : (
                            <td>
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                                <td>
                                  {item?.sellingPrice}
                                  {CurrencySymbol}
                                </td>
                              ) : (
                                <td>
                                  {CurrencySymbol}
                                  {item?.sellingPrice}
                                </td>
                              )}
                            </td>
                          )}
                          {item.isCheck === true ? (
                            <td>
                              {/* ₹
                              {item?.sellingPrice +
                                (item?.sellingPrice * applyTax?.taxValue) / 100} */}
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                                <td>
                                  {item?.sellingPrice +
                                    (item?.sellingPrice * applyTax?.taxValue) /
                                      100}

                                  {CurrencySymbol}
                                </td>
                              ) : (
                                <td>
                                  {CurrencySymbol}
                                  {item?.sellingPrice +
                                    (item?.sellingPrice * applyTax?.taxValue) /
                                      100}
                                </td>
                              )}
                            </td>
                          ) : (
                            <td>
                              <strike>
                                {" "}
                                {/* ₹
                                {item?.sellingPrice +
                                  (item?.sellingPrice * applyTax?.taxValue) /
                                  100} */}
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
                                  <td>
                                    {item?.sellingPrice +
                                      (item?.sellingPrice *
                                        applyTax?.taxValue) /
                                        100}

                                    {CurrencySymbol}
                                  </td>
                                ) : (
                                  <td>
                                    {CurrencySymbol}
                                    {item?.sellingPrice +
                                      (item?.sellingPrice *
                                        applyTax?.taxValue) /
                                        100}
                                  </td>
                                )}
                              </strike>
                            </td>
                          )}
                        </tr>
                      </tbody>
                    );
                  })}
              </table>
              <Button
                className="btn btn-primary mt-3"
                variant="contained"
                style={{
                  background: "var(--main-bg-color)",
                  color: "var(--white-color)",
                  fontsize: " 22px",
                }}
                onClick={(e) => ApplyTax(e)}
                disabled={isCheckValue}
              >
                {t("TaxDetails.submit")}
              </Button>
            </form>

            <AlertpopUP
              open={isPopupOpen}
              message={
                apiError ? apiError : "Tax removed successfully on the product!"
              }
              severity={apiError ? "error" : "success"}
              onClose={handleClose}
            />
          </ModalBody>
        )}
      </Modal>
    </div>
  );
};

export default TaxMapping;
