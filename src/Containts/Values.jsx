import moment from "moment";
import { FaBoxOpen } from "react-icons/fa";
import { HiClipboardList } from "react-icons/hi";
import {
  MdOutlineInventory,
  MdOutlineRestaurant,
  MdPointOfSale,
  MdTableRestaurant,
} from "react-icons/md";
import PosImage from "../assets/images/bluebill-homepage.png";
import TableImage from "../assets/images/bluebill-table.png";
import onlinOrderImage from "../assets/images/bluebill-OnlineOrder.png";
import dashboradImage from "../assets/images/bluebillDashboradImage.png";
import { FcCheckmark } from "react-icons/fc";

export const DEFAULT_LANGUAGE = localStorage.getItem("defaultLang");
export const STORE_Id = parseInt(localStorage.getItem("storeId"));
export const STORE_CURRENCY = localStorage.getItem("StoreCurrency");
export const CurrencySymbol = localStorage.getItem("StoreCurrency");
export const COGNITO_USER_INFO = JSON.parse(
  localStorage.getItem("cognitoUserInfo")
);
export const SERVER_URL =
  "http://ezygen-technology-bluebill-prod-env.ap-south-1.elasticbeanstalk.com/ezygentechnology/";
export const ONLINE_ORDER = "onlineOrder/getShopkeeperOrders";
export const GET_PRODUCT_DATA = `product/getProduct`;
export const GET_TAX_MAPPING = `taxMapping/getTaxMapping?lastUpdated=0&storeId=${STORE_Id}`;
export const ADD_TAX_MAPPING = "taxMapping/addTaxMapping";
export const UPSERT_TAX = "tax/upsertTax";
export const UPLOAD_PROD_IMG = "v1/image/uploadImage";
export const GET_TAX = `tax/getTax?lastUpdated=0&storeId=${STORE_Id}`;
export const GET_UNIT = `unit/getUnit`;
export const UPSERT_UNIT = "unit/upsertUnit";
export const GET_BRAND = `brand/getBrand`;
export const UPSERT_BRAND = "brand/upsertBrand";
export const GET_CATEGORY = `category/getCategory`;
export const UPSERT_CATEGORY = "category/upsertCategory";
export const UPLOAD_IMAGE = "ImageUpload/uploadImage";
export const GET_DISCOUNT = `discount/getDiscount`;
export const GET_MAPPED_DISCOUNT_LIST = `discountmapping/getDiscountMappingByStoreId?lastUpdated=0&storeId=${STORE_Id}`;
export const UPSERT_DISCOUNT = "discount/upsertDiscount";
export const GET_SALESEXECUTIVE = `salesexecutive/getSalesexecutive?lastUpdated=1600126806445&storeId=${STORE_Id}`;
export const UPSERT_SALESEXECUTIVE = "salesexecutive/upsertSalesexecutive";
export const DELETE_SALESEXECUTIVE = "salesexecutive/deleteSalesexecutive";
export const GET_CUSTOMER = `customer/getCustomer`;
export const UPSERT_CUSTOMER = "customer/upsertCustomer";
export const UPSERT_PRODUCT = "product/upsertProduct";
export const ADDDISCOUNT_MAPPING = "discountmapping/addDiscountMapping";
export const ADDTAXES_MAPPING = "taxMapping/addTaxMapping";
// export const STOREID = 1599301415859525
export const INIT = "admintask/init";
export const STOREDETAILS = `store/getStore?storeId=${STORE_Id}`;
export const ADDSTORE = "store/addStore";
export const DEFAULT_IMAGE =
  "https://www.proclinic-products.com/build/static/default-product.30484205.png";
export const DELETE_IMAGE = "v1/image/deletImage";
export const UPDATE_DEFAULT_IMAGE = "v1/image/updateDefaultImageFlag";
export const ADD_TRANSACTION_PAYMENT =
  "transactionpayments/addTransactionpayments";
