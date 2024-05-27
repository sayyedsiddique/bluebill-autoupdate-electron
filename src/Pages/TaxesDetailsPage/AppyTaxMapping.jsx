import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { getProductList } from "../../Redux/Product/productSlice";
import {
  addTaxOnMultiProduct,
  getTaxMappedList,
} from "../../Redux/Tax/taxSlice";
import { useTranslation } from "react-i18next";
import AlertpopUP from "../../utils/AlertPopUP";
import { Checkbox, Button } from "@mui/material";
import { STORE_Id, getUTCDate } from "../../Containts/Values";

const AppyTaxMapping = (props) => {
  const { t } = useTranslation();
  const { applyTaxItem, isModelVisible, setshowApplyToast } = props;
  const dispatch = useDispatch();
  const history = useNavigate();
  const mappedTaxApi = window.mappedTaxApi;
  const productApi = window.productApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline... ", isOnline);

  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  console.log("APImappedTaxList... ", mappedTaxList);
  const isLoading = useSelector((state) => state.tax.mappedTaxListLoading);
  const productData = useSelector((state) => state.product.productData);
  const [isCheckValue, setIsCheckValue] = useState(false);
  const [allProductCheck, setAllProductCheck] = useState(false);
  const [taxNotMappedProduct, setTaxNotMappedProduct] = useState([]);
  console.log("taxNotMappedProduct... ", taxNotMappedProduct);
  const [products, setProducts] = useState([]);
  console.log("products... ", products);
  const [storeId, setStoreId] = useState("");
  const [checkedProductArr, setCheckProductArr] = useState([]);
  console.log("checkedProductArr... ", checkedProductArr);
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);
  console.log("CommanMappedTaxDataList... ", mappedTaxDataList);
  const [productList, setProductList] = useState([]);
  console.log("CommaProductList... ", productList);

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
      let STOREID = localStorage.getItem("storeId");
      setStoreId(STOREID);
    } else {
      const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();
      mappedTaxData && setMappedTaxDataList(mappedTaxData);
    }
  }, []);

  // Get product list
  useEffect(() => {
    if (isOnline) {
      // if (productData.length === 0) {
      dispatch(getProductList(0, 0, ""));
      // }
    } else {
      const productListData = productApi?.productDB?.getProductsList();
      productListData && setProductList(productListData);
    }
  }, []);

  // we added one value isCheck in product object and Set product list in state
  useEffect(() => {
    let newArr = [];

    console.log("newArr... ", newArr);
    productList &&
      productList?.map((item) => {
        let afterTaxPrice =
          item?.sellingPrice +
          (item?.sellingPrice * applyTaxItem?.taxValue) / 100;
        // console.log("afterTaxPrice ", afterTaxPrice.toFixed(2));

        let obj = {
          ...item,
          isCheck: false,
          taxId: applyTaxItem?.taxId,
          storeId: STORE_Id,
          afterTaxPrice: afterTaxPrice.toFixed(2),
        };
        newArr.push(obj);
      });

    setProducts(newArr);
  }, [productData, productList, mappedTaxList]);

  // here we check how many product already have tax mapped
  useEffect(() => {
    let taxNotMappedProducts = [];
    let selectedTax = [];

    selectedTax = [
      ...mappedTaxDataList.filter(
        (taxItem) => taxItem?.taxId === applyTaxItem.taxId
      ),
    ];
    console.log("selectedTax... ", selectedTax);

    // if duplicate array item added in array
    // then it's remove duplicate item in the array
    let selectedTaxUniqueArray = Array.from(new Set(selectedTax));

    // if tax mapped array has item then it run
    if (selectedTaxUniqueArray?.length > 0) {
      // we check how much product match in the tax mapped array
      console.log("found chala");
      products &&
        products?.map((prodItem) => {
          selectedTaxUniqueArray &&
            selectedTaxUniqueArray?.filter((item) => {
              if (prodItem?.productId === item?.productId) {
                taxNotMappedProducts.push(prodItem);
              }
            });
        });
    } else {
      // if we dont found any tax mapped product
      // then we displayed whole product list
      console.log("not found chala");
      setTaxNotMappedProduct(products);
    }

    // we remove item from product array
    // which match with tax mapped product
    let newPro = [];
    products &&
      products?.filter((prodItem, prodIndex) => {
        let newArr = taxNotMappedProducts.includes(prodItem);
        if (!taxNotMappedProducts.includes(prodItem)) {
          newPro.push(prodItem);
        }
      });
    setTaxNotMappedProduct(newPro);
  }, [mappedTaxDataList, products]);

  // submit button disable or enable when user checkout
  useEffect(() => {
    let checkedValue =
      taxNotMappedProduct &&
      taxNotMappedProduct.some((item) => {
        return item.isCheck === true;
      });

    const allProdCheck = taxNotMappedProduct?.filter(
      (item) => item?.isCheck === true
    );
    // Check if all products have isCheck set to true
    const allProductsAreChecked =
      allProdCheck.length === taxNotMappedProduct.length;

    // Set the state based on the condition
    setAllProductCheck(allProductsAreChecked);
    // if user check the value then we enable the button
    if (checkedValue === true) {
      setIsCheckValue(true);
    } else {
      setIsCheckValue(false);
    }
  }, [taxNotMappedProduct]);

  // Single checkbox handler
  const checkboxHandler = (e) => {
    const { name, checked } = e.target;

    let arr = [...taxNotMappedProduct];
    let checkedProductsArr = [...checkedProductArr];

    if (checked === false) {
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

    setTaxNotMappedProduct(arr);
  };

  const allCheckhandler = (e) => {
    const { checked } = e.target;

    let arr = [...taxNotMappedProduct];
    let checkedProductsArr = [];

    arr &&
      arr?.map((item, itemIndex) => {
        arr[itemIndex].isCheck = checked;
        checkedProductsArr.push(arr[itemIndex]);
      });

    if (checked === true) {
      setCheckProductArr(checkedProductsArr);
    } else {
      setCheckProductArr([]);
    }

    setAllProductCheck(checked);

    setTaxNotMappedProduct(arr);
  };

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setshowApplyToast(false); // Redirect to tax list page
    }, 2000); // Show popup for 2 seconds
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const taxAddOnProductSuccess = () => {
    handleClick(); //for popUp show

    // Swal.fire({
    //   icon: "success",
    //   title: "Tax added successfully on the product.",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     setshowApplyToast(false);
    //   }
    // });
  };

  // const apiFailureResponse = (error) => {
  //   console.log("apiFailureResponse ", error)

  // }

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    handleClick(); //for popUp show when api will be failure.
    setApiError(`An error occurred: ${error}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (isOnline) {
      checkedProductArr?.length > 0 &&
        dispatch(
          addTaxOnMultiProduct(
            checkedProductArr,
            taxAddOnProductSuccess,
            apiFailureResponse
          )
        );
    } else {
      let taxPayload = [];

      for (let i = 0; i <= checkedProductArr?.length; i++) {
        if (checkedProductArr[i]?.isCheck === true) {
          let payload = {
            taxId: checkedProductArr[i]?.taxId,
            productId: checkedProductArr[i]?.productId,
            storeId: checkedProductArr[i]?.storeId,
            lastUpdate: getUTCDate(),
            isSync: 0,
            isDeleted: 0,
          };
          console.log("singlePayload... ", payload);
          const result =
            taxPayload && mappedTaxApi?.mappedTaxDB?.insertMappedTax(payload);
          taxAddOnProductSuccess();
          taxPayload.push(payload);
        }

        // if (i === checkedProductArr?.length - 1) {
        //   console.log("CHALA");
        //   console.log("taxPayloadMutli ", taxPayload);

        // }
      }
    }
  };

  return (
    <div>
      <Modal
        size="small"
        isOpen={isModelVisible}
        toggle={() => setshowApplyToast(!isModelVisible)}
      >
        <ModalHeader
          toggle={() => setshowApplyToast(!isModelVisible)}
          style={{
            backgroundColor: "var(--topHeader-bg-color)",
            color: " var(--text-color)",
          }}
        >
          {t("TaxDetails.apply")} {applyTaxItem && applyTaxItem?.taxName}{" "}
          {applyTaxItem && applyTaxItem?.taxValue}% {t("TaxDetails.tax")}
          <Button
            className="btn btn-primary ms-2"
            variant="contained"
            style={{
              background: "var(--main-bg-color)",
              color: "var(--white-color)",
              fontsize: " 22px",
            }}
            onClick={(e) => submitHandler(e)}
            disabled={isCheckValue === false ? true : false}
          >
            {t("TaxDetails.submit")}
          </Button>
        </ModalHeader>
        {false ? (
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
                        // id={`custom-checkbox-${index}`}
                        checked={allProductCheck}
                        // name={index}
                        onChange={allCheckhandler}
                      /> */}
                    </th>
                    <th scope="col">{t("TaxDetails.productName")}</th>
                    <th scope="col">{t("TaxDetails.beforeTax")}</th>
                    <th scope="col">{t("TaxDetails.afterTax")}</th>
                  </tr>
                </thead>
                {taxNotMappedProduct &&
                  taxNotMappedProduct?.map((item, index) => {
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
                                onChange={checkboxHandler}
                              />
                              {/* <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={item.isCheck}
                                name={index}
                                onChange={checkboxHandler}
                              /> */}
                            </div>
                          </td>
                          <td>
                            <label for="" className="">
                              {item?.productName}
                            </label>
                          </td>

                          <td>
                            {/* ₹{item?.sellingPrice} */}
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

                          {item.isCheck === true ? (
                            <td>
                              {/* ₹{item?.afterTaxPrice} */}
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                                <td>
                                  {item?.afterTaxPrice}
                                  {CurrencySymbol}
                                </td>
                              ) : (
                                <td>
                                  {CurrencySymbol}
                                  {item?.afterTaxPrice}
                                </td>
                              )}
                            </td>
                          ) : (
                            <td>
                              <strike>
                                {/* ₹{item?.afterTaxPrice} */}
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
                                  <td>
                                    {item?.afterTaxPrice}
                                    {CurrencySymbol}
                                  </td>
                                ) : (
                                  <td>
                                    {CurrencySymbol}
                                    {item?.afterTaxPrice}
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
                onClick={(e) => submitHandler(e)}
                disabled={isCheckValue === false ? true : false}
              >
                {t("TaxDetails.submit")}
              </Button>
            </form>

            <AlertpopUP
              open={isPopupOpen}
              message={
                apiError ? apiError : "Tax added successfully on the product!"
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

export default AppyTaxMapping;
