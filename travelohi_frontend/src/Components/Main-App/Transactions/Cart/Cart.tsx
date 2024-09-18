import { SetStateAction, SyntheticEvent, useEffect, useState } from "react";
import "./cartpage.css";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const Cart = ({
  flightTransactions,
  hotelTransactions,
  setRefetch,
  uid,
  email,
}: {
  flightTransactions: any[];
  hotelTransactions: any[];
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  uid: number;
  email: string;
}) => {
  const [checkOutPopUp, setCheckOutPopUp] = useState(false);
  const handleOpenCheckoutPopup = (room: any) => {
    if (getTotalPriceInCart() <= 0) {
      alert("Nothing to checkout, consider adding a hotel/flight.");
    } else {
      setCheckOutPopUp(true);
    }
  };

  const handleCloseCheckoutPopup = () => {
    setCheckOutPopUp(false);
  };

  const [selectedMethod, setSelectedMethod] = useState("HI Wallet");

  const changePaymentMethod = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSelectedMethod(event.target.value);
  };

  const [walletBalance, setWalletBalance] = useState(0);
  useEffect(() => {
    console.log(uid);
    const getWalletBalance = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/getwalletbalance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: uid.toString(),
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWalletBalance(data.wallet.balance);
        } else {
          console.error("Error fetching wallet balance");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getWalletBalance();
  }, []);

  const itemsPerPage = 2;
  const [displayedItems, setDisplayedItems] = useState(itemsPerPage);
  const [promoCode, setPromoCode] = useState("");
  const [promoInfo, setPromoInfo] = useState(null);

  const calculateTotalPrice = (transaction: any) => {
    const checkinDate = new Date(transaction.checkindate);
    const checkoutDate = new Date(transaction.checkoutdate);
    const numberOfNights = Math.floor(
      (checkoutDate - checkinDate) / (24 * 60 * 60 * 1000)
    );

    return (
      transaction.price * numberOfNights +
      flightTransactions.filter((transaction) => !transaction.ispaid).length *
        359.99
    );
  };

  const getTotalPriceInCart = () => {
    const hotelTotal = hotelTransactions
      .filter((transaction) => !transaction.ispaid)
      .slice(0, displayedItems)
      .reduce(
        (total, transaction) => total + calculateTotalPrice(transaction),
        0
      );

    const flightTotal = flightTransactions
      .filter((transaction) => !transaction.ispaid)
      .slice(0, displayedItems)
      .reduce((total) => total + 359.99, 0);

    return hotelTotal + flightTotal;
  };

  const showMoreItems = () => {
    setDisplayedItems(displayedItems + itemsPerPage);
  };

  const handlePromoCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPromoCode(event.target.value);
  };

  const handleCheckInDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    transactionId: string
  ) => {
    const newCheckinDate = new Date(event.target.value);
    const transaction = hotelTransactions.find((t) => t.id === transactionId);

    if (transaction) {
      const newCheckoutDate = new Date(transaction.checkoutdate);
      updateHotelCartDate(transactionId, {
        checkindate: newCheckinDate,
        checkoutdate: newCheckoutDate,
      });
    }
  };

  const handleCheckOutDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    transactionId: string
  ) => {
    const newCheckoutDate = new Date(event.target.value);
    const transaction = hotelTransactions.find((t) => t.id === transactionId);

    if (transaction) {
      const newCheckinDate = new Date(transaction.checkindate);
      updateHotelCartDate(transactionId, {
        checkindate: newCheckinDate,
        checkoutdate: newCheckoutDate,
      });
    }
  };

  const updateHotelCartDate = async (
    transactionId: any,
    { checkindate, checkoutdate }: { checkindate?: Date; checkoutdate?: Date }
  ) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/updatehotelcartdate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: transactionId.toString(),
            checkindate: checkindate,
            checkoutdate: checkoutdate,
          }),
        }
      );

      if (response.ok) {
        alert("Success Updated Date");
        setRefetch(true);
        setRefetch(true);

        setTimeout(() => {
          setRefetch(false);
        }, 1000);
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating hotel cart date:", error);
    }
  };

  const [cardNumber, setCardNumber] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [expMonth, setExpMonth] = useState<string>("");
  const [expYear, setExpYear] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCardNumber(data.cardnumber);
        setCvv(data.cvv);
        setExpMonth(data.expiremonth);
        setExpYear(data.expireyear);
      }
    })();
  }, [selectedMethod]);

  const updateCreditCard = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/updatecredit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(uid),
          cardNumber,
          expMonth,
          expYear,
          cvv,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        console.log("Profile updated successfully:", data);
      } else {
        alert(data.message);
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

  const checkout = async () => {
    if (selectedMethod === "HI Wallet") {
      let finalBalance = 0;
      if (promoInfo != null) {
        if (
          walletBalance >=
          (getTotalPriceInCart() * (100 - promoInfo?.discount)) / 100
        ) {
          finalBalance =
            walletBalance -
            (getTotalPriceInCart() * (100 - promoInfo?.discount)) / 100;
        } else throw new Error("not enough balance");
      } else {
        if (walletBalance >= getTotalPriceInCart()) {
          finalBalance = walletBalance - getTotalPriceInCart();
        } else throw new Error("not enough balance");
      }
      try {
        const response = await fetch(
          "http://localhost:8000/api/deductwalletbalance",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: uid.toString(),
              balance: finalBalance.toString(),
            }),
          }
        );

        if (response.ok) {
          console.log("Wallet balance deducted successfully");
        } else {
          console.error("Error deducting wallet balance");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (
            data.cardNumber === "0" ||
            data.cvv === "0" ||
            data.expiremonth == "0" ||
            data.expireyear == "0" ||
            data.cardNumber === "" ||
            data.cvv === "" ||
            data.expiremonth == "" ||
            data.expireyear == ""
          ) {
            throw new Error();
          }
        }
      } catch {
        alert("Please fill in credit card credentials!");
      }
    }

    let ishotel = false;
    // send receipt here
    try {
      const response = await fetch("http://localhost:8000/api/checkouthotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uid.toString(),
        }),
      });

      if (response.ok) {
        console.log("hotels paid for successfully");
        try {
          const receiptResponse = await fetch(
            "http://localhost:8000/api/sendreceipt",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                grandtotal: getTotalPriceInCart().toString(),
              }),
            }
          );
          if (receiptResponse.ok) {
            console.log("Receipt sent successfully");
            ishotel = true;
          } else {
            console.error("Error sending receipt");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.error("Error paying for hotels");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    try {
      const response = await fetch(
        "http://localhost:8000/api/checkoutflights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: uid.toString(),
          }),
        }
      );

      if (response.ok) {
        console.log("flights paid for successfully");
        if (!ishotel) {
          try {
            const receiptResponse = await fetch(
              "http://localhost:8000/api/sendreceipt",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                  grandtotal: getTotalPriceInCart().toString(),
                }),
              }
            );
            if (receiptResponse.ok) {
              console.log("Receipt sent successfully");
            } else {
              console.error("Error sending receipt");
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      } else {
        console.error("Error paying for flights");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    window.location.reload();
  };

  const checkPromo = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/checkpromo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promocode: promoCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPromoInfo(data.promo);
      } else {
        console.error("Error checking promo code");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      {checkOutPopUp ? (
        <>
          <div className="orderblur" onClick={handleCloseCheckoutPopup}></div>
          <div
            className="seatspopupcontainer"
            style={{ flexDirection: "column" }}
          >
            <h2>Choose Payment Method</h2>
            <div className="paymentmethodcontainer">
              GRAND TOTAL : ${getTotalPriceInCart()}
              {promoInfo && (
                <>
                  <div
                    style={{
                      background: "red",
                      borderRadius: "0.5rem",
                      padding: "1rem",
                      fontSize: "20px",
                      color: "white",
                    }}
                  >
                    -{promoInfo?.discount}%
                  </div>
                  <div style={{ color: "green" }}>
                    {(getTotalPriceInCart() * (100 - promoInfo.discount)) / 100}
                  </div>
                </>
              )}
            </div>
            <div className="paymentmethodcontainer">
              <select value={selectedMethod} onChange={changePaymentMethod}>
                <option value="HI Wallet">HI Wallet</option>
                <option value="Credit Card">Credit Card</option>
              </select>
            </div>
            <div className="paymentmethodcontainer">
              {selectedMethod == "HI Wallet" ? (
                <div>
                  HI Wallet
                  <p>Wallet Balance: ${walletBalance}</p>
                </div>
              ) : (
                <div>
                  <div className={`accountcontainer`}>
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
                      <button onClick={updateCreditCard}>
                        {isSaving ? "Saving. . ." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="paymentmethodcontainer">
              <div className="checkoutbtn" onClick={checkout}>
                Confirm Payment
              </div>
            </div>
          </div>
        </>
      ) : null}
      {hotelTransactions && Array.isArray(hotelTransactions) ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 className={`totalpriceheader`}>
              Grand Total:{" "}
              <div className={`${promoInfo && "strike"}`}>
                ${getTotalPriceInCart()}
              </div>
              {promoInfo && (
                <>
                  <div
                    style={{
                      background: "red",
                      borderRadius: "1rem",
                      padding: "0.25rem",
                      fontSize: "16px",
                      color: "white",
                    }}
                  >
                    -{promoInfo?.discount}%
                  </div>
                  <div style={{ color: "green" }}>
                    {(getTotalPriceInCart() * (100 - promoInfo.discount)) / 100}
                  </div>
                </>
              )}
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                flexDirection: "row",
                height: "50%",
                color: "white",
              }}
            >
              <input
                style={{ marginRight: "20px", paddingLeft: "20px" }}
                type="text"
                placeholder="Add a Promo Code"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
              {promoInfo && (
                <div
                  style={{
                    color: "green",
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  <FaCheck />
                </div>
              )}
              <div
                style={{ marginRight: "20px" }}
                className="checkoutbtn"
                onClick={checkPromo}
              >
                Check Promo
              </div>
              <div className="checkoutbtn" onClick={handleOpenCheckoutPopup}>
                Checkout
              </div>
            </div>
          </div>
          {hotelTransactions
            .filter((transaction) => !transaction.ispaid)
            .slice(0, displayedItems)
            .map((transaction: any) => (
              <div key={transaction.id}>
                <div className="historyitem">
                  <h3>Hotel - {transaction.name}</h3>
                  <p>{transaction.roomname}</p>
                  <p>Check in:</p>
                  <input
                    type="date"
                    value={
                      transaction.checkindate
                        ? new Date(transaction.checkindate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleCheckInDateChange(e, transaction.id)}
                  />
                  <p>Check out:</p>
                  <input
                    type="date"
                    value={
                      transaction.checkoutdate
                        ? new Date(transaction.checkoutdate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleCheckOutDateChange(e, transaction.id)
                    }
                  />
                  <p>$ {transaction.price} / night</p>
                  <h5>Booking Total: $ {calculateTotalPrice(transaction)}</h5>
                </div>
              </div>
            ))}
          {flightTransactions
            .filter((transaction) => !transaction.ispaid)
            .slice(0, displayedItems)
            .map((transaction: any) => (
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
                  <h5>$359.99</h5>
                </div>
              </div>
            ))}
          {displayedItems < hotelTransactions.length && (
            <div onClick={showMoreItems} className="showmorebutton">
              Show More
              <IoIosArrowDown />
            </div>
          )}
        </>
      ) : (
        <div>No items in cart. Consider adding one!</div>
      )}
    </div>
  );
};

export default Cart;
