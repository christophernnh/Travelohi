import { BsStar, BsStarFill } from "react-icons/bs";
import "./recommendations.css";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const HotelRecommendations = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(String);

  useEffect(() => {
    fetch("http://localhost:8000/api/gethotels")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setHotels(data.hotels);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching hotels: " + error.message);
      });
  }, []);

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
      {hotels.slice(0, 5).map((hotel) => {
  
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
              <p className="bottomspacer"><IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred Partner</p>
              <p className="learnmore" onClick={() => navigate(`/hoteldetail/${hotel.id}/${hotel.name}`)}>
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

export default HotelRecommendations;
