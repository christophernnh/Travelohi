import { SyntheticEvent, useEffect, useState } from "react";
import "./hotellist.css";
import { PiPlus } from "react-icons/pi";
import Hotellistitem from "./Hotellistitem";
import { BiCross } from "react-icons/bi";
import { FaCross } from "react-icons/fa6";
import { CgClose } from "react-icons/cg";

const Hotellist = ({
  selectedHotel,
  setSelectedHotel,
  refetch,
  setRefetch,
}) => {
  interface Hotel {
    id: number;
    name: string;
    description: string;
    rating: number;
    address: string;
    cityID: number;
    // reviews: HotelReview[];
    images: any[];
    capacity: number;
    available: number;
    facilities: string[];
    roomTypes: RoomType[];
  }

  // roomType.ts
  interface RoomType {
    id: number;
    hotelID: number;
    name: string;
    facilities: string[];
    price: number;
  }

  const [hotels, setHotels] = useState([]);
  const [cityChoices, setCityChoices] = useState([]);
  const [error, setError] = useState(String);

  const [isAddHotelDialogVisible, setAddHotelDialogVisibility] =
    useState(false);

  const toggleAddHotelDialog = () => {
    setAddHotelDialogVisibility(!isAddHotelDialogVisible);
    setRoomTypes([]);
  };
  const removeRoom = (roomId) => {
    setRoomTypes((prevRoomTypes) =>
      prevRoomTypes.filter((roomtype) => roomtype.id !== roomId)
    );
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/gethotels")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setHotels(data.hotels);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching hotels: " + error.message);
      });

    fetch("http://localhost:8000/api/getcities")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setCityChoices(data.cities);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching hotels: " + error.message);
      });
  }, [refetch]);

  //insert new hotel
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | null>();
  const [rating, setRating] = useState<number | null>();
  const [address, setAddress] = useState<string>("");

  const [cityID, setCityID] = useState<number>(1);
  const [images, setImages] = useState<string[]>([]);

  const [capacity, setCapacity] = useState<number | null>();
  const [facilities, setFacilities] = useState<string[]>([]);

  const [hotel, setHotel] = useState<Hotel>({
    id: 0,
    name: "",
    description: "",
    rating: 0,
    address: "",
    cityID: 0,
    // reviews: HotelReview[];
    images: [],
    capacity: 0,
    available: 0,
    facilities: [],
    roomTypes: [],
  });
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const addNewRoom = () => {
    setRoomTypes([
      ...roomTypes,
      {
        id: roomTypes.length + 1,
        hotelID: 0,
        name: "",
        facilities: [],
        price: 0,
      },
    ]);
  };

  const uploadHotelImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        processImageToBase64(file);
      } catch (error) {
        alert(error);
      }
    }
  };

  const processImageToBase64 = (image: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const base64String = reader.result as string;

          setImages((prevImages) => [...prevImages, base64String]);

          resolve();
          alert("Upload image success");
        } catch (error) {
          console.error("Error while processing image:", error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        reject(error);
      };

      reader.readAsDataURL(image);
    });
  };

  const submitToDatabase = async (e: SyntheticEvent) => {
    e.preventDefault();

  
    try {
      const response = await fetch("http://localhost:8000/api/createhotel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          rating: String(0),
          address,
          cityID: String(cityID),
          images: JSON.stringify(images),
          capacity: String(capacity),
          available: String(capacity),
          facilities: "",
          // roomTypes: String(roomTypes),
        }),
      });
  
      if (response.ok) {
        const hotelData = await response.json();
        const hotelID = hotelData.ID;
  
        // Insert room types
        for (const roomType of roomTypes) {
          try {
            const roomResponse = await fetch(
              "http://localhost:8000/api/createroom",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  hotelid: String(hotelID),
                  name: roomType.name,
                  facilities: String(roomType.facilities),
                  price: String(roomType.price),
                }),
              }
            );
  
            if (roomResponse.ok) {
              const roomData = await roomResponse.json();
              console.log("Room created successfully:", roomData);
            } else {
              console.error(
                "Failed to create room:",
                roomResponse.status,
                roomResponse.statusText
              );
            }
          } catch (error) {
            console.error("Error creating room:", error);
          }
        }
  
        console.log("Hotel created successfully:", hotelData);
        alert("Success created hotel room");
        setRefetch(true);
      } else {
        const data = await response.json();
        alert(data.message);
        console.error(
          "Failed to create hotel:",
        );
      }
    } finally {
      setTimeout(() => {
        toggleAddHotelDialog();
        setRefetch(false);
      }, 1000);
    }
  };
  

  return (
    <div className="hotellist">
      <div className="hotellistheader">
        Hotels
        <div className="hoteliconcontainer">
          <button
            id="sendButton"
            onClick={() => {
              toggleAddHotelDialog();
            }}
            className="addhotelbtn"
          >
            Add new hotel
            <PiPlus />
          </button>
        </div>
      </div>
      <div>
        {hotels.map((hotel) => (
          <Hotellistitem
            key={hotel.id}
            hotel={hotel}
            selectedHotel={selectedHotel}
            setSelectedHotel={setSelectedHotel}
          />
        ))}
      </div>
      {/* Adding new hotel */}
      {isAddHotelDialogVisible && (
        <div>
          <div
            className="backgrounddimmer"
            onClick={toggleAddHotelDialog}
          ></div>
          <div className="addhotel">
            <div>
              <h2>Add Hotel</h2>
              <div className="row1 alignleft">
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g, Four Seasons Kuta"
                />
                Hotel Name
              </div>
              <div className="row1 alignleft">
                <input
                  type="text"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g, Beautiful seaside hotel"
                />
                Description
              </div>
              <div className="row1 alignleft">
                <select
                  value={cityID}
                  onChange={(e) => setCityID(Number(e.target.value))}
                >
                  {cityChoices.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                City
              </div>
              <div className="row1 alignleft">
                <input
                  type="text"
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g, 123 Street"
                />
                Address
              </div>
              <div className="row1 alignleft">
                <input
                  type="text"
                  placeholder="e.g, 20"
                  onChange={(e) =>
                    setCapacity(
                      e.target.value !== ""
                        ? parseInt(e.target.value, 10)
                        : null
                    )
                  }
                />
                Capacity
              </div>
              <div className="row1 alignleft">Photos</div>
              <input
                id="imginput"
                className="mailsendinput"
                type="file"
                accept="image/*"
                onChange={uploadHotelImage}
              />
              <div className="addimagescroll">
                {images.map((image) => (
                  <img className="hotelimg" src={image}></img>
                ))}
              </div>
              <button
                id="sendButton"
                onClick={() => document.getElementById("imginput")?.click()}
                className="addhotelbtn"
              >
                Add photos
              </button>
              <button onClick={addNewRoom} className="addroomtypebtn">
                Add Room Type
              </button>
              <button onClick={submitToDatabase} className="addroomtypebtn">
                Create Hotel
              </button>
            </div>
          </div>
          <div className="addhotel2">
            <h2>Room Types ({roomTypes.length})</h2>
            <div className="addhotelscroll">
              {roomTypes.length > 0 ? (
                roomTypes.map((roomtype, index) => (
                  <div className="typegroup" key={roomtype.id}>
                    <button
                      className="addroomtypedelete"
                      onClick={() => removeRoom(roomtype.id)}
                    >
                      <CgClose />
                    </button>
                    Room Type {roomtype.id}
                    <div className="row1 alignleft">
                      <input
                        type="text"
                        onChange={(e) =>
                          setRoomTypes((prevRoomTypes) =>
                            prevRoomTypes.map((roomType, i) =>
                              i === index
                                ? { ...roomType, name: e.target.value }
                                : roomType
                            )
                          )
                        }
                        placeholder="e.g, Penthouse suite"
                      />
                      Type Name
                    </div>
                    <div className="row1 alignleft">
                      <input
                        type="text"
                        onChange={(e) =>
                          setRoomTypes((prevRoomTypes) =>
                            prevRoomTypes.map((roomType, i) =>
                              i === index
                                ? {
                                    ...roomType,
                                    price: parseInt(e.target.value, 10),
                                  }
                                : roomType
                            )
                          )
                        }
                        placeholder="e.g, 500"
                      />
                      Price(USD)
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Air Conditioning"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Air Conditioning
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Wifi"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Wifi
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Breakfast"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Breakfast
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Television"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Television
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Gym"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Gym
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Spa"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Spa
                      </label>
                    </div>
                    <div className="row1 alignleft">
                      <label>
                        <input
                          className="facilitycheckbox"
                          type="checkbox"
                          value="Minibar"
                          onChange={(e) =>
                            setRoomTypes((prevRoomTypes) =>
                              prevRoomTypes.map((roomType, i) =>
                                i === index
                                  ? {
                                      ...roomType,
                                      facilities: e.target.checked
                                        ? [
                                            ...roomType.facilities,
                                            e.target.value,
                                          ]
                                        : roomType.facilities.filter(
                                            (facility) =>
                                              facility !== e.target.value
                                          ),
                                    }
                                  : roomType
                              )
                            )
                          }
                        />
                        Minibar
                      </label>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-rooms-message">
                  No rooms yet, consider adding one
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotellist;
