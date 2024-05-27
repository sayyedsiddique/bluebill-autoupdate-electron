import React, { useEffect, useState } from 'react';
import "./AddProduct.css";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { InputLabel, TextField, Button } from "@mui/material";
import DatePicker from "react-datepicker";
import { useTranslation } from 'react-i18next';
import { getUTCDate } from '../../Containts/Values';
import { addInventoryProduct } from '../../Redux/InventoryManage/InventoryManageSlice';
import { useDispatch } from 'react-redux';

const AddQuantityOfProductModal = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [date, setDate] = useState(new Date());
    const [purchasingPrice, setPurchasingPrice] = useState("");
    console.log("purchasingPrice", purchasingPrice);
    const [notes, setNotes] = useState('');
    const [quantity, setQuantity] = useState("");
    const [quantityError, setQuantityError] = useState('');
    console.log("name007", props?.togglevalue);
    console.log("productIdData", props?.productIdData);


    useEffect(() => {
        if (props?.isEdit) {
            setPurchasingPrice(props?.productDetails?.purchasingPrice)
            setQuantity(props?.productDetails?.quantity)
            setNotes(props?.productDetails?.notes)
        } else {
            setPurchasingPrice(props?.productDetails?.purchasingPrice)
        }
        // console.log("props?.productDetails?.quantity", props?.productDetails?.quantity);

    }, [props?.productDetails])


    const handleQuantity = (event) => {
        const value = event.target.value.replace(/\D/g, "");
        setQuantity(value);
        setQuantityError('');
    };

    const handlePurchasingPrice = (event) => {
        const value = event.target.value.replace(/\D/g, "");
        setPurchasingPrice(value);
    };

    const handleNotes = (event) => {
        setNotes(event.target.value);
    };

    //  date handler
    const DatePickerHandler = (date) => {
        console.log("date ", date);
        setDate(date);
    };


    // Add quantity text field validation..
    const validate = () => {
        if (quantity === undefined || quantity === '') {
            setQuantityError("Please enter quantity")
            return false;
        }
        return true
    }

    // add Inventory Handler...
    const addInventoryHandler = () => {
        let val = validate();
        if (val) {
            let inventoryProductData = {
                inventoryId: props?.isEdit ? props?.productDetails?.inventoryId : 0,
                isDeleted: 0,
                lastUpdated: getUTCDate(),
                notes: "",
                productId: props?.productDetails?.productId,
                purchasingPrice: parseInt(purchasingPrice),
                quantity: Number(quantity),
            };
            console.log("inventoryProductData", inventoryProductData);
            dispatch(addInventoryProduct(inventoryProductData, props?.isEdit, props.handleUpdateSuccess))
            props?.setshow(false);
        }
    }



    return (
        <div>
            <Modal size="small"
                isOpen={props.isModelVisible}
                toggle={() => props.setshow(!props.isModelVisible)}>
                <ModalHeader toggle={() => props.setshow(!props.isModelVisible)} className="popup-modal">
                    {t("AllProduct.Instock")}
                </ModalHeader>
                <ModalBody className="popup-modal">
                    <form>
                        <div className='mb-4'>
                            <InputLabel className="requiredstar">
                                {/* Add Quantity of Product */}
                                {t("AllProduct.quantity")}
                            </InputLabel >
                            <TextField
                                type="text"
                                size="small"
                                name="quantity"
                                value={quantity}
                                onChange={handleQuantity}
                                inputProps={{ maxLength: 7 }}
                                placeholder={t("AllProduct.addQuantity")}
                                className="form-control"
                            />
                            {quantityError ? <span className="text-danger">{quantityError}</span> : null}
                        </div>

                        <div className='d-flex mb-4 equal-width'>
                            <div className=''>
                                <InputLabel
                                // className="requiredstar"
                                >
                                    {t("AllProduct.purchasePrice")}
                                </InputLabel >
                                <TextField
                                    type="text"
                                    size="small"
                                    name="quantity"
                                    value={purchasingPrice}
                                    inputProps={{ maxLength: 7 }}
                                    onChange={handlePurchasingPrice}
                                    placeholder={t("AllProduct.enterPurchasePrice")}
                                    className="form-control"
                                />
                            </div>
                            <div className=''>
                                <InputLabel
                                // className="requiredstar"
                                >
                                    {t("AllProduct.purchaseDate")}
                                </InputLabel >
                                <DatePicker
                                    className="form-control"
                                    minDate={new Date()}
                                    selected={date}
                                    dateFormat="d/MM/yyyy"
                                    onChange={(date) => {
                                        DatePickerHandler(date);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <InputLabel>
                                {t("AllProduct.notes")}
                            </InputLabel >
                            <TextField
                                type="text"
                                size="small"
                                name="quantity"
                                value={notes}
                                onChange={handleNotes}
                                placeholder={t("AllProduct.enterNotes")}
                                className="form-control"
                            />
                        </div>
                        <Button
                            className="btn btn-primary mt-4"
                            variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                            }}
                            onClick={() => addInventoryHandler()}
                        >
                            {props?.isEdit ? t("AllProduct.update") : t("AllProduct.add")}
                        </Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default AddQuantityOfProductModal;
