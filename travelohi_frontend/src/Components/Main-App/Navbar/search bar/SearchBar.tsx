import { BiSearch } from "react-icons/bi";
import "../Navbar.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ theme, setSearchResults }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (input != "") {
        fetchData();
      }else if(input == ""){
        setSearchResults(["emptyinput"]);
      }

    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [input]);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch hotel details");
      }

      const data = await response.json();
      setSearchResults(data.hotels);
    } catch (error) {
      console.log("error fetching results.");
    }
  };

  const handleChange = (value) => {
    setSearchResults([]);
    setInput(value);
  };

  const handleSearchClick = async () => {
    if (input.trim() !== "") {
      await navigate(`/search/${input}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Flights or Hotels . . ."
        className={`${theme}`}
        onChange={(e) => handleChange(e.target.value)}
      />
      <BiSearch onClick={handleSearchClick} style={{cursor: "pointer"}}/>
    </div>
  );
};

export default SearchBar;