export const ADD_TRANSACTION_PAYMENT_N_SALES_DETAILS = "transactionpayments/addTransactionpaymentsNSalesDetails"
export const ADD_SALES_DETAILS = "salesdetails/addSalesdetails";
export const GET_TRANSACTIONBY_Month =
  "transactionpayments/getTransactionpaymentsByMonth";
export const GET_TRANSACTION_BY_DATE =
  "/transactionpayments/getTransactionpaymentsByDate";
export const GET_TRANSACTION = "transactionpayments/getTransactionpayments?";
export const GET_TOTAL_TRANSCATION_BY_MONTH = "transactionpayments/getTotalTransactionsByMonth?"
export const GET_TRANSACTION_LIST_BY_DATE = "transactionpayments/getTransactionListByDay?"
export const SINGLE_TRANSACTION_DETAILS = "/salesdetails/getSalesdetails?";
export const SYNC = "pos/synch";
export const ADD_FLOOR = "floor/addFloor";
export const GET_FLOOR_LIST = "floor/getFloorList";
export const GET_SINGLE_FLOOR_DETAILS = "floor/getSingleFloorById";
export const UPDATE_FLOOR_DETAILS = "floor/updateFloor";
export const GET_TABLE_LIST = "table/getTableList";
export const ADD_TABLE = "table/addTable";
export const UPDATE_TABLE_DETAILS = "table/updateTable";
export const GET_SINGLE_TABLE_DETAILS = "table/getTableById";
export const DELETE_TABLE_BY_ID = "table/deleteTableById";
export const GET_FLOOR_MAPPED_TABLE_LIST = "table/getFloorMappedTableList";
export const GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID =
  "floorPlan/getFloorPlanListByFloorId";
export const GET_FLOOR_PLAN_LIST = "floorPlan/getFloorPlanList";
export const ADD_FLOOR_PLAN = "floorPlan/addFloorPlan";
export const UPDATE_FLOOR_PLAN = "floorPlan/updateFloorPlan";
export const DELETE_FLOOR_PLAN = "floorPlan/deleteFloorPlanById";
export const GET_TABLE_ORDER_TRANS_LIST =
  "tableOrderTransaction/getTableOrders";
export const ADD_TABLE_ORDER_TRANS = "tableOrderTransaction/insertTableOrder";
export const UPDATE_TABLE_ORDER_TRANS =
  "tableOrderTransaction/updateTableOrder";
export const GET_TABLE_ORDER_TRANS_PRODUCT_LIST =
  "tableOrderTrasactionProducts/getTableOrderTransProductsList";
export const ADD_TABLE_ORDER_TRANS_PRODUCT =
  "tableOrderTrasactionProducts/insertTableOrderTransProducts";
export const UPDATE_TABLE_ORDER_TRANS_PRODUCT =
  "tableOrderTrasactionProducts/updateTableOrderSignleProd";
export const GET_SPLIT_PAYMENT_LIST =
  "splitPaymentTransaction/getSplitTransactionList";
export const ADD_SPLIT_PAYMENT =
  "splitPaymentTransaction/insertSplitTransaction";
export const UPDATE_SPLIT_PAYMENT =
  "splitPaymentTransaction/updateSplitTransaction";
