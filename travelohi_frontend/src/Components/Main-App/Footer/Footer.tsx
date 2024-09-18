import { GiDolphin } from "react-icons/gi";
import "./Footer.css";
import {
  FaFacebookSquare,
  FaInstagram,
  FaTiktok,
  FaTwitterSquare,
  FaXingSquare,
} from "react-icons/fa";
import { FaX, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footerrow">
        <div className="footercol">
          <span className="footerlogo">
            <GiDolphin />
            Travelohi
          </span>
          <p className="tagline">Life, your way</p>
          <p className="socials">
            <FaInstagram />
            <FaFacebookSquare />
            <FaXTwitter />
            <FaTiktok />
          </p>
        </div>
        <div className="footercol">
          <h3>Office</h3>
          <p className="tenpxgap">Raya Kb. Jeruk No.27</p>
          <p>Kemanggisan, Kec. Palmerah</p>
          <p> DKI Jakarta, Indonesia 11530</p>
          <p className="emailid">hchrisnath@gmail.com</p>
          <h4>+62 54394988</h4>
        </div>
        <div className="footercol footercollinks">
          <h3>Products</h3>
          <div>
            {" "}
            <a href="">Home</a>
          </div>
          <div>
            {" "}
            <a href="/game">Game</a>
          </div>
          <div>
            {" "}
            <a href="/profile">Profile</a>
          </div>
          <div>
            {" "}
            <a href="">Promos</a>
          </div>
          <div>
            {" "}
            <a href="/location-checker">Location Checker</a>
          </div>
        </div>
        <div className="footercol footercollinks">
          <h3>Others</h3>
          <div>
            {" "}
            <a href="https://corporates.ctv.traveloka.com/en-id/">
              Traveloka for Corporates
            </a>
          </div>
          <div>
            {" "}
            <a href="https://www.traveloka.com/en-id/affiliate">
              Traveloka Affiliate
            </a>
          </div>
          <div>
            {" "}
            <a href="https://www.traveloka.com/en-id/privacy-notice">
              Privacy Notice
            </a>
          </div>
          <div>
            {" "}
            <a href="https://www.traveloka.com/en-id/termsandconditions">
              Terms and Conditions
            </a>
          </div>
        </div>
        <div className="footercol">
          <h3>Certifications</h3>
          <div className="partnerscontainer">
            <img
              className="partners"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2017/12/13/1513150321127-5096be77d2a19401b476853e54ba2cc6.svg?tr=dpr-2,h-35,q-75"
            ></img>
            <img
              className="partners"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2019/07/04/1562226590916-2361205eaa5ec2f3e1807157cd842950.svg?tr=dpr-2,h-35,q-75"
            ></img>
            <img
              className="partners"
              src="https://ik.imagekit.io/tvlk/image/imageResource/2021/05/10/1620638808154-e6c02ed786235ab59252628a9aa9b715.png?tr=dpr-2,h-35,q-75"
            ></img>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
