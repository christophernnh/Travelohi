import { useState } from "react";
import "./recommendations.css";
import HotelRecommendations from "./HotelRecommendations";
import FlightRecommendations from "./FlightRecommendations";

const Recommendations = ({theme}) => {
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
        <HotelRecommendations />
      ) : (
        <FlightRecommendations />
      )}
    </div>
  );
};

export default Recommendations;
