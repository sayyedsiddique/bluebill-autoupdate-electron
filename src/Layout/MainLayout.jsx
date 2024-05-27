import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import TopHeader from "../Pages/SideBarAndHeader/TopHeader/TopHeader";
import SideNav from "../Pages/SideBarAndHeader/SideNav/SideNav";

import "./MainLayout.css";
import { useSelector } from "react-redux";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import TrialNotification from "../Components/TrialNotification/TrialNotification";

const MainLayout = (props) => {
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.sync.isLoading);
  const [isAuth, setIsAuth] = useState(localStorage.getItem("loggedIn"));
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("loggedIn");
    user ? setIsAuth(true) : setIsAuth(false);
  }, [isAuth]);

  const isAddStorePage = location.pathname === "/storecreation"; //for hide topHeader & sideNav bar from store creation page
  const isLogoutOnly = isAddStorePage;

  return (
    <div>
      {isAuth ? (
        <>
          {/* {!isAddStorePage && (
            <TopHeader
              auth={props.auth.setAuthStatus}
              defaultLang={props?.defaultLang}
            />
          )} */}
          <TopHeader
            auth={props.auth.setAuthStatus}
            defaultLang={props?.defaultLang}
          />
          {/* <SideNav
            selectHandler={props?.selectHandler}
            defaultLang={props?.defaultLang}
          /> */}

          <SideNav
            selectHandler={props?.selectHandler}
            defaultLang={props?.defaultLang}
            isLogoutOnly={isLogoutOnly}
          />
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Outlet />
            </>
          )}
        </>
      ) : (
        // </div>
        <div>{navigate("/")}</div>
      )}
    </div>
  );
};

export default MainLayout;
