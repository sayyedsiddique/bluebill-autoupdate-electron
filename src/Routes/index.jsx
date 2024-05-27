import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import DashboardPage from "../Pages/Dashboard/DashboardPage";
import ProductsPage from "../Pages/Products/ProductsPage";
import OnlineOrder from "../Pages/OnlineOrder/OnlineOrderPage";
import MainLayout from "../Layout/MainLayout";
import DisplayOrdersItem from "../Components/OnlineOrders/DisplayOrdersItem/DisplayOrdersItem";
import OrderDetailsPage from "../Pages/OrderDetailsPage/OrderDetailsPage";
import ProductDetailsPage from "../Pages/ProductDetailsPage/ProductDetailsPage";
import CartPage from "../Pages/CartPage/CartPage";
import AddProduct from "../Pages/AddProduct/AddProduct";
import CustomersPage from "../Pages/CustomersDetailsPage/CustomersDetailsPage";
import Discount from "../Pages/DIscountPage/DiscountPage";
import Taxes from "../Pages/TaxesDetailsPage/TaxesPage";
import Brands from "../Pages/BrandsPage/BrandsPage";
import Units from "../Pages/UnitsPage/UnitsPage";
import Category from "../Pages/CategoryPages/CategoryPage";
import SalesExecutive from "../Pages/SalesExecutivePage/SalesExecutivePage";
import StorePage from "../Pages/StorePage/StorePage";
import StoreAddresPage from "../Pages/StorePage/StoreAddressPage";
import SaveStoreAddress from "../Pages/StorePage/SaveStoreAddress";
import StoreCreatorSummery from "../Pages/StorePage/StoreCreatorPage";
import LogIn from "../Pages/auth/LogIn";
import { Auth } from "aws-amplify";
import Register from "../Pages/auth/Register";
import RegisterSuccess from "../Pages/auth/Registersuccess";
import ForgotPassword from "../Pages/auth/ForgotPassword";
import ForgotPassVarification from "../Pages/auth/ForgotPassVarification";
import ResendOtpLink from "../Pages/auth/ResendOtpLink";
import UploadBulk from "../Upload/UploadBulkXL";
import PublicRoute from "./publicRoute";
import StoreSettingScreen from "../Pages/StoreSettingPage/StoreSetting";
import StoreEditPage from "../Pages/StoreSettingPage/storeEditPage";
import ChangeAddressPage from "../Pages/StoreSettingPage/changeAddressPage";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useDispatch } from "react-redux";
import { getLanguage } from "../Redux/Language/languageSlice";
import StoreSettingsPage from "../Pages/StoreSettingPage/StoreSettingsPage";
import StoreSettingsEditPage from "../Pages/StoreSettingPage/StoreSettingsEditPage";
import ProductCreation from "../Pages/AddProduct/ProductCreation";
import EditProductPage from "../Pages/AddProduct/EditProductPage";
import StoreMainComponent from "../Pages/StorePage/StoreMainComponent";
import TransactionDetailsPage from "../Pages/TransactionDetails/TransactionDetailsPage";
import ReportPage from "../Pages/ReportPage/ReportPage";
import SingleTransactionDetails from "../Pages/TransactionDetails/SingleTransactionDetails";
import ReportDetailsPage from "../Pages/ReportPage/ReportDetailsPage";
import SingleReportDetails from "../Pages/ReportPage/SingleReportDetails";
import Page404 from "../Pages/Page404/Page404";
import HomePage from "../Pages/HomePage/HomePage";
import Home from "../Pages/Home/Home";
import { STORE_Id, retrieveObj } from "../Containts/Values";
import Registration from "../Pages/auth/Registration";
import SignIn from "../Pages/auth/SignIn";
import ForgetPassword from "../Pages/auth/ForgetPassword";
import ForgetPasswordVerification from "../Pages/auth/ForgetPasswordVerification";
import OtpPage from "../Pages/auth/OtpPage";
import ResentOtpPage from "../Pages/auth/ResendOtpPage";
import FloorsPage from "../Pages/FloorsPage/FloorsPage";
import TablePage from "../Pages/TablePage/TablePage";
import StockDashboardPage from "../Pages/InventoryManagment/StockDashboardPage";
import PurchaseOrderPage from "../Pages/InventoryManagment/PurchaseOrderPage";
import AccountAndSettings from "../Pages/AccountandSettings/AccountAndSettings";
import TablesManagement from "../Pages/TablePage/TablesManagement";
import { generateLicense, generateToken, getLicenseDetails } from "../Redux/LicenseSlice/licenseSlice";
import PricingPage from "../Components/PricingPage/PricingPage";
import SupportPage from "../Components/HomePages/SupportPage/SupportPage";
import ApplyDiscountOnProduct from "../Pages/DIscountPage/ApplyDiscountOnProduct";
import ApplyTAxOnProduct from "../Pages/TaxesDetailsPage/ApplyTaxOnProduct";
import ApplyTaxOnProduct from "../Pages/TaxesDetailsPage/ApplyTaxOnProduct";
import InventoryProductsDetails from "../Pages/InventoryManagment/InventoryProductsDetails";

