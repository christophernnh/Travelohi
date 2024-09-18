import { SyntheticEvent, useEffect, useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const CreditCard = ({theme}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  const [id, setId] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [expMonth, setExpMonth] = useState<string>("");
  const [expYear, setExpYear] = useState<string>("");

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
        setCardNumber(data.cardnumber);
        setCvv(data.cvv);
        setExpMonth(data.expiremonth);
        setExpYear(data.expireyear);
      } else {
        navigate("/login");
      }
    })();
  }, [navigate]);

  const handleSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/updatecredit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(id),
          cardNumber,
          expMonth,
          expYear,
          cvv,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message)
        console.log("Profile updated successfully:", data);
      } else {
        alert(data.message)
        console.error(
          "Failed to update profile:",
          response.status,
          response.statusText
        );
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
            <div className="small">
              Card Number
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="row1">
            <div className="small">
              Exp. Month
              <input
                placeholder="MM"
                type="text"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
              />
            </div>
            <div className="small">
              Exp. Year
              <input
                placeholder="YY"
                type="text"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
              />
            </div>
            <div className="small">
              CVV
              <input
                placeholder="123"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
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

export default CreditCard;
