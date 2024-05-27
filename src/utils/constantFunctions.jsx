
import { getLocalUTCDate, getUTCDate, retrieveObj } from "../Containts/Values";
import Swal from "sweetalert2";
import { GET_CATEGORY, SERVER_URL } from "../Containts/Values";
import axios from "axios";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import moment from "moment";

export const getToken = () => {
  let userToken = localStorage.getItem("userToken");
  return userToken;
};

export const apiConfig = (url, method, data) => {
  const config = {
    method: method,
    url: url,
    headers: {
      Authorization: "Bearer " + getToken(),
    },
    data: data,
  };

  return config;
};

export const apiConfigUserToken = (url, method, data, usertoken) => {
  const config = {
    method: method,
    url: url,
    headers: {
      Authorization: "Bearer " + usertoken,
    },
    data: data,
  };

  return config;
};

export const PopUp = (
  icon,
  title,
  showCancelButton,
  confirmButtonText,
  handleSuccess
) => {
  Swal.fire({
    icon: icon,
    title: title,
    showCancelButton: showCancelButton, //value in boolean
    cancelButtonColor: "gray",
    focusCancel: true,
    confirmButtonColor: "#171F3A",
    iconColor: "#171F3A",
    confirmButtonText: confirmButtonText,
    customClass: "swal-wide",
    animation: false,
    showClass: {
      popup: "animated fadeInDown faster",
      icon: "animated heartBeat delay-1s",
    },
  }).then((res) => {
    if (res?.isConfirmed) {
      handleSuccess();
    }
  });
};

export const weekDays = [
  { id: "1", value: "Monday" },
  { id: "2", value: "Tuesday" },
  { id: "3", value: "Wednesday" },
  { id: "4", value: "Thursday" },
  { id: "5", value: "Friday" },
  { id: "6", value: "Saturday" },
  { id: "7", value: "Sunday" },
];

export const SelectedPaymentMode = [
  { id: 0, value: "Cash" },
  // { id: 1, value: "Card" },
  { id: 2, value: "Split" },
  // { id: 3, value: "Credit" },
  // { id: 4, value: "Redeem" },
  // { id: 5, value: "Paylater" },
];

export const PaymentOptionsWithoutSplit = [
  { id: 0, value: "Cash", amount: "" },
  { id: 1, value: "Card", amount: "" },
  { id: 2, value: "Credit", amount: "" },
  { id: 3, value: "Redeem", amount: "" },
  { id: 4, value: "Paylater", amount: "" },
];

export const findDayInDays = (day) => {
  let getDay = weekDays.find((item) => {
    return item.value === day;
  });
  console.log("getDay ", getDay);
  return getDay;
};

export const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];


export const MonthsByDays = [
  {
    id: 0,
    name: "Custom",
    value: moment.utc().valueOf(), // Get the current UTC time in milliseconds
  },
  {
    id: 1,
    name: "Today",
    value: moment().startOf('day').valueOf(), // Get the start of the current day in local time and convert it to UTC milliseconds
  },
  {
    id: 2,
    name: "Last 7 Days",
    value: moment.utc().subtract(7, 'days').valueOf(),
  },
  {
    id: 3,
    name: "Last 30 Days",
    value: moment.utc().subtract(30, 'days').valueOf(),
  },
  {
    id: 4,
    name: "Last 3 Month",
    value: moment.utc().subtract(90, 'days').valueOf(),
  },
  {
    id: 5,
    name: "Last 6 Month",
    value: moment.utc().subtract(180, 'days').valueOf(),
  },
];



export const ShowExpire = [
  { id: 1, name: "Show Expire Before 1 Day", value: 86400000 },
  { id: 2, name: "Show Expire Before 2 Day", value: 86400000 },
  { id: 3, name: "Show Expire Before 3 Day", value: 86400000 },
  { id: 4, name: "Show Expire Before 4 Day", value: 86400000 },
  { id: 5, name: "Show Expire Before 5 Day", value: 86400000 },
  { id: 6, name: "Show Expire Before 6 Day", value: 86400000 },
  { id: 7, name: "Show Expire Before 7 Day", value: 86400000 },
  { id: 8, name: "Show Expire Before 8 Day", value: 86400000 },
  { id: 9, name: "Show Expire Before 9 Day", value: 86400000 },
  { id: 10, name: "Show Expire Before 10 Day", value: 86400000 },
];

// export const { t } = useTranslation();

