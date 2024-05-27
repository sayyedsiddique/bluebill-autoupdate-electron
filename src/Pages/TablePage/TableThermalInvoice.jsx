import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import ThermalSmallInvoice from '../../Components/Invoice/ThermalSmallInvoice';
import Button from "@mui/material/Button";
import { BsFillPrinterFill } from 'react-icons/bs';
import ReactToPrint from 'react-to-print';
import jsPDF from "jspdf";
import ShareInvoiceOnSocialMedia from './ShareInvoiceOnSocialMedia/ShareInvoiceOnSocialMedia';


const TableThermalInvoice = ({
    showConfirmModal,
    selectedTable,
    totalPriceDetails,
    backToTableHandler,
    handleCloseModal,
    selectedProductList,
    saveTransDetails

}) => {

    const { t } = useTranslation();
    const componentRef = useRef();
    const [shareModalOpen, setShareModalOpen] = useState(false);

    const openShareModal = () => {
        setShareModalOpen(true);
    };

    const closeShareModal = () => {
        setShareModalOpen(false);
    };

console.log("selectedProductList0010",selectedProductList);
    return (
        <div>

            <Modal isOpen={showConfirmModal} toggle={handleCloseModal}>
                <ModalHeader>
                    <p>{t("Tables.receiptPreview")}</p>{" "}
                </ModalHeader>
                <ModalBody>

                    <ThermalSmallInvoice
                        tableOrderDetailsvalue={selectedTable}
                        totalPriceDetails={totalPriceDetails}
                        selectedProductList={selectedProductList}
                        saveTransDetails={saveTransDetails}
                        ref={componentRef}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button sx={{ textTransform: "none" }}
                        style={{
                            backgroundColor: "var(--white-color)",
                            color: "var(--main-bg-color)",
                            border: " 2px solid  var(--main-bg-color)",
                        }}
                        onClick={backToTableHandler}>
                        {t("Tables.backToTable")}
                    </Button>
                    {/* <Button variant="contained" onClick={handleCloseModal}>
                        {t("Tables.cancel")}
                    </Button> */}

                    <div>
                        <Button
                            style={{
                                marginLeft: '10px',
                                backgroundColor: 'var(--main-bg-color)',
                            }}
                            variant="contained"
                            onClick={openShareModal}
                        >
                            {t('Tables.shareReceipt')}
                        </Button>

                    </div>

                    <ReactToPrint
                        trigger={() => (
                            <Button
                                style={{
                                    marginLeft: "10px",
                                    backgroundColor: "var(--main-bg-color)"
                                }}
                                variant="contained"
                            >
                                <BsFillPrinterFill
                                    size={15}
                                    style={{
                                        margin: 5,
                                    }}
                                />
                                {t("Tables.print")}
                            </Button>
                        )}
                        content={() => {
                            const content = componentRef.current;
                            // console.log("Content to print:", content);
                            return content;
                        }}
                        pageStyle="print"
                        documentTitle="Invoice Details"
                        bodyClass="printer"
                        onAfterPrint={() => console.log("document printed!")}
                    />

                </ModalFooter>
            </Modal>

            <ShareInvoiceOnSocialMedia
                isOpen={shareModalOpen}
                onClose={closeShareModal} />

        </div>
    )
}

export default TableThermalInvoice
