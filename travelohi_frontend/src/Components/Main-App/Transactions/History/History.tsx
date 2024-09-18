import { useEffect, useState, useRef } from "react";
import "./historypage.css";
import { IoIosArrowDown } from "react-icons/io";
const History = ({
  flightTransactions,
  hotelTransactions,
  activeTab,
  uid,
}: {
  flightTransactions: any[];
  hotelTransactions: any[];
  activeTab: string;
  uid: string;
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [reviewPopUp, setReviewPopUp] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isanonymous, setIsAnonymous] = useState(false);
  const [description, setDescription] = useState("");

  const handleReviewPopUp = (transaction: any) => {
    setSelectedTransaction(transaction);
    setReviewPopUp(true);
  };

  const handleCloseOrderPopup = () => {
    setReviewPopUp(false);
    setSelectedTransaction(null);
    setIsAnonymous(false);
    setRating(5);
    setDescription("");
    setIsAnonymous(false);
  };

  const [rating, setRating] = useState(5);

  const addReview = async () => {
    console.log(selectedTransaction?.hotelid);
    console.log(rating.toString);
    console.log(uid.toString);
    console.log(description);
    try {
      const reviewResponse = await fetch(
        "http://localhost:8000/api/addreview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userid: String(uid),
            hotelid: selectedTransaction?.hotelid,
            rating: String(rating),
            description: description,
            anonymous: isanonymous.toString(),
          }),
        }
      );

      if (!reviewResponse.ok) {
        throw new Error(reviewResponse.json.message);
      }

      const data = await reviewResponse.json();
      alert("Review posted successfully!");
      setIsSaving(true);
      window.location.reload();
    } catch {
      alert("Please fill in all fields!")
    } finally{
      setIsSaving(false);
    }
  };

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setRating(value);
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showFlights, setShowFlights] = useState<boolean>(true);
  const [showHotels, setShowHotels] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const itemsPerPage = 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const contentRef = useRef<HTMLDivElement>(null);

  const filteredTransactions = hotelTransactions
    ? hotelTransactions
        .filter((transaction) => transaction.ispaid)
        .sort((a, b) => {
          const aCheckoutDate = new Date(a.checkoutdate).getTime();
          const bCheckoutDate = new Date(b.checkoutdate).getTime();

          return bCheckoutDate - aCheckoutDate;
        })
        .filter((transaction) => {
          const searchTerms = searchQuery.toLowerCase();
          return (
            (transaction.name.toLowerCase().includes(searchTerms) ||
              transaction.city.toLowerCase().includes(searchTerms) ||
              transaction.country.toLowerCase().includes(searchTerms)) &&
            (activeTab === "My Tickets"
              ? new Date(transaction.checkoutdate).getTime() >= Date.now()
              : new Date(transaction.checkoutdate).getTime() < Date.now())
          );
        })
        .slice(0, endIndex)
    : [];

  const filteredFlightTransactions = flightTransactions
    ? flightTransactions
        .filter((transaction) => transaction.ispaid)
        .sort((a, b) => {
          const aArrivalDate = new Date(a.arrivaltime).getTime();
          const bArrivalDate = new Date(b.arrivaltime).getTime();

          return bArrivalDate - aArrivalDate;
        })
        .filter((transaction) => {
          const searchTerms = searchQuery.toLowerCase();
          return (
            (transaction.flightid.toLowerCase().includes(searchTerms) ||
              transaction.airlinename.toLowerCase().includes(searchTerms) ||
              transaction.fromcity.toLowerCase().includes(searchTerms) ||
              transaction.fromcountry.toLowerCase().includes(searchTerms) ||
              transaction.tocity.toLowerCase().includes(searchTerms) ||
              transaction.tocountry.toLowerCase().includes(searchTerms)) &&
            (activeTab === "My Tickets"
              ? new Date(transaction.arrivaltime).getTime() >= Date.now()
              : new Date(transaction.arrivaltime).getTime() < Date.now())
          );
        })
        .slice(0, endIndex)
    : [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetching) {
            setIsFetching(true);
            setTimeout(() => {
              setCurrentPage((prevPage) => prevPage + 1);
              setIsFetching(false);
            }, 1000);
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
    };
  }, [isFetching, hotelTransactions]);

  return (
    <div className="history-container">
      <h4>Search and Filter</h4>
      <div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search ongoing flights or hotels..."
          style={{ paddingInline: "10px", marginRight: "20px", width: "50%" }}
        ></input>
        <input
          type="checkbox"
          checked={showFlights}
          onChange={() => setShowFlights(!showFlights)}
        />
        Flights &nbsp;&nbsp;&nbsp;&nbsp;
        <input
          type="checkbox"
          checked={showHotels}
          onChange={() => setShowHotels(!showHotels)}
        />
        Hotels
      </div>
      <div style={{ marginBottom: "20px" }}></div>
      {(showHotels &&
        Array.isArray(filteredTransactions) &&
        filteredTransactions.length > 0) ||
      (showFlights &&
        Array.isArray(filteredFlightTransactions) &&
        filteredFlightTransactions.length > 0) ? (
        <>
          {showHotels &&
            filteredTransactions.map((transaction: any) => (
              <div key={transaction.id}>
                {reviewPopUp ? (
                  <>
                    <div
                      className="orderblur"
                      onClick={handleCloseOrderPopup}
                    ></div>
                    <div
                      className="seatspopupcontainer"
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      <div>
                        <h2>Review</h2>
                        <div>
                          <h3>
                            {transaction.name} - {transaction.roomname}
                          </h3>
                        </div>
                      </div>
                      <div>
                        Rating: &nbsp;
                        <input
                          type="range"
                          id="ratingSlider"
                          name="rating"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={handleSliderChange}
                        />{" "}
                        &nbsp; {rating}
                        <input
                          placeholder="Share your thoughts here"
                          type="text"
                          style={{ width: "100%", height: "100px" }}
                          onChange={(e) => setDescription(e.target.value)}
                          value={description}
                        ></input>
                        <input
                          type="checkbox"
                          checked={isanonymous}
                          onChange={() => setIsAnonymous(!isanonymous)}
                        ></input>{" "}
                        &nbsp; Post Anonymously
                      </div>
                      <div>
                        <div
                          className="closeseatbtn"
                          onClick={() => addReview()}
                        >
                          {isSaving ? "Posting Review..." : "Add Review"}
                        </div>
                        <div
                          className="closeseatbtn"
                          onClick={handleCloseOrderPopup}
                        >
                          Close
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="historyitem">
                  <h3>Hotel - {transaction.name}</h3>
                  <p>{transaction.roomname}</p>
                  <p>
                    Check in: {new Date(transaction.checkindate).toDateString()}
                  </p>
                  <p>
                    Check out:{" "}
                    {new Date(transaction.checkoutdate).toDateString()}
                  </p>
                  <p>$ {transaction.price} / night</p>
                  <p>
                    Ordered at :{" "}
                    {new Date(transaction.orderdate).toDateString()}
                  </p>
                  {transaction.ispaid &&
                  new Date(transaction.checkoutdate).getTime() < Date.now() ? (
                    <div
                      className="closeseatbtn"
                      onClick={() => handleReviewPopUp(transaction)}
                    >
                      Add Review
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          {showFlights &&
            filteredFlightTransactions.map((transaction: any) => (
              <div key={transaction.flightid}>
                <div className="historyitem">
                  <h3>Flight - {transaction.flightid}</h3>
                  <div>
                    <img
                      src={transaction.airlinelogo}
                      alt="Airline Logo"
                      className="flightdetailtopcolimg"
                    />
                  </div>
                  <h4>{transaction.seatid}</h4>
                  <p>Total luggage: {transaction.luggage}(kg)</p>
                  <p>
                    Departure: {transaction.fromcity}, {transaction.fromcountry}{" "}
                    ({transaction.fromairportcode})
                  </p>
                  <p>
                    {new Date(transaction.departuretime).toDateString()},{" "}
                    {new Date(transaction.departuretime).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                  <div>&nbsp;</div>
                  <p>
                    Arrival: {transaction.tocity}, {transaction.tocountry} (
                    {transaction.toairportcode})
                  </p>
                  <p>
                    {new Date(transaction.arrivaltime).toDateString()},{" "}
                    {new Date(transaction.arrivaltime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <h5>Total: $359.99</h5>
                  <p>
                    Ordered at :{" "}
                    {new Date(transaction.orderdate).toDateString()}
                  </p>
                </div>
              </div>
            ))}
          <div ref={contentRef} className="showmorebutton">
            <IoIosArrowDown />
          </div>
        </>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default History;
