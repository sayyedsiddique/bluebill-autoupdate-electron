import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { STORE_Id, STORE_CURRENCY, getUTCDate } from "../../Containts/Values";
import {
  addDisOnMultiplePro,
  getDiscountlist,
  getMappedDiscountByProdutId,
  getMappedDiscountListByStoreId,
} from "../../Redux/Discount/discountSlice";
import { getProductList } from "../../Redux/Product/productSlice";
import { useTranslation } from "react-i18next";
import AlertpopUP from "../../utils/AlertPopUP";
import { Checkbox } from "@mui/material";

const ApplyDiscountModal = (props) => {
  const { t } = useTranslation();
  const { isModelVisible, selectedDiscount, setshow } = props;
  // console.log("selectedDiscount... ", selectedDiscount);
  const dispatch = useDispatch();
  const productApi = window.productApi;
  const discountMappingApi = window.discountMappingApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const mappedDiscountData = useSelector(
    (state) => state.discount.mappedDiscountData
  );
  // console.log("mappedDiscountData... ", mappedDiscountData);
  const mappedDiscountSingle = useSelector(
    (state) => state.discount.getSingleDiscount
  );
  const isLoading = useSelector((state) => state.discount.loading);
  const productData = useSelector((state) => state.product.productData);
  console.log("selectedDiscount ", selectedDiscount);
  console.log("productData ", productData);
  const [storeId, setStoreId] = useState("");
  const [products, setProducts] = useState([]);
  console.log("products... ", products);
  const [discountMappedListData, setDiscountMappedListData] = useState([]);
  console.log("discountMappedListData... ", discountMappedListData);
  const [isCheckValue, setIsCheckValue] = useState(false);
  const [allProductCheck, setAllProductCheck] = useState(false);
  const [checkedProductArr, setCheckProductArr] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);
  // console.log("checkedProductArr... ", checkedProductArr);
  const [discountNotMappedProducts, setDiscountNotMappedProducts] = useState(
    []
  );
  console.log("discountNotMappedProducts... ", discountNotMappedProducts);

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

  // useEffect(() => {
  //   dispatch(getDiscountlist());
  //   STORE_Id && setStoreId(Number(STORE_Id));
  // }, [STORE_Id]);

  // after i got api responsive we store in state
  useEffect(() => {
    // dispatch(getDiscountlist());
    STORE_Id && setStoreId(Number(STORE_Id));
  }, [STORE_Id]);

  useEffect(() => {
    productData?.product?.length > 0 && setProducts(productData?.product);
  }, [isModelVisible, productData?.product]);

  // Get product list
  // useEffect(() => {
  //   if (productData.length === 0) {
  //     dispatch(getProductList());
  //   }
  // }, [productData]);

  // storing mappedDiscountData data into state
  useEffect(() => {
    mappedDiscountData?.length > 0 &&
      setDiscountMappedListData(mappedDiscountData);
  }, [isModelVisible, mappedDiscountData]);

  useEffect(() => {
    if (isOnline) {
      // call this api only when this modal opened
      if (isModelVisible) {
        dispatch(getProductList(0, 0, ""));
        dispatch(getMappedDiscountListByStoreId());
      }
    } else {
      const productList = productApi?.productDB?.getProductsList();
      productList && setProducts(productList);
      const mappedDiscountList =
        discountMappingApi?.discountMappingDB?.getDiscountMappedList();
      // console.log("mappedDiscountListSqlite... ", mappedDiscountList);
      mappedDiscountList && setDiscountMappedListData(mappedDiscountList);
    }
  }, [isModelVisible]);

  // here we check how many product already have discount mapped
  useEffect(() => {
    let discountNotMappedProducts = [];
    let selectedDiscountArr = [];

    selectedDiscountArr = [
      ...discountMappedListData.filter(
        (discountItem) =>
          discountItem?.discountId === selectedDiscount.discountId
      ),
    ];
    console.log("selectedDiscountArr... ", selectedDiscountArr);

    // if duplicate array item added in array
    // then it's remove duplicate item from the array
    let selectedDiscountUniqueArray = Array.from(new Set(selectedDiscountArr));
    console.log("selectedDiscountUniqueArray ", selectedDiscountUniqueArray);

    // if discount mapped array has item then it run
    if (selectedDiscountUniqueArray?.length > 0) {
      // we check how much product match in the tax mapped array
      // console.log("found chala");
      products &&
        products?.map((prodItem) => {
          selectedDiscountUniqueArray &&
            selectedDiscountUniqueArray?.filter((item) => {
              if (prodItem?.productId === item?.productId) {
                discountNotMappedProducts.push(prodItem);
              }
            });
        });
    } else {
      // if we dont find any discount mapped product
      // then we displayed whole product list
      // console.log("not found chala");
      setDiscountNotMappedProducts(products);
    }
    console.log("discountNotMappedProducts... ", discountNotMappedProducts);

    // we remove item from product array
    // which match with discount mapped product
    let newPro = [];
    products &&
      products?.filter((prodItem, prodIndex) => {
        // let newArr = discountNotMappedProducts.includes(prodItem);
        if (!discountNotMappedProducts.includes(prodItem)) {
          newPro.push(prodItem);
        }
      });
    // console.log("newPro... ", newPro);
    setDiscountNotMappedProducts(newPro);
  }, [isModelVisible, selectedDiscount, products]);

  // we check here selected discount mapped on which product
  useEffect(() => {
    const productList = isOnline
      ? productData?.product
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
    // console.log("newArr... ", newArr);

    // if duplicate array item added in array
    // then it's remove duplicate item in the array
    let flatDiscountProducts =
      newArr?.length > 0 && Array.from(new Set(newArr));
    // console.log("flatDiscountProducts.... ", flatDiscountProducts);

    arr =
      flatDiscountProducts?.length > 0
        ? flatDiscountProducts && [...flatDiscountProducts]
        : productList && [...productList];
    // console.log("arr... ", arr);

    arr &&
      arr?.map((item, index) => {
        let afterDiscountPrice;

        // if dicounst if flat then it will run
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
            storeId: storeId,
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
            storeId: storeId,
            afterDiscountPrice: afterDiscountPrice.toFixed(2),
          };
          filterProducts.push(obj);
        }
      });
    console.log("filterProducts... ", filterProducts);
    setProducts(filterProducts);
    // }
    //  else{

    //   let afterDiscountPrice =
    //   item?.sellingPrice +
    //   (item?.sellingPrice * applyTaxItem?.taxValue) / 100;

    //   let obj = {
    //     ...item,
    //     isCheck: false,
    //     discountId: selectedDiscount?.discountId,
    //     storeId: storeId,
    //     afterDiscountPrice: afterDiscountPrice.toFixed(2),
    //   };
    // }
  }, [isModelVisible, selectedDiscount, productData?.product]);

  // submit button disable or enable when user checkout
  useEffect(() => {
    let checkedValue =
      discountNotMappedProducts &&
      discountNotMappedProducts.some((item) => {
        return item.isCheck === true;
      });

    let allProdCheck = discountNotMappedProducts?.filter(
      (item) => item?.isCheck === true
    );
    let allProdAreCheck =
      allProdCheck?.length === discountNotMappedProducts?.length;
    setAllProductCheck(allProdAreCheck);
    // if user check the value then we enable the button
    if (checkedValue === true) {
      setIsCheckValue(true);
    } else {
      setIsCheckValue(false);
    }
  }, [isModelVisible, discountNotMappedProducts]);

  // checkbox handler
  const checkboxHandler = (e) => {
    // console.log("e ", e?.target);
    const { name, checked } = e.target;
    let arr = [...products];
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
            // checkedProductsArr.push(arr[itemIndex])
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

    // setCheckProductArr(checkedProductsArr)
    setProducts(arr);
  };

  // All checked handler
  const allCheckhandler = (e) => {
    const { checked } = e.target;

    let arr = [...products];
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

    setProducts(arr);
  };

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setshow(false); // Redirect to discount list page
    }, 2000); // Show popup for 2 seconds
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const discountAddOnProductSuccess = () => {
    handleClick(); // for popUp

    // Swal.fire({
    //   icon: "success",
    //   title: "Discount added successfully on the product.",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     setshow(false);
    //   }
    // });
  };

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    handleClick(); //for popUp show when api will be failure
    setApiError(`An error occurred: ${error}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (isOnline) {
      checkedProductArr?.length > 0 &&
        dispatch(
          addDisOnMultiplePro(
            checkedProductArr,
            discountAddOnProductSuccess,
            apiFailureResponse
          )
        );
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

          const result =
            payload &&
            discountMappingApi?.discountMappingDB?.insertDiscountMapping(
              payload
            );
          discountAddOnProductSuccess();
        }
      }
    }
  };

  return (
    <div>
      <Modal
        size="small"
        isOpen={isModelVisible}
        toggle={() => setshow(!isModelVisible)}
      >
        <ModalHeader
          toggle={() => setshow(!isModelVisible)}
          style={{
            backgroundColor: "var(--topHeader-bg-color)",
            color: "var(--text-color)",
          }}
        >
          <div className="discount-table-header">
          {t("DiscountDetails.apply")}{" "}
            {selectedDiscount && selectedDiscount?.discountName}{" "}
            {selectedDiscount && selectedDiscount?.isPercent === true
              ? "%"
              : "flat"}{" "}
            {t("DiscountDetails.discount")}
            <button
              className="btn btn-primary ms-2"
              style={{
                background: "var(--main-bg-color)",
                color: "var(--white-color)",
                fontsize: " 22px",
              }}
              onClick={(e) => submitHandler(e)}
              disabled={isCheckValue === false ? true : false}
            >
              {t("DiscountDetails.submit")}
            </button>
          </div>
        </ModalHeader>
        {isLoading ? (
          <LoadingSpinner spinnerSize="small" />
        ) : (
          <ModalBody style={{ backgroundColor: "var(--topHeader-bg-color)" }}>
            <form action="">
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
                      {/* <input
                        type="checkbox"
                        // id={`custom-checkbox-${index}`}
                        checked={allProductCheck}
                        // name={index}
                        onChange={allCheckhandler}
                      /> */}
                    </th>
                    <th scope="col">{t("DiscountDetails.productName")}</th>
                    <th scope="col">{t("DiscountDetails.beforeDiscount")}</th>
                    <th scope="col">{t("DiscountDetails.afterDiscount")}</th>
                  </tr>
                </thead>
                {discountNotMappedProducts &&
                  discountNotMappedProducts?.map((item, index) => {
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
                            <label className="">{item?.productName}</label>
                          </td>
                          {item.isCheck === true ? (
                            <td>
                              <strike>
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
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
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
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
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
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
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
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
              <button
                className="mt-3 btn btn-primary"
                style={{
                  background: "var(--main-bg-color)",
                  color: "var(--white-color)",
                  fontsize: " 22px",
                }}
                onClick={(e) => submitHandler(e)}
                disabled={isCheckValue === false ? true : false}
              >
                {t("DiscountDetails.submit")}
              </button>
            </form>

            <AlertpopUP
              open={isPopupOpen}
              message={
                apiError
                  ? apiError
                  : "Discount added successfully on the product!"
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

export default ApplyDiscountModal;
