import React from "react";
import { CUSTOM_DROPDOWN_STYLE } from "../utils/CustomeStyles";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const LanguageOption = (props) => {
  const { defaultLang, selectHandler, selectArr } = props;
  const { t } = useTranslation();

  const langOption = [
    { name: t("SideNav.english") },
    { name: t("SideNav.arabic") },
    { name: t("SideNav.marathi") },
    { name: t("SideNav.hindi") },
  ];


  return (
    // <div>
    //   <select  value={props?.defaultLang} name="" id="" onChange={(e) => props.onChange(e)}>
    //     <option >Select Language</option>
    //     <option value="en">English</option>
    //     <option value="ar">Arabic</option>
    //   </select>
    // </div>

    <div>
      <Select
        placeholder={<div className="select-tax">{t("SideNav.selectLanguage")}</div>}
        // placeholder="Select tax"
        // noOptionsMessage={() => "Not found"}
        getOptionLabel={(langOption) => langOption?.name}
        options={langOption}
        styles={CUSTOM_DROPDOWN_STYLE}
        value={defaultLang}
        onChange={(e) => selectHandler(e)}
        isClearable
      />
    </div>
  );
};

export default LanguageOption;
