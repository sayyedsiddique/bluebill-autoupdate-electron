import React from 'react'
import { BiSearch } from "react-icons/bi";
import '../../../StyleSheet/SearchBar.css'
const SearchBar = (props) => {
  return (
    <div className="searchContainer">
         <input className='searchbox' type="search" placeholder="Search Here">{props.children}</input>
         <BiSearch className="searchIcon"/>
    </div>
  )
}

export default SearchBar;