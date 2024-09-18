import { BiHotel, BiUser } from "react-icons/bi";
import "./admin.css";
import { SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import { BsAirplane } from "react-icons/bs";
import { RiCoupon3Line } from "react-icons/ri";
import Userlist from "./Manage Users/Userlist";
import Promolist from "./Manage Promos/Promolist";
import { useNavigate } from "react-router-dom";
import Hotellist from "./Manage Hotels/Hotellist";
import Flightlist from "./Manage Flights/Flightlist";
const Admin = () => {
  const [currentTab, setCurrentTab] = useState("Manage Users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const handleTabClick = (tab: SetStateAction<string>) => {
    setCurrentTab(tab);
    setSelectedUser(null);
    setSelectedPromo(null);
    setSelectedHotel(null);
    setSelectedFlight(null);
  };

  const navigate = useNavigate();

  //admin profile
  const [adminData, setAdminData] = useState<any>(null);

  //updating user
  const [issubscribed, setisSubscribed] = useState<boolean>();
  const [isBanned, setIsBanned] = useState<boolean>();
  const [userID, setUserID] = useState<string>("");

  //updating promos
  const [promoID, setPromoID] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number | null>();
  const [promoDescription, setPromoDescription] = useState<string>("");
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [promoImage, setPromoImage] = useState<string>("");
  const [promoType, setPromoType] = useState<string>("");

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/admin", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAdminData(data);
      } else {
        navigate("/home");
      }
    })();

    if (selectedUser) {
      setisSubscribed(selectedUser.issubscribed);
      setIsBanned(selectedUser.isbanned);
      setUserID(selectedUser.id);
    }

    if (selectedPromo) {
      setPromoID(selectedPromo.id);
      setPromoCode(selectedPromo.promocode);
      setDiscount(selectedPromo.discount);
      setPromoDescription(selectedPromo.description);
      setValidFrom(new Date(selectedPromo.validfrom));
      setValidUntil(new Date(selectedPromo.validuntil));
      setPromoImage(selectedPromo.image);
      setPromoType(selectedPromo.promotype);
    }
    // console.log(userID);
  }, [selectedUser, selectedPromo]);

  const updateUser = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/updateuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(userID),
          issubscribed: String(issubscribed),
          isbanned: String(isBanned),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User updated successfully:", data);
      } else {
        console.error(
          "Failed to update profile:",
          response.status,
          response.statusText
        );
      }
      setRefetch(true);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setRefetch(false);
      }, 1000);
    }
  };

  const updatePromo = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/updatepromo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(promoID),
          promocode: promoCode,
          discount: String(discount),
          promodescription: promoDescription,
          validfrom: validFrom,
          validuntil: validUntil,
          promoimage: promoImage,
          promotype: promoType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User updated successfully:", data);
      } else {
        console.error(
          "Failed to update profile:",
          response.status,
          response.statusText
        );
      }
      setRefetch(true);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setRefetch(false);
      }, 1000);
    }
  };

  const deletePromo = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await fetch("http://localhost:8000/api/deletepromo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(promoID),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("promo deleted successfully:", data);
      } else {
        console.error(
          "Failed to delete promo:",
          response.status,
          response.statusText
        );
      }
      setRefetch(true);
    } finally {
      setTimeout(() => {
        setIsDeleting(false);
        setRefetch(false);
      }, 1000);
    }
  };

  const submitPromoImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      processImageToBase64(file);
    }
  };

  const processImageToBase64 = (image: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const base64String = reader.result as string;

          setPromoImage(base64String);

          resolve();
        } catch (error) {
          console.error("Error while processing image:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };

      reader.readAsDataURL(image);
    });
  };

  const selectedContent = () => {
    if (selectedUser) {
      return (
        <div>
          <h2>User Details</h2>
          <img
            className="adminpage-userimg"
            src={selectedUser.profilepicture}
          ></img>
          <p>{`Email : ${selectedUser.email}`}</p>
          <p>{`Name : ${selectedUser.firstname} ${selectedUser.lastname}`}</p>
          <p>{`Birthday : ${selectedUser.birthDate}`}</p>
          <p>{`Gender : ${selectedUser.gender}`}</p>
          <div className="row1 alignleft">
            <input
              type="checkbox"
              checked={issubscribed}
              onChange={() => setisSubscribed(!issubscribed)}
            />
            Subscribed to newsletter
          </div>
          <div className="row1 alignleft">
            <input
              type="checkbox"
              checked={isBanned}
              onChange={() => setIsBanned(!isBanned)}
            />
            Is banned
          </div>
          <div className="row1">
            <button onClick={updateUser}>
              {isSaving ? "Saving. . ." : "Save"}
            </button>
          </div>
        </div>
      );
    } else if (selectedPromo) {
      return (
        <div>
          <h2>Promo Details</h2>
          <img className="promoimg" src={promoImage}></img>
          <input
            id="fileinput"
            className="fileinput"
            type="file"
            accept="image/*"
            onChange={submitPromoImage}
          />
          <button
            onClick={() => document.getElementById("fileinput")?.click()}
            className="choosePromoBtn"
          >
            Choose Promo Image
          </button>
          <div className="row1 alignleft">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            Promo Code
          </div>
          <div className="row1 alignleft">
            <input
              type="text"
              value={promoDescription}
              onChange={(e) => setPromoDescription(e.target.value)}
            />
            Description
          </div>
          <div className="row1 alignleft">
            <input
              type="date"
              value={validFrom?.toISOString().split("T")[0] || ""}
              onChange={(e) => setValidFrom(new Date(e.target.value))}
            />
            Valid From
          </div>
          <div className="row1 alignleft">
            <input
              type="date"
              value={validUntil?.toISOString().split("T")[0] || ""}
              onChange={(e) => setValidUntil(new Date(e.target.value))}
            />
            Valid Until
          </div>
          <div className="row1 alignleft">
            <input
              type="number"
              value={discount || ""}
              onChange={(e) =>
                setDiscount(
                  e.target.value !== "" ? parseInt(e.target.value, 10) : null
                )
              }
            />
            Discount(%)
          </div>
          <div className="row1 alignleft">
            <input
              type="text"
              value={promoType}
              onChange={(e) => setPromoType(e.target.value)}
            />
            Promo Type
          </div>
          <div className="row1">
            <button onClick={deletePromo}>
              {isDeleting ? "Deleting. . ." : "Delete"}
            </button>
            <button onClick={updatePromo}>
              {isSaving ? "Saving. . ." : "Save"}
            </button>
          </div>
        </div>
      );
    }
  };
  const renderContent = () => {
    switch (currentTab) {
      case "Manage Users":
        return (
          <Userlist
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            refetch={refetch}
          />
        );
      case "Manage Flights":
        return (
          <Flightlist
            refetch={refetch}
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
          />
        );
      case "Manage Promos":
        return (
          <Promolist
            selectedPromo={selectedPromo}
            setSelectedPromo={setSelectedPromo}
            refetch={refetch}
            setRefetch={setRefetch}
          />
        );
      case "Manage Hotels":
        return (
          <Hotellist
            selectedHotel={selectedHotel}
            setSelectedHotel={setSelectedHotel}
            refetech={refetch}
            setRefetch={setRefetch}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div className="adminpagecontainer">
      {/* left */}
      <div className="admincol">
        {/* profile head */}
        <div className="adminprofilehead">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt="Profile"
          ></img>
          {adminData ? (
            <div>
              <h5>{adminData.firstname}</h5>
              <p>{adminData.email}</p>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="adminleftgroup">
          <div
            className={`profiletab ${
              currentTab === "Manage Users" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Manage Users")}
          >
            <BiUser />
            <a>Manage Users</a>
          </div>
          <div
            className={`profiletab ${
              currentTab === "Manage Flights" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Manage Flights")}
          >
            <BsAirplane />
            <a>Manage Flights</a>
          </div>
          <div
            className={`profiletab ${
              currentTab === "Manage Hotels" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Manage Hotels")}
          >
            <BiHotel />
            <a>Manage Hotels</a>
          </div>
          <div
            className={`profiletab ${
              currentTab === "Manage Promos" ? "active" : ""
            }`}
            onClick={() => handleTabClick("Manage Promos")}
          >
            <RiCoupon3Line />
            <a>Manage Promos</a>
          </div>
        </div>
      </div>
      {/* middle */}
      <div className="admincol">{renderContent()}</div>
      {/* right */}
      <div className="admincol">{selectedContent()}</div>
    </div>
  );
};

export default Admin;
