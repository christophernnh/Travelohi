import "./profile.css";
import { FaGear } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import {
  BiBell,
  BiBuildings,
  BiCoin,
  BiCreditCard,
  BiHistory,
  BiSolidDiscount,
} from "react-icons/bi";
import { SetStateAction, useEffect, useState } from "react";
import { RiPassPendingLine } from "react-icons/ri";
import MyAccount from "./My Account/MyAccount";
import { useNavigate } from "react-router-dom";
import CreditCard from "./Credit Card/CreditCard";

const Profile = ({theme}) => {
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        navigate("/login");
      }
    })();
  }, []);
  const renderContent = () => {
    switch (currentTab) {
      case "MyReservations":
        return <div>My Reservations Content</div>;
      case "History":
        return <div>History Content</div>;
      case "Promo":
        return <div>Promo Content</div>;
      case "Notifications":
        return <div>Notifications Content</div>;
      case "QuickPicks":
        return <div>Quick Picks Content</div>;
      case "CreditCard":
        return <CreditCard theme={theme}/>;
      case "MyPoints":
        return <div>My Points Content</div>;
      case "MyAccount":
        return <MyAccount theme={theme}/>;
      default:
        return null;
    }
  };

  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    window.location.reload();
    navigate("/login");
  };

  const [currentTab, setCurrentTab] = useState("MyAccount");

  const handleTabClick = (tab: SetStateAction<string>) => {
    setCurrentTab(tab);
  };

  return (
    <>
      {userData && (
        <div className={`profilepagecontainer ${theme}bg`}>
          <div className={`col`}>
            <div className={`profileleft ${theme}`}>
              {/* profilehead */}
              <div className={`profilehead ${theme}`}>
                <img src={userData.profilepicture} alt="Profile"></img>
                <div>
                  <h5>{userData.firstname}</h5>
                  <p>{userData.gender}</p>
                </div>
              </div>
              {/* profile group 1 */}
              <div className={`profilegroup ${theme}`}>
                <div
                  className={`profiletab ${
                    currentTab === "MyReservations" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("MyReservations")}
                >
                  <BiBuildings />
                  <a>My Reservations</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "History" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("History")}
                >
                  <BiHistory />
                  <a>History</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "Promo" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("Promo")}
                >
                  <BiSolidDiscount />
                  <a>Promo</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "Notifications" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("Notifications")}
                >
                  <BiBell />
                  <a>Notifications</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "QuickPicks" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("QuickPicks")}
                >
                  <RiPassPendingLine />
                  <a>Quick Picks</a>
                </div>
              </div>
              {/* profile group 2 */}
              <div className={`profilegroup ${theme}`}>
                <div
                  className={`profiletab ${
                    currentTab === "CreditCard" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("CreditCard")}
                >
                  <BiCreditCard />
                  <a>Credit Card</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "MyPoints" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("MyPoints")}
                >
                  <BiCoin />
                  <a>My Points</a>
                </div>
              </div>
              {/* profile group 3 */}
              <div className={`profilegroup ${theme}`}>
                <div
                  className={`profiletab ${
                    currentTab === "MyAccount" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={() => handleTabClick("MyAccount")}
                >
                  <FaGear />
                  <a>My Account</a>
                </div>
                <div
                  className={`profiletab ${
                    currentTab === "Logout" ? `active ${theme}` : `${theme}`
                  }`}
                  onClick={logout}
                >
                  <FiLogOut />
                  <a>Logout</a>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className={`profileright ${theme}`}>{renderContent()}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
