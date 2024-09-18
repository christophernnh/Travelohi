import { useNavigate, useParams } from "react-router-dom";
import "./FlightDetail.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { IoAirplaneSharp } from "react-icons/io5";

const FlightDetail = () => {
  const { flightid } = useParams();
  const [flight, setFlight] = useState<any>();
  const [seats, setSeats] = useState<any>();
  const [isSeatsPopupOpen, setIsSeatsPopupOpen] = useState(false);

  const [selectedSeat, setSelectedSeat] = useState<any>(null);

  const [seatLength, setSeatLength] = useState<number>(0);

  const fetchFlightDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/getflightdetail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ flightid }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flight details");
      }

      const data = await response.json();
      setFlight(data.flight);

      console.log(data.flight);
      // get seats
      try {
        const response = await fetch(`http://localhost:8000/api/getseats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ flightid }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }

        const data = await response.json();
        setSeats(data.seats);
        setSeatLength(data.seats.length);

        // console.log(data.seats);
      } catch (error) {
        // console.error("Error fetching flight details:", data.message);
      }
    } catch (error) {
      // console.error("Error fetching flight details:", data.message);
    }
  };

  useEffect(() => {
    fetchFlightDetails();
  }, [flightid]);

  const calculateFlightDuration = () => {
    const departureTime = new Date(flight.departuretime);
    const arrivalTime = new Date(flight.arrivaltime);

    const durationInMinutes = (arrivalTime - departureTime) / (1000 * 60);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = Math.round(durationInMinutes % 60);

    return `${hours}h ${minutes}m`;
  };

  const handleOpenSeatsPopup = () => {
    setIsSeatsPopupOpen(true);
    getuser();
  };

  const handleCloseSeatsPopup = () => {
    setIsSeatsPopupOpen(false);
    setSelectedSeat(null);
    setLuggage("");
  };

  const [uid, setUid] = useState("");
  const [luggage, setLuggage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const navigate = useNavigate();

  const addToCart = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/addflighttocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid.toString(),
          flightid,
          seatid: selectedSeat,
          luggage,
        }),
      });

      if (response.ok) {
        handleCloseSeatsPopup();
        alert("Successfully added to cart.");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 500);
    }
  };
  const getuser = async () => {
    const response = await fetch("http://localhost:8000/api/user", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      setUid(data.id);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {flight ? (
        <div>
          <div className="flightdetailtop">
            <div className="flightdetailtopcol">
              <div className="flightdetailtopcolheader">
                <img
                  src={flight.airlinelogo}
                  alt="Airline Logo"
                  className="flightdetailtopcolimg"
                />
                <div>
                  {flight.flightid} - {flight.airlinename}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="flightfromtocol">
                  <div>
                    {flight.fromairportcode} - {flight.fromcity}
                  </div>
                  <div style={{ fontSize: "25px", fontWeight: "500" }}>
                    {new Date(flight.departuretime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>{new Date(flight.departuretime).toDateString()}</div>
                </div>
                <div className="flightfromtocol">
                  <div>
                    {flight.istransit === true ? "Non-Direct" : "Direct"}
                  </div>
                  <div>
                    <IoAirplaneSharp />
                  </div>
                  <div>{calculateFlightDuration()}</div>
                </div>
                <div className="flightfromtocol">
                  <div>
                    {flight.toairportcode} - {flight.tocity}
                  </div>
                  <div style={{ fontSize: "25px", fontWeight: "500" }}>
                    {new Date(flight.arrivaltime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div>{new Date(flight.arrivaltime).toDateString()}</div>
                </div>
              </div>
            </div>
            <div className="flightdetailtopcol">
              <div style={{ marginTop: "40px", color: "orange" }}>
                <h2>$359.99</h2>
              </div>
              Per Pax
            </div>
            <div className="flightdetailtopcol">
              <div style={{ marginTop: "40px", color: "orange" }}>
                <h2>{seatLength}</h2>
              </div>
              Seats
            </div>
          </div>
          {seats && isSeatsPopupOpen ? (
            <>
              <div className="seatsblur" onClick={handleCloseSeatsPopup}></div>
              <div className="seatspopupcontainer">
                <div>
                  <h2>Seats</h2>
                  <div className="seat-grid">
                    {seats.map((seat: any) => (
                      <div
                        key={seat.seatid}
                        className={`seat-item ${
                          seat.passengerid
                            ? "occupied"
                            : selectedSeat === seat.seatid
                            ? "selected"
                            : "available"
                        }`}
                        onClick={() => {
                          setSelectedSeat(seat.seatid);
                          setLuggage("");
                        }}
                      >
                        {seat.seatid}
                      </div>
                    ))}
                  </div>
                  <div className="closeseatbtn" onClick={handleCloseSeatsPopup}>
                    Close
                  </div>
                </div>
                {selectedSeat ? (
                  <div className="addpassengerdetail">
                    <h3>{flight.flightid}</h3>
                    <img
                      src={flight.airlinelogo}
                      alt="Airline Logo"
                      className="flightdetailtopcolimg"
                    />

                    <mark>{selectedSeat}</mark>
                    <div style={{ marginTop: "30px" }}>
                      <p>Luggage (kg)</p>
                    </div>
                    <input
                      placeholder="eg. 10"
                      value={luggage}
                      onChange={(e) => {
                        setLuggage(e.target.value);
                      }}
                    ></input>
                    <p>Total: $359.99</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                      }}
                    >
                      <div className="closeseatbtn" onClick={(e) => addToCart(e)}>Add to cart</div>
                      <div className="closeseatbtn">Checkout</div>
                    </div>
                  </div>
                ) : (
                  <div className="addpassengerdetail">
                    <h3>Please Select a seat.</h3>
                  </div>
                )}
              </div>
            </>
          ) : null}
          <div>
            <div className="orderticketbtn" onClick={handleOpenSeatsPopup}>
              Order Ticket
            </div>
          </div>
        </div>
      ) : (
        <p>Loading flight details...</p>
      )}
    </>
  );
};

export default FlightDetail;
