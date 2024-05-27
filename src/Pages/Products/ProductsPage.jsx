import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import MainContentArea from "../MainContentArea/MainContentArea";
import ToggleSwitch from "../../Components/ToggleSwitch";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  DEFAULT_IMAGE,
  GET_PRODUCT_EXCEL_SHEET,
  SERVER_URL,
  STORE_CURRENCY,
  STORE_Id,
  pageSizeForPag,
} from "../../Containts/Values";
import Swal from "sweetalert2";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSignleProduct,
  deleteSingleProduct,
  getProductExcelSheet,
  getProductList,
  getProductsCategory,
  getProductsCategoryList,
  getProuductByCategoryId,
} from "../../Redux/Product/productSlice";
import {
  getTaxMappedList,
  removeTaxOnDashProduct,
} from "../../Redux/Tax/taxSlice";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { Button, Pagination } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  ShowExpire,
  apiFailureResponse,
  getSortArrow,
  handleReload,
  handleTrim,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import AlertpopUP from "../../utils/AlertPopUP";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import EmptyCategoryMessege from "../CartPage/EmptyCategoryMsg/EmptyProductsCategoryMessege";
import debounce from "lodash/debounce";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { IconButton } from "@material-ui/core";
import { GetApp } from "@material-ui/icons";
import { IoMdDownload } from "react-icons/io";
import axios from "axios";
import CachedIcon from "@mui/icons-material/Cached";
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import AddQuantityOfProductModal from "../../Pages/AddProduct/AddQuantityOfProductModal";



let userToken = localStorage.getItem("userToken");

const ProductsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productApi = window.productApi;
  const mappedTaxApi = window.mappedTaxApi;
  const categoryApi = window.categoryApi;
  const productImageApi = window.productImageApi;
  const defaultLang = useSelector((state) => state.language.language);
  console.log("defaultLang... ", defaultLang?.name);
  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const productData = useSelector((state) => state.product.productData);
  console.log("productData... ", productData);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const ProductExcelSheetData = useSelector(
    (state) => state.product.productExcelSheet
  );
  // console.log("ProductExcelSheetData", ProductExcelSheetData);

  const isLoading = useSelector((state) => state.product.loading);
  const [searchProduct, setSearchProduct] = useState([]);
  const [taxArrMappedToPro, setTaxArrMappedToPro] = useState([]);
  const [alertExpire, setAlertExpire] = useState([]);
  console.log("taxArrMappedToPro... ", taxArrMappedToPro);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [product, setProduct] = useState([]);
  console.log("product...", product);
  console.log("isOnline... ", isOnline);
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);
  console.log("CommanMappedTaxDataList... ", mappedTaxDataList);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");

  // Variables for infiniteScroll
  const [productsList, setProductsList] = useState([]);
  const [productCategorydata, setProductCategorydata] = useState([]);
  console.log("productCategorydata...", productCategorydata);
  const [selectedCategory, setSelectedCategory] = useState("All");
  console.log("selectedCategory..", selectedCategory);
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder);
  const [ProductExcelSheetDataList, setProductExcelSheetDataList] = useState(
    []
  );
  // console.log("ProductExcelSheetDataList007", ProductExcelSheetDataList);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  console.log("apiError", apiError);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setsearch] = useState("");
  const [date, setDate] = useState();
  const [isReloading, setIsReloading] = useState(false);
  const [isModelVisible, setModelVisible] = useState(false);
  const [addInventoryItem, setAaddInventoryItem] = useState("");

  const handleClose = () => {
    setIsPopupOpen(false);
  };

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

  // when we got products data from api's we store in state here
  useEffect(() => {
    productData?.product?.length > 0 && setProduct(productData?.product);
    mappedTaxList?.length > 0 && setMappedTaxDataList(mappedTaxList);
    categoriesData?.category?.length > 0 &&
      setProductCategorydata(categoriesData?.category);
  }, [productData?.product, categoriesData?.category]);

  // apiError state empty after 3 second
  // and user redirect to /products page
  useEffect(() => {
    if (apiError?.length > 0) {
      console.log("error useEffect");
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);

  // for infinite scrolling
  // useEffect(() => {
  //   // productData && setProduct(productData);
  //   setProductsList(product.slice(0, 6)); //for Infinite-Scroll
  // }, [product]);

  // for calling inetial api
  useEffect(() => {
    if (isOnline) {
      dispatch(getTaxMappedList());
      dispatch(getCategoryList(0, 0, ""));
      dispatch(getProductExcelSheet());

      setAlertExpire(JSON.parse(localStorage.getItem("ExpireProduct")));
    } else {
      const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();
      mappedTaxData && setMappedTaxDataList(mappedTaxData);
      const categories = categoryApi?.categoryDB?.getAllCategories();
      setProductCategorydata(categories);
      const productCategoryList = categoryApi?.categoryDB?.getAllCategories();
      productCategoryList && setProductCategorydata(productCategoryList);
    }
  }, [isOnline]);

  useEffect(() => {
    setProductExcelSheetDataList(ProductExcelSheetData);
  }, [ProductExcelSheetData]);

  // we call product list api herre
  useEffect(() => {
    if (isOnline) {
      dispatch(getProductList(pageNumber, pageSizeForPag, ""));
    } else {
      const productList = productApi?.productDB?.getProductsList();
      console.log("productListsqlite... ", productList);
      productList && setProduct(productList);
    }
  }, [isOnline]);

  // to find tax of product
  useEffect(() => {
    let selectedTax = [];
    // console.log("mappedTaxList ", mappedTaxList)
    mappedTaxDataList &&
      mappedTaxDataList?.filter((taxItem) => {
        product &&
          product?.map((item) => {
            if (taxItem?.productId === item?.productId) {
              selectedTax?.push(taxItem);
            }
          });
      });
    selectedTax && setTaxArrMappedToPro(selectedTax);
  }, [mappedTaxDataList, product]);

  const editProductDetails = (id) => {
    const selectedData = product.find((item) => {
      return item.productId === id;
    });

    navigate(`/product/edit?productId=${selectedData.productId}`);
  };

  // to add new product
  const addProductHandler = () => {
    dispatch(deleteSingleProduct({}));
    navigate("/add-product");
  };

  // to remove tax from delete product
  const deleteMappedTax = () => {
    console.log("Tax delete");
    dispatch(removeTaxOnDashProduct(taxArrMappedToPro));
  };

  //product delete successfully popup
  const productDeleteSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/products"
    ); //for popUp msg
    console.log("product deleted success");
  };

  // to delete product
  const HandleDelete = async (id) => {
    const selectDelete = product.find((item) => {
      return item.productId === id;
    });

    if (isOnline) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this product?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((data) => {
        if (data.isConfirmed) {
          const deleteData = {
            purchasingPrice: selectDelete.purchasingPrice,
            currencyId: selectDelete.currencyId,
            lastUpdate: selectDelete.lastUpdate,
            categoryId: selectDelete.categoryId,
            inventoryManage: selectDelete.inventoryManage,
            maxRetailPrice: selectDelete.maxRetailPrice,
            stockLevelAlert: selectDelete.stockLevelAlert,
            brandId: selectDelete.brandId,
            updatedBy: selectDelete.updatedBy,
            productId: selectDelete.productId,
            subCategoryId: selectDelete.subCategoryId,
            sellingPrice: selectDelete.sellingPrice,
            active: selectDelete.active,
            barCode: selectDelete.barCode,
            quantity: selectDelete.quantity,
            priceIncludeTax: selectDelete.priceIncludeTax,
            notes: selectDelete.notes,
            storeId: selectDelete.storeId,
            productName: selectDelete.productName,
            unitId: selectDelete.unitId,
            addedBy: selectDelete.addedBy,
            isDeleted: 1,
            expiryDate: selectDelete.expiryDate,
            taxName: selectDelete.taxName,
            discountName: selectDelete.discountName,
          };
          dispatch(
            deleteSignleProduct(
              deleteData,
              deleteMappedTax,
              productDeleteSuccess,
              apiFailureResponse,
              setApiError
            )
          );
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this product?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((data) => {
        if (data.isConfirmed) {
          // if product has tax mapped then delete that mapped tax also from product
          // else only delete product
          if (taxArrMappedToPro?.includes(selectDelete?.productId)) {
            const result =
              selectDelete &&
              mappedTaxApi?.mappedTaxDB?.deleteMappedTax(
                selectDelete?.productId
              );
          } else {
            const resultProduct = productApi?.productDB?.deleteProductById(
              selectDelete?.productId
            );
            console.log("deletedresultProduct... ", resultProduct);
            if (resultProduct?.changes === 1) {
              // if product deleted then delete the image of that product
              selectDelete.productId &&
                productImageApi?.productImageDB?.deleteProductImagesByProductId(
                  selectDelete.productId
                );
              // we call product list api again
              const productList = productApi?.productDB?.getProductsList();
              productList && setProduct(productList);
              // product delete all things done we call success handler
              resultProduct && productDeleteSuccess();
            }
            // resultProduct && productDeleteSuccess();
          }
        }
      });
    }
  };

  // //  for trim product name
  // const trimHandler = (item) => {
  //   let productName = item;
  //   let val = productName.slice(0, 20);
  //   return val;
  // };


  // to set expire alert before product expired
  const handleAlertExpire = (e) => {
    setAlertExpire(e);
    localStorage.setItem("ExpireProduct", JSON.stringify(e));
  };

  const extractRelativePath = (absolutePath) => {
    console.log("absolutePath... ", absolutePath);
    // if '/public/' not found it return -1 value
    const publicIndex = absolutePath.indexOf("/public/");
    console.log("publicIndex... ", publicIndex);
    if (publicIndex !== -1) {
      return absolutePath.substring(publicIndex);
    }
    return absolutePath; // Return the original path if '/public/' is not found
  };

  // const categoryOptions = productCategorydata.map(category => ({
  //   value: category.categoryId,
  //   label: category.categoryName
  // }));

  // const handleCategoryChange = (selectedOption) => {
  //   setSelectedCategory(selectedOption ? selectedOption.value : "All");
  // };

  const CategorySelectHandler = (categoryDetails) => {
    console.log("SelectedCategory: ", categoryDetails);

    if (isOnline) {
      if (categoryDetails) {
        setSelectedCategory(categoryDetails);
        dispatch(
          getProuductByCategoryId(categoryDetails?.categoryId, true, 0, 0, "")
        );
      } else {
        setSelectedCategory("All");
        dispatch(getProductList(pageNumber, pageSizeForPag, ""));
      }
    } else {
      setSelectedCategory(categoryDetails);
      const productList = productApi?.productDB?.getProductsByCategoryId(
        categoryDetails?.categoryId
      );
      console.log("productListsqlite... ", productList);
      productList && setProduct(productList);
    }
  };

  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getProductList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getProductList(p, pageSizeForPag, ""));
    } else {
      const productList = productApi?.productDB?.getProductsList();
      console.log("productListsqlite... ", productList);
      productList && setProduct(productList);
    }
    setPageNumber(p);
  };

  // function to download Excel sheet ....
  const downloadExcelhandler = async () => {
    // Its important to set the 'Content-Type': 'blob' and responseType:'arraybuffer'.
    const headers = {
      "Content-Type": "blob",
      Authorization: `Bearer  ${userToken}`,
    };
    const config = {
      method: "GET",
      url: `${SERVER_URL}${GET_PRODUCT_EXCEL_SHEET}?storeId=${STORE_Id}`,
      responseType: "arraybuffer",
      headers,
    };

    try {
      const response = await axios(config);

      const outputFilename = "productsDetails.xlsx";

      // If you want to download file automatically using link attribute.
      const url = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", outputFilename);
      document.body.appendChild(link);
      link.click();

      // OR you can save/write file locally.
      // fs.writeFileSync(outputFilename, response.data);
    } catch (error) {
      throw Error(error);
    }
  };

  return (
    <MainContentArea>
      <div className="main-container">
        <div className="table-cartbox">
          <div>
            <ReloadButton
              isReloading={isReloading}
              reloadHandler={() =>
                handleReload(isReloading, setIsReloading, () =>
                  dispatch(getProductList(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("AllProduct.allProducts")}</h3>
            </div>
            <div className="search-container">
              <input
                className="form-control "
                type="search"
                placeholder={t("AllProduct.searchProducts")}
                aria-label="Search"
                // value={searchProduct}
                onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            <div className="buttonDiv">
              <div className="productPage-btn d-flex">
                <div>
                  <IoMdDownload
                    onClick={downloadExcelhandler}
                    style={{
                      fontSize: "25px",
                      color: "var(--text-color)",
                      cursor: "pointer",
                      marginRight: "0.5rem",
                    }}
                  />
                </div>
                <div>
                  <Button
                    className="btn me-2 UB-btn"
                    style={{
                      marginLeft: 5,
                      background: "var(--white-color)",
                      color: " var(--main-bg-color)",
                      fontsize: " 22px",
                      border: " 2px solid  var(--main-bg-color)",
                    }}
                    onClick={() => navigate("/upload")}
                  >
                    {t("AllProduct.uploadBulk")}
                  </Button>
                </div>
                <div>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                    }}
                    onClick={() => addProductHandler()}
                  >
                    {t("AllProduct.addNewProduct")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="Select-categoryList">
            <div className="product-expiry-select">
              <Select
                placeholder={t("AllProduct.showExpireBefore")}
                getOptionLabel={(ShowExpire) => ShowExpire?.name}
                options={ShowExpire}
                style={{ width: 40 }}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={alertExpire}
                onChange={(e) => {
                  handleAlertExpire(e);
                }}
                isClearable
              />
            </div>
            <div className="selelect-product-byCategory">
              <Select
                styles={CUSTOM_DROPDOWN_STYLE}
                placeholder={t("AllProduct.selectcategory")}
                options={productCategorydata}
                value={selectedCategory ? selectedCategory : null}
                getOptionLabel={(productCategorydata) =>
                  productCategorydata?.categoryName
                }
                onChange={(e) => CategorySelectHandler(e)}
                isClearable
              />
            </div>
          </div>

          {isLoading ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <div className="">
              {product && product.length > 0 ? (
                // <div className="card cardradius card-fs">
                <div className="card-body my-3 pt-0">
                  <table className="table table-hover table-borderless table-fixed ">
                    {product.filter((item) => {
                      if (selectedCategory === "All") {
                        return true;
                      } else {
                        return item.categoryId === selectedCategory?.categoryId;
                      }
                    }).length > 0 && (
                        <thead
                          className="table-secondary sticky-top "
                          style={{ zIndex: 0 }}
                        >
                          <tr className="prodlist-container">
                            <th
                              onClick={() =>
                                setProductsList(
                                  sortTableDataHandler(
                                    productsList,
                                    sortOrder,
                                    setSortOrder
                                  )
                                )
                              }
                              className="Name-cursor"
                            >
                              {t("AllProduct.product")}
                              {getSortArrow(sortOrder)}
                            </th>
                            {/* <th className="dnone">{t("AllProduct.productId")}</th> */}
                            <th>{t("AllProduct.sellingPrice")}</th>
                            <th>{t("AllProduct.quantity")}</th>
                            <th className="dnone" style={{ textAlign: "center" }}>
                              {t("AllProduct.expiryDate")}
                            </th>
                            {/* <th className="dnone">{t("AllProduct.Expire")}</th> */}
                            <th className="dnone" style={{ textAlign: "center" }}>
                              {t("AllProduct.InventoryManage")}
                            </th>
                            <th className="text-center dnone">
                              {t("AllProduct.status")}
                            </th>
                            <th>{t("AllProduct.edit")}</th>
                            <th>{t("AllProduct.delete")}</th>
                          </tr>
                        </thead>
                      )}
                    {product?.length > 0 &&
                      product
                        .filter(
                          (item) =>
                            item?.productName?.toLowerCase().includes(search) &&
                            (selectedCategory === "All" ||
                              item.categoryId === selectedCategory?.categoryId)
                        )
                        ?.map(
                          (
                            item,
                            // {
                            //   productId,
                            //   imageUrl,
                            //   notes,
                            //   quantity,
                            //   sellingPrice,
                            //   productName,
                            //   maxRetailPrice,
                            //   expiryDate,
                            //   inventoryManage,
                            //   unitId,
                            //   stockLevelAlert,
                            //   purchasingPrice,
                            //   categoryId,
                            //   brandId,
                            //   barCode,
                            // },
                            index
                          ) => (
                            <tbody
                              key={index}
                              onClick={() => setDate(item?.expiryDate)}
                            >
                              <tr className="prodlist-container">
                                <td className="d-flex gap-2">
                                  {/* {console.log(
                                    "imageUrl... ",
                                    `/${item?.imageUrl?.split("/public/")[1]}`
                                  )} */}
                                  <img
                                    onClick={() =>
                                      navigate(
                                        `/product?productId=${item.productId}`
                                      )
                                    }
                                    // src={
                                    //   isOnline
                                    //     ? imageUrl
                                    //     : imageUrl?.length > 0
                                    //     ? `/${imageUrl?.split("/public/")[1]}`
                                    //     : DEFAULT_IMAGE
                                    // }
                                    src={
                                      item?.imageUrl
                                        ? item?.imageUrl
                                        : DEFAULT_IMAGE
                                    }
                                    // alt="product image"
                                    width="50"
                                    height="50"
                                    className="cursor-pointer"
                                  />
                                  <div className="d-flex align-items-start flex-column">
                                    <span
                                      // className="justify-content-start align-items-center visible cursor "
                                      title={item?.productName}
                                    >
                                      <span className="font-14 font-boldest text-Color">
                                        {handleTrim(item?.productName)}
                                        {/* <span>
                                          {item?.productName.length >= 20
                                            ? "..."
                                            : null}
                                        </span> */}
                                      </span>
                                    </span>
                                    <span className="font-size-11">
                                      {item.productId}
                                    </span>
                                  </div>
                                </td>

                                {/* <td className="dnone">{item.productId}</td> */}
                                {defaultLanguage === "ar" ||
                                  defaultLanguage === "عربي" ? (
                                  <td>
                                    {item?.sellingPrice.toFixed(2)}
                                    {CurrencySymbol}
                                  </td>
                                ) : (
                                  <td>
                                    {CurrencySymbol}
                                    {item?.sellingPrice.toFixed(2)}
                                  </td>
                                )}

                                <td style={{ paddingLeft: "2rem" }}>
                                  {item?.quantity}
                                </td>

                                <td className="dnone">
                                  <div className="d-flex flex-column">
                                    <span>
                                      {item?.expiryDate != 0
                                        ? moment(item?.expiryDate).format(
                                          "DD/MM/YYYY"
                                        )
                                        : "Not Available"}
                                    </span>
                                    <span>
                                      {new Date(item?.expiryDate) <= new Date() ? (
                                        <span className="text-danger">{t("AllProduct.expired")}</span>
                                      ) : (
                                        <span className="text-success">{t("AllProduct.valid")}</span>
                                      )}

                                    </span>

                                  </div>

                                </td>

                                {/* <td className="dnone">
                                 
                                </td> */}
                                <td className="text-center dnone">
                                  <div className="d-flex flex-column">
                                    {item?.inventoryManage === 1 ? (
                                      <span className="">{t("AllProduct.Yes")}</span>
                                    ) : (
                                      <span className="">{t("AllProduct.No")}</span>
                                    )}
                                    <span>
                                      {item?.inventoryManage === 1 && (
                                        // Add inventory Button...
                                        <Button
                                          variant="contained"
                                          style={{
                                            backgroundColor: "var(--button-bg-color)",
                                            color: "var(--button-color)",
                                            fontSize: "11px",
                                            borderRadius: "5px",
                                            padding: "3px 10px",


                                          }}
                                          onClick={() => {
                                            setAaddInventoryItem(item)
                                            setModelVisible(true);

                                          }}
                                        >
                                          {t("AllProduct.addInventory")}
                                        </Button>
                                      )}
                                    </span>

                                  </div>
                                </td>

                                <td className="dnone togl">
                                  <ToggleSwitch
                                    togglevalue={
                                      // it means no inventory manage
                                      (item?.inventoryManage === 0 &&
                                        item?.quantity === 0) ||
                                        (item?.inventoryManage === 1 &&
                                          item?.quantity > 0)
                                        ? true
                                        : false
                                    }
                                    item={item}
                                    // productId={item.productId}
                                    setshow={setModelVisible}
                                  />
                                </td>
                                <td>
                                  <button
                                    className="btn"
                                    onClick={() =>
                                      editProductDetails(item.productId)
                                    }
                                  >
                                    <CiEdit
                                      className="icon-mar text-Color"
                                      size={20}
                                    />
                                  </button>
                                </td>

                                <td>
                                  <button
                                    className="btn"
                                    onClick={() => HandleDelete(item.productId)}
                                  >
                                    <RiDeleteBin5Line
                                      className="icon-mar text-Color"
                                      size={20}
                                    />
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}

                    {selectedCategory !== "All" &&
                      product.filter(
                        (item) =>
                          item.categoryId === selectedCategory?.categoryId
                      ).length === 0 && (
                        <div className="message-container">
                          <h2>This category doesn't have any products.</h2>
                        </div>
                      )}
                  </table>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"Product Data"} />
              )}
            </div>
          )}
          {isOnline && productData?.totalProduct > 0 && (
            <Pagination
              count={Math.ceil(productData?.totalProduct / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}
        </div>
      </div>

      {isModelVisible &&
        <AddQuantityOfProductModal
          isModelVisible={isModelVisible}
          setshow={setModelVisible}
          productDetails={addInventoryItem}
        />

      }

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : "Product deleted successfully!"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />
    </MainContentArea>
  );
};

export default ProductsPage;
