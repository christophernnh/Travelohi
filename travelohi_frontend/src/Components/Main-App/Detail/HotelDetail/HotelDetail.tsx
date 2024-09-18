import "./hoteldetail.css";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { TbAirConditioning, TbWifi } from "react-icons/tb";
import { MdFreeBreakfast, MdTv, MdSpa, MdLocalBar } from "react-icons/md";
import { CgGym } from "react-icons/cg";
import { BiBorderRadius } from "react-icons/bi";

const HotelDetail = () => {
  const { id, name } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [facilityList, setFacilityList] = useState<string[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/getreviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hotelid: id }), // Pass hotelid as part of the request body
        });

        if (!response.ok) {
          throw new Error("Failed to fetch hotel reviews");
        }

        const data = await response.json();
        setReviews(data.hotelreviews);
      } catch (error) {
        console.error("Error fetching hotel reviews:", error.message);
      }
    };

    fetchReviews(); // Call the fetchReviews function to fetch reviews
  }, [id]);

  const [uid, setUid] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [expMonth, setExpMonth] = useState<string>("");
  const [expYear, setExpYear] = useState<string>("");

  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  const addToCart = async (e: SyntheticEvent, roomtypeid: number) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/addhoteltocart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid?.toString(),
          hotelid: id?.toString(),
          roomtypeid: roomtypeid?.toString(),
          checkindate: checkIn,
          checkoutdate: checkOut,
        }),
      });

      if (response.ok) {
        handleCloseOrderPopup();
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

  const getCreditCard = async () => {
    const response = await fetch("http://localhost:8000/api/user", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      // setUserData(data);
      setUid(data.id);
      setCardNumber(data.cardnumber);
      setCvv(data.cvv);
      setExpMonth(data.expiremonth);
      setExpYear(data.expireyear);
    } else {
      navigate("/login");
    }
  };

  // useEffect(() => {
  //   getCreditCard();
  // }, []);

  const [orderPopUp, setOrderPopUp] = useState(false);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleOpenOrderPopup = (room: any) => {
    getCreditCard();
    setSelectedRoom(room);
    setOrderPopUp(true);
  };

  const handleCloseOrderPopup = () => {
    setOrderPopUp(false);
    setSelectedRoom(null);
    setCheckIn(null);
    setCheckOut(null);
  };

  const [lowestPrice, setLowestPrice] = useState<string>("");
  const RatingStars = ({ rating }: { rating: number }) => {
    const totalStars = 5;

    return (
      <>
        {Array.from({ length: totalStars }, (_, index) =>
          index < rating ? (
            <BsStarFill key={index} className="detailstar" />
          ) : (
            <BsStar key={index} className="detailstar" />
          )
        )}
      </>
    );
  };
  const fetchHotelDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/gethoteldetail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }

      const data = await response.json();
      setHotel(data.hotel);
      setImages(JSON.parse(data.hotel.images));

      try {
        const response = await fetch(`http://localhost:8000/api/getrooms`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch hotel details");
        }

        const data = await response.json();
        setRooms(data.rooms);
        const minPrice = Math.min(
          ...data.rooms.map((room: { price: string }) => parseFloat(room.price))
        );
        setLowestPrice(`$ ${minPrice.toFixed(2)}`);
      } catch (error) {
        console.error(data.message);
      }
    } catch (error) {
      // console.error("Error fetching hotel details:", error.message);
    }
  };

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const renderFacilityIcon = (facility: string) => {
    switch (facility.trim().toLowerCase()) {
      case "air conditioning":
        return <TbAirConditioning />;
      case "wifi":
        return <TbWifi />;
      case "breakfast":
        return <MdFreeBreakfast />;
      case "television":
        return <MdTv />;
      case "spa":
        return <MdSpa />;
      case "bar":
        return <MdLocalBar />;
      case "gym":
        return <CgGym />;
      case "minibar":
        return <MdLocalBar />;
      default:
        return null;
    }
  };

  return (
    <div>
      {hotel ? (
        <>
          <div className="hotelheader">
            <div className="left">
              <div className="headertext">{hotel.name}</div>
              <div className="hotelrating">
                <RatingStars rating={hotel.rating} /> &nbsp;&nbsp;&nbsp;&nbsp;{" "}
                <IoShieldCheckmarkOutline /> &nbsp; TraveloHI Preferred Partner
              </div>
              <div className="hoteladdress">
                <FaLocationDot className="locationicon" />
                {hotel.address}
                <div
                  style={{
                    color: "rgb(0, 81, 194)",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                >
                  See Map
                </div>
              </div>
            </div>
            <div className="right">
              <div style={{ width: "100%" }}>Price/room/night starts from</div>
              <div className="startsfrom">{lowestPrice}</div>
              <div className="selectroombtn">Select Room</div>
            </div>
          </div>
          <div className="hotelimgcontainer">
            <div className="left">
              <img src={images[0]}></img>
            </div>
            <div className="right">
              <img src={images[1]}></img>
              <img src={images[2]}></img>
              <img src={images[3]}></img>
              <img src={images[4]}></img>
              <img src={images[5]}></img>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "grey",
                  borderRadius: "10px",
                }}
              >
                View More Photos
              </div>
            </div>
          </div>
          <div className="descriptioncontainer">
            <h3>Overview</h3>
            <p>{hotel.description}</p>
          </div>
          <div className="roomtypecontainer">
            <h3>Ratings</h3>
            <div className="ratingcolumn">
              <div className="ratingrow">
                Cleanliness{" "}
                <div>
                  <RatingStars rating={hotel.rating} />
                </div>
              </div>
              <div className="ratingrow">
                Comfort{" "}
                <div>
                  <RatingStars rating={hotel.rating} />
                </div>
              </div>
              <div className="ratingrow">
                Location{" "}
                <div>
                  <RatingStars rating={hotel.rating} />
                </div>
              </div>
              <div className="ratingrow">
                Service{" "}
                <div>
                  <RatingStars rating={hotel.rating} />
                </div>
              </div>
            </div>
          </div>
          <div className="roomtypecontainer">
            <h3>Availability</h3>
            <div className="roomtypeborder">
              <div className="roomtype tableheader">
                <div>Room Type</div>
                <div>Facilities</div>
                <div>Price/Room/Night</div>
                <div></div>
              </div>
              {rooms.map((room) => {
                const facilityList = room.facilities.split(",");
                return (
                  <div className="roomtype" key={room.id}>
                    <div>{room.name}</div>
                    <div>
                      <div className="facilitygrid">
                        {facilityList.map((facility, index) => (
                          <React.Fragment key={index}>
                            <div className="facilitygriditem">
                              {renderFacilityIcon(facility)}&nbsp;&nbsp;
                              {facility}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                    <div>USD {parseFloat(room.price).toFixed(2)}</div>
                    <div>
                      <div
                        className="orderroombtn"
                        onClick={() => handleOpenOrderPopup(room)}
                      >
                        Order
                      </div>
                    </div>
                    {orderPopUp ? (
                      <>
                        <div
                          className="orderblur"
                          onClick={handleCloseOrderPopup}
                        ></div>
                        <div className="seatspopupcontainer">
                          <div>
                            <h2>Order Detail</h2>
                            <div>
                              {hotel.name} - {selectedRoom.name}
                            </div>
                            <div>
                              Check-In:{" "}
                              <input
                                type="date"
                                value={
                                  checkIn?.toISOString().split("T")[0] || ""
                                }
                                onChange={(e) =>
                                  setCheckIn(new Date(e.target.value))
                                }
                              ></input>
                            </div>
                            <div>
                              Check-Out:{" "}
                              <input
                                type="date"
                                value={
                                  checkOut?.toISOString().split("T")[0] || ""
                                }
                                onChange={(e) =>
                                  setCheckOut(new Date(e.target.value))
                                }
                              ></input>
                            </div>{" "}
                            <div
                              className="closeseatbtn"
                              onClick={getCreditCard}
                            >
                              Order Now
                            </div>
                            <div
                              className="closeseatbtn"
                              onClick={(e) => addToCart(e, selectedRoom.id)}
                            >
                              {isSaving ? "Adding to cart..." : "Add to cart"}
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
                  </div>
                );
              })}
            </div>
          </div>
          <div className="descriptioncontainer">
              <h3>Reviews</h3>
              {reviews.map((review) => {
                return (
                  <div  key={review.id} style={{borderRadius: "10px", border: "0.1px solid grey", padding: "20px", marginBottom: "10px"}}>
                    <h3>{review.isanonymous ? "Anonymous" : (review.firstname)}</h3>
                    <div><RatingStars rating={review.rating}></RatingStars></div>
                    <div>{review.description}</div>
                    <p style={{fontSize: "13px"}}>{new Date(review.createdat).toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HotelDetail;
