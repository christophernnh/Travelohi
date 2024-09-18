import { PiPlus } from "react-icons/pi";
import "./flightlist.css";
import { SyntheticEvent, useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { BiCircle } from "react-icons/bi";
import { IoAirplane } from "react-icons/io5";
import Flightlistitem from "./Flightlistitem";
const Flightlist = ({ refetch, selectedFlight, setSelectedFlight }) => {

  const[flights, setFlights] = useState<any[]>([]);

  const [addFlight, setAddFlight] = useState<boolean>(false);
  const toggleAddFlight = () => {
    setAddFlight(!addFlight);
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [airlineChoices, setAirlineChoices] = useState([]);
  const [airPlanes, setAirplanes] = useState([]);
  const [airports, setAirports] = useState([]);

  //insert flight usestates
  const [airlineID, setAirlineID] = useState<number>();
  const [airplaneID, setAirplaneID] = useState<number>();
  const [isTransit, setIsTransit] = useState<boolean>(false);
  const [source, setSource] = useState<number>();
  const [destination, setDestination] = useState<number>();
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);

  const [selectedAirline, setSelectedAirline] = useState<any>();
  const [selectedAirplane, setSelectedAirplane] = useState<any>();

  const [selectedFrom, setSelectedFrom] = useState<any>();
  const [selectedTo, setSelectedTo] = useState<any>();

  const createFlight = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/createflight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flightid: generateFlightID(),
          airlineid: String(airlineID),
          fromid: String(source),
          toid: String(destination),
          departuretime: departureDate,
          arrivaltime: arrivalDate,
          istransit: String(isTransit),
          airplaneid: String(airplaneID),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(true);
        alert("Flight created successfully");
      } else {
        alert(response.statusText);
        console.error(
          "Failed to create:",
          response.status,
          response.statusText
        );
      }
    } finally {
      setTimeout(() => {
        setLoading(false);

        setAirlineID(undefined);
        setAirplaneID(undefined);
        setIsTransit(false);
        setSource(undefined);
        setDestination(undefined);
        setDepartureDate(null);
        setArrivalDate(null);
        setSelectedAirline(undefined);
        setSelectedAirplane(undefined);
        setSelectedFrom(undefined);
        setSelectedTo(undefined);
        setAddFlight(!addFlight);
      }, 1000);
    }
  };

  const generateFlightID = () => {
    if (selectedFrom && selectedTo && departureDate) {
      const sourceCode = selectedFrom.code;
      const destinationCode = selectedTo.code;

      const randomPart = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");

      console.log(`${sourceCode}${destinationCode}${randomPart}`);
      return `${sourceCode}${destinationCode}${randomPart}`;
    } else {
      console.log("error generating flight ID.");
      return "";
    }
  };

  useEffect(() => {

    fetch("http://localhost:8000/api/getflights")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.message === "success") {
        setFlights(data.flights);
      } else {
        setError(data.message);
      }
    })
    .catch((error) => {
      setError("Error fetching flights: " + error.message);
    });

    fetch("http://localhost:8000/api/getairlines")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setAirlineChoices(data.airline);
          setSelectedAirline(data.airline[0]);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching airlines: " + error.message);
      });

    fetch("http://localhost:8000/api/getairplanes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setAirplanes(data.airplane);
          setSelectedAirplane(data.airplane[0]);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching airplanes: " + error.message);
      });

    fetch("http://localhost:8000/api/getairports")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setAirports(data.airport);
          setSelectedFrom(data.airport[0]);
          setSelectedTo(data.airport[0]);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching cities: " + error.message);
      });
  }, [refetch]);

  return (
    <div className="hotellist">
      <div className="flightlistheader">
        Flights
        <div className="flighticoncontainer">
          <button
            id="sendButton"
            onClick={() => {
              toggleAddFlight();
            }}
            className="addhotelbtn"
          >
            Add new flight
            <PiPlus />
          </button>
        </div>
      </div>
      <div>
      {flights.map((flight) => (
          <Flightlistitem
            key={flight.id}
            flight={flight}
            selectedFlight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
          />
        ))}
      </div>
      {addFlight && (
        <>
          <div className="backgrounddimmer" onClick={toggleAddFlight}>
            <CgClose className="closebutton" />
          </div>
          <div className="addflightcontainer">
            <div className="addflightsubcontainer">
              <div className="addflightcolumn">
                Choose Airline
                <select
                  value={airlineID}
                  onChange={(e) => {
                    const selectedAirlineId = Number(e.target.value);
                    setAirlineID(selectedAirlineId);
                    const selectedAirline = airlineChoices.find(
                      (airline) => airline.id === selectedAirlineId
                    );
                    setSelectedAirline(selectedAirline);
                  }}
                >
                  {airlineChoices.map((airline) => (
                    <option key={airline.id} value={airline.id}>
                      {airline.name}
                    </option>
                  ))}
                </select>
                <select
                  value={airplaneID}
                  onChange={(e) => {
                    const selectedAirplaneId = Number(e.target.value);
                    setAirplaneID(selectedAirplaneId);
                    const selectedAirplane = airPlanes.find(
                      (airplane) => airplane.id === selectedAirplaneId
                    );
                    setSelectedAirplane(selectedAirplane);
                  }}
                >
                  {airPlanes.map((airplane) => (
                    <option key={airplane.id} value={airplane.id}>
                      {airplane.name}
                    </option>
                  ))}
                </select>
                <div>
                  <input
                    type="checkbox"
                    checked={isTransit}
                    onChange={() => setIsTransit(!isTransit)}
                  />
                  &nbsp; Is Transit?
                </div>
              </div>
              <div className="addflightcolumn">
                Choose Source & Destination
                <p>From</p>
                <select
                  value={source}
                  onChange={(e) => {
                    const selectedAirportID = Number(e.target.value);
                    setSource(selectedAirportID);
                    const selectedAirport = airports.find(
                      (airport) => airport.id === selectedAirportID
                    );
                    setSelectedFrom(selectedAirport);
                  }}
                >
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      ({airport.code}) {airport.name} , {airport.city},{" "}
                      {airport.country}
                    </option>
                  ))}
                </select>
                <p>To</p>
                <select
                  value={destination}
                  onChange={(e) => {
                    const selectedAirportID = Number(e.target.value);
                    setDestination(selectedAirportID);
                    const selectedAirport = airports.find(
                      (airport) => airport.id === selectedAirportID
                    );
                    setSelectedTo(selectedAirport);
                  }}
                >
                  {airports.map((airport) => (
                    <option key={airport.id} value={airport.id}>
                      ({airport.code}) {airport.name} , {airport.city},{" "}
                      {airport.country}
                    </option>
                  ))}
                </select>
              </div>
              <div className="addflightcolumn">
                Select Departure and Arrival Time
                <p>Departure Date</p>
                <input
                  type="date"
                  value={departureDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setDepartureDate(new Date(e.target.value))}
                ></input>
                <input
                  type="time"
                  value={
                    departureDate
                      ? departureDate.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                  onChange={(e) =>
                    setDepartureDate(
                      new Date(
                        `${departureDate?.toISOString().split("T")[0]}T${
                          e.target.value
                        }:00`
                      )
                    )
                  }
                ></input>
                <p>Arrival Date</p>
                <input
                  type="date"
                  value={arrivalDate?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setArrivalDate(new Date(e.target.value))}
                ></input>
                <input
                  type="time"
                  value={
                    arrivalDate
                      ? arrivalDate.toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""
                  }
                  onChange={(e) =>
                    setArrivalDate(
                      new Date(
                        `${arrivalDate?.toISOString().split("T")[0]}T${
                          e.target.value
                        }:00`
                      )
                    )
                  }
                ></input>
                <div className="createflightbuttoncontainer">
                  <div className="createflightbutton" onClick={createFlight}>
                    {loading ? "Creating..." : "Add new flight"}
                  </div>
                </div>
              </div>
            </div>
            <div className="addflightsubcontainerbottom">
              <div className="addflightprototypeheader">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={selectedAirline?.logo}></img>
                  <p>{selectedAirplane?.name}</p>
                </div>
                <div className="transitcontainer">
                  {isTransit ? "Transit Flight" : "Non-Transit Flight"}
                </div>
              </div>
              <div className="addflightprototypebody">
                <div className="flightpointcol">
                  Departure
                  <div className="airporttext">{selectedFrom?.code}</div>
                  <div className="citycountrytext">
                    {selectedFrom?.city},{selectedFrom?.country}
                  </div>
                  <BiCircle />
                  <div className="flightdatetext">
                    {departureDate
                      ? departureDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Please Choose a departure date."}
                  </div>
                </div>
                <div className="flightpointcol">
                  <IoAirplane />
                </div>
                <div className="flightpointcol">
                  Arrival
                  <div className="airporttext">{selectedTo?.code}</div>
                  <div className="citycountrytext">
                    {selectedTo?.city},{selectedTo?.country}
                  </div>
                  <BiCircle />
                  <div className="flightdatetext">
                    {arrivalDate
                      ? arrivalDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })
                      : "Please Choose an arrival date."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Flightlist;
