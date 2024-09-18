import { useNavigate, useParams } from "react-router-dom";
import "./searchpage.css";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import { useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FaLocationDot, FaPlaneUp, FaRegClock } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

const SearchPage = () => {

  const [showFlights, setShowFlights] = useState<boolean>(true);
  const [showHotels, setShowHotels] = useState<boolean>(true);
  const navigate = useNavigate();
  const { query } = useParams();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsFlight, setSearchResultsFlight] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/searchhotelfiltered`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }

      const data = await response.json();
      setSearchResults(data.hotels);
    } catch (error) {
      console.log("error fetching results.");
    }
  };

  const fetchDataFlights = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/getflights");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.message === "success") {
        // Convert the query to lowercase for case-insensitive comparison
        const lowercaseQuery = query?.toLowerCase();

        // Filter flights based on the lowercase query
        const filteredFlights = data.flights.filter(
          (flight) =>
            flight.fromairportcode.toLowerCase().includes(lowercaseQuery) ||
            flight.toairportcode.toLowerCase().includes(lowercaseQuery) ||
            flight.fromcity.toLowerCase().includes(lowercaseQuery) ||
            flight.tocity.toLowerCase().includes(lowercaseQuery) ||
            flight.fromcountry.toLowerCase().includes(lowercaseQuery) ||
            flight.tocountry.toLowerCase().includes(lowercaseQuery)
        );

        setSearchResultsFlight(filteredFlights);
      } else {
        // setError(data.message);
      }
    } catch (error) {
      // setError("Error fetching flights: " + error.message);
    }
  };

  useEffect(() => {
    setSearchResults([]);
    setSearchResultsFlight([]);

    fetchData();
    fetchDataFlights();
  }, [query]);

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
    <div className="searchpagecontainer">
      <div className="searchheadercontainer">
        <h2>Displaying results for "{query}"</h2>
      </div>

      <div className="searchbodycontainer">
        <div className="searchpagecol">
          <h3>Filters</h3>
          <div className="filtercontainer">
            <div>
              <input
                type="checkbox"
                checked={showFlights}
                onChange={() => setShowFlights(!showFlights)}
              />
              Flights &nbsp;&nbsp;&nbsp;&nbsp;
              <input
                type="checkbox"
                checked={showHotels}
                onChange={() => setShowHotels(!showHotels)}
              />
              Hotels
            </div>
          </div>
          <div className="filtercontainer">
            <div className="filterheader"><h3>Flight Filters</h3></div>
            <div className="filterbody">
              <label>
                <input
                  type="checkbox"
                />
                Transit Flights
              </label>
            </div>
          </div>
        </div>
        <div className="searchpagecol">
          {searchResults[0] == "emptyinput" ? null : searchResults.length ===
            0 ? (
            <div></div>
          ) : (
            searchResults.map((hotel) => {
              console.log(hotel.images);
              const imagesArray = JSON.parse(hotel.images);

              return (
                <div className="searchcard" key={hotel.id}>
                  {imagesArray.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      className="searchcardimg"
                      src={image}
                      alt={`Image of ${hotel.name}`}
                    />
                  ))}
                  <div className="recommendationtextcontainer">
                    <h2 className="recommendationheadertext">{hotel.name}</h2>
                    <p>
                      <FaLocationDot className="locationpin" /> {hotel.city},{" "}
                      {hotel.country}
                    </p>
                    <RatingStars rating={hotel.rating} />
                    <p className="bottomspacer">
                      <IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred
                      Partner
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
            })
          )}
          {searchResultsFlight.map((flight) => {
            return (
              <div className="searchcard" key={flight.flightid}>
                <img
                  className="flightsearchimg"
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
                    <FaLocationDot className="locationpin" />{" "}
                    {flight.toairportcode}, {flight.tocity}, {flight.tocountry}
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
      </div>
    </div>
  );
};

export default SearchPage;
