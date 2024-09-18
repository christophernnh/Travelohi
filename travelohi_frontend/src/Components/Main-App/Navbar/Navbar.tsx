import "./Navbar.css";
import { GiDolphin } from "react-icons/gi";
import { useEffect, useState } from "react";
import { BiBuilding, BiSearch } from "react-icons/bi";
import { FaAngleUp, FaRegSun, FaUser } from "react-icons/fa6";
import { FaRegMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaAngleDown } from "react-icons/fa6";
import DropdownCurrency from "./dropdowns/DropdownCurrency";
import DropdownPay from "./dropdowns/DropdownPay";
import SearchBar from "./search bar/SearchBar";
import SearchResults from "./search bar/SearchResults";

interface NavbarProps {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const Navbar: React.FC<NavbarProps> = ({ theme, setTheme }) => {
  const [hotelTransactions, setHotelTransactions] = useState<any[]>([]);
  const [flightTransactions, setFlightTransactions] = useState<any[]>([]);
  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();

        let hotelResponse;
        let flightResponse;
        hotelResponse = await fetch(
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

        const hotelData = await hotelResponse?.json();

        const filteredHotelCount = hotelData?.hoteltransactions
        ? hotelData.hoteltransactions
            .filter((transaction: { ispaid: any; }) => transaction.ispaid)
            .filter(
              (transaction: { checkoutdate: string | number | Date; }) =>
                new Date(transaction.checkoutdate).getTime() >= Date.now()
            ).length
        : 0;

        flightResponse = await fetch(
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
          throw new Error("Failed to fetch flight details");
        }

        const flightData = await flightResponse?.json();
        const filteredFlightsCount = flightData?.flighttransactions
        ? flightData.flighttransactions
            .filter((transaction: { ispaid: any; }) => transaction.ispaid)
            .filter(
              (transaction: { arrivaldate: string | number | Date; }) =>
                new Date(transaction.arrivaldate).getTime() >= Date.now()
            )
            .length
        : 0;
        setReservations(reservations + filteredFlightsCount + filteredHotelCount);
      } catch (error) {
        // console.error(error.message);
      }
    };

    fetchData();
  }, [refetch]);

  const filteredTransactions = hotelTransactions
    ? hotelTransactions
        .filter((transaction) => transaction.ispaid)
        .sort((a, b) => {
          const aCheckoutDate = new Date(a.checkoutdate).getTime();
          const bCheckoutDate = new Date(b.checkoutdate).getTime();

          return bCheckoutDate - aCheckoutDate;
        })
        .filter(
          (transaction) =>
            new Date(transaction.checkoutdate).getTime() >= Date.now()
        )
    : [];

  const [reservations, setReservations] = useState(0);

  const [searchResults, setSearchResults] = useState<any[]>([]);

  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/login");
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };
  const navigateRegister = () => {
    navigate("/register");
  };

  const navigateToAdmin = () => {
    navigate("/admin");
  };

  const navigateHome = () => {
    navigate("/home");
  };
  const [name, setName] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  useEffect(() => {
    setReservations(filteredTransactions.length);
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const content = await response.json();
        setName(content.firstname);
        setLoggedIn(true);
      } else {
        const response = await fetch("http://localhost:8000/api/admin", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          setName("Admin Dashboard");
          setAdminLoggedIn(true);
        } else {
          setAdminLoggedIn(false);
        }
        setLoggedIn(false);
      }
    })();
  }, [refetch]);
  const logout = async () => {
    await fetch("http://localhost:8000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setName("");
    setLoggedIn(false);
    window.location.reload();
    navigate("/login");
  };

  const toggle_mode = () => {
    theme == "light" ? setTheme("dark") : setTheme("light");
    console.log(theme);
  };

  const [openCurrency, setOpenCurrency] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const openCurrencyDropdown = () => {
    setOpenCurrency(!openCurrency);
    if (openPay) {
      setOpenPay(false);
    }
  };
  const openPayDropdown = () => {
    setOpenPay(!openPay);
    if (openCurrency) {
      setOpenCurrency(false);
    }
  };

  const [currency, setCurrency] = useState("USD");

  const updateCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  return (
    <div className={`navbar ${theme}`}>
      {/* travelohi logo */}
      <div className={`logo ${theme}`} onClick={navigateHome}>
        <GiDolphin />
        Travelohi
      </div>
      {/* search bar */}
      <div className={`searchcontainer`}>
        <SearchBar theme={theme} setSearchResults={setSearchResults} />
      </div>
      <SearchResults
        searchResults={searchResults}
        setSearchResults={setSearchResults}
      />
      {/* navbar items */}
      <ul>
        {/* currency dropdown */}
        <li
          className={` ${theme}`}
          onClick={() => {
            navigate("/myreservations");
          }}
        >
          <BiBuilding />
          My Reservations({reservations})
        </li>
        <li
          className={`currencybutton ${theme}`}
          onClick={openCurrencyDropdown}
        >
          {currency == "IDR" ? (
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACqCAMAAABVlWm8AAAABlBMVEX/AAD///9BHTQRAAAAhElEQVR4nO3PMQEAAAjAIO1f2hRegwbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAPNk2/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv+2A+BhVKwOtdkDAAAAAElFTkSuQmCC"
              alt="currency logo"
              className="logoimg"
            ></img>
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/United-states_flag_icon_round.svg/1024px-United-states_flag_icon_round.svg.png"
              alt="currency logo"
              className="logoimg"
            ></img>
          )}

          {currency}
          {!openCurrency ? (
            <FaAngleDown className="logodropdown" />
          ) : (
            <FaAngleUp className="logodropdown" />
          )}
        </li>
        {/* dropdowns */}
        {openCurrency ? (
          <DropdownCurrency
            currency={currency}
            updateCurrency={updateCurrency}
            theme={theme}
          />
        ) : (
          <></>
        )}
        {openPay ? <DropdownPay theme={theme} /> : <></>}

        {/* pay dropdown button */}
        <li className={`${theme}`} onClick={openPayDropdown}>
          Pay{" "}
          {!openPay ? (
            <FaAngleDown className="logodropdown" />
          ) : (
            <FaAngleUp className="logodropdown" />
          )}
        </li>

        {/* register, login and profiles buttons */}
        <li
          onClick={
            isLoggedIn
              ? navigateToProfile
              : !adminLoggedIn
              ? navigateToLogin
              : navigateToAdmin
          }
          className={`loginbtn ${theme}`}
        >
          <FaUser />
          {isLoggedIn ? name : !adminLoggedIn ? "Login" : name}
        </li>
        {!(isLoggedIn || adminLoggedIn) ? (
          <li className="registerbtn" onClick={navigateRegister}>
            Register
          </li>
        ) : (
          <li className="registerbtn" onClick={logout}>
            <FiLogOut /> Logout
          </li>
        )}
      </ul>
      {/* toggle night & day mode */}
      <div
        onClick={() => {
          toggle_mode();
        }}
        className={`daynighttoggle ${theme}`}
      >
        {theme == "light" ? <FaRegSun /> : <FaRegMoon />}
      </div>
    </div>
  );
};

export default Navbar;
