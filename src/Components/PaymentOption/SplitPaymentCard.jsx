import { Button, TextField } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const SplitPaymentCard = ({
  cardIndex,
  paymentMethod,
  amount,
  closeHandler,
  splitPaymentCardInputHandler,
  splitAmountTotalPrice,
  remainingTotalAmount,
  inputError,
}) => {
  const { t } = useTranslation();
  console.log("inputError... ", inputError);
  return (
    <div className="d-flex mb-3 justify-content-between" key={cardIndex}>
      <h5>{paymentMethod}</h5>
      <div className="w-50">
        <TextField
          style={{ backgroundColor: "var(--white-color)" }}
          // label="Size"
          // placeholder={t("AddNewProduct.stockLevelAlert")}
          id="outlined-size-small"
          size="small"
          type="number"
          name={cardIndex}
          value={amount && parseFloat(amount)}
          inputProps={{ maxLength: 4 }}
          onChange={splitPaymentCardInputHandler}
        />
        {inputError && <span className="text-danger">{inputError}</span>}
      </div>

      <div className="">
        <Button
          variant="contained"
          style={{
            background: "var(--second-red-color)",
            color: "var(--white-color)",
          }}
          onClick={() => closeHandler()}
        >
          {t("X")}
        </Button>
      </div>
    </div>
  );
};

export default SplitPaymentCard;
