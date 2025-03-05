import React from "react";
import "./Footer.css";
import logo from "../images/IIT_Ropar_logo.png";
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <footer className="flex flex-col font-['Dosis'] pt-[2rem] w-full  bg-slate-700  text-gray-200 bottom-0">
      <div className="flex justify-around px-32 ">
        <div className=" flex flex-col gap-4 items-center text-md">
          {/* <h4>About Us</h4> */}
          <img src={logo} className="h-20 flex m-auto"></img>
          <p className="text-center">
            Indian Institute of Technology<br/> Ropar, Rupnagar - 140001,<br/>Punjab, Bharat
          </p>
          <div className="flex gap-4">
            <div className="border rounded-full p-2 px-3 hover:bg-[rgba(255,255,255,0.1)]  cursor-pointer">
              <TwitterIcon className="" fontSize=""/>
            </div>
            <div className="border rounded-full p-2 px-3 hover:bg-[rgba(255,255,255,0.1)]  cursor-pointer">
              <FacebookIcon fontSize="" />
            </div>
            <div className="border rounded-full p-2 hover:bg-[rgba(255,255,255,0.1)]  cursor-pointer">
              <LinkedInIcon />
            </div>
          </div>
        </div>
        <div className="border-gray-500 border-[0.1px] "></div>
        <div className="footer-section quick-links text-md">
          <h4 className="mb-2 text-lg">Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="https://www.iitrpr.ac.in/" target="_blank" rel="noreferrer">About Us</a>
            </li>
            <li>
              <a href="/">Gallery</a>
            </li>
            <li>
              <a href="contact">Contact Us</a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact-info text-md">
          <h4 className="mb-2 text-lg">Contact Info</h4>
          <p>
            <strong>Email:</strong> contact@yourguesthouse.com
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
          <p>
            <strong>Address:</strong> 123 Street, City, Country
          </p>
        </div>
      </div>

      <div className=" flex mt-5 justify-center bg-gray-600">
        <div className="px-2 pt-4 pb-4 text-sm ">© 2024 Indian Institute of Technology Ropar, Rupnagar - 140001, INDIA</div>
      </div>
    </footer>
  );
};

export default Footer;
