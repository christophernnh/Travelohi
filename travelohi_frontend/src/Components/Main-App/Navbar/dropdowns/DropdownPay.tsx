import { FaWallet } from "react-icons/fa6";
import "./Dropdown-pay.css";
import { FaRegCreditCard } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
const DropdownPay = ({ theme }) => {
  return (
    <div className={`dropdowncontainerpay ${theme}`}>
      <ul className={`dropdownitempay ${theme}`}>
        <li className="headers">From Travelohi</li>
        <li className="tooltip">
          <FaWallet />
          &nbsp;HI-Wallet<span className="tooltiptext">Zero top up fee for first time users!</span>
        </li>
        <li className="tooltip">
          <FaRegCreditCard />
          &nbsp;Credit Card<span className="tooltiptext">Mastercard and Visa available</span>
        </li>
      </ul>
      <ul className={`dropdownitempay ${theme}`}>
        <li className="headers">Other Methods</li>
        <li className="tooltip">
          <FaMoneyCheckDollar /> &nbsp;HI-Debt
          <span className="tooltiptext">Get up to 40% cashback with HI-Debt</span>
        </li>
      </ul>
    </div>
  );
};

export default DropdownPay;
