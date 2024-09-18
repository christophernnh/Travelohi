import { useState } from "react";
import "./locationrec.css";
import CheckerHotels from "./CheckerHotels";
import CheckerFlights from "./CheckerFlights";
// import HotelRecommendations from "./HotelRecommendations";
// import FlightRecommendations from "./FlightRecommendations";

const LocationRecommendation = ({theme, hotels, flights}) => {
  const [activeTab, setActiveTab] = useState<string>("Hotels");
  return (
    <div className={`recommendationscontainer ${theme}`}>
      <h1>Travel Recommendations</h1>
      <div className="recommendationstabcontainer">
        <div
          className={`recommendationstab ${
            activeTab === "Hotels" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Hotels")}
        >
          Hotels
        </div>
        <div
          className={`recommendationstab ${
            activeTab === "Flights" ? "active" : ""
          }`}
          onClick={() => setActiveTab("Flights")}
        >
          Flights
        </div>
      </div>
      {activeTab === "Hotels" ? (
        <CheckerHotels hotels={hotels} />
        // <HotelRecommendations />
      ) : (
        <CheckerFlights flights={flights}/>
        
      )}
    </div>
  );
};

export default LocationRecommendation;
