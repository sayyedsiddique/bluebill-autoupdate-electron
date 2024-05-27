import { makeStyles } from "@mui/styles";

export const CUSTOM_DROPDOWN_STYLE = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "black" : "black",
    background:state.isSelected ? 0 : 0,

  }),
  control: (base, state) => ({
    ...base,
    cursor: 'pointer',
    border: "2px solid #dee2e6!important",
    // borderRadius: "0.7rem",
    padding: "0.1rem",
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: state.isFocused ? 0 : 0,
    },
  }),
};

export const useStyles = makeStyles({
  input: {
    "&:focus": {
      outline: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderWidth: "1px",
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
  },
  inputWBack: {
    backgroundColor: "var(--white-02)",
    borderRadius: "5px",
    "& input::placeholder": {
      fontSize: "15px"
    },
    width: "100%"
  },
});


export const switchStyles = {
  "& .MuiSwitch-switchBase.Mui-checked ": {
    color: "var(--main-bg-color)",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "var(--main-bg-color)",
  },
};