export const PRODUCT_LIST_BY_CATEGORY_ID = `product/getProuductByCategoryId?`;
export const CATEGORY_IMAGE_UPLOAD = "ImageUpload/uploadImage";
export const GENERATE_TOKEN = "generateToken";
export const GENERATE_LICENSE = "generate-license";
export const ADD_LICENSE = "licenses/addLicenses";
export const VALIDATE_LICENSE_KEY = "validateLicenseKey";
export const GET_LICENSE_DETAILS = "licenses/getLicenseDetails";
export const CURRENT_UTC_TIME = "licenses/currentUtcMillis";
export const CREATE_ORDER = "payment/create_order";
export const ADD_PAYMENT = "payment/addPayment";
export const GET_PAYMENT = "payment/getPayment";
export const GET_SUBSCRIPTION_PLANS = "plan/getPlans";
export const UPDATE_SUBSCRIPTION_DETAILS = "plan/updatePlan";
export const CREATE_MACHINE = "createMachine";
export const GET_MACHINE_DETAILS = "retriveMachine";
export const GET_TOP_SELLING_PRODUCT = "product/getTopSellingProduct";
export const GET_TRANSACTION_AMOUNT_BY_PERIOD = "salesdetails/getTransaction";
export const GET_TOP_BUYERS = "customer/getTopBuyers";
export const GET_SHOPKEEPER_ORDER = "onlineOrder/getShopkeeperOrders"
export const GET_DISCOUNT_MAPPED_PRODUCTS_BY_CATEGORY_ID = "product/getPrductDiscountMapped"
export const GET_TAX_MAPPED_PRODUCTS_BY_CATEGORY_ID = "product/getPrductTaxMapped"
export const GET_PRODUCT_EXCEL_SHEET = "product/getProductExcelSheet"
export const GET_ALL_COUNTRIES = "countries/getAllCountries"
export const ADD_INVENTORY_PRODUCT = "inventory/addInventoryProduct"
export const GET_INVENTORTY_ALL_PRODUCTS = "inventory/getInventoryDashboard"
export const GET_INVENTORY_BY_PRODUCT_ID = `inventory/getInventoryByProductId?`
export const DELETE_INVENTORY_BY_PRODUCT_ID =`inventory/deleteInventoryByProductId?`

// For generating license
export const KeyGenAccountId = "e0076663-81d8-4800-80c6-9f41a3364162";
export const KeyGenPolicyIdForTrial = "1809a24a-061d-42c1-b94d-5deb3d67aa52";
export const KeyGenUserId = "fba062e1-5192-439e-8e5d-b740eda57bf2";
export const policyTypeFree = "freeTrial";
export const policyTypeLifeTime = "lifeTime";
export const policyTypeMonthly = "monthly";
export const policyTypeYearly = "yearly";

export const STORE_DEFAULT_IMG =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwLagH7SKwZwn86eGZupwx3Vn4TbTsgnNqYg&usqp=CAU";

// Google client ID
export const ClientId =
  "848119570036-muj68v2ivtv19pauhe0rsav7a8nk7tf7.apps.googleusercontent.com";

export const STORE_TYPE = [
  { cat_key: "st01", cat: "Grocery", cat_img: "", language: "en" },
  { cat_key: "st02", cat: "Medical", cat_img: "", language: "en" },
  { cat_key: "st03", cat: "Electronics", cat_img: "", language: "en" },
  { cat_key: "st04", cat: "Bakery", cat_img: "", language: "en" },
  { cat_key: "st05", cat: "Chicken and Mutton", cat_img: "", language: "en" },
  { cat_key: "st00", cat: "Other", cat_img: "", language: "en" },
  { cat_key: "st06", cat: "Fruits", cat_img: "", language: "en" },
  { cat_key: "st07", cat: "Hotels", cat_img: "", language: "en" },
  { cat_key: "st08", cat: "Hardware", cat_img: "", language: "en" },
  { cat_key: "st09", cat: "Health Care", cat_img: "", language: "en" },
  { cat_key: "st10", cat: "Farsan", cat_img: "", language: "en" },
  { cat_key: "st11", cat: "Vegetables", cat_img: "", language: "en" },
  {
    cat_key: "st12",
    cat: "Fruits and Vegetables",
    cat_img: "",
    language: "en",
  },
  { cat_key: "st13", cat: "Snack and Foods", cat_img: "", language: "en" },
  {
    cat_key: "st14",
    cat: "Sweets and Confectionery",
    cat_img: "",
    language: "en",
  },
  {
    cat_key: "st15",
    cat: "Spices and Condiments",
    cat_img: "",
    language: "en",
  },
  { cat_key: "st16", cat: "Fashion", cat_img: "", language: "en" },
];

// fro Prod

