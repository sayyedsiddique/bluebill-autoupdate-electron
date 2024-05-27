const { contextBridge, ipcRenderer } = require("electron");
const personDB = require("./Database/PersonManager");
const unitDB = require("./Database/unitManager");
const brandDB = require("./Database/brandManager");
const taxDB = require("./Database/taxManager");
const discountDB = require("./Database/discountManager");
const categoryDB = require("./Database/CategoryManager");
const customerDB = require("./Database/customerManager");
const salesExecutiveDB = require("./Database/salesExecutiveManager");
const productDB = require("./Database/productManager");
const mappedTaxDB = require("./Database/mappedTaxManager");
const discountMappingDB = require("./Database/discountMappingManger");
const transactionPaymentDB = require("./Database/transactionManager");
const salesDetailsDB = require("./Database/salesDetailsManager");
const productImageDB = require("./Database/productImageManager");
const floorDB = require("./Database/floorManager");
const tableDB = require("./Database/tableManager");
const tableOrderDB = require("./Database/tableOrderTransaction");
const splitPaymentTransactionDB = require("./Database/splitPaymentTransactionManager");
const tableOrderTransProductsDB = require("./Database/tableOrderTransactionProductsManger");
const floorPlanTablesDB = require("./Database/floorPlanManager");
const storeDetailsDB = require("./Database/storeDetailsManager");
const licenseDetailsDB = require("./Database/licenseManager");
const machineId = require("node-machine-id");
const os = require("os");

const getNames = (msg) => {
  console.log("repload file chali ", msg);
};

const getUnits = () => {
  console.log("readAllPerson...", personDB?.readAllPerson());
};

const deleteAllSqliteDataHandler = () => {
  unitDB?.deleteAllUnits();
  brandDB?.deleteAllBrands();
  taxDB?.deleteAllTax();
  discountDB?.deleteAllDiscount();
  categoryDB?.deleteAllCategory();
  customerDB?.deleteAllCustomer();
  salesExecutiveDB?.deleteAllSalesExecutive();
  productDB?.deleteAllProduct();
  mappedTaxDB?.deleteAllMappedTax();
  discountMappingDB?.deleteAllDiscountMapping();
  transactionPaymentDB?.deleteAllTransactionPayment();
  salesDetailsDB?.deleteAllSalesDetails();
  productImageDB?.deleteAllProductImages();
  floorDB?.deleteAllFloor();
  tableDB?.deleteAllTable();
  tableOrderDB?.deleteAllTableOrder();
  // splitPaymentTransactionDB?.deleteAllSplitTransaction();
  tableOrderTransProductsDB?.deleteAllTableOrderTransactionProducts();
  const floorPlanDataDeleted = floorPlanTablesDB?.deleteAllFloorPlan();
  storeDetailsDB?.deleteAllStoreDetails();
};

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
});

contextBridge.exposeInMainWorld("api", {
  getNames: getNames,
});

contextBridge.exposeInMainWorld("deleteAllDataApi", {
  deleteAllSqliteDataHandler: deleteAllSqliteDataHandler,
});

// this is for license page
contextBridge.exposeInMainWorld("gateLicenseApi", {
  personDB,
});

// all person sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("sqlite", {
  personDB,
});

// all unit sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("unitApi", {
  unitDB,
});

// all brand sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("brandApi", {
  brandDB,
});

// all tax sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("taxApi", {
  taxDB,
});

// all discount sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("discountApi", {
  discountDB,
});

// all category sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("categoryApi", {
  categoryDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("customerApi", {
  customerDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("salesExecutiveApi", {
  salesExecutiveDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("productApi", {
  productDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("mappedTaxApi", {
  mappedTaxDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("discountMappingApi", {
  discountMappingDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("transactionPaymentApi", {
  transactionPaymentDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("salesDetailsApi", {
  salesDetailsDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("productImageApi", {
  productImageDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("floorApi", {
  floorDB,
});

// all customer sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("tableApi", {
  tableDB,
});

// all table order sqlite api goes from here in the frontend application
contextBridge.exposeInMainWorld("tableOrderApi", {
  tableOrderDB,
});

contextBridge.exposeInMainWorld("splitPaymentTransactionApi", {
  splitPaymentTransactionDB,
});

contextBridge.exposeInMainWorld("tableOrderTransProductsApi", {
  tableOrderTransProductsDB,
});

contextBridge.exposeInMainWorld("floorPlanTablesApi", {
  floorPlanTablesDB,
});

contextBridge.exposeInMainWorld("storeDetailsApi", {
  storeDetailsDB,
});

contextBridge.exposeInMainWorld("licenseDetailsApi", {
  licenseDetailsDB,
});

async function getMachineId() {
  try {
    const id = await machineId.machineId();
    console.log("getMachineId... ", id);

    const version = `v${ipcRenderer.sendSync("GET_APP_VERSION")}`;
    const electron = `v${process.versions.electron}`;
    const node = `v${process.versions.node}`;
    const platform = process.platform;
    const name = os.hostname();

    const deviceCompleteDetails = {
      fingerPrint: id,
      version,
      electron,
      node,
      platform,
      name,
    };
    // console.log("deviceCompleteDetails... ", deviceCompleteDetails)
    return deviceCompleteDetails;
  } catch (error) {
    console.error("Error retrieving machine ID:", error);
    return null;
  }
}

function getAppAvailableUpdate() {
  const message = ipcRenderer.sendSync("GET_APP_UPDATE");
  console.log("messageP... ", message);
  return message;
}

contextBridge.exposeInMainWorld("getDeviceFingerPrint", {
  getMachineId: getMachineId,
});

contextBridge.exposeInMainWorld("appUpdate", {
  getAppAvailableUpdate: getAppAvailableUpdate,
});
