import React, { useEffect, useState } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import { Button, Checkbox, InputLabel } from "@mui/material";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import {
  CurrencySymbol,
  DEFAULT_LANGUAGE,
  STORE_Id,
  getUTCDate,
  pageSizeForPag,
} from "../../Containts/Values";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import {
  addDisOnMultiplePro,
  getDiscountMappedProductsByCatId,
  getDiscountlist,
  removeDisOnMultiplePro,
} from "../../Redux/Discount/discountSlice";
import { BiSearch } from "react-icons/bi";
import AlertpopUP from "../../utils/AlertPopUP";
import EmptyProductsCategoryMessege from "../CartPage/EmptyCategoryMsg/EmptyProductsCategoryMessege";

const ApplyDiscountOnProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  console.log("location... ", location?.state?.isDiscountMapped);
  const discountApi = window.discountApi;
  const discountMappingApi = window.discountMappingApi;
  const categoryApi = window.categoryApi;
  const productApi = window.productApi;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const discountData = useSelector((state) => state.discount.discountData);
  const productListData = useSelector((state) => state.discount.productList);
  console.log("productListData... ", productListData);
  const isLoading = useSelector((state) => state.category.loading);

  const [categoryList, setCategoryList] = useState([]);
  console.log("categoryList... ", categoryList);
  const [selectedCategory, setSelectedCategory] = useState("");
  console.log("selectedCategory... ", selectedCategory);
  const [discountList, setDiscountList] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(
    location?.state?.discount
  );
  const [productList, setProductList] = useState([]);
  const [finalProductList, setFinalProductList] = useState([]);
  console.log("finalProductList... ", finalProductList);
  const [checkedProductArr, setCheckProductArr] = useState([]);
  const [unCheckedProdArr, setUnCheckedProdArr] = useState([]);
  console.log("checkedProductArr... ", checkedProductArr);
  console.log("unCheckedProdArr... ", unCheckedProdArr);
  const [isCheckValue, setIsCheckValue] = useState(false);
  const [allProductCheck, setAllProductCheck] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);
  const [toastSuccessMsg, setToastSuccessMsg] = useState("");
  console.log("selectedDiscount... ", selectedDiscount);
  console.log("discountList... ", discountList);
  console.log("productList... ", productList);

  useEffect(() => {
    const productList = isOnline
      ? productListData?.productDiscount
      : productApi?.productDB?.getProductsList();
    let arr = productList?.length && [...productList];
    let newArr = [];
    let filterProducts = [];
    // console.log("filterProducts... ", filterProducts);

    // if user select flat discount then it will run
    // if (selectedDiscount?.isPercent === false || selectedDiscount?.isPercent === 0) {
    // if selected discount is flat discount
    // and discount value greater then product price
    // so that product i will removed
    newArr = arr?.length > 0 && [
      ...arr?.filter(
        (item) =>
          selectedDiscount?.isPercent === false &&
          selectedDiscount?.discountVal < item?.sellingPrice
      ),
    ];

    console.log("newArr... ", newArr);

    // if duplicate array item added in array
    // then it's remove duplicate item in the array
    let flatDiscountProducts =
      newArr?.length > 0 && Array.from(new Set(newArr));

      arr =
      flatDiscountProducts?.length > 0
        ? flatDiscountProducts && [...flatDiscountProducts]
        : productList && [...productList];

        arr &&
        arr?.map((item, index) => {
          let afterDiscountPrice;
  
          // if discount is flat then it will run
          if (
            selectedDiscount?.isPercent === false ||
            selectedDiscount?.isPercent === 0
          ) {
            // console.log("flat discount");
            afterDiscountPrice =
              item?.sellingPrice - selectedDiscount?.discountVal;
  
            let obj = {
              ...item,
              isCheck: false,
              discountId: selectedDiscount?.discountId,
              storeId: STORE_Id,
              afterDiscountPrice: afterDiscountPrice.toFixed(2),
            };
            // console.log("obj... ", obj);
            filterProducts.push(obj);
          }
  
          if (
            selectedDiscount?.isPercent === true ||
            selectedDiscount?.isPercent === 1
          ) {
            // console.log("percentDiscount");
            // Calculate the discount amount
            let afterDiscountPrice =
              item?.sellingPrice -
              (item?.sellingPrice * selectedDiscount?.discountVal) / 100;
  
            let obj = {
              ...item,
              isCheck: false,
              discountId: selectedDiscount?.discountId,
              storeId: STORE_Id,
              afterDiscountPrice: afterDiscountPrice.toFixed(2),
            };
            filterProducts.push(obj);
          }
        });
      console.log("filterProducts... ", filterProducts);
      setProductList(filterProducts);

  }, [productListData?.productDiscount]);

  // if categoriesData has data then it store in data state
  useEffect(() => {
    discountData?.discount?.length > 0 &&
      setDiscountList(discountData?.discount);
    categoriesData?.category?.length > 0 &&
      setCategoryList(categoriesData?.category);
  }, [discountData?.discount, categoriesData?.category]);

  // Discount and Category list api called here
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      dispatch(getDiscountlist(0, 0, "", ""));
      dispatch(getCategoryList(0, 0, ""));
    } else {
      let arr = [];
      const discountListData = discountApi?.discountDB?.getAllDiscounts();

      discountListData &&
        discountListData?.map((item) => {
          const now = new Date();
          const expiry = new Date(item?.endDate);
          const date = new Date();
          const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          };

          let obj = {
            ...item,
            isExpire: expiry <= now,
          };
          arr.push(obj);
        });
      arr && setDiscountList(arr);

      const categories = categoryApi?.categoryDB?.getAllCategories();
      console.log("categoriessqlite... ", categories);
      setCategoryList(categories);
    }
  }, [isOnline]);

  // Initially calculating discount value with product price
  useEffect(() => {
    // const productList = isOnline
    //   ? productListData?.productDiscount
    //   : productApi?.productDB?.getProductsList();

    // Creating a shallow copy of the productList array.
    // arr and productList both reference the same objects in memory.
    const productsDataList = [...productList];
    let arr = productList?.length && [...productList];
    let newArr = [];
    let filterProducts = [];
    // console.log("filterProducts... ", filterProducts);

    // if user select flat discount then it will run
    // if (selectedDiscount?.isPercent === false || selectedDiscount?.isPercent === 0) {
    // if selected discount is flat discount
    // and discount value greater then product price
    // so that product i will removed
    newArr = arr?.length > 0 && [
      ...arr?.filter(
        (item) =>
          selectedDiscount?.isPercent === false &&
          selectedDiscount?.discountVal < item?.sellingPrice
      ),
    ];

    console.log("newArr... ", newArr);

    // if duplicate array item added in array
    // then it's remove duplicate item in the array
    let flatDiscountProducts =
      newArr?.length > 0 && Array.from(new Set(newArr));

    arr =
      flatDiscountProducts?.length > 0
        ? flatDiscountProducts && [...flatDiscountProducts]
        : productsDataList && [...productsDataList];

    arr &&
      arr?.map((item, index) => {
        let afterDiscountPrice;

        // if discount is flat then it will run
        if (
          selectedDiscount?.isPercent === false ||
          selectedDiscount?.isPercent === 0
        ) {
          // console.log("flat discount");
          afterDiscountPrice =
            item?.sellingPrice - selectedDiscount?.discountVal;

          let obj = {
            ...item,
            isCheck: location?.state?.isDiscountMapped,
            discountId: selectedDiscount?.discountId,
            storeId: STORE_Id,
            afterDiscountPrice: afterDiscountPrice.toFixed(2),
          };
          // console.log("obj... ", obj);
          filterProducts.push(obj);
        }

        if (
          selectedDiscount?.isPercent === true ||
          selectedDiscount?.isPercent === 1
        ) {
          // console.log("percentDiscount");
          // Calculate the discount amount
          let afterDiscountPrice =
            item?.sellingPrice -
            (item?.sellingPrice * selectedDiscount?.discountVal) / 100;

          let obj = {
            ...item,
            isCheck: location?.state?.isDiscountMapped,
            discountId: selectedDiscount?.discountId,
            storeId: STORE_Id,
            afterDiscountPrice: afterDiscountPrice.toFixed(2),
          };
          filterProducts.push(obj);
        }
      });
    console.log("filterProducts... ", filterProducts);

    // When came to unmap discount from product
    if (location?.state?.isDiscountMapped) {
      setAllProductCheck(location?.state?.isDiscountMapped);
      setCheckProductArr(filterProducts);
    }
    setFinalProductList(filterProducts);
  }, [productList]);

  // Remove previous product list when user navigate
  useEffect(() => {
    !selectedCategory &&
      productListData?.productDiscount?.length > 0 &&
      setProductList([]);
  }, [selectedCategory, productListData?.productDiscount]);

  // Discount select handler
  const selectDiscountHandler = (e) => {};

  // Category select handler
  const selectCategoryHandler = (e) => {
    console.log("CategoryHandler ", e);
    setSelectedCategory(e);

    if (isOnline) {
      dispatch(
        getDiscountMappedProductsByCatId(
          e?.categoryId,
          selectedDiscount?.discountId,
          location?.state?.isDiscountMapped,
          0,
          0,
          ""
        )
      );
    } else {
      let productDataList = productApi?.productDB?.getProductDiscountMapped(
        e?.categoryId,
        location?.state?.isDiscountMapped
      );
      setProductList(productDataList);
      console.log("productDataListLOCAL... ", productDataList);
    }
  };

  // checkbox handler
  const checkboxHandler = (e) => {
    const { name, checked } = e.target;
    console.log("name", name);
    console.log("Echecked", checked);
    let arr = [...finalProductList];
    let checkedProductsArr = [...checkedProductArr];
    let uncheckProductsArr = [...unCheckedProdArr];

    if (checked === false) {
      let onlyCheckedProd = [
        ...checkedProductsArr.filter((item, index) => index !== Number(name)),
      ];
      let onlyUnCheckedProd = [
        ...checkedProductsArr.filter((item, index) => index === Number(name)),
      ];
      console.log("onlyUnCheckedProd... ", onlyUnCheckedProd);
      // setUnCheckedProdArr(...unCheckedProdArr, onlyUnCheckedProd)
      setCheckProductArr(onlyCheckedProd);

      arr &&
        arr?.map((item, itemIndex) => {
          if (itemIndex === Number(name)) {
            arr[itemIndex].isCheck = checked;
            uncheckProductsArr.push(arr[itemIndex]);
          }
        });
      // console.log("uncheckProductsArr ", uncheckProductsArr);
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

    // setCheckProductArr(checkedProductsArr)
    // setProductList(arr);
    setFinalProductList(arr);
  };

  // All checked handler
  const allCheckhandler = (e) => {
    const { checked } = e.target;

    // Creating a shallow copy of the productList array.
    // arr and productList both reference the same objects in memory.
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

    // setProductList(arr);
    setFinalProductList(arr);
  };

  //for popUp
  // const handleClick = () => {
  //   setIsPopupOpen(true);
  //   setTimeout(() => {
  //     setIsPopupOpen(false);
  //     navigate("/Discount");
  //   }, 2000); // Show popup for 2 seconds
  // };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // Success Handler
  const discountAddOnProductSuccess = (message) => {
    // handleClick(); // for popUp
    setToastSuccessMsg(message);
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      navigate("/Discount");
    }, 2000); // Show popup for 2 seconds
  };

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    // handleClick(); //for popUp show when api will be failure
    setApiError(`An error occurred: ${error}`);
  };

  // submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (isOnline) {
      // if it true we calling remove discount api
      if (location?.state?.isDiscountMapped) {
        unCheckedProdArr &&
          dispatch(
            removeDisOnMultiplePro(
              unCheckedProdArr,
              discountAddOnProductSuccess,
              apiFailureResponse
            )
          );
      } else {
        // under false we calling appyly discount api
        checkedProductArr &&
          dispatch(
            addDisOnMultiplePro(
              checkedProductArr,
              discountAddOnProductSuccess,
              apiFailureResponse
            )
          );
      }
    } else {
      // if it true we calling remove discount api
      if (location?.state?.isDiscountMapped) {
        for (let i = 0; i <= unCheckedProdArr?.length; i++) {
          if (unCheckedProdArr[i]?.isCheck === false) {

            const postDataForSqlite = {
              ...unCheckedProdArr[i],
              discountId: 0, //id
              discountVal: "",
              productId: unCheckedProdArr[i]?.productId,
              lastUpdate: getUTCDate(),
            };

            // Update product details with discount values
            const resultProduct =
              postDataForSqlite &&
              productApi?.productDB?.updateProduct(postDataForSqlite);
            console.log("UpdatedProductResult... ", resultProduct);

            const result =
              discountMappingApi?.discountMappingDB?.deleteDiscountMapping(
                unCheckedProdArr[i]?.productId
              );
            discountAddOnProductSuccess(
              `Discount unmapped successfully from ${
                unCheckedProdArr?.length > 1 ? "products" : "product"
              }`
            );
          }
        }
      } else {
        for (let i = 0; i <= checkedProductArr?.length; i++) {
          if (checkedProductArr[i]?.isCheck === true) {
            let payload = {
              discountId: checkedProductArr[i]?.discountId, //id
              productId: checkedProductArr[i]?.productId,
              storeId: STORE_Id,
              lastUpdate: getUTCDate(),
              isDeleted: 0,
              isSync: 0,
            };

            const postDataForSqlite = {
              ...checkedProductArr[i],
              discountId: checkedProductArr[i]?.discountId, //id
              discountVal: selectedDiscount?.discountVal,
              productId: checkedProductArr[i]?.productId,
              lastUpdate: getUTCDate(),
            };

            // Update product details with discount values
            const resultProduct =
              postDataForSqlite &&
              productApi?.productDB?.updateProduct(postDataForSqlite);
            console.log("UpdatedProductResult... ", resultProduct);

            const result =
              payload &&
              discountMappingApi?.discountMappingDB?.insertDiscountMapping(
                payload
              );
            discountAddOnProductSuccess(
              `Discount mapped successfully on ${
                checkedProductArr?.length > 1 ? "products" : "product"
              }`
            );
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
              {t("DiscountDetails.selectedDiscount")}
              <span className="text-danger">*</span>
            </InputLabel>
            <div className="mb-1">
              <Select
                placeholder={t("DiscountDetails.selectedDiscount")}
                getOptionLabel={(discountList) => discountList?.discountName}
                options={discountList}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={selectedDiscount}
                name="unitValue"
                // ref={unitInputRef}
                onChange={(e) => selectDiscountHandler(e, "discount")}
                isClearable
              />
              {/* {error && error?.unitValue && (
                  <span className="text-danger">{error?.unitValue}</span>
                )} */}
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
              {/* {error && error?.unitValue && (
                  <span className="text-danger">{error?.unitValue}</span>
                )} */}
            </div>
          </div>
        </div>

        {/* Product dashboard */}
        <div className="table-cartbox apply-discount-dashboard w-100">
          <div className="header-container">
            <div className="table-heading">
              <h3>
                {location?.state?.isDiscountMapped
                  ? t("DiscountDetails.RemoveMappedDiscount")
                  : t("DiscountDetails.applyDiscountOnProduct")}
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
                {t("DiscountDetails.submit")}
              </Button>
            </div>
          </div>
          {productList?.length > 0 ? (
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
                  <th scope="col">{t("DiscountDetails.productName")}</th>
                  <th scope="col">{t("DiscountDetails.beforeDiscount")}</th>
                  <th scope="col">{t("DiscountDetails.afterDiscount")}</th>
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
                                {item?.afterDiscountPrice}
                                {CurrencySymbol}
                              </>
                            ) : (
                              <>
                                {CurrencySymbol}
                                {item?.afterDiscountPrice}
                              </>
                            )}
                          </td>
                        ) : (
                          <td>
                            <strike>
                              {DEFAULT_LANGUAGE === "ar" ||
                              DEFAULT_LANGUAGE === "عربي" ? (
                                <>
                                  {item?.afterDiscountPrice}
                                  {CurrencySymbol}
                                </>
                              ) : (
                                <>
                                  {CurrencySymbol}
                                  {item?.afterDiscountPrice}
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
              {t("DiscountDetails.submit")}
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

export default ApplyDiscountOnProduct;
