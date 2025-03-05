import React, { useEffect, useState } from "react";
import styles from "./Text.module.css";

const Text = () => {
  const [showHindi, setShowHindi] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHindi((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`pb-2 text-[calc(min(2.5vw,1.875rem))]`}>
      <a className='text-justify min-w-max font-medium font-["Dosis"]' href="/">
        <div className="flex flex-col py-1 h-9">
          <div className={!showHindi && "h-0 overflow-hidden"}>
            भारतीय प्रौद्योगिकी संस्थान रोपड़
          </div>
          <div className={showHindi && "h-0 overflow-hidden"}>
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </div>
        </div>
      </a>
    </div>
  );
};

export default Text;
