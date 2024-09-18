import { PiPlus } from "react-icons/pi";
import "./promolist.css";
import { IoMdSend } from "react-icons/io";
import Promolistitem from "./Promolistitem";
import { SyntheticEvent, useEffect, useState } from "react";

const Promolist = ({
  selectedPromo,
  setSelectedPromo,
  refetch,
  setRefetch,
}) => {
  const [promos, setPromos] = useState([]);
  const [error, setError] = useState(String);
  const [isAddPromoDialogVisible, setAddPromoDialogVisibility] =
    useState(false);

  // insert promo
  const [promoID, setPromoID] = useState<string>("");
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number | null>();
  const [promoDescription, setPromoDescription] = useState<string>("");
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [promoImage, setPromoImage] = useState<string>("");
  const [promoType, setPromoType] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/getpromos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setPromos(data.promos);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching users: " + error.message);
      });
  }, [refetch]);

  const toggleAddPromoDialog = () => {
    setAddPromoDialogVisibility(!isAddPromoDialogVisible);
  };

  const createPromo = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:8000/api/createpromo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promocode: promoCode,
          discount: String(discount),
          promodescription: promoDescription,
          validfrom: validFrom,
          validuntil: validUntil,
          promoimage: promoImage,
          promotype: promoType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Promo created successfully:", data);
      } else {
        console.error(
          "Failed to create:",
          response.status,
          response.statusText
        );
      }
      setRefetch(true);
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        toggleAddPromoDialog(false);
        setRefetch(false);
      }, 1000);
    }
  };

  const submitPromoImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      processImageToBase64(file);
    }
  };

  const processImageToBase64 = (image: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const base64String = reader.result as string;

          setPromoImage(base64String);

          resolve();
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

  return (
    <div className="promolist">
      <div className="promolistheader">
        Promos
        <div className="promoiconcontainer">
          <button
            id="sendButton"
            onClick={() => {
              toggleAddPromoDialog();
            }}
            className="addpromobtn"
          >
            Add new promo
            <PiPlus />
          </button>
        </div>
      </div>
      <div>
        {promos.map((promo) => (
          <Promolistitem
            key={promo.id}
            promo={promo}
            selectedPromo={selectedPromo}
            setSelectedPromo={setSelectedPromo}
          />
        ))}
      </div>
      {isAddPromoDialogVisible && (
        <div>
          <div
            className="backgrounddimmer"
            onClick={toggleAddPromoDialog}
          ></div>
          <div className="addpromo">
            <div>
              <h2>Add Promo</h2>
              <img className="promoimg" src={promoImage}></img>
              <input
                id="fileinput"
                className="fileinput"
                type="file"
                accept="image/*"
                onChange={submitPromoImage}
              />
              <button
                onClick={() => document.getElementById("fileinput")?.click()}
                className="buttonStyle"
              >
                Choose Promo Image
              </button>
              <div className="row1 alignleft">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                Promo Code
              </div>
              <div className="row1 alignleft">
                <input
                  type="text"
                  //   value={promoDescription}
                  onChange={(e) => setPromoDescription(e.target.value)}
                />
                Description
              </div>
              <div className="row1 alignleft">
                <input
                  type="date"
                  value={validFrom?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setValidFrom(new Date(e.target.value))}
                />
                Valid From
              </div>
              <div className="row1 alignleft">
                <input
                  type="date"
                  value={validUntil?.toISOString().split("T")[0] || ""}
                  onChange={(e) => setValidUntil(new Date(e.target.value))}
                />
                Valid Until
              </div>
              <div className="row1 alignleft">
                <input
                  type="number"
                  value={discount || ""}
                  onChange={(e) =>
                    setDiscount(
                      e.target.value !== ""
                        ? parseInt(e.target.value, 10)
                        : null
                    )
                  }
                />
                Discount(%)
              </div>
              <div className="row1 alignleft">
                <input
                  type="text"
                  value={promoType}
                  onChange={(e) => setPromoType(e.target.value)}
                />
                Promo Type
              </div>
              <div className="row1">
                <button onClick={createPromo}>
                  {isSaving ? "Creating. . ." : "Create"}
                </button>
              </div>
            </div>
            <button className="addpromobtn" onClick={toggleAddPromoDialog}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promolist;
