import { useEffect, useRef, useState } from "react";
import "./Carousel.css";
import image1 from "/web-assets/carousel/carousel1.png";
import image2 from "/web-assets/carousel/carousel2.png";
import image3 from "/web-assets/carousel/carousel3.png";
import image4 from "/web-assets/carousel/carousel4.png";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Carousel = ({ theme }) => {
  const carouselRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [promos, setPromos] = useState<any>(null);

  const prev = () => {
    const maxScrollPosition =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

    const newScrollPosition = scrollPosition - carouselRef.current.clientWidth;

    if (newScrollPosition >= 0) {
      setScrollPosition(newScrollPosition);
      carouselRef.current.scrollLeft = newScrollPosition;
    } else {
      setScrollPosition(maxScrollPosition);
      carouselRef.current.scrollLeft = maxScrollPosition;
    }
  };

  const next = () => {
    const maxScrollPosition =
      carouselRef.current.scrollWidth - carouselRef.current.clientWidth;

    const newScrollPosition = scrollPosition + carouselRef.current.clientWidth;

    if (newScrollPosition <= maxScrollPosition) {
      setScrollPosition(newScrollPosition);
      carouselRef.current.scrollLeft = newScrollPosition;
    } else {
      setScrollPosition(0);
      carouselRef.current.scrollLeft = 0;
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/getpromos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setPromos(data.promos);
        }
      })
      .catch((error) => {
        console.log("Error fetching promos: " + error.message);
      });

    const intervalId = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [scrollPosition]);

  return (
    <div>
      <div className={`carouselwrap ${theme}`}>
        <button className="carouselbutton prev" onClick={prev}>
          <MdKeyboardArrowLeft />
        </button>
        <div className="carousel" ref={carouselRef}>
          <div>
            {promos?.slice(0, 3).map((promo, promoIndex) => (
              <span key={promoIndex}>
                <img src={promo.image} alt={`carousel-img-${promoIndex}`} />
                <h2>USE CODE: {promo.promocode}</h2>
              </span>
            ))}
          </div>
          <div>
          {promos?.slice(1, 4).map((promo, promoIndex) => (
              <span key={promoIndex}>
                <img src={promo.image} alt={`carousel-img-${promoIndex}`} />
                <h2>USE CODE: {promo.promocode}</h2>
              </span>
            ))}
          </div>
          <div>
          {promos?.slice(1, 4).map((promo, promoIndex) => (
              <span key={promoIndex}>
                <img src={promo.image} alt={`carousel-img-${promoIndex}`} />
                <h2>USE CODE: {promo.promocode}</h2>
              </span>
            ))}
          </div>
        </div>
        <button className="carouselbutton next" onClick={next}>
          <MdKeyboardArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
