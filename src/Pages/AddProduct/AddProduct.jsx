import React, { useState, useEffect, useRef } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import {
  GET_UNIT,
  GET_BRAND,
  GET_CATEGORY,
  GET_TAX,
  GET_DISCOUNT,
  UPSERT_PRODUCT,
  ADDTAXES_MAPPING,
  ADDDISCOUNT_MAPPING,
  UPLOAD_PROD_IMG,
  SERVER_URL,
  STORE_Id,
  USER_NAME,
  COGNITO_USER_INFO,
  retrieveObj,
  validDiscount,
} from "../../Containts/Values";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "./AddProduct.css";
import axios from "axios";
import UnitModal from "../UnitsPage/UnitModal";
import BrandModal from "../BrandsPage/BrandModal";
import CategoryModal from "../CategoryPages/CategoryModal";
import TaxModal from "../TaxesDetailsPage/TaxModel";
import DiscountModal from "../DIscountPage/DiscountModal";
import moment from "moment";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getBrandList } from "../../Redux/Brand/brandSlice";
import { CiCircleRemove } from "react-icons/ci";
import {
  getSingleProductData,
  setProductDefaultImg,
} from "../../Redux/Product/productSlice";
import { RxCrossCircled } from "react-icons/rx";
import { IconContext } from "react-icons";
import { getUnitList } from "../../Redux/Unit/unitSlice";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import {
  addTaxToMap,
  getTaxList,
  getTaxMappedList,
} from "../../Redux/Tax/taxSlice";
import {
  addDiscountToMap,
  getDiscountlist,
  getMappedDiscountByProdutId,
} from "../../Redux/Discount/discountSlice";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";

let userToken = localStorage.getItem("userToken");

