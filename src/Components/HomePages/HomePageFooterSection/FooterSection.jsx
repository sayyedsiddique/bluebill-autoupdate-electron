import React from 'react'
import logoIcon from "../../../assets/images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import indianFlag from "../../../assets/images/india-flag-icon.png";

const FooterSection = () => {
    const history = useNavigate();
  return (
    <div>

<div className="container">
            <div className="footer_left_right_container d-flex">
              <div className="footer_rightside">
                <img src={logoIcon} alt="" />
              </div>
              <div className="footer_leftside">
                <ul>
                  <li>
                    <Link to={"/user"}>Business tools</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>BlueBill finder</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>BlueBill for PC</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>BlueBill delivery</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link to={"/user"}>Help center</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Blog</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Banned items</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Business tools</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link to={"/user"}>About</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Privacy</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Terms</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Contact</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>FAQ's</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link to={"/user"}>Jobs</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Branding</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Press inquery</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Bug bounty</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link to={"/user"}>Facebook</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Twitter</Link>
                  </li>
                  <li>
                    <Link to={"/user"}>Linkedin</Link>
                  </li>
                </ul>
              </div>
            </div>

            <hr />
            <footer className="bottom_footer_container d-flex justify-content-between align-items-center ps-4 pe-4">
              <p className="heading-pera">
                &copy; 2015-22 BlueBill Inc. All Rights Reserved.
              </p>
              <div className="indian_flag_container d-flex justify-content-between align-items-center">
                <p className="heading-pera pb-0">Made in </p>
                <img src={indianFlag} alt="" />
              </div>
            </footer>
          </div>
        
      
    </div>
  )
}

export default FooterSection
