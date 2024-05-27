import React, { useEffect, useRef, useState } from 'react'
import "./PurchaseOrderPage.css";
import MainContentArea from '../MainContentArea/MainContentArea'
import { Checkbox, InputLabel, MenuItem, TextField, TextareaAutosize, Button } from '@mui/material';
import DatePicker from "react-datepicker";
import { validateDate } from '@mui/x-date-pickers/internals';
import PurchaseOrderPageModal from './PurchaseOrderPageModal';
import { useSelector } from 'react-redux';
import { CUSTOM_DROPDOWN_STYLE } from '../../utils/CustomeStyles';
import { useTranslation } from 'react-i18next';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Select from "react-select";




const PurchaseOrderPage = () => {

  const [show, setShow] = useState(false);
  const [editData, setEditData] = useState(null);
  console.log("editData", editData);
  const { t } = useTranslation();
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  console.log("purchaseOrderData", purchaseOrderData);



  const [poNumber, setPoNumber] = useState('');
  const [poInvoice, setPoInvoice] = useState('');
  const [expectedeDate, setExpectedDate] = useState(0);
  const [billingDate, setBillingDate] = useState(0);
  const [VendorListData, setVendorListData] = useState('');
  const [shipListData, setShipListData] = useState('');
  const [notes, setNotes] = useState('');
  const [applyTaxAfterDiscount, setApplyTaxAfterDiscount] = useState(false);

  const [error, setError] = useState({
    VendorListData: "",
    shipListData: "",
    poNumber: "",
    expectedeDate: "",
    billingDate: ""
  })


  const poNumberRef = useRef(null);
  const poInvoiceInputRef = useRef(null);
  const expectedeDateRef = useRef(null);
  const billingDateRef = useRef(null);
  const VendorListDataRef = useRef(null);
  const shipListDataRef = useRef(null);


  const vendors = ['Vendor1', 'Vendor2', 'Vendor3', 'Vendor4'];
  const shipToOptions = ['Mumbai', 'Dubai', 'Qatar'];




  const validation = () => {
    if (VendorListData === undefined || VendorListData === '') {
      setError({ ...error, VendorListData: "Please select vendor" });
      if (VendorListDataRef.current) {
        VendorListDataRef.current.focus();
      }
      return false;
    } else if (shipListData === undefined || shipListData === '') {
      setError({ ...error, shipListData: 'Please select shipTo location' });
      if (shipListDataRef.current) {
        shipListDataRef.current.focus();
      }
      return false;
    } else if (poNumber === undefined || poNumber === '') {
      setError({ ...error, poNumber: 'Please enter PO number' });
      if (poNumberRef.current) {
        poNumberRef.current.focus();
      }
      return false;
    } else if (!expectedeDate || isNaN(expectedeDate.getTime())) {
      setError({ ...error, expectedeDate: 'Please select expected date' });
      if (expectedeDateRef.current) {
        expectedeDateRef.current.focus();
      }
      return false;
    } else if (!billingDate || isNaN(billingDate.getTime())) {
      setError({ ...error, billingDate: 'Please select billing date' });
      if (billingDateRef.current) {
        billingDateRef.current.focus();
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const val = validation()
    if (val) {
      console.log('Form Data:', {
        VendorListData,
        shipListData,
        poNumber,
        poInvoice,
        expectedeDate,
        billingDate,
        applyTaxAfterDiscount,
        notes,
      });
    }
  };





  // const handleVendorChange = (event) => {
  //   setVendorListData(event.target.value);
  //   setError({ ...error, VendorListData: '' });
  // };


  const handleVendorChange = (selectedOption) => {
    console.log("Selected Vendor:", selectedOption);
    setVendorListData(selectedOption);
    setError({ ...error, VendorListData: '' });
  };


  const handleShipToChange = (selectedOption) => {
    console.log("Selected shipTo:", selectedOption);
    setShipListData(selectedOption);
    setError({ ...error, shipListData: '' });
  };



  // const handleShipToChange = (event) => {
  //   setShipListData(event.target.value);
  //   setError({ ...error, shipListData: '' });
  // };


  const expectedeDateSelectHandler = (date) => {
    setExpectedDate(date);
    setError({ ...error, expectedeDate: '' });
  };


  const billingDateSelectHandler = (date) => {
    setBillingDate(date);
    setError({ ...error, billingDate: '' });
  };



  useEffect(() => {
    let hours = 23;
    expectedeDate && expectedeDate.setHours(hours);
    let minutes = 59;
    expectedeDate && expectedeDate.setMinutes(minutes);
    let second = 59;
    expectedeDate && expectedeDate.setSeconds(second);
  }, [expectedeDate]);

  useEffect(() => {
    let hours = 23;
    billingDate && billingDate.setHours(hours);
    let minutes = 59;
    billingDate && billingDate.setMinutes(minutes);
    let second = 59;
    billingDate && billingDate.setSeconds(second);
  }, [billingDate]);


  const handlePoNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPoNumber(value);
    setError({ ...error, poNumber: '' });
  };

  const handlePoInvoiceChange = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setPoInvoice(value);
  };

  const handleApplyTaxAfterDiscountChange = (event) => {
    setApplyTaxAfterDiscount(event.target.checked);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };






  const handleShow = () => {
    setShow(true);
    setEditData(null);
  };

  const handleClose = () => {
    setShow(false);
    setEditData(null);
  };


  const handleDelete = (index) => {
    const updatedData = [...purchaseOrderData];
    updatedData.splice(index, 1);
    setPurchaseOrderData(updatedData);
  };


  const handleAddOrder = (PurchaseData) => {
    if (editData) {
      const updatedData = purchaseOrderData?.map(data => (data === editData ? PurchaseData : data));
      setPurchaseOrderData(updatedData);
      setEditData(null);
    } else {
      setPurchaseOrderData([...purchaseOrderData, PurchaseData]);
    }
  };


  const handleEdit = (data) => {
    setEditData(data);
    setShow(true);
  };




  return (
    <MainContentArea scroll="auto">

      <div className="purchaseFormMainContainer w-100">
        <div className="cardBox purchaseFromContainer overflow-auto d-flex flex-column">
          <form>
            <div class="purchase-order d-flex" >
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.vendor")}
                  <span className="text-danger">*</span>
                </InputLabel>
                <Select
                  styles={CUSTOM_DROPDOWN_STYLE}
                  value={VendorListData}
                  placeholder={t("PurchaseOrderPage.vendorPlaceholder")}
                  inputRef={VendorListDataRef}
                  onChange={handleVendorChange}
                  options={vendors?.map((vendor, index) => ({ label: vendor, value: vendor }))}
                  isClearable
                />

                {error.VendorListData && <span className="text-danger">{error.VendorListData}</span>}
              </div>
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.shipTo")}
                  <span className="text-danger">*</span>
                </InputLabel>
                <Select
                  styles={CUSTOM_DROPDOWN_STYLE}
                  placeholder={t("PurchaseOrderPage.shipToPlaceholder")}
                  // style={{ padding: "0" }}
                  value={shipListData}
                  inputRef={shipListDataRef}
                  onChange={handleShipToChange}
                  options={shipToOptions?.map((shipTo, index) => ({ label: shipTo, value: shipTo }))}
                  isClearable
                >
                  {/* {shipToOptions.map((shipTo, index) => (
                    <MenuItem key={index} value={shipTo}>
                      {shipTo}
                    </MenuItem>
                  ))} */}
                </Select>
                {error.shipListData && <span className="text-danger">{error.shipListData}</span>}
              </div>
            </div>
            <br />
            <div class="purchase-order -row d-flex">
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.poNumber")}
                  <span className="text-danger">*</span>
                </InputLabel>
                <TextField
                  type='text'
                  size='small'
                  placeholder={t("PurchaseOrderPage.poNumberPlaceholder")}
                  value={poNumber}
                  ref={poNumberRef}
                  onChange={handlePoNumberChange} />
                {error.poNumber && <span className="text-danger">{error.poNumber}</span>}
              </div>
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.poInvoiceNumber")}</InputLabel>
                <TextField
                  type='text'
                  size='small'
                  value={poInvoice}
                  placeholder={t("PurchaseOrderPage.poInvoicePlaceholder")}
                  // ref={poInvoiceInputRef}
                  onChange={handlePoInvoiceChange} />
              </div>
            </div>
            <br />
            <div class="purchase-order d-flex ">
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.expectedDelivery")}
                  <span className="text-danger">*</span>
                </InputLabel>
                <DatePicker
                  minDate={new Date()}
                  className="form-control"
                  selected={expectedeDate}
                  // ref={expectedeDateRef}
                  dateFormat="d/MM/yyyy"
                  onChange={(date) => {
                    expectedeDateSelectHandler(date);
                  }}
                />
                {error.expectedeDate && <span className="text-danger">{error.expectedeDate}</span>}

              </div>
              <div class="purchase-order-input col-md-5 mb-3">
                <InputLabel>{t("PurchaseOrderPage.billingDate")}
                  <span className="text-danger">*</span>
                </InputLabel>

                <DatePicker
                  minDate={new Date()}
                  className="form-control"
                  selected={billingDate}
                  // inputRef={billingDateRef}
                  dateFormat="d/MM/yyyy"
                  onChange={(date) => {
                    billingDateSelectHandler(date);
                  }}
                />
                {error.billingDate && <span className="text-danger">{error.billingDate}</span>}

              </div>
            </div>
            <div className='purchase-order-checkbox'>
              <div className='purchase-order-input'>
                <Checkbox
                  className="p-0"
                  type="checkbox"
                  size="medium"
                  style={{ padding: 3 }}
                  checked={applyTaxAfterDiscount}
                  onChange={handleApplyTaxAfterDiscountChange}
                />
                <InputLabel>{t("PurchaseOrderPage.applyTaxAfterDiscount")}</InputLabel>
              </div>
              <br />
              <div className="purchase-order-input col-md-4 mb-3"
                style={{ width: "100%" }}

              >
                <InputLabel>
                  {t("PurchaseOrderPage.notes")}
                </InputLabel>
                <TextareaAutosize
                  minRows={5}
                  name="notes"
                  value={notes}
                  onChange={handleNotesChange}
                  style={{
                    width: "100%",
                    borderColor: "var(--border-color)",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                />
              </div>

            </div>
          </form>
          <div className="purchase-order-submit-button mt-2" style={{ textAlign: "right" }}>
            {/* <Button
              variant="contained"
              onClick={handleSubmit}
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
              }}
              type="submit"
            >
              Submit
            </Button> */}

            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)"
              }}
              onClick={handleShow}
            >
              {t("PurchaseOrderPage.addItem")}
            </Button>
            <PurchaseOrderPageModal
              // productData={productData}
              show={show}
              setShow={setShow}
              handleClose={handleClose}
              handleAddOrder={handleAddOrder}
              editData={editData}
            />
          </div>
        </div>
      </div >

      <div className='row' style={{ height: "400px" }}>
        {/* <div className='card cardradius'> */}
        <div className="table-cartbox">
          <div className='card-body my-3 pt-0'>
            <table className="table table-hover  table-borderless ">
              <thead className="table-secondary sticky-top">
                <tr>
                  <th className='col'>{t("PurchaseOrderPage.srNo")}</th>
                  <th className='col-2'>{t("PurchaseOrderPage.productName")}</th>
                  <th className='col-'>{t("PurchaseOrderPage.unitBuyingPrice")}</th>
                  <th className='col-'>{t("PurchaseOrderPage.unitBasePrice")}</th>
                  <th className='col'>{t("PurchaseOrderPage.unitSellingPrice")}</th>
                  <th className='col'>{t("PurchaseOrderPage.mrp")}</th>
                  <th className='col'>{t("PurchaseOrderPage.quantity")}</th>
                  <th className='col'>{t("PurchaseOrderPage.discount")}</th>
                  <th className='col'>{t("PurchaseOrderPage.tax")}</th>
                  <th className='col-1'>{t("PurchaseOrderPage.actions")}</th>

                  {/* <th className='col'>{t("Amount(Without Tax)")}</th> */}
                </tr>
              </thead>

              <tbody>
                {purchaseOrderData?.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.productName?.productName}</td>
                    <td>{data.unitBuyingPrice}</td>
                    <td>{data.unitBasePrice}</td>
                    <td>{data.unitSellingPrice}</td>
                    <td>{data.mrp}</td>
                    <td>{data.quantity}</td>
                    <td>{data.discountValue}</td>
                    <td>{data.tax}</td>

                    <td>
                      <button
                        className="btn text-Color"
                        onClick={() => handleEdit(data)}
                      >
                        <CiEdit size={25} />
                      </button>


                      <button
                        className="btn text-Color"
                        onClick={() => handleDelete(index)}
                      >
                        <RiDeleteBin5Line size={25} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>

      </div>

    </MainContentArea >




  )
}

export default PurchaseOrderPage
