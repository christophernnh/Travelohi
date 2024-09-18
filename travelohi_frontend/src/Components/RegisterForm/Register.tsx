import rs from "./Register.module.scss";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { GiDolphin } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReCAPTCHA from "react-google-recaptcha";
import { IoClose } from "react-icons/io5";

const Register = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [securityQuestion, setSecurityQuestion] = useState(
    "What is your favorite childhood pet's name?"
  );
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [gender, setGender] = useState("Male");
  const [issubscribed, setisSubscribed] = useState(false);
  const [capVal, setCapVal] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setisSubscribed(!issubscribed);
  };

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:8000/api/user", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const response = await fetch("http://localhost:8000/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          navigate("/home");
        }
      }
    })();
  }, []);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    //validations
    //first name and last name validations
    if (firstname.length < 5 || !/^[a-zA-Z]+$/.test(firstname)) {
      setErrorMessage("Invalid First name");
      return;
    }

    if (lastname.length < 5 || !/^[a-zA-Z]+$/.test(lastname)) {
      setErrorMessage("Invalid Last name");
      return;
    }

    //13 years old validations
    const currentDate = new Date();
    const userAge = currentDate.getFullYear() - (birthDate?.getFullYear() || 0);

    if (userAge < 13) {
      setErrorMessage("Must be 13 years old or older");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
    if (!passwordRegex.test(password)) {
      // Display an error message or handle the validation failure
      setErrorMessage("Invalid password");
      return;
    }

    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        birthDate,
        securityQuestion,
        securityAnswer,
        gender,
        issubscribed: String(issubscribed),
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      setErrorMessage(errorMessage);
      return;
    }
    alert("Register success")
    navigate("/login");
  };

  return (
    <div className={rs.loginbackground}>
      <IoClose className={rs.crossIcon} onClick={() => navigate("/home")} />
      <div className={rs.wrapper}>
        <form onSubmit={submit}>
          <h3>
            <GiDolphin /> travelohi
          </h3>
          <h1>Register</h1>
          <div className={rs.userdetails}>
            <div className={rs.inputbox}>
              <span className={rs.details}>First Name</span>
              <input
                type="text"
                placeholder="Example: John"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
              <FaUser className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Last Name</span>
              <input
                type="text"
                placeholder="Example: Doe"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
              <FaUser className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Email</span>
              <input
                type="email"
                placeholder="Example: johndoe@travelohi.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdEmail className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Gender</span>
              <select
                className={rs.select}
                id="gender-dropdown"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Create Password</span>
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Confirm Password</span>
              <input type="password" placeholder="Confirm Password" required />
              <FaLock className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Pick a Security Question</span>
              <select
                required
                className={rs.select}
                id="question-dropdown"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              >
                <option value="What is your favorite childhood pet's name?">
                  What is your favorite childhood pet's name?
                </option>
                <option value="In which city where you born?">
                  In which city where you born?
                </option>
                <option value="What is the name of your favorite book or movie?">
                  What is the name of your favorite book or movie?
                </option>
                <option value="What is the name of the elementary school you attended?">
                  What is the name of the elementary school you attended?
                </option>
                <option value="What is the model of your first car?">
                  What is the model of your first car?
                </option>
              </select>
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Security Question Answer</span>
              <input
                type="text"
                placeholder="Answer here"
                required
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
              <FaUser className={rs.icon} />
            </div>
            <div className={rs.inputbox}>
              <span className={rs.details}>Birth Date</span>
              <DatePicker
                required
                className={rs.input}
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
              />
            </div>
            <div className={rs.inputbox}>
              <ReCAPTCHA
                // className={ls.recaptchacontainer}
                sitekey="6Ld-0V0pAAAAAO9Nm-9eqVKK_ShMAOxIt3Bq8h95"
                onChange={(val) => setCapVal(val)}
              />
            </div>
            <div className={rs.newsletter} onClick={handleCheckboxChange}>
              Subscribe to our newsletter
              <input type="checkbox" checked={issubscribed} />
            </div>
          </div>
          <div className={rs.details}>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button className={rs.button} type="submit">
              {/* hidden={!capVal} */}
              Register
            </button>
          </div>
          <div className={rs.registerlink}>
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