//  export const Month = [
//   {
//     id: 1,
//     name: t("transaction.Last7Days"),
//     value: getUTCDate() - 7 * 86400000,
//   },
//   {
//     id: 2,
//     name: t("transaction.Last30Days"),
//     value: getUTCDate() - 30 * 86400000,
//   },
//   {
//     id: 3,
//     name: t("transaction.Last3Month"),
//     value: getUTCDate() - 90 * 86400000,
//   },
//   {
//     id: 3,
//     name: t("transaction.Last6Month"),
//     value: getUTCDate() - 180 * 86400000,
//   },
// ];

//to show error msg in popUp
export const apiFailureResponse = (error) => {
  console.log("apiFailureResponse chala");
  return error;
};

//to show success msg in popUp
export const showPopupHandleClick = (
  setIsPopupOpen,
  timeout,
  setApiError,
  navigate,
  redirectUrl
) => {
  setIsPopupOpen(true);
  setTimeout(() => {
    setIsPopupOpen(false);
    setApiError && setApiError("");
    navigate && navigate(redirectUrl);
  }, timeout);
};

export const validateFields = (fields, error, setError, refs) => {
  console.log("fields ", fields);
  console.log("error ", error);
  console.log("refs ", refs);

  // we get object keys in fieldName
  // we iterate object here
  for (const fieldName in fields) {
    console.log("fieldName ", fieldName);
    if (fields[fieldName] === "") {
      console.log("name ", fieldName);
      setError({ ...error, [fieldName]: `Please enter ${fieldName}` });
      if (refs[fieldName]?.current) {
        refs[fieldName]?.current?.focus();
      }
      return false;
    }
  }

  return true;
};
export const getStoreIdFromLocalStorage = () => {
  const storeId = JSON.parse(localStorage.getItem("storeId"));
  console.log("storeId... ", storeId);
  return storeId;
};

export const getStoreDetailsFromLocalStorage = (key) => {
  const storeInfo = JSON.parse(localStorage.getItem(key));
  console.log("storeInfo... ", storeInfo);
  return storeInfo;
};

export const getBrandNotSyncList = () => {
  const brandApi = window.brandApi;
  const brandNotSyncList = brandApi?.brandDB?.getBrandNotSyncList(0);
  return brandNotSyncList;
};

export const getUnitNotSyncList = () => {
  const unitApi = window.unitApi;
  const unitNotSyncList = unitApi?.unitDB?.getUnitNotSyncList(0);
  return unitNotSyncList;
};

export const getCategoryNotSyncList = () => {
  const categoryApi = window.categoryApi;
  const categoryNotSyncList =
    categoryApi?.categoryDB?.getCategoryNotSyncList(0);
  return categoryNotSyncList;
};

export const getSalesExecutiveNotSyncList = () => {
  const salesExecutiveApi = window.salesExecutiveApi;
  const salesExecutiveNotSyncList =
    salesExecutiveApi?.salesExecutiveDB?.getSalesExeNotSyncList(0);
  return salesExecutiveNotSyncList;
};

export const getCustomerNotSyncList = () => {
  const customerApi = window.customerApi;
  const customerNotSyncList =
    customerApi?.customerDB?.getCustomerNotSyncList(0);
  return customerNotSyncList;
};

export const getTaxNotSyncList = () => {
  const taxApi = window.taxApi;
  const mappedTaxData = taxApi?.taxDB?.getTaxNotSyncList(0);
  return mappedTaxData;
};

export const getMappedTaxNotSyncList = () => {
  const mappedTaxApi = window.mappedTaxApi;
  const taxMappedNotSyncList =
    mappedTaxApi?.mappedTaxDB?.getTaxMappedNotSyncList(0);
  return taxMappedNotSyncList;
};

export const getDiscountNotSyncList = () => {
  const discountApi = window.discountApi;
  const discountNotSyncList =
    discountApi?.discountDB?.getDiscountNotSyncList(0);
  return discountNotSyncList;
};

export const getDiscountMappingNotSyncList = () => {
  const discountMappingApi = window.discountMappingApi;
  const discountMappingNotSyncList =
    discountMappingApi?.discountMappingDB?.getDiscountMappingNotSyncList(0);
  return discountMappingNotSyncList;
};

export const getTransactionPaymentNotSyncList = () => {
  const transactionPaymentApi = window.transactionPaymentApi;
  const trasactionPaymentNotSyncList =
    transactionPaymentApi?.transactionPaymentDB?.getTrasactionPaymentNotSyncList(
      0
    );
  return trasactionPaymentNotSyncList;
};

export const getSalesDetailsNotSyncList = () => {
  const salesDetailsApi = window.salesDetailsApi;
  const salesDetailsNotSyncList =
    salesDetailsApi?.salesDetailsDB?.getSalesDetailsNotSyncList(0);
  return salesDetailsNotSyncList;
};