const Index = () => {
  const storeDetailsApi = window.storeDetailsApi;

  const dispatch = useDispatch();
  const location = useLocation();
  console.log("INDEXlocation ", location);
  const [isAuthenticated, setisAuthenticated] = useState(
    JSON.parse(localStorage.getItem("loggedIn"))
  );
  console.log("isAuthenticated ", isAuthenticated);

  const [selectedLang, setSelectedLang] = useState({ name: "English" });
  const [defaultLang, setdefaultLang] = useState("en");
  const [storeData, setStoreData] = useState();
  console.log("storeData ", storeData);

  // const callbackResposeHandler = (response) => {
  //   console.log("Encoded JWT ID token: " + response.credential)
  // }

  // // Global google
  // useEffect(() => {
  //   google.accounts.id.initialize({
  //     client_id: "466377967251-qf130ciqpffq77jdkmaru6s6ups69mgc.apps.googleusercontent.com",
  //     callback: callbackResposeHandler
  //   })

  //   google.accounts.id.renderButton(
  //     document.getElementById("signInDiv"),
  //     {theme: "outline", size: "large"}
  //   )
  // },[])

  // // Generating Keygen token here
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const tokenResponse = await dispatch(generateToken());
  //       console.log("tokenValue... ", tokenResponse?.data?.attributes);

  //       if(tokenResponse){

  //       //  const licensePayload = {
  //       //     "account": "e0076663-81d8-4800-80c6-9f41a3364162",
  //       //     "policyId": "1809a24a-061d-42c1-b94d-5deb3d67aa52",
  //       //     "token": `${tokenResponse?.data?.attributes?.token}`,
  //       //     "userId": "fba062e1-5192-439e-8e5d-b740eda57bf2"
  //       //   }
  //       //   const licenseResponse = await dispatch(generateLicense(licensePayload));

  //       //   if(licenseResponse){
  //       //     console.log("licenseResponse... ", licenseResponse)
  //       //   }

  //       }

  //       // Handle the tokenResponse or perform additional logic
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    dispatch(getLanguage(selectedLang));
  }, [selectedLang]);

  const languageSelectHandler = (e) => {
    let langName = e.name;
    if (
      langName === "English" ||
      langName === "إنجليزي" ||
      langName === "इंग्रजी" ||
      langName === "अंग्रेजी"
    ) {
      setSelectedLang(e);
      setdefaultLang("en");
      localStorage.setItem("defaultLang", JSON.stringify("en"));
      localStorage.setItem("StoreCurrency", ("₹"))
    } else if (
      langName === "Arabic" ||
      langName === "عربي" ||
      langName === "अरबी"
    ) {
      setSelectedLang(e);
      setdefaultLang("ar");
      localStorage.setItem("defaultLang", JSON.stringify("ar"));
      localStorage.setItem("StoreCurrency", ("د.إ"))
    } else if (
      langName === "Marathi" ||
      langName === "الماراثى" ||
      langName === "मराठी"
    ) {
      setSelectedLang(e);
      setdefaultLang("me");
      localStorage.setItem("defaultLang", JSON.stringify("me"));
      localStorage.setItem("StoreCurrency", ("₹"))
    } else if (
      langName === "Hindi" ||
      langName === "هندي" ||
      langName === "हिंदी"
    ) {
      setSelectedLang(e);
      setdefaultLang("hi");
      localStorage.setItem("defaultLang", JSON.stringify("hi"));
      localStorage.setItem("StoreCurrency", ("₹"))
    }
  };

  // getting lang from local storage
  useEffect(() => {
    let lang = localStorage.getItem("defaultLang");
    lang && setdefaultLang(JSON.parse(lang));
  }, [selectedLang]);

  // direction of the website
  // and some design changed here
  useEffect(() => {
    if (defaultLang === "en") {
      setSelectedLang({ name: "English" });
      i18next.changeLanguage(defaultLang);
      document.dir = "ltr";
      document.lang = "en";
      document.body.style.textAlign = "left";
      document.body.style.fontFamily = `"Montserrat", sans-serif;`;
    } else if (defaultLang === "ar") {
      setSelectedLang({ name: "Arabic" });
      i18next.changeLanguage(defaultLang);
      document.dir = "rtl";
      document.lang = "ar";
      document.body.style.textAlign = "right";
      document.body.style.fontFamily = "arabicFont";
    } else if (defaultLang === "me") {
      setSelectedLang({ name: "Marathi" });
      i18next.changeLanguage(defaultLang);
      document.dir = "ltr";
      document.lang = "me";
      document.body.style.textAlign = "left";
      document.body.style.fontFamily = `"Montserrat", sans-serif;`;
    } else if (defaultLang === "hi") {
      setSelectedLang({ name: "Hindi" });
      i18next.changeLanguage(defaultLang);
      document.dir = "ltr";
      document.lang = "hi";
      document.body.style.textAlign = "left";
      document.body.style.fontFamily = `"Montserrat", sans-serif;`;
    }
  }, [defaultLang]);

  //AWS auth status
  const setAuthStatus = (authenticated) => {
    setisAuthenticated(authenticated);
  };
  //AWS status
  // const setUser=user =>{
  // 	// this.setState({user:user});
  //   setuser(user)
  // }
  //aws session mgmt

  // checking stores here
  // useEffect(() => {
  //   const sqliteStoreDetails =  storeDetailsApi?.storeDetailsDB?.getStoreDetails(storeData?.storeId);
  //   console.log("sqliteStoreDetails... ", sqliteStoreDetails)
  //   if(storeData?.storeId){

  //   }

  // }, [storeData])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedIn"));
    user ? setisAuthenticated(true) : setisAuthenticated(false);

    // for check store data availabel or not
    retrieveObj("storeInfo").then((store) => {
      setStoreData(store && store[0]);
    });
  }, [isAuthenticated]);

  useEffect(() => {
    async function data() {
      try {
        const session = await Auth.currentSession();
        console.log("session", session);
        console.log(session.accessToken.payload.exp);
        let exp = session.accessToken.payload.exp;
        const expSession = new Date(exp * 1000);
        console.log(expSession.getTime());
        console.log(new Date().getTime());
        if (expSession.getTime() <= new Date().getTime()) {
          localStorage.clear();
          navigate("/");
          window.location.reload();
        }
        // setAuthStatus(true);
        // const user = await Auth.currentAuthen ticatedUser();
        // setUser(user);
      } catch (error) {
        console.log(error);
      }
    }
    data();
  }, []);

  console.log("storeInfo", storeData);

  const authProps = {
    isAuthenticated: isAuthenticated,
    // user:user,
    setAuthStatus: setAuthStatus,
    // setUser:setUser
  };
  const navigate = useNavigate();

  return (
    <Routes>
      {/* private Route */}
      {isAuthenticated ? (
        <Route
          element={
            <MainLayout
              auth={authProps}
              selectHandler={languageSelectHandler}
              defaultLang={selectedLang}
            />
          }
        >
          {/* Store creation routes */}
          {isAuthenticated ? (
            // Route path for Store Creation Pages
            <>
              <Route path="storecreation" element={<StoreMainComponent />} />
              <Route path="storeaddress" element={<StoreAddresPage />} />
              <Route path="storesave" element={<SaveStoreAddress />} />
              <Route
                path="storecreatorsummery"
                element={<StoreCreatorSummery />}
              />
              <Route path="/changeaddress" element={<ChangeAddressPage />} />
            </>
          ) : null}

          {isAuthenticated ? (
            <>
              {/* Route path for Dashboard Page */}
              <Route path="/" element={<DashboardPage />} />

              {/* Route path for Billing Page */}
              <Route path="cart" element={<CartPage />} />
              <Route path="/tables" element={<TablesManagement />} />

              {/* Route path for Transaction Pages */}
              <Route path="/transaction" element={<TransactionDetailsPage />} />
              <Route
                path="transactionDetails"
                element={<SingleTransactionDetails />}
              />

              {/* Route path for Report Pages */}
              <Route path="report" element={<ReportPage />} />
              <Route path="reportDetails" element={<ReportDetailsPage />} />
              <Route
                path="singleReportDetails"
                element={<SingleReportDetails />}
              />

              {/* Route path for online-Order Pages */}
              <Route path="online-order" element={<OnlineOrder />} />
              <Route
                path="online-order/:productId"
                element={<OrderDetailsPage />}
              />
              {/* <Route path="online-order" element={<DisplayOrdersItem />} /> */}

              {/* Route path for Products & productDetails pages */}
              <Route path="products/" element={<ProductsPage />} />
              <Route path="product" element={<ProductDetailsPage />} />
              {/* Route path for ProductCreation & ProductEdit pages */}
              <Route path="/add-product" element={<ProductCreation />} />
              <Route path="/product/edit" element={<EditProductPage />} />
              {/* Route path for bulkUpload page */}
              <Route path="upload" element={<UploadBulk />} />

              {/* Route path for Discount Pages */}
              <Route path="Discount" element={<Discount />} />
              <Route path="/add-product/Discount" element={<Discount />} />
              <Route path="/Discount/apply-discount-on-products" element={<ApplyDiscountOnProduct />} />

              {/* Route path for Tax Pages */}
              <Route path="Taxes" element={<Taxes />} />
              <Route path="/add-product/Taxes" element={<Taxes />} />
              <Route path="/Taxes/apply-tax-on-products" element={<ApplyTaxOnProduct />} />

              {/* Route path for Unit Pages */}
              <Route path="Units" element={<Units />} />
              <Route path="/add-product/Units" element={<Units />} />

              {/* Route path for Brand Pages */}
              <Route path="Brands" element={<Brands />} />
              <Route path="/add-product/Brands" element={<Brands />} />

              {/* Route path for Floor Pages */}
              {/* <Route path="Floor" element={<FloorsPage />} /> */}
              <Route path="/floor-dashboard" element={<FloorsPage />} />

              {/* Route path for Table Pages */}
              {/* <Route path="Table" element={<TablePage />} /> */}
              <Route path="/TablePage" element={<TablePage />} />

              {/* Route path for StockDashboard Pages */}
              <Route path="StockDashboard" element={<StockDashboardPage />} />
              <Route
                path="/StockDashboardPage"
                element={<StockDashboardPage />}
              />
              <Route
                path="/InventoryProductsDetails"
                element={<InventoryProductsDetails />}
              />

              {/* Route path for PurchaseOrder Pages */}
              <Route path="PurchaseOrderPage" element={<PurchaseOrderPage />} />
              <Route
                path="/PurchaseOrderPage"
                element={<PurchaseOrderPage />}
              />

              {/* Route path for Customer Pages */}
              <Route path="Customers" element={<CustomersPage />} />

              {/* Route path for Category Pages */}
              <Route path="Category" element={<Category />} />

              {/* Route path for SalesExecutive Pages */}
              <Route path="salesExecutive" element={<SalesExecutive />} />

              {/* Route path for Store Setting Pages */}
              <Route path="storesetting" element={<StoreSettingsPage />} />
              <Route path="storeedit" element={<StoreSettingsEditPage />} />

              {/* Route path for Account & Setting Pages */}
              <Route
                path="AccountAndSettings"
                element={<AccountAndSettings />}
              />
            </>
          ) : null}

          {/* <Route path="/add-product" element={<AddProduct />} /> */}
          {/* <Route path="storecreator" element={<StorePage/>}/> */}
          {/* <Route path="/product/edit" element={<AddProduct/>}/> */}
          {/* <Route path="storesetting" element={<StoreSettingScreen/>}/> */}
          {/* <Route path="storeedit" element={<StoreEditPage/>}/> */}
        </Route>
      ) : (
        // Public Route
        <Route path="/" element={<PublicRoute />}>
          <Route path="/" element={<Home />} />
          {/* old login page */}
          {/* <Route
            path="/login"
            element={<LogIn />}
          /> */}
          {/* new login page */}
          <Route path="/signin" element={<SignIn />} />
          {/* old signUp page */}
          {/* <Route path="register" element={<Register />} /> */}
          {/* new signUp page */}
          <Route path="register" element={<Registration />} />
          {/* old otp screen */}
          {/* <Route path="otpscreen" element={<RegisterSuccess />} /> */}
          {/* new otp screen */}
          <Route path="otpscreen" element={<OtpPage />} />
          {/* old forgot screen  */}
          {/* <Route
            path="forgotpassword"
            element={<ForgotPassword navigate={navigate} />}
          /> */}
          {/* new forgot screen */}
          <Route
            path="forgotpassword"
            element={<ForgetPassword navigate={navigate} />}
          />

          {/* old set password screen */}
          {/* <Route
            path="forgotpasswordVerification"
            element={<ForgotPassVarification navigate={navigate} />}
          /> */}
          {/* new set password screen */}
          <Route
            path="forgotpasswordVerification"
            element={<ForgetPasswordVerification navigate={navigate} />}
          />
          {/* old resent otp page */}
          {/* <Route path="resendverificationlink" element={<ResendOtpLink />} /> */}
          {/* new resent otp page */}
          <Route path="resendverification" element={<ResentOtpPage />} />
        </Route>
      )}
      <Route path="*" element={<Page404 />} />
      <Route path="PricingPage" element={<PricingPage />} />
      <Route path="SupportPage" element={<SupportPage />} />

    </Routes>
  );
};

export default Index;
