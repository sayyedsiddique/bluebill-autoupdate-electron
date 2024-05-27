import React, { useEffect, useState } from 'react';
import "./PlanPostercart.css";
import posteImage from '../../../assets/images/PlanPosterCart.jpg';
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const PlanPostercart = ({ signUpHandler }) => {
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setModalOpen(true);
        }, 10000); // 10 seconds

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div>
            <Modal size="lg" isOpen={modalOpen} fade={false} toggle={() => setModalOpen(!modalOpen)}
                className="modal-dialog-centered modal-lg"
                style={{
                    maxWidth: '600px',
                    width: '90vw',
                }}
            >
                <ModalHeader
                    toggle={() => setModalOpen(!modalOpen)}
                    className="popup-modal"
                    style={{
                        borderBottom: "none",
                        paddingBottom: "0px",
                        paddingTop: "0px"
                    }}
                    close={
                        <button
                            className="close"
                            style={{
                                position: "absolute",
                                top: "5px",
                                right: "15px",
                                zIndex: "1",
                                fontSize: "30px",
                                color: "#b1afaf",
                                border: "none",
                                backgroundColor: "white"
                            }}
                            onClick={() => setModalOpen(!modalOpen)}
                        >
                            &times;
                        </button>
                    }
                >
                </ModalHeader>
                <ModalBody style={{ padding: "0.5rem" }}>
                    <img src={posteImage} alt=''
                        style={{ width: '100%', height: 'auto', maxHeight: '80vh', cursor: "pointer" }}
                        onClick={signUpHandler}

                    />
                </ModalBody>

            </Modal>
        </div>
    );
}

export default PlanPostercart;
