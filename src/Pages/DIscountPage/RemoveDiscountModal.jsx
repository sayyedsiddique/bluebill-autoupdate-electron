import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../Redux/Product/productSlice";
import {
  addDisOnMultiplePro,
  getMappedDiscountListByStoreId,
  removeDisOnMultiplePro,
} from "../../Redux/Discount/discountSlice";
import { Checkbox } from "@mui/material";
import Swal from "sweetalert2";
import { getUTCDate } from "../../Containts/Values";

const RemoveDiscountModal = ({ isModelVisible, selectedDiscount, setshow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const productApi = window.productApi;
  const discountMappingApi = window.discountMappingApi;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const mappedDiscountData = useSelector(
    (state) => state.discount.mappedDiscountData
  );
  console.log("selectedDiscount... ", selectedDiscount);
  const productData = useSelector((state) => state.product.productData);
  console.log("productData... ", productData);
  const [products, setProducts] = useState([]);
  const [discountMappedListData, setDiscountMappedListData] = useState([]);
  console.log("discountMappedListData... ", discountMappedListData);
  const [isCheckValue, setIsCheckValue] = useState(true);
  const [allProductCheck, setAllProductCheck] = useState(false);
  const [checkedProductArr, setCheckProductArr] = useState([]);
  // console.log("checkedProductArr... ", checkedProductArr)
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);
  // console.log("checkedProductArr... ", checkedProductArr);
  const [discountMappedProducts, setDiscountMappedProducts] = useState([]);
  console.log("discountMappedProducts... ", discountMappedProducts);
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");

  // Setting default language
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

  // storing mappedDiscountData data into state
  useEffect(() => {
    mappedDiscountData?.length > 0 &&
      setDiscountMappedListData(mappedDiscountData);
  }, [isModelVisible, mappedDiscountData]);

  // calling initial apis
  useEffect(() => {
    if (isOnline) {
      // call this api only when this modal opened
      if (isModelVisible) {
        dispatch(getProductList(0, 0, ""));
        dispatch(getMappedDiscountListByStoreId()); // storeId directly passed in url
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

  // Storing product data in state with isCheck false value
  useEffect(() => {
    let newArr = [];

    productData?.product &&
      productData?.product?.length > 0 &&
      productData?.product?.map((item) => {
        let obj = {
          ...item,
          isCheck: false,
        };
        newArr.push(obj);
      });

    setProducts(newArr);
  }, [isModelVisible, productData?.product]);

  // here we are checking how many products already have discount mapped
  useEffect(() => {
    let discountMappedProduct = [];
    let selectedDiscountList = [];
    discountMappedListData &&
      discountMappedListData?.filter((discountItem) => {
        if (discountItem?.discountId === selectedDiscount.discountId) {
          selectedDiscountList.push(discountItem);
        }
      });
    console.log("selectedDiscountList... ", selectedDiscountList);

    selectedDiscountList &&
      selectedDiscountList?.map((discountItem) => {
        productData?.product &&
          productData?.product?.map((prodItem) => {
            if (discountItem?.productId === prodItem?.productId) {
              let newObj = {
                ...prodItem,
                isCheck: true,
                discountId: discountItem?.discountId,
                storeId: discountItem?.storeId,
              };
              discountMappedProduct.push(newObj);
            }
          });
      });
    setAllProductCheck(true);
    setDiscountMappedProducts(discountMappedProduct);
  }, [
    isModelVisible,
    discountMappedListData,
    productData?.product,
    selectedDiscount,
  ]);

  // submit button disable or enable when user checkout
  useEffect(() => {
    // it's check whole array if someone value equal
    // then it return a true value
    let checkedValue =
      discountMappedProducts &&
      discountMappedProducts.some((item) => {
        return item.isCheck === false;
      });
    // console.log("checkedValue... ", checkedValue)

    // if user uncheck the value then we enable the button
    if (checkedValue === true) {
      setIsCheckValue(false);
      setAllProductCheck(false);
    } else {
      setIsCheckValue(true);
      setAllProductCheck(true);
    }
  }, [isModelVisible, discountMappedProducts, isCheckValue]);

  // here we check how many products are already mapped discount
  // useEffect(() => {
  //   let discountMappedProducts = [];
  //   let selectedDiscountArr = [];

  //   selectedDiscountArr = [
  //     ...discountMappedListData.filter(
  //       (discountItem) =>
  //         discountItem?.discountId === selectedDiscount.discountId
  //     ),
  //   ];
  //   console.log("selectedDiscountArr... ", selectedDiscountArr);

  //   // if duplicate item in the array
  //   // then remove duplicate item from the array
  //   let selectedDiscountUniqueArray = Array.from(new Set(selectedDiscountArr));
  //   console.log("RselectedDiscountUniqueArray ", selectedDiscountUniqueArray);

  //   // if discount mapped array has item then it run
  //   if (selectedDiscountUniqueArray?.length > 0) {
  //     // we check how much product match in the tax mapped array
  //     console.log("found chala");
  //     products &&
  //       products?.map((prodItem) => {
  //         selectedDiscountUniqueArray &&
  //           selectedDiscountUniqueArray?.filter((item) => {
  //             if (prodItem?.productId === item?.productId) {
  //               discountMappedProducts.push(prodItem);
  //             }
  //           });
  //       });
  //   } else {
  //     // if we dont found any tax mapped product
  //     // then we displayed whole product list
  //     console.log("not found chala");
  //     setDiscountMappedProducts(products);
  //   }
  //   console.log("RdiscountMappedProducts... ", discountMappedProducts);

  //   // we remove item from product array
  //   // which match with discount mapped product
  //   let newPro = [];
  //   products &&
  //     products?.filter((prodItem, prodIndex) => {
  //       // let newArr = discountMappedProducts.includes(prodItem);
  //       if (discountMappedProducts.includes(prodItem)) {
  //         newPro.push(prodItem);
  //       }
  //     });
  //   console.log("RnewPro... ", newPro);
  //   setDiscountMappedProducts(newPro);
  // }, [selectedDiscount, products]);

  // checkbox handler
  const checkboxHandler = (e) => {
    console.log("e ", e?.target);
    const { name, checked } = e.target;

    let arr = [...discountMappedProducts];
    let checkedProductsArr = [...checkedProductArr];

    if (checked === true) {
      let onlyCheckedProd = [
        ...checkedProductsArr.filter((item, index) => index === Number(name)),
      ];
      // console.log("onlyCheckedProd... ", onlyCheckedProd)
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

    setDiscountMappedProducts(arr);
  };

  const allProductsCheckHandler = (e) => {
    const { checked } = e.target;

    let arr = [...discountMappedProducts];
    let checkedProductsArr = [];

    arr &&
      arr?.map((item, itemIndex) => {
        arr[itemIndex].isCheck = checked;
        checkedProductsArr.push(arr[itemIndex]);
      });

    if (checked === false) {
      setIsCheckValue(checked);
      setCheckProductArr(checkedProductsArr);
    } else {
      setDiscountMappedProducts(checkedProductsArr);
      setIsCheckValue(checked);
      setCheckProductArr([]);
    }
    setAllProductCheck(checked);

    // setTaxNotMappedProduct(arr);
  };

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      setshow(false); // Redirect to tax list page
    }, 2000); // Show popup for 2 seconds
  };

  const discountRemovedOnProductSuccess = () => {
    handleClick(); //for popUp show
  };

  const submitHandler = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "Are you sure you want to remove discount from this product?",
      showCancelButton: true,
      confirmButtonColor: "var(--light-blue-color)",
      confirmButtonText: "Yes, remove it!",
    }).then((res) => {
      if (res?.isConfirmed) {
        if (isOnline) {
          checkedProductArr.length > 0 &&
            dispatch(
              removeDisOnMultiplePro(
                checkedProductArr,
                discountRemovedOnProductSuccess
              )
            );
        } else {
          for (let i = 0; i <= checkedProductArr?.length; i++) {
            if (checkedProductArr[i]?.isCheck === false) {
              // it's soft delete functionality
              let discountPayload = {
                discountId: checkedProductArr[i]?.discountId,
                productId: checkedProductArr[i]?.productId,
                storeId: checkedProductArr[i]?.storeId,
                lastUpdate: getUTCDate(),
                isSync: 0,
                isDeleted: 1,
              };

              // i am currently using hard delete
              // console.log("discountPayload... ", discountPayload)
              // const result =
              //   taxPayload &&
              //   mappedTaxApi?.mappedTaxDB?.deleteMappedTax(taxPayload?.productId);
              discountRemovedOnProductSuccess();
              // taxPayload.push(payload);
            }
          }
        }
      }
    });
  };

  let isLoading = false;
  return (
    <div>
      <Modal
        size="small"
        isOpen={isModelVisible}
        toggle={() => setshow(!isModelVisible)}
      >
        <ModalHeader toggle={() => setshow(!isModelVisible)}>
          {t("DiscountDetails.remove")}{" "}
          {selectedDiscount && selectedDiscount?.discountName}{" "}
          {selectedDiscount && selectedDiscount?.isPercent === true
            ? "%"
            : "flat"}{" "}
          {/* discount */}
        </ModalHeader>
        {isLoading ? (
          <LoadingSpinner spinnerSize="small" />
        ) : (
          <ModalBody>
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
                        onChange={allProductsCheckHandler}
                      />
                    </th>
                    <th scope="col">{t("DiscountDetails.productName")}</th>
                    <th scope="col">{t("DiscountDetails.beforeDiscount")}</th>
                    <th scope="col">{t("DiscountDetails.afterDiscount")}</th>
                  </tr>
                </thead>
                {discountMappedProducts &&
                  discountMappedProducts?.map((item, index) => {
                    return (
                      <tbody>
                        <tr>
                          <td>
                            <div className="tax-product-name">
                              {/* <input
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={item.isCheck}
                                name={index}
                                onChange={checkboxHandler}
                              /> */}
                              <Checkbox
                                className="p-0"
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                checked={item.isCheck}
                                size="small"
                                name={index}
                                onChange={checkboxHandler}
                              />
                            </div>
                          </td>
                          <td>
                            <label for="" className="">
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
                                {/* ₹{item?.afterTaxPrice} */}
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
                              {/* ₹{item?.afterTaxPrice} */}
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
                              {/* ₹{item?.afterTaxPrice} */}
                              {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                                <td>
                                  {item?.sellingPrice -
                                    (item?.sellingPrice *
                                      selectedDiscount?.discountVal) /
                                      100}

                                  {CurrencySymbol}
                                </td>
                              ) : (
                                <td>
                                  {CurrencySymbol}
                                  {item?.sellingPrice -
                                    (item?.sellingPrice *
                                      selectedDiscount?.discountVal) /
                                      100}
                                </td>
                              )}
                            </td>
                          ) : (
                            <td>
                              <strike>
                                {/* ₹{item?.afterTaxPrice} */}
                                {console.log(
                                  "afterTaxPrice ",
                                  item?.afterTaxPrice
                                )}
                                {defaultLanguage === "ar" ||
                                defaultLanguage === "عربي" ? (
                                  <td>
                                    {item?.sellingPrice -
                                      (item?.sellingPrice *
                                        selectedDiscount?.discountVal) /
                                        100}

                                    {CurrencySymbol}
                                  </td>
                                ) : (
                                  <td>
                                    {console.log(
                                      "sellingPrice ",
                                      item?.sellingPrice
                                    )}
                                    {CurrencySymbol}
                                    {item?.sellingPrice -
                                      (item?.sellingPrice *
                                        selectedDiscount?.discountVal) /
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
              <button
                className="mt-3 btn btn-primary"
                style={{
                  background: "var(--main-bg-color)",
                  color: "var(--white-color)",
                  fontsize: " 22px",
                }}
                onClick={(e) => submitHandler(e)}
                disabled={isCheckValue}
              >
                {t("DiscountDetails.submit")}
              </button>
            </form>
          </ModalBody>
        )}
      </Modal>
    </div>
  );
};

export default RemoveDiscountModal;
