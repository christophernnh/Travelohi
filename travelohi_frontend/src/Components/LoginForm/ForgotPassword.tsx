import ls from "./Login.module.scss";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiDolphin } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";

const ForgotPassword = () => {
  const [emailFound, setEmailFound] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [wrongAnswer, setWrongAnswer] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState("");

  const navigate = useNavigate();

  const checkEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setQuestion(data.question);
      setEmailFound(true);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message);
    }
  };

  const answerQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/answer-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        answer,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setQuestionAnswered(true);
    } else {
      setWrongAnswer("Wrong answer.");
    }
  };

  const validatePassword = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,30}$/;
    const newPassword = e.currentTarget.value;
  
    if (!passwordRegex.test(newPassword)) {
      setPasswordRequirements(
        "Password does not meet requirements."
      );
    } else {
      setPasswordRequirements("");
    }
  }
  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,30}$/;
    if (!passwordRegex.test(password)) {
      setPasswordRequirements(
        "Password does not meet requirements."
      );
      return;
    }

    if (password != confirmPassword) {
        setPasswordRequirements(
          "Passwords do not match."
        );
        return;
      }

    // Reset password logic
    const response = await fetch("http://localhost:8000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      setPasswordRequirements("New password cannot be the same as old password");
    }
  };

  return (
    <div className={ls.loginbackground}>
      <BiArrowBack className={ls.crossIcon} onClick={() => navigate("/login")} />
      <div className={ls.wrapper}>
        {!emailFound ? (
          <form onSubmit={(e) => checkEmail(e)}>
            <h3>
              <GiDolphin /> travelohi
            </h3>
            <h1>Password Recovery</h1>
            <h2>Provide an email</h2>
            <div className={ls.inputbox}>
              <input
                type="text"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <MdEmail className={ls.icon} />
              {errorMessage && <p className={ls.errorText}>{errorMessage}</p>}
            </div>
            <button className={ls.button}>Check E-mail</button>
          </form>
        ) : !questionAnswered ? (
          <form onSubmit={(e) => answerQuestion(e)}>
            <h3>
              <GiDolphin /> travelohi
            </h3>
            <h1>Security question</h1>
            <h2>{question}</h2>
            <div className={ls.inputbox}>
              <input
                type="text"
                placeholder="Answer"
                required
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
              />
              <MdEmail className={ls.icon} />
              {wrongAnswer && <p className={ls.errorText}>{wrongAnswer}</p>}
            </div>
            <button className={ls.button}>Submit</button>
          </form>
        ) : (
          <form onSubmit={(e) => changePassword(e)}>
            <h3>
              <GiDolphin /> travelohi
            </h3>
            <h1>Reset Password</h1>
            <h2>New password</h2>
            <div className={ls.inputbox}>
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => {setPassword(e.target.value); validatePassword(e);}}
                value={password}
              />
              <MdEmail className={ls.icon} />
            </div>
            <h2>Confirm new password</h2>
            <div className={ls.inputbox}>
              <input
                type="password"
                placeholder="Confirm password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              <MdEmail className={ls.icon} />
              {passwordRequirements && <p className={ls.errorText}>{passwordRequirements}</p>}
            </div>
            <button className={ls.button}>Submit</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
