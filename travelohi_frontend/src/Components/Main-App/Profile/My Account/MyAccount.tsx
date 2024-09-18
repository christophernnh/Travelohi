import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myaccount.css";
// import { BiEdit } from "react-icons/bi";

const MyAccount = ({theme}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  // Form usestates
  const [id, setId] = useState<number>();
  const [firstname, setFirstName] = useState<string>("");
  const [lastname, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("Male");
  const [issubscribed, setisSubscribed] = useState<boolean>(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [base64, setBase64] = useState<string>("");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setId(data.id);
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setEmail(data.email);
        setBirthDate(new Date(data.birthDate));
        setGender(data.gender);
        setisSubscribed(data.issubscribed);
        setProfilePicture(data.profilepicture);
      } else {
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setBase64(base64String);

          setProfilePicture(base64String);

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

  const handleSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/updateprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(id),
          firstname,
          lastname,
          email,
          birthDate,
          gender,
          issubscribed: String(issubscribed),
          profilePicture,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        console.log("Profile updated successfully:", data);
      } else {
        alert(data.message);
      }
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <>
      {userData && (
        <div className={`accountcontainer ${theme}`}>
          <div className="row1">
            <img src={profilePicture} alt="profile"></img>
          </div>
          <div className="row1">
            <div className="center">
              <input
                id="fileinput"
                className="fileinput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={() => document.getElementById("fileinput")?.click()}
                className="buttonStyle"
              >
                Choose Profile Picture
              </button>
            </div>
          </div>
          <div className="row1">
            <div className="small">
              First name
              <input
                placeholder="ex: John"
                type="text"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="small">
              Last name
              <input
                placeholder="ex: Doe"
                type="text"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="small">
              Birthday
              <input
                type="date"
                value={birthDate?.toISOString().split("T")[0] || ""}
                onChange={(e) => setBirthDate(new Date(e.target.value))}
              />
            </div>
          </div>
          <div className="row1">
            <div className="small">Gender</div>
          </div>
          <div className="radiocontainer">
            <input
              className="radiobutton"
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
            />
            Male
            <input
              className="radiobutton"
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
            />
            Female
          </div>
          <div className="row1">
            <div className="small">
              Email
              <input
                type="text"
                placeholder="ex: johndoe@travelohi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="row1 alignleft">
            <input
              type="checkbox"
              checked={issubscribed}
              onChange={() => setisSubscribed(!issubscribed)}
            />
            Subscribe to our newsletter
          </div>
          <div className="row1">
            <button onClick={handleSave}>
              {isSaving ? "Saving. . ." : "Save"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyAccount;