export const getProductNotSyncList = () => {
  const productApi = window.productApi;
  const productNotSyncList = productApi?.productDB?.getProductNotSyncList(0);
  return productNotSyncList;
};

// convert file data into blob
export const blobToBuffer = (file) => {
  // return new Promise((resolve, reject) => {
  //   const reader = new FileReader();
  //   console.log("blobToBuffer.... ", blob)
  //   reader.onload = () => {
  //     const buffer = Buffer.from(reader.result);
  //     console.log("reader.result... ", reader.result)
  //     resolve(buffer);
  //   };

  //   reader.onerror = (error) => {
  //     reject(error);
  //   };

  //   reader.readAsArrayBuffer(blob);
  // });

  let onLoad = (fileString) => {
    console.log("fileString ", fileString);
  };
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (result) => {
    onLoad(reader.result);
  };
};

//  for trim name
export const trimHandler = (name, length) => {
  let itemName = name;
  let val = itemName?.slice(0, length);
  return val;
};

//  for get sortArrow
export const getSortArrow = (sortOrder) => {
  return (
    <>
      {sortOrder === "ascending" && <TiArrowSortedDown />}
      {sortOrder === "descending" && <TiArrowSortedUp />}
    </>
  );
};

export const sortTableDataHandler = (sortData, sortingType, setSortOrder) => {
  let sortedData = [...sortData];

  // Check if sortOrder is provided and valid (ascending or descending) value
  if (sortingType === "ascending" || sortingType === "descending") {
    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.brandName?.localeCompare(b?.brandName); // Ascending order for string values
        } else {
          setSortOrder("ascending");
          return b?.brandName?.localeCompare(a?.brandName); // Descending order for string values
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.taxName?.localeCompare(b?.taxName);
        } else {
          setSortOrder("ascending");
          return b?.taxName?.localeCompare(a?.taxName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.unitName?.localeCompare(b?.unitName);
        } else {
          setSortOrder("ascending");
          return b?.unitName?.localeCompare(a?.unitName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.productName?.localeCompare(b?.productName);
        } else {
          setSortOrder("ascending");
          return b?.productName?.localeCompare(a?.productName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.customerName?.localeCompare(b?.customerName);
        } else {
          setSortOrder("ascending");
          return b?.customerName?.localeCompare(a?.customerName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.discountName?.localeCompare(b?.discountName);
        } else {
          setSortOrder("ascending");
          return b?.discountName?.localeCompare(a?.discountName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.name?.localeCompare(b?.name);
        } else {
          setSortOrder("ascending");
          return b?.name?.localeCompare(a?.name);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.categoryName?.localeCompare(b?.categoryName);
        } else {
          setSortOrder("ascending");
          return b?.categoryName?.localeCompare(a?.categoryName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.floorName?.localeCompare(b?.floorName);
        } else {
          setSortOrder("ascending");
          return b?.floorName?.localeCompare(a?.floorName);
        }
      });

    sortedData &&
      sortedData?.sort((a, b) => {
        if (sortingType === "ascending") {
          setSortOrder("descending");
          return a?.tableName?.localeCompare(b?.tableName);
        } else {
          setSortOrder("ascending");
          return b?.tableName?.localeCompare(a?.tableName);
        }
      });
  }

  return sortedData;
};

// Validation method for license
export const validateLicense = (currentTime, expiry, name) => {
  const currentUTCTime = currentTime;
  const licenseExpiryTime = new Date(expiry).getTime();
  // console.log("currentUTCTime... ", currentUTCTime);
  // console.log("licenseExpiryTime... ", licenseExpiryTime);
  if (licenseExpiryTime && currentUTCTime < licenseExpiryTime) {
    console.log("Valid");
    return {
      isValid: true,
      licensePlan: name,
    };
  } else {
    console.log("NotValid");
    return false;
  }
};

// Debounce function
let debounceTimer;
export const debounceSearch = (inputText, apiFunction) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    // Perform search operation here, e.g., fetch data or filter
    console.log("Performing search for:", inputText);
    apiFunction()
  }, 500); // Adjust the delay time (in milliseconds) as needed
};



// for reload dashbard page..
export const handleReload = (isReloading, setIsReloading, reloadHandler) => {
  if (!isReloading) {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 300);
    reloadHandler()
  }

};

// trim product name ...
export const handleTrim = (productName) => {
  if (!productName) return "";
  const trimmedName = productName.length > 15
    ? productName.substring(0, 15) + "..."
    : productName;
  return trimmedName.charAt(0).toUpperCase() + trimmedName.slice(1);
};