const AddProduct = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const prodId = searchParams.get("productId");

  const brandData = useSelector((state) => state.brand.brandData);
  const unitData = useSelector((state) => state.unit.unitData);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const taxData = useSelector((state) => state.tax.taxData);

  const discountData = useSelector((state) => state.discount.discountData);
  const singleProductData = useSelector((state) => state.product.singleProduct);
  // console.log("singleProductData ", singleProductData);
  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const discountMap = useSelector((state) => state.discount.getSingleDiscount);
  // console.log("mappedTaxList ", mappedTaxList);
  const loading = useSelector((state) => state.product.loading);
  const [fields, setFields] = useState({
    name: "",
    notes: "",
    quantity: "",
    price: "",
    purchasingPrice: "",
    barcode: "",
    mrp: "",
    discount: "",
    tax: "",
    unit: "",
    brand: "",
    category: "",
    expDate: "",
    stockLevelAlert: "",
    postDiscount: [],
    postTax: [],
    isTaxDisable: prodId > 0 ? true : false,
    isDiscountDisable: prodId > 0 ? true : false,
  });
  const [changeButton, setChangeButton] = useState(false);
  const [productName, setProductName] = useState("");
  const [productNotes, setProductNotes] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productPurchasingPrice, setProductPurchasingPrice] = useState("");
  const [productBarcode, setProductBarcode] = useState("");
  const [productMRP, setProductMRP] = useState("");
  const [selProductDiscount, setSelProductDiscount] = useState("");
  // console.log("selProductDiscount", selProductDiscount);
  const [selProductTax, setSelProductTax] = useState("");
  // console.log("selProductTax ", selProductTax);
  const [selProductUnit, setSelProductUnit] = useState("");
  const [selProductBrand, setSelProductBrand] = useState("");
  const [selproductCategory, setSelProductCategory] = useState("");
  const [selProductExpDate, setSelProductExpDate] = useState(new Date());
  const [stockLevelAlert, setStockLevelAlert] = useState("");
  const [productId, setProductId] = useState("");
  const [postDiscount, setPostDiscount] = useState([]);
  // console.log("postDiscount", postDiscount);
  const [postTax, setPostTax] = useState([]);
  // console.log("postTax ", postTax);
  const imgInputRef = useRef(null);

  const [moreOption, setMoreOption] = useState(false)
  const [isTaxDisable, setTaxDisable] = useState(productId > 0 ? true : false);
  const [isDiscountDisable, setDiscountDisable] = useState(
    productId > 0 ? true : false
  );
  const [editProductImgs, setEditProductImgs] = useState([]);
  // console.log("editProductImgs ", editProductImgs);

  const [unit, setUnit] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);
  const [tax, setTax] = useState([]);
  // console.log("tax ", tax);
  const [discount, setDiscount] = useState([]);
  const [error, setError] = useState(false);
  const [showUnitModal, setshowUnitModal] = useState(false);
  const [showBrandModal, setshowBrandModal] = useState(false);
  const [showCategoryModal, setshowCategoryModal] = useState(false);
  const [showTaxModal, setshowTaxModal] = useState(false);
  const [showDiscountModal, setshowDiscountModal] = useState(false);
  const [showInventoryManage, setShowInventoryManage] = useState(false);
  const [taxInclude, setTaxInclude] = useState(false);
  const [cognitoUserName, setCognitoUserName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [imageResponse, setImageResponse] = useState([]);
  const [imageLimitError, setImageLimitError] = useState("");
  const [taxList, setTaxList] = useState([]);
  // console.log("taxList ", taxList);
  // console.log("taxinclude apply", taxInclude);
  //const [editProduct, setEditProduct] = useState([]);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cognito) => {
      setCognitoUserName(cognito.username);
      // console.log(cognito);
    });

    retrieveObj("storeUserInfo").then((storeInfo) => {
      setStoreName(storeInfo.stores[0].storeName);
      // console.log(storeInfo.stores[0].storeName);
    });
  }, []);

  const [imgfile, uploadimg] = useState([]);
  const [defaultImgIndex, setDefaultImgIndex] = useState(0);
  const [defaultImageObj, setDefaultImageObj] = useState({});

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
  };

  // on product edit page product mapped tax find and store in state
  useEffect(() => {
    let taxname = "";
    let filterTaxObj = {};

    // filter which product is tax map
    if (productId) {
      mappedTaxList &&
        mappedTaxList?.map((mapItem) => {
          if (productId === mapItem.productId) {
            filterTaxObj = mapItem;
          }
        });
    }

    // console.log("filterTaxObj ", filterTaxObj);
    // filter that taxt in the tax array and get the name of tax
    taxData?.tax &&
      taxData?.tax?.map((item) => {
        if (item?.taxId === filterTaxObj?.taxId) {
          // taxname = item?.taxName;
          setPostTax(item);
          setSelProductTax(item);
        }
      });
  }, [productId, taxData?.tax, mappedTaxList]);

  // Initial Apis Call
  useEffect(() => {
    setBrand(brandData?.brand);
    setUnit(unitData?.unit);
    setCategory(categoriesData?.category);
    setTax(taxData?.tax);
    setDiscount(discountData);
  }, [brandData?.brand, unitData?.unit, categoriesData?.category, taxData?.tax, discountData?.discount]);

  useEffect(() => {
    dispatch(getUnitList(0, 0, ""));
    dispatch(getBrandList(0, 0, ""));
    dispatch(getCategoryList(0, 0, ""));
    dispatch(getDiscountlist(0, 0, "", validDiscount));
    dispatch(getTaxList(0, 0, ""));
    dispatch(getTaxMappedList());
  }, []);

  // calling set default image index in state when user comes edit product page
  useEffect(() => {
    setDefaultImageEditIndex();
  }, [editProductImgs]);

  // set default image index in state when user comes edit product page
  const setDefaultImageEditIndex = () => {
    for (let i = 0; i <= editProductImgs?.length; i++) {
      if (editProductImgs[i]?.productDefaultImage === true) {
        setDefaultImageObj(editProductImgs[i]);
        setDefaultImgIndex(i);
      }
    }
  };

  const addProductDetails = (e) => {
    e.preventDefault();

    let hours = 23;
    selProductExpDate.setHours(hours);
    let minutes = 59;
    selProductExpDate.setMinutes(minutes);
    let second = 59;
    selProductExpDate.setSeconds(second);
    // console.log(selProductExpDate);
    // console.log("endDate ", moment(selProductExpDate).format("LTS"));

    // console.log("unit :", selProductUnit?.unitId);
    // console.log("brand :", selProductBrand?.brandId);
    // console.log("category :", selproductCategory?.categoryId);

    if (!productName || !selProductUnit || !productPrice || !productNotes) {
      setError(true);
      return false;
    }
    let postData = {
      purchasingPrice: productPurchasingPrice,
      currencyId: 0,
      lastUpdate: 0,
      categoryId: selproductCategory?.categoryId,
      inventoryManage:showInventoryManage ? 1 : 0,
      maxRetailPrice: productMRP,
      stockLevelAlert: stockLevelAlert,
      brandId: selProductBrand?.brandId,
      updatedBy: null,
      productId: productId ? productId : null,
      subCategoryId: 0,
      sellingPrice: productPrice,
      active: 0,
      barCode: productBarcode,
      quantity: productQuantity,
      priceIncludeTax: taxInclude ? 1 : 0,
      // priceIncludeTax: "0",
      notes: productNotes,
      storeId: STORE_Id,
      productName: productName,
      unitId: selProductUnit?.unitId,
      addedBy: null,
      isDeleted: 0,
      // discountName: selProductDiscount && selProductDiscount,
      // taxName:  selProductTax && selProductTax,
      expiryDate: new Date(moment(selProductExpDate, "L")).valueOf(),
    };

    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    axios
      .post(`${SERVER_URL}${UPSERT_PRODUCT}`, postData, config)
      .then((response) => {
        //var res = JSON.stringify(data);
        // console.log("Response Product: ", response);
        // setProductId(data.productId);
        // console.log("Response: ", productId);
        if (response.status === 200) {
          selProductDiscount &&
            dispatch(
              addDiscountToMap(
                response?.data?.productId,
                // postDiscount.discountId
                selProductDiscount.discountId
              )
            );

          selProductTax &&
            dispatch(
              addTaxToMap(response?.data?.productId, postTax.taxId, STORE_Id)
            );

          // selProductTax && addTax(response?.data?.productId);
          uploadImage(response?.data?.productId);

          Swal.fire({
            icon: "success",
            title: "Product successfully saved!",
          }).then((res) => {
            if (res?.isConfirmed) {
              window.location.reload();
              navigate(-1);
            }
          });
        }
      })
      .catch((err) => {
        console.log("Error product: ", err);
      });
  };

  const addDiscount = (prodId) => {

    let discountPayload = [
      {
        discountId: postDiscount.discountId, //id
        isDeleted: 0,
        lastUpdate: 0,
        productId: prodId,
        storeId: STORE_Id,
      },
    ];

    // dispatch(addDiscountToMap(discountPayload))

    axios
      .post(`${SERVER_URL}${ADDDISCOUNT_MAPPING}`, discountPayload, config)
      .then((response) => {
      });
  };

  const addTax = (prodId) => {
    let taxPayload = [
      {
        taxId: postTax.taxId,
        isDeleted: 0,
        lastUpdate: 0,
        productId: prodId,
        storeId: STORE_Id,
      },
    ];

    axios
      .post(`${SERVER_URL}${ADDTAXES_MAPPING}`, taxPayload, config)
      .then((response) => {
      });
  };

  // const discountHandle = (e) => {
  //   const id = parseInt(e.target.value);
  //   const findDis = discount.find((item) => item.discountId === id);
  //   console.log(findDis);
  //   setPostDiscount(findDis);
  //   setSelProductDiscount(findDis.discountName);
  // };

  const discountHandle = (e) => {
    // const id = parseInt(e.target.value);
    // const findDis = discount.find((item) => item.discountId === id);
    // console.log(findDis);
    setPostDiscount(e);
    setSelProductDiscount(e);
  };

  const taxHandle = (e) => {
    // const taxName = e.target.value
    // const findDis = tax.find((item) => item.taxName === taxName);
    // console.log(findDis);
    setPostTax(e);
    setSelProductTax(e);
  };

  const imgFilehandler = (e) => {
    if (imgfile.length <= 4) {
      uploadimg((imgfile) => [...imgfile, e.target.files[0]]);
      //URL.createObjectURL(e.target.files)
    } else {
      console.log("you cannot upload more then 5 images");
    }
  };

  const imgDeleteHandler = (index) => {
    imgInputRef.current.value = "";
    const newImgArray = imgfile && imgfile.filter((item, i) => i !== index);
    uploadimg(newImgArray);
    // uploadimg([]);
  };

  // Delete product image
  const EditProdImgDeleteHandler = (index) => {
    imgInputRef.current.value = "";
    const newImgArray =
      editProductImgs && editProductImgs.filter((item, i) => i !== index);
    setEditProductImgs(newImgArray);
  };

  // Set product default image
  const setDefaultHandler = (index) => {
    // console.log("index ", index);
    // console.log("productId ", productId);
    const newImgArray =
      editProductImgs && editProductImgs.filter((item, i) => i === index);
    console.log("newImgArray Default ", newImgArray);

    let imgObj = {
      imageId: newImgArray && newImgArray[0]?.imageId,
      productId: newImgArray && newImgArray[0]?.productId,
    };

    if (!productId) {
      setDefaultImgIndex(index);
    } else {
      setDefaultImgIndex(index);
      dispatch(setProductDefaultImg(imgObj, cognitoUserName));
    }
  };

  const uploadImage = (prodId) => {
    if (imgfile && imgfile.length > 0) {
      // console.log("uploadImage ", imgfile)

      // console.log("data ", data);
      let files = imgfile[0];

      for (let i = 0; i <= imgfile.length; i++) {
        let data = new FormData();
        let imageFile = imgfile[i];

        data.append("file", imageFile, imageFile.name);
        // data.append("file", files, files.name);
        data.append("storeId", STORE_Id);
        data.append("imageId", 0);
        data.append("productId", prodId);
        data.append("storeName", storeName);
        // defaultImgIndex === i
        //   ? data.append("isProductDefaultImage", 1)
        //   : data.append("isProductDefaultImage", 0);

        // if editProduct Image array is empty then we send 0 value
        //  it means on edit age new images not set default
        // if we have defaultImgIndex value on new product creation time
        //  then user able to set default image
        editProductImgs.length > 0
          ? data.append("isProductDefaultImage", 0)
          : defaultImgIndex === i
            ? data.append("isProductDefaultImage", 1)
            : data.append("isProductDefaultImage", 0);

        data.append("isStoreImage", 0);
        data.append("userName", cognitoUserName);
        data.append("updateImageName", "");

        const config = {
          timeout: 10000,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + userToken,
          },
        };

        axios
          .post(SERVER_URL + UPLOAD_PROD_IMG, data, config)
          .then((response) => {
            // var res = JSON.stringify(data);
            // console.log("Response Image : ", response);
            if (i === imgfile.length - 1) {
              response.status === 200 &&
                setImageResponse(response?.data?.imagesResponse);
              Swal.fire({
                icon: "success",
                title: "Product successfully saved!",
              }).then((res) => {
                // console.log("res Swal ", res);
                if (res?.isConfirmed) {
                  window.location.reload();
                  navigate(-1);
                }
              });
            }
          })
          .catch((err) => {
            // console.log("Error index: " + err);
          });
      }

      // data.append("file", files, files.name);
      // data.append("storeId", STORE_Id);
      // data.append("imageId", 0);
      // data.append("productId", prodId);
      // data.append("storeName", storeName);
      // data.append("isProductDefaultImage", 1);
      // data.append("isStoreImage", 0);
      // data.append("userName", cognitoUserName);
      // data.append("updateImageName", "");

      // uploadeImageTOServer(data);
    } else {
      // console.log("Image is not selected");
    }
  };

  const uploadeImageTOServer = async (postData) => {
    // console.log("upload from phone" + JSON.stringify(postData.getAll("file")));
    const config = {
      //baseURL: 'http://bda8484c.ngrok.io/EsoftPos/category/test',
      timeout: 10000,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + userToken,
      },
    };

    // console.log("postData ", postData);

    axios
      .post(SERVER_URL + UPLOAD_PROD_IMG, postData, config)
      .then((response) => {
        // var res = JSON.stringify(data);
        // console.log("Response Image : ", response?.data?.imagesResponse);
        if (response.status === 200) {
          setImageResponse(response?.data?.imagesResponse);
        }
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
  };

  // Edit product Api call
  useEffect(() => {
    if (prodId) {
      // axios
      //     .get(`${SERVER_URL}product/getProductPage?productId=${prodId}`, config)
      //     .then(({ data }) => {
      //         // var res = JSON.stringify(data);
      //         console.log("Response: ", data);
      //         setAllProductEdit(data);
      //         console.log(data);
      //     })
      //     .catch((err) => {
      //         console.log("Error: " + err);
      //     });
      dispatch(getSingleProductData(prodId));
      setChangeButton(true);
    }
  }, []);

  // Edit prouduct data set here
  //const singleProductUrl = "http://ezygen-technology-bluebill-prod-env.ap-south-1.elasticbeanstalk.com/ezygentechnology/product/getProductPage?productId=" + prodId;
  const findUnitObj = (id) => {
    unitData?.unit?.map((item) => {
      if (id === item.unitId) {
        setSelProductUnit(item);
      }
      // console.log("item", unitData);
    });
  };

  const findBrandObj = (id) => {
    brandData?.brand?.map((item) => {
      if (id === item.brandId) {
        setSelProductBrand(item);
      }
      // console.log("item", brandData);
    });
  };

  const findCategoryObj = (id) => {
    categoriesData?.category?.map((item) => {
      if (id === item.categoryId) {
        setSelProductCategory(item);
      }
      // console.log("item", categoryData);
    });
  };

  const setAllProductEdit = () => {
    setProductName(singleProductData.productName);
    setEditProductImgs(singleProductData?.imagesList);
    setProductNotes(singleProductData.notes);
    setProductQuantity(singleProductData.quantity);
    setProductPrice(singleProductData.sellingPrice);
    setProductPurchasingPrice(singleProductData.purchasingPrice);
    setProductBarcode(singleProductData.barCode);
    setProductMRP(singleProductData.maxRetailPrice);
    singleProductData && findUnitObj(singleProductData.unitId);
    //setSelProductUnit(singleProductData.unitId);
    singleProductData && findBrandObj(singleProductData.brandId);
    //setSelProductBrand(singleProductData.brandId);
    singleProductData && findCategoryObj(singleProductData.categoryId);

    //setSelProductCategory(singleProductData.categoryId);
    setSelProductExpDate(
      new Date(moment(singleProductData.expiryDate).format("L"))
    );
    setStockLevelAlert(singleProductData.stockLevelAlert);
    setProductId(singleProductData.productId);
    // setPostDiscount(singleProductData.discountId);
    // setPostTax(singleProductData.taxId);
    setTaxDisable(true);
    setTaxInclude(singleProductData.priceIncludeTax === "0" ? false : true);
    setDiscountDisable(true);
  };

  useEffect(() => {
    if (prodId) {
      setAllProductEdit();
      findDiscountObj(prodId);
    }
  }, [singleProductData]);

  const findDiscountObj = (id) => {
    dispatch(getMappedDiscountByProdutId(id));
  };

  useEffect(() => {
    discount?.map((item) => {
      if (item.discountId === discountMap[0]?.discountId) {
        // console.log("discountMap");
        setSelProductDiscount(item);
      }
    });
  }, [discountMap]);
  // useEffect(() => {
  //     if (prodId) {
  //         axios
  //             .get(`${SERVER_URL}product/getProductPage?productId=${prodId}`, config)
  //             .then(({ data }) => {
  //                 var res = JSON.stringify(data);
  //                 //console.log("Response: " + res);
  //                 setAllProductEdit(data);
  //                 console.log(data);
  //             })
  //             .catch((err) => {
  //                 console.log("Error: " + err);
  //             });
  //     }
  // }, []);

  return (
    <MainContentArea>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="add-newproduct-container">
          <h4 className="mb-5">{t("addNewProduct.ProductInformation")}</h4>
          <form className="addprod-form">
            <div className="mb-5 form-input">
              <div className="col-5 form-input">
                <label htmlFor="formControl" className="form-label">
                  {t("addNewProduct.UploadImage")}
                </label>
                <input
                  type="file"
                  className="form-control mb-4"
                  placeholder="Upload product Image"
                  onChange={imgFilehandler}
                  ref={imgInputRef}
                />
              </div>
              <hr />
              <h2>{t("addNewProduct.Preview")}</h2>

              <div className="main-img-container">
                {/* New image upload */}
                {imgfile &&
                  imgfile?.length > 0 &&
                  imgfile?.map((elem, index) => {
                    return (
                      <div
                        className="img-container"
                      // style={{
                      //   marginBottom: `${
                      //     defaultImgIndex === index ? "37px" : "0"
                      //   }`,
                      // }}
                      >
                        <span key={elem} className="position-relative">
                          <img
                            src={URL.createObjectURL(elem)}
                            height="200"
                            width="200"
                            alt="med1"
                            style={{ marginBottom: "20px" }}
                          />
                          <span
                            className="image-delete cursor-pointer"
                            onClick={() => imgDeleteHandler(index)}
                          >
                            <IconContext.Provider value={{ size: "30px" }}>
                              <RxCrossCircled />
                            </IconContext.Provider>
                          </span>
                        </span>
                        {editProductImgs.length === 0 && imgfile.length > 0 && (
                          <span key={index} className="set-default-btn">
                            <button
                              key={index}
                              style={{
                                display: `${defaultImgIndex === index ? "none" : "block"
                                  }`,
                              }}
                              type="text"
                              onClick={(e) => {
                                e.preventDefault();
                                setDefaultHandler(index);
                              }}
                            >
                              {t("addNewProduct.SetDefault")}
                            </button>
                          </span>
                        )}

                        {editProductImgs.length > 0 && imgfile.length > 0 && (
                          <span key={index} className="set-default-btn">
                            <button
                              key={index}
                              style={{
                                background: "#4f4f4f",
                              }}
                              type="text"
                              disabled={true}
                            >
                              {t("addNewProduct.Notallowedbeforeupload")}
                            </button>
                          </span>
                        )}
                      </div>
                    );
                  })}

                {/* product edit images */}
                {editProductImgs &&
                  editProductImgs?.length > 0 &&
                  editProductImgs?.map((item, index) => {
                    return (
                      <div
                        className="img-container"
                        style={{
                          marginBottom: `${defaultImgIndex === index ? "37px" : "0"
                            }`,
                        }}
                      >
                        <span key={index} className="position-relative">
                          <img
                            src={item?.imageUrl}
                            height="200"
                            width="200"
                            alt="med1"
                            style={{ marginBottom: "20px" }}
                          />
                          <span
                            className="image-delete cursor-pointer"
                            onClick={() => EditProdImgDeleteHandler(index)}
                          >
                            <IconContext.Provider value={{ size: "30px" }}>
                              <RxCrossCircled />
                            </IconContext.Provider>
                          </span>
                        </span>
                        <span key={index} className="set-default-btn">
                          <button
                            key={index}
                            style={{
                              display: `${defaultImgIndex === index ? "none" : "block"
                                }`,
                            }}
                            type="text"
                            onClick={(e) => {
                              e.preventDefault();
                              setDefaultHandler(index);
                            }}
                          >
                            {t("addNewProduct.SetDefault")}
                          </button>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="row">
              <div className="col-5 required form-input">
                <label htmlFor="formControl" className="form-label">
                  {t("addNewProduct.ProductName")}
                </label>
                <input
                  type="text"
                  className="form-control mb-4"
                  placeholder={t("addNewProduct.ProductName")}
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                />
                {error && !productName && (
                  <span className="error-msg"></span>
                )}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-5 required form-input">
                <label htmlFor="formControl" className="form-label">
                  {t("addNewProduct.Unit")}
                </label>
                {/* <select
                  className="form-select mb-4"
                  value={selProductUnit}
                  onChange={(e) => {
                    setSelProductUnit(e.target.value);
                  }}
                >
                  <option>Select Unit</option>
                  {unit.map((item) => {
                    return (
                      <option value={item.unitId} key={item.unitId}>
                        {item.unitName}
                      </option>
                    );
                  })}
                </select> */}

                <Select
                  // placeholder={<div className="select-tax">Select unit</div>}
                  placeholder={t("addNewProduct.SelectUnit")}
                  getOptionLabel={(unit) => unit?.unitName}
                  options={unit}
                  styles={CUSTOM_DROPDOWN_STYLE}
                  value={selProductUnit}
                  onChange={(e) => {
                    setSelProductUnit(e);
                  }}
                  isClearable
                />

                {error && !selProductUnit && (
                  <span className="error-msg">{t("addNewProduct.Entervalidunit")}</span>
                )}
              </div>

              <div className="col-5 mt-4 form-link pt-2">
                <Link
                  className="card-link fs-5  pt-2 "
                  onClick={() => setshowUnitModal(true)}
                >
                  {t("addNewProduct.AddUnit")}
                </Link>
              </div>

              {showUnitModal && (
                <UnitModal
                  // fetchApi={fetchUnitApi}
                  isModelVisible={showUnitModal}
                  setshow={setshowUnitModal}
                />
              )}
            </div>

            <div className="row">
              <div className="col-5 required form-input">
                <label htmlFor="formControl" className="form-label">
                  {t("addNewProduct.SellingPrice")}
                </label>
                <input
                  type="number"
                  className="form-control mb-4"
                  placeholder={t("addNewProduct.Enterproductsellingprice")}
                  value={productPrice}
                  onChange={(e) => {
                    setProductPrice(e.target.value);
                  }}
                />
                {error && !productPrice && (
                  <span className="error-msg">
                    {t("addNewProduct.Enterproductsellingprice")}
                  </span>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-5 required form-input">
                <label htmlFor="formControl" className="form-label">
                  {t("addNewProduct.ProductDescription")}{" "}
                </label>
                <textarea
                  type="text"
                  className="form-control mb-4"
                  placeholder={t("addNewProduct.ProductDescription")}
                  rows="4"
                  value={productNotes}
                  onChange={(e) => {
                    setProductNotes(e.target.value);
                  }}
                />
                {error && !productNotes && (
                  <span className="error-msg">{t("addNewProduct.pleaseEnterproductDescription")}</span>
                )}
              </div>
            </div>
            {moreOption ? <span>
              <div className="row">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.PurchasingPrice")}{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control mb-4"
                    placeholder={t("addNewProduct.Purchasingpriceofproduct")}
                    value={productPurchasingPrice}
                    onChange={(e) => {
                      setProductPurchasingPrice(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.MRP")}{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control mb-4"
                    placeholder={t("addNewProduct.Product MRP")}
                    value={productMRP}
                    onChange={(e) => {
                      setProductMRP(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.Category")}{" "}
                  </label>
                  {/* <select
                  className="form-select"
                  value={selproductCategory}
                  onChange={(e) => {
                    setSelProductCategory(e.target.value);
                  }}
                >
                  <option>Select Category :</option>
                  {category.map((item) => {
                    return (
                      <option value={item.categoryId} key={item.categoryId}>
                        {item.categoryName}
                      </option>
                    );
                  })}
                </select> */}
                  <Select
                    // placeholder={<div className="select-tax">Select category</div>}
                    placeholder={t("addNewProduct.SelectCategory")}
                    getOptionLabel={(category) => category?.categoryName}
                    options={category}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={selproductCategory}
                    onChange={(e) => {
                      setSelProductCategory(e);
                    }}
                    isClearable
                  />
                </div>

                <div className="col-5 mt-4 pt-2 form-link">
                  <Link
                    className="card-link fs-5"
                    onClick={() => setshowCategoryModal(true)}
                  >
                    {t("addNewProduct.AddCategory")}
                  </Link>
                </div>
                {showCategoryModal && (
                  <CategoryModal
                    // fetchApi={fetchCategoryApi}
                    isModelVisible={showCategoryModal}
                    setshow={setshowCategoryModal}
                  />
                )}
              </div>

              <div className="row mb-4">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.Brand")}{" "}
                  </label>
                  {/* <select
                  className="form-select"
                  value={selProductBrand}
                  onChange={(e) => {
                    setSelProductBrand(e.target.value);
                  }}
                >
                  <option>Select Brand</option>
                  {brand.map((item) => {
                    return (
                      <option value={item.brandId} key={item.brandId}>
                        {item.brandName}
                      </option>
                    );
                  })}
                </select> */}
                  <Select
                    // placeholder={<div className="select-tax">Select brand</div>}
                    placeholder={t("addNewProduct.SelectBrand")}
                    getOptionLabel={(brand) => brand?.brandName}
                    options={brand}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={selProductBrand}
                    onChange={(e) => {
                      setSelProductBrand(e);
                    }}
                    isClearable
                  />
                </div>

                <div className="col-5 mt-4 pt-2 form-link">
                  <Link
                    className="card-link fs-5"
                    onClick={() => setshowBrandModal(true)}
                  >
                    {t("addNewProduct.AddBrand")}
                  </Link>
                </div>
                {showBrandModal && (
                  <BrandModal
                    // fetchApi={fetchBrandApi}
                    isModelVisible={showBrandModal}
                    setshow={setshowBrandModal}
                  />
                )}
              </div>

              <div className="row mb-4">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.Barcode")}{" "}
                  </label>
                  <input
                    type="number"
                    className="form-control mb-4"
                    placeholder={t("addNewProduct.Productbarcode")}
                    value={productBarcode}
                    onChange={(e) => {
                      setProductBarcode(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="row mb-5">
                <div className="form-check-reverse form-switch ps-3">
                  <label className="form-check-label fs-5">
                    {t("addNewProduct.InventoryManage")}
                  </label>
                  <input
                    className="form-check-input btn-lg ms-3 toggle-btn"
                    type="checkbox"
                    onClick={() => setShowInventoryManage(!showInventoryManage)}
                  />

                  {showInventoryManage ? (
                    <div className="row mt-3">
                      <div className="col-5 form-input">
                        <input
                          type="number"
                          className="form-control"
                          placeholder={t("addNewProduct.Quantity")}
                          value={productQuantity}
                          onChange={(e) => {
                            setProductQuantity(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-5 form-input">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t("addNewProduct.StockLevelAlert")}
                          value={stockLevelAlert}
                          onChange={(e) => {
                            setStockLevelAlert(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-3 ">
                  <label> {t("addNewProduct.ExpriryDate")}</label>
                  <DatePicker
                    minDate={new Date()}
                    className="form-control"
                    selected={selProductExpDate}
                    dateFormat="d/MM/yyyy"
                    onChange={(date) => {
                      setSelProductExpDate(date);
                    }}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.ApplyTax")}
                  </label>
                  {/* <select
                  className="form-select"
                  onChange={taxHandle}
                  value={selProductTax?.length > 0 ? selProductTax : "Select Tax"}
                  disabled={isTaxDisable}
                >
                  <option>
                    {selProductTax ? selProductTax : <p>Select Tax :</p>}
                  </option>
                  {tax.map((item) => {
                    return (
                      <option value={item.taxName} key={item.taxId}>
                        {item.taxName}
                      </option>
                    );
                  })}
                </select> */}
                  <div>
                    <Select
                      placeholder={<div className="select-tax"> {t("addNewProduct.Selecttax")}</div>}
                      // placeholder="Select tax"
                      // noOptionsMessage={() => "Not found"}
                      getOptionLabel={(tax) => tax?.taxName}
                      options={tax}
                      styles={CUSTOM_DROPDOWN_STYLE}
                      value={selProductTax}
                      onChange={taxHandle}
                      isClearable
                    />
                  </div>
                </div>
                <div className="col-5 mt-4 pt-2 form-link">
                  <Link
                    className="card-link fs-5"
                    onClick={() => setshowTaxModal(true)}
                  >
                    {t("addNewProduct.AddTax")}
                  </Link>
                </div>
                {showTaxModal && (
                  <TaxModal
                    // fetchApi={fetchTaxApi}
                    isModelVisible={showTaxModal}
                    setshow={setshowTaxModal}
                  />
                )}
              </div>

              <div className="row mb-4">
                <div className="form-check-reverse form-switch ps-3">
                  <label className="form-check-label fs-5">{t("addNewProduct.TaxInclude")}</label>
                  <input
                    className="form-check-input btn-lg ms-3 toggle-btn"
                    type="checkbox"
                    checked={taxInclude}
                    onClick={() => setTaxInclude(!taxInclude)}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-5 form-input">
                  <label htmlFor="formControl" className="form-label">
                    {t("addNewProduct.ApplyDiscount")}
                  </label>
                  {/* <select
                  className="form-select"
                  value={selProductDiscount}
                  onChange={discountHandle}
                  disabled={isDiscountDisable}
                  //onChange={(e) => { setSelProductDiscount(e.target.value) }}
                >
                  <option>
                    {selProductDiscount ? (
                      selProductDiscount
                    ) : (
                      <p>Select Discount:</p>
                    )}{" "}
                    :
                  </option>
                  {discount.map((item) => {
                    return (
                      <option value={item.discountId} key={item.discountId}>
                        {item.discountName}
                      </option>
                    );
                  })}
                </select> */}

                  <Select
                    placeholder={
                      <div className="select-tax">{t("addNewProduct.Selectdiscount")}</div>
                    }
                    // placeholder="Select tax"
                    // noOptionsMessage={() => "Not found"}
                    getOptionLabel={(discount) => discount?.discountName}
                    options={discount}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={selProductDiscount}
                    onChange={discountHandle}
                    isClearable
                  />
                </div>

                <div className="col-2 mt-4 pt-2 form-link">
                  <Link
                    className="card-link fs-5"
                    onClick={() => setshowDiscountModal(true)}
                  >
                    {t("addNewProduct.AddDiscount")}
                  </Link>
                </div>

                {showDiscountModal && (
                  <DiscountModal
                    // fetchApi={fetchDiscountApi}
                    isModelVisible={showDiscountModal}
                    setshow={setshowDiscountModal}
                  />
                )}
              </div>
            </span> : <span style={{ color: 'blue', cursor: "pointer" }} onClick={() => setMoreOption(true)}>{t("addNewProduct.Moreoption")}<RiArrowDropDownLine /></span>
            }
            <div className=" mt-4">
              <button
                className="btn btn-primary fw-semibold col-2 form-button"
                style={{
                  background: "var(--main-bg-color)",
                  color: "var(--white-color)",
                  fontsize: " 22px",
                }}
                type="submit"
                onClick={addProductDetails}
              >
                {changeButton ? t("addNewProduct.UpdateProduct") : t("addNewProduct.AddProduct")}
              </button>
            </div>
          </form>
        </div>
      )}
    </MainContentArea>
  );
};

export default AddProduct;
