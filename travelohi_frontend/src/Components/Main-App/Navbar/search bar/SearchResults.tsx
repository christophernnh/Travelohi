
import "../Navbar.css";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ searchResults, setSearchResults }) => {
  const navigate = useNavigate();

  const clickResult = async (result) => {
    await navigate(`/hoteldetail/${result.id}/${result.name}`);
    setSearchResults(["emptyinput"]);
  };
  return (
    <div className="results-list">
      {searchResults[0] == "emptyinput" ? null : searchResults.length === 0 ? (
        <div className="result-item">No results.</div>
      ) : (
        searchResults.map((result, index) => (
          <div key={index} className="result-item" onClick={() => clickResult(result)}>
            <p>{result.name}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResults;
