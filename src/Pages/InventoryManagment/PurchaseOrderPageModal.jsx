import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { useTranslation } from 'react-i18next';
import { MenuItem, Checkbox, TextareaAutosize, InputLabel, TextField, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from '../../Redux/Product/productSlice';
import { getMappedDiscountByProdutId } from '../../Redux/Discount/discountSlice';
import { useNavigate } from 'react-router-dom'
import { CUSTOM_DROPDOWN_STYLE } from '../../utils/CustomeStyles';
import Select from "react-select";




const PurchaseOrderPageModal = ({ show, setShow, handleClose, handleAddOrder, editData, }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const productApi = window.productApi;
    const dispatch = useDispatch();
    const isOnline = useSelector((state) => state.checkInternet.isOnline);
    const productData = useSelector((state) => state.product.productData);
    const [productList, setproductList] = useState([]);

    console.log("productData", productData);

    const [discountType, setDiscountType] = useState('');
    const discountTypes = ['Percentage', 'Flat'];
    console.log("discountType", discountType);
    const [calculateUnit, setCalculateUnit] = useState(false)
    console.log('calculateUnit', calculateUnit);

    const [error, setError] = useState(
        {
            productName: '',
            quantity: '',
            unit: ''
        });


    const [fields, setFields] = useState({
        productName: "",
        quantity: "",
        unitBuyingPrice: "",
        unitBasePrice: "",
        mrp: "",
        unitSellingPrice: "",
        tax: "",
        discountValue: "",
        calculateUnit: "",

    })

    console.log("fields", fields);

    useEffect(() => {
        productData?.product?.length > 0 && setproductList(productData?.product);
    }, [productData?.product]);

    useEffect(() => {
        if (isOnline) {
            dispatch(getProductList(0, 0, ""));
            dispatch(getMappedDiscountByProdutId());
        } else {
            const productList = productApi?.productDB?.getProductsList();
            productList && setproductList(productList);

        }
    }, []);



    useEffect(() => {
        if (editData) {
            setFields({
                productName: editData.productName,
                quantity: editData.quantity,
                unitBuyingPrice: editData.unitBuyingPrice,
                unitBasePrice: editData.unitBasePrice,
                mrp: editData.mrp,
                unitSellingPrice: editData.unitSellingPrice,
                tax: editData.tax,
                discountValue: editData.discountValue,
                calculateUnit: editData.calculateUnit,
            });
            setDiscountType(editData.discountType);
            setCalculateUnit(editData.calculateUnit);

        }
    }, [editData]);


    const validation = () => {
        if (!fields.productName) {
            setError({ ...error, productName: 'Please Select Item' });
            return false;
        } else if (fields.quantity === undefined || fields.quantity === '') {
            setError({ ...error, quantity: 'Please enter quantity' });
            return false;
        } else if (fields.quantity.length > 3) {
            setError({ ...error, quantity: 'Maximum 3 Digit allowed' });
            return false;
        } else if (fields.unitBuyingPrice === undefined || fields.unitBuyingPrice === '') {
            setError({ ...error, unitBuyingPrice: 'Please enter unit buying price' });
            return false;
        }
        return true;

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const val = validation();
        if (val) {
            // const formData = { ...fields };
            // onSubmit(formData);
            const jsonObj = {

                productName: fields.productName,
                quantity: fields.quantity,
                unitBuyingPrice: fields.unitBuyingPrice,
                unitBasePrice: fields.unitBasePrice,
                mrp: fields.mrp,
                unitSellingPrice: fields.unitSellingPrice,
                tax: fields.tax,
                discountValue: fields.discountValue,
                calculateUnit: fields.calculateUnit,
                discountType: discountType,

            }
            setFields({
                ...fields, productName: "",
                quantity: "",
                unitBuyingPrice: "",
                unitBasePrice: "",
                mrp: "",
                unitSellingPrice: "",
                tax: "",
                discountValue: "",
                calculateUnit: "",
                discountType: "",
            })
            setDiscountType('');
            setCalculateUnit(false);

            handleAddOrder({ ...jsonObj })
            // console.log('Form Data:', fields);
            handleClose();
        }
    };



    const ProductNameSelectHandler = (e, name) => {
        setError({ ...error, productName: "" });
        console.log(e, name);
        setFields({ ...fields, productName: e });
    };

    const handleDiscountType = (selectedOption) => {
        if (selectedOption) {
            setDiscountType(selectedOption.value);
        } else {
            setDiscountType('');
        }
    };

    const handleCalculateUnit = (event) => {
        setCalculateUnit(event.target.checked);
        setFields({ ...fields, calculateUnit: event.target.checked });
    };

    const options = discountTypes?.map((type) =>
        ({ value: type, label: type })
    );


    const purchaseOrderInputhandler = (e) => {
        console.log(e);
        const { name, value } = e.target
        console.log(name, value);
        if (name === "quantity" ||
            name === "unitBasePrice" ||
            name === "unitBuyingPrice" ||
            name === "mrp" ||
            name === "unitSellingPrice" ||
            name === "tax" ||
            name === "discountValue"
        ) {
            let validate = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
            if (validate) {
                setFields({ ...fields, [name]: value });
                setError({ ...error, [name]: "" });
            }

        }

    }


    return (
        <Modal
            size="xl"
            isOpen={show}
            toggle={() => setShow(!show)}>
            <ModalHeader toggle={() => setShow(!show)} className="popup-modal">
                {/* {t("TableDetails.addTable")} */}
                {/* {modalHeader} */}
            </ModalHeader>
            <ModalBody className=' purchaseOrder popup-modal'>
                <Row>
                    <Col style={{ marginBottom: "40px" }}>
                        <div>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.productName")}
                                <span className="text-danger">*</span>
                            </InputLabel>
                            <Select
                                styles={CUSTOM_DROPDOWN_STYLE}
                                getOptionLabel={(product) => product?.productName}
                                value={fields?.productName}
                                placeholder={t("PurchaseOrderPage.namePlaceholder")}
                                name='productName'
                                onChange={(e) => ProductNameSelectHandler(e, "productName")}
                                options={productData?.product}
                                isClearable
                            />
                            {error.productName && <span className="text-danger">{error.productName}</span>}
                        </div>

                    </Col>
                    <Col>
                        <div>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.quantity")}
                                <span className="text-danger">*</span>
                            </InputLabel>
                            <TextField
                                type="text"
                                size='small'
                                maxLength={3}
                                placeholder="0"
                                className="form-control"
                                value={fields.quantity}
                                name='quantity'
                                onChange={purchaseOrderInputhandler}

                            />
                            {error.quantity && <span className="text-danger">{error.quantity}</span>}
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.unitBuyingPriceWithTax")}
                                <span className="text-danger">*</span>
                            </InputLabel>
                            <TextField
                                type="text"
                                size='small'
                                placeholder="0.00"
                                className="form-control"
                                value={fields.unitBuyingPrice}
                                name='unitBuyingPrice'
                                onChange={purchaseOrderInputhandler}
                            />
                            {error.unitBuyingPrice && <span className="text-danger">{error.unitBuyingPrice}</span>}
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div style={{ marginBottom: "10%" }}>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.unitBasePriceWithoutTax")}
                            </InputLabel>
                            <TextField
                                type="text"
                                size='small'
                                placeholder="0.00"
                                className="form-control"
                                value={fields.unitBasePrice}
                                name='unitBasePrice'
                                onChange={purchaseOrderInputhandler}
                            />
                            <div className=''>
                                <Checkbox
                                    className="p-0"
                                    type="checkbox"
                                    size="medium"
                                    style={{ padding: 3 }}
                                    name='calculateUnit'
                                    checked={calculateUnit}
                                    onChange={handleCalculateUnit}
                                />
                                <label style={{ fontSize: "15px", marginTop: "10px" }}>
                                    {t("PurchaseOrderPage.calculateUnitBuyingPrice")}</label>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.mrp")}
                            </InputLabel>
                            <TextField
                                type="text"
                                size='small'
                                placeholder="0.00"
                                className="form-control"
                                value={fields.mrp}
                                name='mrp'
                                onChange={purchaseOrderInputhandler}
                            />
                        </div>
                    </Col>

                    <Col>
                        <div>
                            <InputLabel style={{ color: "var(--product-text-color)" }}>
                                {t("PurchaseOrderPage.unitSellingPrice")}
                            </InputLabel>
                            <TextField
                                type="text"
                                size='small'
                                placeholder="0.00"
                                className="form-control"
                                value={fields.unitSellingPrice}
                                name='unitSellingPrice'
                                onChange={purchaseOrderInputhandler}
                            />
                        </div>
                    </Col>
                </Row>

                <Col>
                    <div style={{ marginBottom: "20px" }}>
                        <InputLabel style={{ color: "var(--product-text-color)" }}>
                            {t("PurchaseOrderPage.tax")}
                        </InputLabel>
                        <TextField
                            type="text"
                            size='small'
                            placeholder={t("PurchaseOrderPage.taxPlaceholder")}
                            className="form-control"
                            value={fields.tax}
                            name='tax'
                            onChange={purchaseOrderInputhandler}
                        />
                    </div>
                </Col>

                <Row>
                    <div className='discount-type'>
                        <div className='discount-value-field'>
                            <InputLabel>
                                {t("PurchaseOrderPage.discountType")}
                            </InputLabel>
                            <Select
                                styles={CUSTOM_DROPDOWN_STYLE}
                                value={options.find((opt) => opt.value === discountType)}
                                options={options}
                                name='discountType'
                                placeholder={t("PurchaseOrderPage.discountPlaceholder")}
                                onChange={(selectedOption) => handleDiscountType(selectedOption)}
                                isClearable
                            />

                        </div>
                        <div className='discount-value-field'>
                            {['Percentage', 'Flat'].includes(discountType) && (
                                <div>
                                    <InputLabel style={{ color: "var(--product-text-color)" }}>
                                        {t("PurchaseOrderPage.discountValue")}
                                    </InputLabel>
                                    <TextField
                                        type="text"
                                        size='small'
                                        placeholder="0.00"
                                        className="form-control"
                                        value={fields.discountValue}
                                        name='discountValue'
                                        onChange={purchaseOrderInputhandler}
                                    />
                                </div>
                            )}

                        </div>
                    </div>
                </Row>

                <ModalFooter className='footer-btn-modal'>
                    <div className='creat-btn'>
                        <Button
                            className='mt-3'
                            variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                            }}
                            onClick={() => navigate("/add-product")}>
                            {t("PurchaseOrderPage.createItem")}
                        </Button>
                    </div>
                    <div className='submit-btn'>

                        <Button
                            className='mt-3'
                            variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                            }}
                            onClick={handleSubmit}>
                            {t("PurchaseOrderPage.submit")}
                        </Button>


                    </div>


                </ModalFooter>


            </ModalBody>
        </Modal>
    );
};

export default PurchaseOrderPageModal;
