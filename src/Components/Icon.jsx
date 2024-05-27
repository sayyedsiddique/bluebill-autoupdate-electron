import React from 'react'
import {  RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit} from "react-icons/ci";
import '../Pages/Products/ProductsPage.css';



const Icon = () => {

  return (
    <>
      <CiEdit className="icon-mar"/>
      <RiDeleteBin5Line className="icon-mar"/>
    </>
  );
}

export default Icon;