//pool for  // email required
export const awsEmailConfig = {
  mandatorySignId: true,
  region: "ap-south-1",
  userPoolId: "ap-south-1_RfxuxJGzN",
  // userPoolId: 'ap-south-1_lcaVQ3q2M',
  userPoolWebClientId: "pokbf2v0370bh61c4qfk0qut2",
  // userPoolWebClientId: '4sqfj0qvqu9jhbpqrnghg41fcj',

  // OPTIONAL - Hosted UI configuration
  oauth: {
    domain: "http://localhost:3000",
    scope: [
      "phone",
      "email",
      "profile",
      "openid",
      "aws.cognito.signin.user.admin",
    ],
    redirectSignIn: "http://localhost:3000/",
    redirectSignOut: "http://localhost:3000/",
    responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
};

//Usermigration Pool // email and phone // phone required
export const awsPhoneConfig = {
  mandatorySignId: true,
  region: "ap-south-1",
  userPoolId: "ap-south-1_1E1QOpMhw",
  userPoolWebClientId: "10n81rti08onh759jia29d0dfk",
};

export const AwsConfig = (bool) => {
  let aws = bool ? awsPhoneConfig : awsEmailConfig;

  return aws;
};

export function getUTCDate(date) {
  let d = date ? new Date(date) : new Date();
  return Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds()
  );
}

