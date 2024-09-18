import { useEffect, useState } from "react";
import { FaLocationDot, FaPlaneUp, FaRegClock } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./recommendations.css";

const FlightRecommendations = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(String);

  useEffect(() => {
    fetch("http://localhost:8000/api/getflights")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setFlights(data.flights);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching flights: " + error.message);
      });
  }, []);
  return (
    <div className="recommendationsrow">
      {flights.slice(0, 5).map((flight) => {
        return (
          <div className="recommendation" key={flight.flightid}>
            <img
              className="flightrecommendationcardimg"
              src={flight.airlinelogo}
              alt={`Emblem of flight`}
            />
            <h2 className="flightrecommendationheadertext">
              {flight.flightid}
            </h2>
            <div className="recommendationtextcontainer">
              <p>
                <div>Departure: </div>
                <FaLocationDot className="locationpin" />{" "}
                {flight.fromairportcode}, {flight.fromcity},{" "}
                {flight.fromcountry}
                <div>
                  <FaRegClock className="clockicon" />
                  {flight.departuretime}
                </div>
              </p>
              <div style={{ paddingBlock: "10px" }}>
                <FaPlaneUp />
              </div>
              <p>
                <div>Arrival: </div>
                <FaLocationDot className="locationpin" /> {flight.toairportcode}
                , {flight.tocity}, {flight.tocountry}
                <div>
                  <FaRegClock className="clockicon" />
                  {flight.arrivaltime}
                </div>
              </p>

              {/* <p className="bottomspacer">
                <IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred Partner
              </p> */}
              <p
                className="learnmore"
                onClick={() => navigate(`/flightdetail/${flight.flightid}`)}
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

export default FlightRecommendations;
