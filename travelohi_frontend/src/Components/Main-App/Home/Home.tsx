import "./MainApp.css";
import Carousel from "./Carousel/Carousel";
import { GiArchiveResearch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import WhyTraveloHI from "./WhyTraveloHI/WhyTraveloHI";
import Recommendations from "./Recomendations/Recommendations";
import gameLogo from "/game-assets/gamelogo.png";

const Home = ({theme, setTheme}) => {

  const navigate = useNavigate(); 
  const toLocation = () => {
    navigate('/location-checker');
  }
  const toGame = () => {
    navigate('/game');
  }

  return (
    <div>
      <Carousel theme={theme}/>
      <Recommendations theme={theme}/>
      <WhyTraveloHI theme={theme}/>
      <div className="fixed-button" onClick={toLocation}>
        <GiArchiveResearch className="checkericon"/>
        Location Checker
      </div>
      <div className="fixed-game-btn" onClick={toGame}>
        <img src={gameLogo}></img>
      </div>
      
    </div>
  );
};

export default Home;
