import React, { useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import "./Slider.css";
import { useEffect } from "react";

const Slider = (sliderItems) => {
  const [slideIndex, setSlideIndex] = useState(0);
  // const [titleColor, setTitleColor] = useState("black");

  const [direct, setDirect] = useState("");

  const [show, setShow] = useState(false);

  const ref = useRef(0);

  const titleRef = useRef(0);

  useEffect(() => {
    ref.current.style.transform = `translateX(${-slideIndex * 80}vw)`;
  }, [slideIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleClick("right");
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (direction) => {
    setDirect(direction);
    setShow(true);

    direction === "left"
      ? setSlideIndex((slideIndex) =>
          slideIndex === 0 ? sliderItems.items.length - 1 : slideIndex - 1
        )
      : setSlideIndex((slideIndex) =>
          slideIndex === sliderItems.items.length - 1 ? 0 : slideIndex + 1
        );
  };

  return (
    <div className="slider-container mx-7 transition-transform rounded-lg border-2 border-black">
      <div className="arrow arrow-left">
        <KeyboardArrowLeftOutlinedIcon onClick={() => handleClick("left")} />
      </div>
      <div className="slide-wrapper " ref={ref}>
        {sliderItems.items.map((slide, i) => (
          <div className="slide" key={"slide-" + slide.key}>
            <div className="imgContainer">
              <img
                loading={i === 0 ? "eager" : "lazy"}
                src={slide.img}
                fetchpriority="high"
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
      <div className="arrow arrow-right">
        <KeyboardArrowRightOutlinedIcon onClick={() => handleClick("right")} />
      </div>
    </div>
  );
};

export default Slider;
