import { useEffect, useRef, useState } from "react";
import "./Dropdown-currency.css";
interface DropdownCurrencyProps {
  currency: string;
  updateCurrency: (newCurrency: string) => void;
  theme: string;
}

const DropdownCurrency: React.FC<DropdownCurrencyProps> = ({
  currency,
  updateCurrency,
  theme,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const changetoIDR = () => {
    updateCurrency("IDR");
    console.log("IDR");
  };

  const changetoUSD = () => {
    updateCurrency("USD");
    console.log("USD");
  };

  const [language, setLanguage] = useState("English");
  const changeToEnglish = () => {
    setLanguage("English");
  };
  const changeToIndo = () => {
    setLanguage("Indonesian");
  };
  const changeToChinese = () => {
    setLanguage("Chinese");
  };

  const handleClickOutside = (event: { target: any; }) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      // Clicked outside the dropdown, close it
      // Add any additional logic you need to handle closing the dropdown
      console.log("Clicked outside dropdown");
    }
  };

  useEffect(() => {
    // Attach the event listener on component mount
    document.addEventListener("click", handleClickOutside);

    // Detach the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdowncontainer ${theme}`}>
      <div className="header">Currencies</div>
      <ul className="dropdownitem">
        <li
          onClick={changetoUSD}
          className={
            currency == "USD" ? `left selected ${theme}` : `left notselected ${theme}`
          }
        >
          {" "}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/United-states_flag_icon_round.svg/1024px-United-states_flag_icon_round.svg.png"
            alt="currency logo"
            className="logoimg"
          ></img>
          USD
        </li>
        <li
          onClick={changetoIDR}
          className={
            currency == "IDR" ? `left selected ${theme}` : `left notselected ${theme}`
          }
        >
          {" "}
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACqCAMAAABVlWm8AAAABlBMVEX/AAD///9BHTQRAAAAhElEQVR4nO3PMQEAAAjAIO1f2hRegwbMAAAAAAAAAAAAAAAAAAAAAAAAAAAAPNk2/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv82/zb/Nv+2A+BhVKwOtdkDAAAAAElFTkSuQmCC"
            alt="currency logo"
            className="logoimg"
          ></img>
          IDR
        </li>
      </ul>
      <div className="header">Languages</div>
      <ul className="dropdownitem">
        <li
          className={
            language === "English"
              ? `left selected ${theme}`
              : `left notselected ${theme}`
          }
          onClick={changeToEnglish}
        >
          English
        </li>
        <li
          className={
            language === "Indonesian"
              ? `left selected ${theme}`
              : `left notselected ${theme}`
          }
          onClick={changeToIndo}
        >
          Indonesian
        </li>
        <li
          className={
            language === "Chinese"
              ? `left selected ${theme}`
              : `left notselected ${theme}`
          }
          onClick={changeToChinese}
        >
          中文
        </li>
      </ul>
    </div>
  );
};

export default DropdownCurrency;
