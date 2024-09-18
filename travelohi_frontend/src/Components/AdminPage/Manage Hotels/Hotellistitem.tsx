import { IoIosArrowForward } from "react-icons/io"
import "./hotellist.css"

const Hotellistitem = ({hotel, selectedHotel, setSelectedHotel}) => {
  return (
    <div
      className={`hotellistitem ${hotel === selectedHotel ? "active" : ""}`}
      onClick={() => setSelectedHotel(hotel)}
    >
      <div className="promolistitemright">
        {/* <img
          src={
            promo.profilepicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt="Profile"
        /> */}
        <span>
          {hotel.name}, {hotel.city}
        </span>
      </div>
      <div className="hoteliconcontainer">
        <IoIosArrowForward />
      </div>
    </div>
  )
}

export default Hotellistitem
