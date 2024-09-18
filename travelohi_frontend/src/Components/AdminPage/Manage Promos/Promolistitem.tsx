import { IoIosArrowForward } from "react-icons/io";
import "./promolist.css"

const Promolistitem = ({promo, selectedPromo, setSelectedPromo}) => {
  return (
    <div
      className={`promolistitem ${promo === selectedPromo ? "active" : ""}`}
      onClick={() => setSelectedPromo(promo)}
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
          {promo.promocode}
        </span>
      </div>
      <div className="promoiconcontainer">
        {/* {p.isbanned ? <FaBan /> : ""}
        {user.issubscribed ? <MdOutlineSubscriptions /> : ""} */}
        <IoIosArrowForward />
      </div>
    </div>
  );
}

export default Promolistitem
