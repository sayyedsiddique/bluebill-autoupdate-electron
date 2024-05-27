import React, { useEffect, useState } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import { useLocation, useNavigate } from "react-router-dom";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { Button, Checkbox, InputLabel } from "@mui/material";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  CurrencySymbol,
  DEFAULT_LANGUAGE,
  STORE_Id,
  getUTCDate,
} from "../../Containts/Values";
import { useDispatch, useSelector } from "react-redux";
import {
  addTaxOnMultiProduct,
  getTaxList,
  getTaxMappedProductsByCatId,
  removeTaxOnProduct,
} from "../../Redux/Tax/taxSlice";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import EmptyProductsCategoryMessege from "../CartPage/EmptyCategoryMsg/EmptyProductsCategoryMessege";
import { BiSearch } from "react-icons/bi";
import AlertpopUP from "../../utils/AlertPopUP";

const ApplyTaxOnProduct = () => {
  const location = useLocation();
  console.log("location... ", location?.state);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const taxApi = window.taxApi;
  const categoryApi = window.categoryApi;
  const mappedTaxApi = window.mappedTaxApi;
  const productApi = window.productApi;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const getTaxdata = useSelector((state) => state.tax.taxData);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const productListData = useSelector((state) => state.tax.productList);
  const isLoading = useSelector((state) => state.category.loading);

  const [productList, setProductList] = useState([]);
  const [finalProductList, setFinalProductList] = useState([]);
  const [taxtList, setTaxList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTax, setSelectedTax] = useState(location?.state?.tax);
  console.log("productList...", productList);
  console.log("finalProductList", finalProductList);
  console.log("productListData...", productListData);
  const [isCheckValue, setIsCheckValue] = useState(false);
  const [allProductCheck, setAllProductCheck] = useState(false);
  const [checkedProductArr, setCheckProductArr] = useState([]);
  console.log("checkedProductArr... ", checkedProductArr);
  const [unCheckedProdArr, setUnCheckedProdArr] = useState([]);
  console.log("unCheckedProdArr... ", unCheckedProdArr);

  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);
  const [toastSuccessMsg, setToastSuccessMsg] = useState("");

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

  // Add product list in state
  useEffect(() => {
    productListData?.productTax?.length > 0 &&
      setProductList(productListData?.productTax);
  }, [selectedCategory, productListData?.productTax]);

    // Remove previous product list when user navigate
    useEffect(() => {
      !selectedCategory &&
        productListData?.productTax?.length > 0 &&
        setProductList([]);
      setCheckProductArr([]);
    }, [selectedCategory, productListData?.productTax]);



  // Initially calculating tax value with product price
  useEffect(() => {
    // productListData?.productTax && setProductList(productListData?.productTax);
    let arr = [...productList];
    let newArr = [];

    console.log("newArr... ", newArr);
    arr &&
      arr?.map((item) => {
        let afterTaxPrice =
          item?.sellingPrice +
          (item?.sellingPrice * location?.state?.tax?.taxValue) / 100;
        // console.log("afterTaxPrice ", afterTaxPrice.toFixed(2));

        let obj = {
          ...item,
          isCheck: location?.state?.isTaxMapped,
          taxId: location?.state?.tax?.taxId,
          storeId: STORE_Id,
          afterTaxPrice: afterTaxPrice.toFixed(2),
        };
        newArr.push(obj);
      });

    // When came to unmap discount from product
    if (location?.state?.isTaxMapped) {
      setAllProductCheck(location?.state?.isTaxMapped);
      // setCheckProductArr(newArr);
    }

    setFinalProductList(newArr);
  }, [productList]);


  // if categoriesData has data then it store in data state
  useEffect(() => {
    getTaxdata?.tax?.length > 0 && setTaxList(getTaxdata?.tax);
    categoriesData?.category?.length > 0 &&
      setCategoryList(categoriesData?.category);
  }, [getTaxdata?.tax, categoriesData?.category]);

  // Initially tax list and category list api called
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      dispatch(getTaxList(0, 0, ""));
      dispatch(getCategoryList(0, 0, ""));
    } else {
      let arr = [];
      const taxListData = taxApi?.taxDB?.getAllTaxes();
      setTaxList(taxListData);

      const categories = categoryApi?.categoryDB?.getAllCategories();
      console.log("categoriessqlite... ", categories);
      setCategoryList(categories);
    }
  }, [isOnline]);

  // Check all products together handler
  const allCheckhandler = (e) => {
    const { checked } = e.target;

    // Creating a shallow copy of the productList array.
    // This means that arr and productList both reference the same objects in memory
    let arr = [...finalProductList];

    let checkedProductsArr = [];

    arr &&
      arr?.map((item, itemIndex) => {
        arr[itemIndex].isCheck = checked;
        checkedProductsArr.push(arr[itemIndex]);
      });

    if (checked === true) {
      setUnCheckedProdArr([]);
      setCheckProductArr(checkedProductsArr);
    } else {
      setCheckProductArr([]);
      setUnCheckedProdArr(checkedProductsArr);
    }

    setAllProductCheck(checked);

    setFinalProductList(arr);
  };

  // Single checkbox handler
  const checkboxHandler = (e) => {
    const { name, checked } = e.target;

    let arr = [...finalProductList];
    let checkedProductsArr = [...checkedProductArr];
    let uncheckProductsArr = [...unCheckedProdArr];

    if (checked === false) {
      let onlyCheckedProd = [
        ...checkedProductsArr.filter((item, index) => index !== Number(name)),
      ];
      setCheckProductArr(onlyCheckedProd);

      arr &&
        arr?.map((item, itemIndex) => {
          if (itemIndex === Number(name)) {
            arr[itemIndex].isCheck = checked;
            uncheckProductsArr.push(arr[itemIndex]);
          }
        });
      setUnCheckedProdArr(uncheckProductsArr);
    } else {
      arr &&
        arr?.map((item, itemIndex) => {
          if (itemIndex === Number(name)) {
            arr[itemIndex].isCheck = checked;
            checkedProductsArr.push(arr[itemIndex]);
            uncheckProductsArr.pop(arr[itemIndex]);
          }
        });

      setCheckProductArr(checkedProductsArr);
      setUnCheckedProdArr(uncheckProductsArr);
    }

    // setTaxNotMappedProduct(arr);
    // setProductList(arr);
    setFinalProductList(arr);
  };

  const selectCategoryHandler = (e) => {
    console.log("CategoryHandler ", e);
    setSelectedCategory(e);

    if (isOnline) {
      dispatch(
        getTaxMappedProductsByCatId(
          selectedTax?.taxId,
          e.categoryId,
          location?.state?.isTaxMapped,
          0,
          0,
          ""
        )
      );
    } else {
      let productDataList = productApi?.productDB?.getProductTaxMapped(
        e?.categoryId,
        location?.state?.isTaxMapped
      );
      setProductList(productDataList);
      console.log("productDataListLOCAL... ", productDataList);
    }
  };

  const selectTaxHandler = (e) => {};

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      navigate("/Taxes");
      // setshowApplyToast(false); // Redirect to tax list page
    }, 2000); // Show popup for 2 seconds
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const taxAddOnProductSuccess = (message) => {
    // handleClick(); //for popUp show

    // Swal.fire({
    //   icon: "success",
    //   title: "Tax added successfully on the product.",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     setshowApplyToast(false);
    //   }
    // });

    setToastSuccessMsg(message);
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      navigate("/Taxes");
      // setshowApplyToast(false); // Redirect to tax list page
    }, 2000); // Show popup for 2 seconds
  };

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    handleClick(); //for popUp show when api will be failure.
    setApiError(`An error occurred: ${error}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (isOnline) {
      // if it true we calling remove discount api
      if (location?.state?.isTaxMapped) {
        unCheckedProdArr &&
          dispatch(
            removeTaxOnProduct(
              unCheckedProdArr,
              taxAddOnProductSuccess,
              apiFailureResponse
            )
          );
      } else {
        checkedProductArr &&
          dispatch(
            addTaxOnMultiProduct(
              checkedProductArr,
              taxAddOnProductSuccess,
              apiFailureResponse
            )
          );
      }
    } else {
      // if it true we calling remove tax api
      if (location?.state?.isTaxMapped) {
        let taxPayload = [];

        for (let i = 0; i <= unCheckedProdArr?.length; i++) {
          if (unCheckedProdArr[i]?.isCheck === false) {
            // let payload = {
            //   taxId: unCheckedProdArr[i]?.taxId,
            //   productId: unCheckedProdArr[i]?.productId,
            //   storeId: unCheckedProdArr[i]?.storeId,
            //   lastUpdate: getUTCDate(),
            //   isSync: 0,
            //   isDeleted: 0,
            // };
            // console.log("singlePayload... ", payload);

            const postDataForSqlite = {
              ...unCheckedProdArr[i],
              taxId: 0, //id
              taxValue: "",
              productId: unCheckedProdArr[i]?.productId,
              lastUpdate: getUTCDate(),
            };

            // Update product details with discount values
            const resultProduct =
              postDataForSqlite &&
              productApi?.productDB?.updateProduct(postDataForSqlite);
            console.log("UpdatedProductResult... ", resultProduct);

            const result =
              taxPayload &&
              mappedTaxApi?.mappedTaxDB?.deleteMappedTax(
                unCheckedProdArr[i]?.productId
              );
            taxAddOnProductSuccess(
              `Tax unmapped successfully from ${
                unCheckedProdArr?.length > 1 ? "products" : "product"
              }`
            );
            // taxPayload.push(payload);
          }
        }
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

            const postDataForSqlite = {
              ...checkedProductArr[i],
              taxId: 0, //id
              taxValue: "",
              productId: checkedProductArr[i]?.productId,
              lastUpdate: getUTCDate(),
            };

            // Update product details with discount values
            const resultProduct =
              postDataForSqlite &&
              productApi?.productDB?.updateProduct(postDataForSqlite);
            console.log("UpdatedProductResult... ", resultProduct);

            const result =
              taxPayload && mappedTaxApi?.mappedTaxDB?.insertMappedTax(payload);
            taxAddOnProductSuccess(
              `Tax mapped successfully on ${
                checkedProductArr?.length > 1 ? "products" : "product"
              }`
            );
            taxPayload.push(payload);
          }
        }
      }
    }
  };

  return (
    <MainContentArea>
      <div className="mb-2" style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          style={{ background: "#e3e2e2", color: "dimgray" }}
          onClick={() => navigate(-1)}
        >
          {t("AddNewProduct.Back")}
        </Button>
      </div>
      <div className="d-flex flex-column gap-3">
        <div className="box-shadow w-50 p-3 border-radious-5px">
          <div className="mb-3">
            <InputLabel style={{ color: "var(--product-text-color)" }}>
              {t("TaxDetails.selectedTax")}
              <span className="text-danger">*</span>
            </InputLabel>
            <div className="mb-1">
              <Select
                placeholder={t("TaxDetails.selectedTax")}
                getOptionLabel={(taxtList) => taxtList?.taxName}
                options={taxtList}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={selectedTax}
                name="unitValue"
                // ref={unitInputRef}
                onChange={(e) => selectTaxHandler(e, "tax")}
                isClearable
              />
            </div>
          </div>

          <div className="mb-3">
            <InputLabel style={{ color: "var(--product-text-color)" }}>
              {t("DiscountDetails.selectCategory")}
              <span className="text-danger">*</span>
            </InputLabel>
            <div className="mb-1">
              <Select
                placeholder={t("DiscountDetails.selectCategory")}
                getOptionLabel={(categoryList) => categoryList?.categoryName}
                options={categoryList}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={selectedCategory}
                name="unitValue"
                // ref={unitInputRef}
                onChange={(e) => selectCategoryHandler(e, "category")}
                isClearable
              />
            </div>
          </div>
        </div>

        {/* Product dashboard */}
        <div className="table-cartbox apply-discount-dashboard w-100">
          <div className="header-container">
            <div className="table-heading">
              <h3>
                {location?.state?.isTaxMapped
                  ? t("TaxDetails.removeMappedTax")
                  : t("TaxDetails.applyTaxOnProduct")}
              </h3>
            </div>
            <div className="search-container">
              <input
                type="search"
                className="form-control"
                placeholder={t("DiscountDetails.SearchProductByName")}
                aria-label="Search"
                // onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  // marginTop: 5,
                }}
                onClick={submitHandler}
              >
                {t("TaxDetails.submit")}
              </Button>
            </div>
          </div>
          {finalProductList?.length > 0 ? (
            <table className="table">
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
                  </th>
                  <th scope="col">{t("TaxDetails.productName")}</th>
                  <th scope="col">{t("TaxDetails.beforeTax")}</th>
                  <th scope="col">{t("TaxDetails.afterTax")}</th>
                </tr>
              </thead>
              {finalProductList &&
                finalProductList?.map((item, index) => {
                  return (
                    <tbody>
                      <tr>
                        <td>
                          <div className="tax-product-name">
                            <Checkbox
                              className="p-0"
                              type="checkbox"
                              checked={item.isCheck}
                              size="small"
                              name={index}
                              onChange={checkboxHandler}
                            />
                          </div>
                        </td>
                        <td>
                          <label className="">{item?.productName}</label>
                        </td>
                        {item.isCheck === true ? (
                          <td>
                            <strike>
                              {DEFAULT_LANGUAGE === "ar" ||
                              DEFAULT_LANGUAGE === "عربي" ? (
                                <>
                                  {item?.sellingPrice}
                                  {CurrencySymbol}
                                </>
                              ) : (
                                <>
                                  {CurrencySymbol}
                                  {item?.sellingPrice}
                                </>
                              )}
                            </strike>
                          </td>
                        ) : (
                          <td>
                            {DEFAULT_LANGUAGE === "ar" ||
                            DEFAULT_LANGUAGE === "عربي" ? (
                              <>
                                {item?.sellingPrice}
                                {CurrencySymbol}
                              </>
                            ) : (
                              <>
                                {CurrencySymbol}
                                {item?.sellingPrice}
                              </>
                            )}
                          </td>
                        )}

                        {item.isCheck === true ? (
                          <td>
                            {DEFAULT_LANGUAGE === "ar" ||
                            DEFAULT_LANGUAGE === "عربي" ? (
                              <>
                                {item?.afterTaxPrice}
                                {CurrencySymbol}
                              </>
                            ) : (
                              <>
                                {CurrencySymbol}
                                {item?.afterTaxPrice}
                              </>
                            )}
                          </td>
                        ) : (
                          <td>
                            <strike>
                              {DEFAULT_LANGUAGE === "ar" ||
                              DEFAULT_LANGUAGE === "عربي" ? (
                                <>
                                  {item?.afterTaxPrice}
                                  {CurrencySymbol}
                                </>
                              ) : (
                                <>
                                  {CurrencySymbol}
                                  {item?.afterTaxPrice}
                                </>
                              )}
                            </strike>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  );
                })}
            </table>
          ) : (
            <EmptyProductsCategoryMessege />
          )}

          <div>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
                // marginTop: 5,
              }}
              onClick={submitHandler}
            >
              {t("TaxDetails.submit")}
            </Button>
          </div>
        </div>
        <AlertpopUP
          open={isPopupOpen}
          message={apiError ? apiError : toastSuccessMsg}
          severity={apiError ? "error" : "success"}
          onClose={handleClose}
        />
      </div>
    </MainContentArea>
  );
};

export default ApplyTaxOnProduct;
