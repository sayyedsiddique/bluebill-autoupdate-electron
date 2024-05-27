import {configureStore} from '@reduxjs/toolkit'
import { cartReducer } from './actions/cartSlice'
import { brandReducer } from './Brand/brandSlice'
import { categoryReducer } from './Category/categorySlice'
import { customerReducer } from './Customer/customerSlice'
import { discountReducer } from './Discount/discountSlice'
import { languageReducer } from './Language/languageSlice'
import { onlineOrderReducer } from './OnlineOrderSlice/onlineOrderSlice'
import { productReducer } from './Product/productSlice'
import { salesExecutiveReducer } from './SalesExecutive/SalesExecutiveSlice'
import { sidenavReducer } from './SidenavSlice/sidenavSlice'
import { storeSettingReducer } from './StoreSetting/storeSettingSlice'
import { taxReducer } from './Tax/taxSlice'
import { transactionReducer } from './Transaction/TransactionSlice'
import { unitReducer } from './Unit/unitSlice'
import { authReducer } from './authSlice/authSlice'
import { bulkUploadReducer } from './bulkUploadSlice/bulkUploadSlice'
import { storeCreatorReducer } from './StoreCreatorSlice/storeCreatorSlice'
import { checkInternetReducer } from './CheckInternet/CheckInternet'
import { syncReducer } from './Sync/syncSlice'
import { floorReducer } from './Floor/floorSlice'
import { tableReducer } from './Table/tableSlice'
import { floorPlanReducer } from './FloorPlan/floorPlanSlice'
import { tableOrderReducer } from './TableOrder/TableOrderSlice'
import { tableOrderProductReducer } from './TableOrderProduct/TableOrderProductSlice'
import { splitPaymentReducer } from './SplitPayment/SplitPaymentSlice'
import { licenseReducer } from './LicenseSlice/licenseSlice'
import { subscriptionPaymentReducer } from './SubscriptionPaymentSlice/SubscriptionPaymentSlice'
import { subscriptionPlanReducer } from './SubscriptionPlanSlice/SubscriptionPlanSlice'
// import { subscriptionPlanReducer } from './subscriptionPlan/SubscriptionPlanSlice'
import { InventoryManageReducer } from './InventoryManage/InventoryManageSlice';

const store = configureStore({
    reducer: {
        cart: cartReducer,
        // togMenu: menuReducer,
        sidenavToggle: sidenavReducer,
        onlineOrder:onlineOrderReducer,
        brand: brandReducer,
        product: productReducer,
        storeSetting:storeSettingReducer,
        unit: unitReducer,
        category: categoryReducer, 
        tax: taxReducer,
        discount: discountReducer,
        language: languageReducer,
        salesExecutive:salesExecutiveReducer,
        transaction:transactionReducer,
        customer:customerReducer,
        auth:authReducer,
        bulkUpload:bulkUploadReducer,
        storeCreator:storeCreatorReducer,
        checkInternet: checkInternetReducer,
        sync: syncReducer,
        floor: floorReducer,
        table: tableReducer,
        floorPlan: floorPlanReducer,
        tableOrder: tableOrderReducer,
        tableOrderProduct: tableOrderProductReducer,
        splitPayment: splitPaymentReducer,
        license: licenseReducer,
        subscriptionPayment: subscriptionPaymentReducer,
        // subscriptionPlan: subscriptionPlanReducer
        subscriptionPlan: subscriptionPlanReducer,
        InventoryManage: InventoryManageReducer,
    }
})

export default store