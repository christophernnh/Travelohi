import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import lc from "./LocationChecker.module.scss";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import useAuthChecker from "../AuthChecker";
import { useNavigate } from "react-router-dom";
import LocationRecommendation from "./LocationRecommendation/LocationRecommendation";

const LocationChecker = ({ theme }) => {
  const authenticated = useAuthChecker();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [filename, setFileName] = useState("No selected file");
  const [prediction, setPrediction] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsFlight, setSearchResultsFlight] = useState<any[]>([]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedImage(file || null);
    setFileName(file ? file.name : "No selected file");
  };

  const getData = () => {
    setSearchResults([]);
    setSearchResultsFlight([]);
    if (!selectedImage) {
      console.error("Please select an image");
      setPrediction("Please Select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/predict",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        const prediction = response.data.prediction;
        setPrediction(prediction);
        if (response.data.prediction === "Brazil") {
          getRecommendations(14);
          getRecommendationsFlight(14);
        } else if (response.data.prediction === "Canada"){
          getRecommendations(11);
          getRecommendationsFlight(11);
        }
        else if (response.data.prediction === "Finland"){
          getRecommendations(7);
          getRecommendationsFlight(7);
        } 
        else if (response.data.prediction === "Japan"){
          getRecommendations(2);
          getRecommendationsFlight(2);
        }
        else if (response.data.prediction === "United_States"){
          getRecommendations(1);
          getRecommendationsFlight(1);
        }
        else if (response.data.prediction === "United-Kingdom"){
          getRecommendations(3);
          getRecommendationsFlight(3);
        }
        else {
          console.log("Prediction:", prediction);
        }
      })
      .catch((error) => {
        console.error("Error predicting image:", error);
      });
  };

  const getRecommendations = async (countryId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/locationresults`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ countryId: countryId.toString() }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }
      const data = await response.json();
      setSearchResults(data.hotels);
    } catch (error) {
      console.log("error fetching results.");
    }
  };

  const getRecommendationsFlight = async (countryId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/locationresultsflight`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ countryId: countryId.toString() }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch flight details");
      }
      const data = await response.json();
      setSearchResultsFlight(data.flights);
    } catch (error) {
      console.log("error fetching results.");
    }
  };

  return (
    <div className={lc.body}>
      {authenticated ? (
          <div className={lc.boxsize}>
            <div className={lc.input}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                id="fileInput"
                hidden
              />
              <label htmlFor="fileInput" className={lc.pointerable}>
                <MdCloudUpload color="#1475cf" size={60} />
                <p>Browse file to upload</p>
              </label>
            </div>

            <section className={lc.uploadrow}>
              <AiFillFileImage color="#1475cf" />
              <span className={lc.uploadedcontent}>
                {filename}
                <MdDelete
                  onClick={() => {
                    setFileName("No Selected File");
                    setSelectedImage(null);
                  }}
                />
              </span>
            </section>
            <div>
              <button className={lc.predictButton} onClick={getData}>
                Find Location
              </button>
            </div>
          {prediction !== null && (
            <>
              The location of the uploaded image is in : {" "} {prediction}
              {searchResults[0] ==
              "emptyinput" ? null : searchResults.length === 0 ? (
                <div className="result-item">No results.</div>
              ) : (
                // searchResults.map((result, index) => (
                //   <div key={index}>
                //     <p>{result.name}</p>
                //   </div>
                // ))
                <LocationRecommendation theme={theme} hotels={searchResults} flights={searchResultsFlight}/>
              )}
            </>
          )}
        </div>
      ) : (
        <div className={lc.center}>
          <p>Please log in to use this feature</p>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      )}
    </div>
  );
};

export default LocationChecker;
