import React, { useRef } from 'react';
import "./CategoryList.css";
import defaultImage from '../../../assets/images/default-image.png'

const CategoryList = ({ productCategorydata, CategoryhandleClick, selectedCategory }) => {
  const listRef = useRef(null);
  console.log("selectedCategory",selectedCategory);

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollLeft -= 100; // Adjust scroll distance as needed
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollLeft += 100; // Adjust scroll distance as needed
    }
  };

  return (
    <div className="category-list-main">
      <div className="category-list-scroll-container ">

        <div className="category-list-container d-flex">
          <button className="scroll-button" onClick={scrollLeft}>&lt;</button>
          <ul ref={listRef} className="category-list" style={{ marginBottom: "0rem" }}>
            <li
              className={`category-card ${selectedCategory === "All" ? "active" : ""}`}
              onClick={() => CategoryhandleClick("All")}
            >
              <div className="category-list-card">
                <p style={{ fontSize: "14px" }}>All Categories</p>
              </div>
            </li>
            {productCategorydata &&
              productCategorydata.map((item, index) => (
                <li key={index}
                  className={`category-card ${selectedCategory === item.categoryId ? "active" : ""}`}
                  onClick={() => CategoryhandleClick(item.categoryId)}
                >
                  <div className="category-list-card">
                    <img
                      src={item?.imageUrl ? item?.imageUrl : defaultImage}
                      alt=""
                      width="50"
                      height="50"
                      className="cursor-pointer"
                      style={{ borderRadius: "10px", }}
                    />
                    <p style={{ textAlign: "center", fontSize: "14px"}}>{item?.categoryName}</p>
                  </div>
                </li>
              ))}
          </ul>
          <button className="scroll-button" onClick={scrollRight}>&gt;</button>
        </div>

      </div>
    </div>
  );
};

export default CategoryList;
