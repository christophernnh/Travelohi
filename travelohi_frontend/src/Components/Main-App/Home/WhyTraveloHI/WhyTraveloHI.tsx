import "./WhyTraveloHI.css";

const WhyTraveloHI = ({theme}) => {
  return (
    <div className={`whycontainer ${theme}`}>
      <h1>Why travel with TraveloHI</h1>
      <div className="whyrow">
        {/* 1 */}
        <div className="service">
          <img
            className="cardimg"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/20/1687227678966-12fda985e8a02d206373852b694774eb.png?tr=dpr-2,q-75,w-320"
          ></img>
          <div className="textcontainer">
            <h2>Fun Activities</h2>
            <p>Kickstart your adventure</p>
          </div>
        </div>
        {/* 2 */}
        <div className="service">
          <img
            className="cardimg"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/20/1687227682697-02305318f6999d0142ef2261c167d374.png?tr=dpr-2,q-75,w-320"
          ></img>
          <div className="textcontainer">
            <h2>Tours and attractions</h2>
            <p>Discover yourself in Asia and beyond</p>
          </div>
        </div>
        {/* 3 */}
        <div className="service">
          <img
            className="cardimg"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/20/1687227690463-708b02ea6e23476821e4ecb856cb43aa.png?tr=dpr-2,q-75,w-320"
          ></img>
          <div className="textcontainer">
            <h2>Travel Insurance</h2>
            <p>Worry free travelling</p>
          </div>
        </div>
        {/* 4 */}
        <div className="service">
          <img
            className="cardimg"
            src="https://ik.imagekit.io/tvlk/image/imageResource/2023/06/20/1687227693875-5736b59ef93cb6b20734c12b2c641a22.png?tr=dpr-2,q-75,w-320"
          ></img>
          <div className="textcontainer">
            <h2>TraveloHI Debt</h2>
            <p>Travel now, pay later</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyTraveloHI;
