import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cart from "./Cart/Cart";
import History from "./History/History";

const Transactions = () => {
  const [refetch, setRefetch] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("My Tickets");

  const [hotelTransactions, setHotelTransactions] = useState<any[]>([]);
  const [flightTransactions, setFlightTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!userResponse.ok) {
          navigate("/login");
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setUserData(userData);

        const hotelResponse = await fetch(
          "http://localhost:8000/api/gethoteltransactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userData.id.toString() }),
          }
        );

        if (!hotelResponse.ok) {
          throw new Error("Failed to fetch hotel details");
        }

        const hotelData = await hotelResponse.json();
        setHotelTransactions(hotelData.hoteltransactions);

        const flightResponse = await fetch(
          "http://localhost:8000/api/getflighttransactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userData.id.toString() }),
          }
        );

        if (!flightResponse.ok) {
          throw new Error("Failed to fetch flight transactions");
        }

        const flightData = await flightResponse.json();
        setFlightTransactions(flightData.flighttransactions);
      } catch (error) {}
    };

    fetchData();
  }, [navigate, activeTab, refetch]);

  return (
    <div>
      <div className={`recommendationscontainer`}>
        <h1>My Reservations</h1>
        <div className="recommendationstabcontainer">
          <div
            className={`recommendationstab ${
              activeTab === "History" ? "active" : ""
            }`}
            onClick={() => setActiveTab("History")}
          >
            History
          </div>
          <div
            className={`recommendationstab ${
              activeTab === "My Tickets" ? "active" : ""
            }`}
            onClick={() => setActiveTab("My Tickets")}
          >
            My Tickets
          </div>
          <div
            className={`recommendationstab ${
              activeTab === "Cart" ? "active" : ""
            }`}
            onClick={() => setActiveTab("Cart")}
          >
            Cart
          </div>
        </div>
        {activeTab === "History" || activeTab === "My Tickets" ? (
          <History
            hotelTransactions={hotelTransactions}
            activeTab={activeTab}
            flightTransactions={flightTransactions}
            uid={userData?.id}
          />
        ) : (
          <Cart
            flightTransactions={flightTransactions}
            hotelTransactions={hotelTransactions}
            setRefetch={setRefetch}
            uid={userData.id}
            email={userData.email}
          />
        )}
      </div>
    </div>
  );
};

export default Transactions;
