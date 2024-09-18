import { useEffect, useState } from "react";
import "./userlist.css";
import Userlistitem from "./Userlistitem";
import { IoMdSend } from "react-icons/io";

const Userlist = ({ selectedUser, setSelectedUser, refetch }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(String);

  useEffect(() => {
    fetch("http://localhost:8000/api/getusers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "success") {
          setUsers(data.users);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Error fetching users: " + error.message);
      });
  }, [refetch]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const sendButton = document.getElementById("sendButton");
        if (sendButton) {
          sendButton.innerText = "Sending...";
        }

        const response = await fetch(
          "http://localhost:8000/api/sendnewsletter",
          {
            method: "POST",
            body: formData,
          }
        );

        // Restore the original button text after 2 seconds
        setTimeout(() => {
          if (sendButton) {
            sendButton.innerText = "Send email";
          }
        }, 1000);

        const data = await response.json();

        if (response.ok) {
          alert("Newsletter sent successfully");
        } else {
          alert("Error sending email: " + data.message);
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className="userlist">
      <div className="userlistheader">
        Users
        <div className="iconcontainer">
          <input
            id="fileinput"
            className="mailsendinput"
            type="file"
            accept="html/*"
            onChange={handleFileChange}
          />
          <button
            id="sendButton"
            onClick={() => document.getElementById("fileinput")?.click()}
            className="openmailbtn"
          >
            Send email
          </button>
          {/* <button className="openmailbtn"><IoMdSend /></button> */}
        </div>
      </div>
      <div>
        {users.map((user) => (
          <Userlistitem
            key={user.id}
            user={user}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />
        ))}
      </div>
    </div>
  );
};

export default Userlist;
