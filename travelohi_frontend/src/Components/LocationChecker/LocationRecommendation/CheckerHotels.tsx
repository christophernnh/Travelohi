import { BsStar, BsStarFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const CheckerHotels = ({ hotels }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(String);

  const RatingStars = ({ rating }: { rating: number }) => {
    const totalStars = 5;

    return (
      <>
        {Array.from({ length: totalStars }, (_, index) =>
          index < rating ? (
            <BsStarFill key={index} className="star" />
          ) : (
            <BsStar key={index} className="star" />
          )
        )}
      </>
    );
  };
  return (
    <div className="recommendationsrow">
      {hotels.map((hotel) => {
        console.log(hotel.images);
        const imagesArray = JSON.parse(hotel.images);

        return (
          <div className="recommendation" key={hotel.id}>
            <img
              className="recommendationcardimg"
              src={imagesArray[0]}
              alt={`Image of ${hotel.name}`}
            />
            <div className="recommendationtextcontainer">
              <h2 className="recommendationheadertext">{hotel.name}</h2>
              <p>
                <FaLocationDot className="locationpin" /> {hotel.city},{" "}
                {hotel.country}
              </p>
              <RatingStars rating={hotel.rating} />
              <p className="bottomspacer">
                <IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred Partner
              </p>
              <p
                className="learnmore"
                onClick={() =>
                  navigate(`/hoteldetail/${hotel.id}/${hotel.name}`)
                }
              >
                Learn more &nbsp;
                <IoIosArrowForward />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckerHotels;
