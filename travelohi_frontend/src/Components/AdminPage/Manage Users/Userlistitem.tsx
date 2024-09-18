import { IoIosArrowForward } from "react-icons/io";
import "./userlist.css";
import { FaBan } from "react-icons/fa";
import { MdOutlineSubscriptions } from "react-icons/md";

const Userlistitem = ({ user, selectedUser, setSelectedUser }) => {
  return (
    <div
      className={`userlistitem ${user === selectedUser ? "active" : ""}`}
      onClick={() => setSelectedUser(user)}
    >
      <div className="userlistitemright">
        <img
          src={
            user.profilepicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          }
          alt="Profile"
        />
        <span>
          {user.firstname} {user.lastname}
        </span>
      </div>
      <div className="iconcontainer">
        {user.isbanned ? <FaBan /> : ""}
        {user.issubscribed ? <MdOutlineSubscriptions /> : ""}
        <IoIosArrowForward />
      </div>
    </div>
  );
};

export default Userlistitem;