export const getLocalUTCDate = () => {
  // // Get the current UTC time
  // const utcTime = moment.utc();

  // // Convert UTC time to local time
  // const localTime = utcTime.local();
  // console.log("localTime...", localTime.format());
  // return localTime
  // Get the current date
  const currentDate = moment();
  console.log("currentDate... ", currentDate)
  // Set the time to the start of the day (midnight)
  const startOfDay = currentDate.startOf('day');
  console.log("startOfDay... ", startOfDay)

  // Calculate the time elapsed since the start of the day
  const timeFromStartOfDay = currentDate.diff(startOfDay);
  console.log("timeFromStartOfDay... ", timeFromStartOfDay)

  // Format the time elapsed as hours, minutes, and seconds
  const formattedTime = moment.duration(timeFromStartOfDay).asSeconds();
  console.log("formattedTime...", formattedTime);
  return formattedTime


}
export function startOfMonth(date) {
  // Create a new Date object representing the start of the month
  //  by using the year and month of the input date and setting the day to 1
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export const DateFormateForTransaction = (date) => {
  let dateFormate = moment(date).format();
  return dateFormate;
};

// for shope time
export const TimeConveter = (dateString) => {
  let date = new Date(parseInt(dateString));
  let time =
    (date.getHours() > 12 ? date.getHours() - 12 : date.getHours()) +
    ":" +
    (date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes() +
    " " +
    (date.getHours() < 12 || date.getHours() === 24 ? "AM" : "PM");

  return time;
};

export async function storeObjInLocalStrg(key, item) {
  try {
    //we want to wait for the Promise returned by AsyncStorage.setItem()
    //to be resolved to the actual value before returning the value
    var jsonOfItem = await localStorage.setItem(key, JSON.stringify(item));
    return jsonOfItem;
  } catch (error) {
    console.log(error.message);
  }
}

export async function retrieveObj(key) {
  try {
    const retrievedItem = await localStorage.getItem(key);
    let item = JSON.parse(retrievedItem);
    return item;
  } catch (error) {
    console.log(error.message);
  }
  return;
}

export async function getTocken(key) {
  try {
    let gettocken = await localStorage.getItem(key);
    return gettocken;
  } catch (error) {
    console.log(error);
  }
}

export const alertPopUp = (props) => {
  console.log(props.msg);
  return (
    <div
      className="toast align-items-center"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">{props.msg}</div>
        <button
          type="button"
          className="m-auto btn-close me-2"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export const REJECTED = {
  statusId: 0,
  status: "Rejected",
};
export const PENDING = {
  statusId: 1,
  status: "Pending",
};
export const ACCEPTED = {
  statusId: 2,
  status: "Accepted",
};
export const IN_PROGRESS = {
  statusId: 3,
  status: "In-Progress",
};
export const DISPATCH = {
  statusId: 4,
  status: "Dispatch",
};
export const DELIVERED = {
  statusId: 5,
  status: "Delivered",
};
export const READY_TO_PICK = {
  statusId: 4,
  status: "Ready To Pick",
};
export const PICKED = {
  statusId: 5,
  status: "Picked",
};

export const STATUS_ENUM = {
  0: REJECTED,
  1: PENDING,
  2: ACCEPTED,
  3: IN_PROGRESS,
  4: DISPATCH,
  5: DELIVERED,
};

export const PICKUPSTATUS_ENUM = {
  0: REJECTED,
  1: PENDING,
  2: ACCEPTED,
  3: IN_PROGRESS,
  4: READY_TO_PICK,
  5: PICKED,
};

export const toppings = [
  {
    name: "Capsicum",
    price: 1.2,
  },
  {
    name: "Paneer",
    price: 2.0,
  },
  {
    name: "Red Paprika",
    price: 2.5,
  },
  {
    name: "Onions",
    price: 3.0,
  },
  {
    name: "Extra Cheese",
    price: 3.5,
  },
  {
    name: "Baby Corns",
    price: 3.0,
  },
  {
    name: "Mushroom",
    price: 2.0,
  },
];

export const invoiceOptions = [
  {
    id: 1,
    invoiceName: "POS Half A4 Horizontal",
    height: "100%",
    width: "800px",
    fontsize: "16px",
    // style: "labelDemoInvocieStyle"
  },
  {
    id: 2,
    invoiceName: "POS Quarter",
    height: "100%",
    width: "400px",
    fontsize: "15px",
    // style: "labelDemoInvocieStyle1"
  },
  {
    id: 3,
    invoiceName: "POS Thermal Big",
    height: "100%",
    width: "900px",
    fontsize: "18px",
  },
  {
    id: 4,
    invoiceName: "PPOS Thermal Small",
    height: "100%",
    width: "600px",
    fontsize: "17px",
  },
  {
    id: 5,
    invoiceName: "POS A5 Vertical",
    height: "100%",
    width: "300px",
    fontsize: "14px",
  },
];

export const DemoInvoiceProduct = [
  {
    productName: "Denim jeans",
    rate: "400",
    quantity: "3",
    amount: "550",
  },
  {
    productName: " Cotton T-shirt",
    rate: "200",
    quantity: "2",
    amount: "250",
  },
  {
    productName: "Blue shirt",
    rate: "350",
    quantity: "4",
    amount: "600",
  },
];

export const DemoInvoiceDetails = [
  {
    customerName: "sayed",
    saleExecutive: "admin",
    subtotal: "950",
    totalAmount: "1400",
  },
];

export const KotCancellationReasons = [
  { id: 1, name: "Customer No Longer Needed" },
  { id: 2, name: "Delay In Preparation" },
  { id: 3, name: "Expired Food" },
  { id: 4, name: "Food Not Cooked Well" },
  { id: 5, name: "Item Not Available" },
  { id: 6, name: "Wrong Food Delivered" },
  { id: 7, name: "Other" },
];

export const ARABIC_CURRENCY = "د.إ";

export const subscriptionPlanDetails = [
  {
    planName: "FREE",
    afterDiscountPrice: 7999,
    beforeDiscountPrice: 9998,
    afterDiscountPriceMonthly: 749,
    beforeDiscountPriceMonthly: 949,
    disabled: true,
  },
  {
    planName: "LIFE TIME",
    afterDiscountPrice: 14998,
    beforeDiscountPrice: 19999,
    afterDiscountPriceMonthly: 1799,
    beforeDiscountPriceMonthly: 1999,
  },
];

export const SubscriptionFeatureList = {
  OnlineStore: "Online Store (Web & website)",
  AppManagement: "Android and ios store Managment App (Owner App)",
  ProductCount: "Number of products",
  Bandwidth: "Network bandwidth",
  Coupons: "Discount coupons",
  Integration: "Integrations",
  DeliveryApp: "Delivery app",
  ExportReports: "Exports reports",
  ThemeCustomization: "Theme customization",
  Email: "Email",
  Chat: "Chat",
};

export const SubscriptionChargesList = {
  AccountSetup: {
    title: "Account Setup/training online",
    price: "2150",
  },
  InitialDate: {
    title: "Initial Date set-up/chages/services reguest",
    price: "1120",
  },
  AdditionalDate: {
    title: "Additional Date set-up/chages/services reguest",
    price: "2260",
  },
};

export const SubscriptionAddonsList = {
  Locations: {
    title: "Locations",
    price: "8.99",
    discountedPrice: "9.99",
  },
  EmployeeAccounts: {
    title: "Employee Accounts",
    price: "8.99",
    discountedPrice: "9.99",
  },
  TableManagement: {
    title: "Table & Kot Management (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  LoyaltyManagement: {
    title: "Loyalty Management (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  CustomerReferralManagement: {
    title: "Customer Referral Management (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  PointOfSales: {
    title: "Point of Sales",
    price: "8.99",
    discountedPrice: "9.99",
  },
  PurchaseAndInventoryManagement: {
    title: "Purchase and Inventory Management (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  AdvancedDiscounts: {
    title: "Advanced Discounts (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  ProfessionalsProReports: {
    title: "Profesionals Pro Reports (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  BrandedAndroidShoppingApp: {
    title: "Branded Android Shopping app",
    price: "8.99",
    discountedPrice: "9.99",
  },
  BrandedIOSShoppingApp: {
    title: "Branded iOS Shopping app",
    price: "8.99",
    discountedPrice: "9.99",
  },
  CustomDomain: {
    title: "Custom Domain (Per Location)",
    price: "1200",
    discountedPrice: "1500",
  },
  FranchiseManagement: {
    title: "Franchise Managemen (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  WaiterApp: {
    title: "Waiter App (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  KitchenDisplayScreen: {
    title: "Kitchen Display Screen (KDS) (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  AccountingManagement: {
    title: "Acounting Management (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  CRFofMarketing: {
    title: "CRF of Marketing (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  QRCodeTableOrdering: {
    title: "QR code Table Ordering (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  KioskOrdering: {
    title: "Kiosk Ordeing - Self Services (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  AccountingIntegrations: {
    title: "Accounting Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  EInvoicingIntegrations: {
    title: "E-Invocing Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  OnlineStoreIntegrations: {
    title: "Online Store Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  DeliveryIntegrations: {
    title: "Delivery Integrations(Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  CommunicationsIntegrations: {
    title: "Communications Integrations(Per Location)",
    price: "8.99",
    discountedPrice: "$9.99",
  },
  PaymentGetwayIntegrations: {
    title: "Payment Getway Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  AdvanceOrdering: {
    title: "Advance Ordering (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  ForeignCurrency: {
    title: "Foreign Currency (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  MarketingIntegrations: {
    title: "Marketing Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  OthersIntegrations: {
    title: "Others Integrations (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
  GiftCard: {
    title: "Gift Card (Per Location)",
    price: "8.99",
    discountedPrice: "9.99",
  },
};

// homePgae design for images slider

export const images1 = [
  "https://posbytz.com/wp-content/uploads/2023/02/shero-01.png",
  "https://posbytz.com/wp-content/uploads/2023/07/msfood.png",
  "https://posbytz.com/wp-content/uploads/2023/09/Jazz-cafe.jpg",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
];

export const images2 = [
  "https://posbytz.com/wp-content/uploads/2023/02/shero-01.png",
  "https://posbytz.com/wp-content/uploads/2023/07/msfood.png",
  "https://posbytz.com/wp-content/uploads/2023/09/Jazz-cafe.jpg",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
];

export const images3 = [
  "https://posbytz.com/wp-content/uploads/2023/02/shero-01.png",
  "https://posbytz.com/wp-content/uploads/2023/07/msfood.png",
  "https://posbytz.com/wp-content/uploads/2023/09/Jazz-cafe.jpg",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
  "https://posbytz.com/wp-content/uploads/2023/09/HOT-POT.png",
];

// HomePage design for Asked Questins ...
export const questions = [
  {
    title: "What is Restaurant Pos software?",
    answer:
      "Restaurant POS software is a computer-based system that helps streamline and manage various operations in restaurants, cafes, bars, and other foodservice establishments. It acts as a central hub for processing and recording transactions, managing orders, and facilitating interactions between customers, servers, and the kitchen staff ",
  },
  {
    title: "What is cost of Pos software ?",
    answer:
      "Cost of the BlueBill software starts as low as from $19 Dollars per month. To know more about our plan please.",
  },

  {
    title: "What is Best Pos software for Supermarkets?",
    answer:
      "BlueBill software for Supermarket include inventory tracking, point of sale (POS), supplier management, employee scheduling, analytics, accounting and other systems..",
  },
  {
    title: " What is an Restaurant food ordering system for restaurants?",
    answer:
      "An Restaurant Food ordering system for restaurants is a digital platform that allows customers to place food orders through the internet. It provides a convenient way for customers to browse menus, customize orders, and make secure online payments.",
  },

  {
    title: "How can I create an online store for free?",
    answer:
      "You can set up and start selling from your online store with BlueBill in a matter of minutes. Sign up for the free account, customize online the store according to your brand, and you’re ready to make your first sale..",
  },
];

// HomePage design for Features content ...

export const features = [
  {
    id: 1,
    // image: 'https://posbytz.com/wp-content/uploads/2023/07/itl1.png',
    icon: (
      <MdPointOfSale
        style={{
          height: "70px",
          width: "70px",
          color: " var(--button-bg-color)",
        }}
      />
    ),
    image_1: PosImage,
    alt: "",
    title: "POS",
    color: " var(--button-bg-color)",
    content:
      "Our POS software offers a wide range of powerful features designed to enhance your retail and restaurant operations. Here are some key highlights:",
    highlights: [
      "Easy-to-Use Interface",
      "Device Agnostic can be installed in Windows, Android, and iOS",
      "Works well for both Restaurant and Retail business",
      "Multiple channel Sales management",
      "Integrations with printers, scanner, weighing scales, and label printers",
    ],
  },
  {
    id: 3,
    // image: 'https://posbytz.com/wp-content/uploads/2023/07/itled-1.png',
    icon: (
      <MdOutlineInventory
        style={{ height: "70px", width: "70px", color: "#6C0758" }}
      />
    ),
    image_1: "https://posbytz.com/wp-content/uploads/2023/07/Untitled-9-1.png",
    title: "Purchase & Inventory Management",
    color: "#6C0758",
    content:
      "Our comprehensive purchase and inventory management features empower your retail or restaurant business to efficiently manage and optimize your purchasing processes and inventory levels. Here are the key features that our software offers:",
    highlights: [
      "Purchase Order Creation: Generate purchase orders directly within the system",
      "Supplier Management: Manage your vendors track all your purchase and payments against any vendor",
      "Inventory Tracking: Keep real-time track of your inventory levels, including stock quantities, locations, and availability.",
      "Reorder Point and Auto-Replenishment: Set up reorder points for products to automatically trigger purchase orders when inventory reaches a predefined threshold.",
      "Manage Delivery for online orders through our Delivery optionsReporting and Analytics: Generate comprehensive reports and analyse inventory data to gain insights into cost of goods, inventory stock reports etc..,",
    ],
  },

  {
    id: 4,
    // image: 'https://posbytz.com/wp-content/uploads/2023/07/Untitled-.png',
    icon: (
      <HiClipboardList
        style={{ height: "70px", width: "70px", color: "#24007E" }}
      />
    ),
    image_1: onlinOrderImage,
    title: " Online Order Management",
    color: "#24007E",
    content:
      "A Online Ordering system is a digital platform allowing customers to browse menus, order online, complete payments, track orders with convenience & efficiency for both customers and restaurants. These solutions make it easy for restaurateurs to manage Online orders, accept payments, deliver orders and more. ",
    highlights: [
      "Online Store Creation: Establish an attractive and user-friendly online store to showcase your products or menu items. Customize the design, layout, and branding to create a unique online shopping experience that reflects your brand identity",
      "Product Catalog Management: Easily manage your product inventory within the online store. Add new products, update pricing and descriptions, and categorize items for easy navigation.",
      "Order Placement: Allow customers to place orders directly through your online store along with secure payments options",
    ],
  },

  {
    id: 5,
    // image: 'https://posbytz.com/wp-content/uploads/2023/07/1.png',
    icon: (
      <MdOutlineRestaurant
        style={{ height: "70px", width: "70px", color: "rgb(106 0 172)" }}
      />
    ),
    image_1: TableImage,
    title: "Resturant Management",
    color: "rgb(106 0 172)",
    content:
      "Restaurant POS software is a solution that allows food businesses to manage their operations easily. These solutions make it easy for restaurateurs to manage sales, accept payments, manage inventory, ingredients/recipes, food costing, accounting , CRM and more. ",
    highlights: [
      "Works on any device including Desktop/PC, Tablet/iPads, and mobile phones.",
      "Integrated with Kitchen printers and Displays to manage orders in the kitchen.",
      "Real-time tracking of all orders with the BlueBill Restaurant Management system.",
    ],
  },

  {
    id: 6,
    icon: (
      <FaBoxOpen style={{ height: "70px", width: "70px", color: "#24007E" }} />
    ),
    image_1: dashboradImage,
    title: "Products Management",
    color: "#24007E",
    content:
      "Our Products Management feature provides a comprehensive solution for managing your inventory and products efficiently. With advanced tools and features, you can streamline your product management process and enhance your overall business operations.",
    highlights: [
      "Efficient Inventory Management",
      "Streamlined Product Catalog",
      "Real-time Tracking and Updates",
      "Integration with E-commerce Platforms",
      "Automated Stock Reordering",
    ],
  },
];

// For pricing Modal objects ..............

/* FILE AND SHEARING TABLE SECTION */

export const fileSharingData = [
  {
    feature: "Online Store (Web & website)",
    free: "100MB",
    lifeTime: "25GB",
    ultimate: "50GB",
  },
  {
    feature: "Android and ios store Managment App (Owner App)",
    free: "7 Days",
    lifeTime: "Configurable",
    ultimate: "Configurable",
  },
  {
    feature: "Number of products Managment",
    free: "2GB",
    lifeTime: "Unlimited",
    ultimate: "Unlimited",
  },
  {
    feature: "Discount coupons",
    free: "Limited",
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Locations",
    free: <FcCheckmark className="checkmark" />,
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Employee Accounts",
    free: <FcCheckmark className="checkmark" />,
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Table & Kot Management (Per Location)",
    free: <FcCheckmark className="checkmark" />,
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Purchase and Inventory Management (Per Location)",
    free: "",
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Advanced Discounts (Per Location)",
    free: "",
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Online Store Integrations (Per Location)",
    free: "",
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: "",
  },

  {
    feature: "Delivery Integrations(Per Location)",
    free: "",
    lifeTime: <FcCheckmark className="checkmark" />,
    ultimate: <FcCheckmark className="checkmark" />,
  },
  {
    feature: "Point of Sales",
    free: "",
    lifeTime: "",
    ultimate: "",
  },

  {
    feature: "Payment Getway Integrations (Per Location)",
    free: "",
    lifeTime: "",
    ultimate: "",
  },

  {
    feature: "Branded Android Shopping app",
    free: "",
    lifeTime: "",
    ultimate: "",
  },

  {
    feature: "Payment Getway Integrations (Per Location)",
    free: "Limited",
    lifeTime: "",
    ultimate: "",
  },
];

export const Periods = [
  {
    id: 0,
    name: "todayDays",
    value: getUTCDate() - 1 * 86400000,
  },
  {
    id: 1,
    name: "last7Days",
    value: getUTCDate() - 7 * 86400000,
  },
  {
    id: 2,
    name: "last30Days",
    value: getUTCDate() - 30 * 86400000,
  },
  {
    id: 3,
    name: "last3Month",
    value: getUTCDate() - 90 * 86400000,
  },
  {
    id: 4,
    name: "last6Month",
    value: getUTCDate() - 180 * 86400000,
  },
];

export const pageSizeForPag = 5

// for valid discount
export const validDiscount = "true"
export const expireDiscount = "false"