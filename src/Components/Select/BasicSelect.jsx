import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect(props) {
  console.log("select props", props);
  const {selectArray, setSelectValue, selectValue, defaultValue} = props

  const selectHandler = (event) => {

    setSelectValue(event.target.value)
  };

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth>
        <Select
          value={selectValue}
          onChange={selectHandler}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">
            <em>{defaultValue}</em>
          </MenuItem>
          {selectArray && selectArray.map((item) => {

          return <MenuItem value={item.value}>{item.value}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
