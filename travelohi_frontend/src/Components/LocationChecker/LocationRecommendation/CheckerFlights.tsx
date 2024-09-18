import { BsStar, BsStarFill } from "react-icons/bs";
// import "./recommendations.css";
import { FaLocationDot, FaPlaneUp, FaRegClock } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const CheckerFlights = ({flights}) => {
  const navigate = useNavigate();

  return (
    <div className="recommendationsrow">
      {flights.map((flight) => {
        return (
          <div className="recommendation" key={flight.flightid}>
            <img
              className="flightrecommendationcardimg"
              src={flight.airlinelogo}
              alt={`Emblem of flight`}
            />
            <h2 className="flightrecommendationheadertext">{flight.flightid}</h2>
            <div className="recommendationtextcontainer">
              <p>
                <div>Departure: </div>
                <FaLocationDot className="locationpin" /> {flight.fromairportcode}, {" "}{flight.fromcity},{" "}
                {flight.fromcountry}
                <div><FaRegClock className="clockicon"/>{flight.departuretime}</div>
              </p>
              <div style={{paddingBlock: "10px"}}><FaPlaneUp /></div>
              <p>
                <div>Arrival: </div>
                <FaLocationDot className="locationpin" /> {flight.toairportcode}, {" "}{flight.tocity},{" "}
                {flight.tocountry}
                <div><FaRegClock className="clockicon"/>{flight.arrivaltime}</div>
              </p>

              {/* <p className="bottomspacer">
                <IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred Partner
              </p> */}
              <p
                className="learnmore"
                // onClick={() =>
                //   navigate(`/hoteldetail/${hotel.id}/${hotel.name}`)
                // }
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

export default CheckerFlights;
