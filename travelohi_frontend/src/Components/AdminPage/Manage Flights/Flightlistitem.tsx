import { IoIosArrowForward } from "react-icons/io";

const Flightlistitem = ({ key, flight, selectedFlight, setSelectedFlight }) => {
  return (
    <div>
      <div
        className={`hotellistitem ${flight === selectedFlight ? "active" : ""}`}
        onClick={() => setSelectedFlight(flight)}
      >
        <div className="promolistitemright">
          <span>
            {flight.flightid}
          </span>
        </div>
        <div className="hoteliconcontainer">
          <IoIosArrowForward />
        </div>
      </div>
    </div>
  );
};

export default Flightlistitem;
