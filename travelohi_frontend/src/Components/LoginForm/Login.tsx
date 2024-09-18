import ls from "./Login.module.scss";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { GiDolphin } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import ReCAPTCHA from "react-google-recaptcha";
import { IoClose } from "react-icons/io5";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [capVal, setCapVal] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const navigateToOTP = () => {
    navigate("/loginOTP");
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    await submitWithPassword();
  };

  const submitWithPassword = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/home");
      } else {
        try {
          const response = await fetch("http://localhost:8000/api/loginadmin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              email,
              password,
            }),
          });
          const data = await response.json();

          if (response.ok) {
            // setErrorMessage(data.message);
            navigate("/admin");
          } else {
            setErrorMessage(data.message);
          }
        } catch (error) {
          console.error("An error occurred during login:", error);
        }
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
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

  return (
    <div>
      <IoClose className={ls.crossIcon} onClick={() => navigate("/home")} />
      <div className={ls.loginbackground}>
        <div className={ls.wrapper}>
          <form onSubmit={submit}>
            <h3>
              <GiDolphin /> travelohi
            </h3>
            <h1>Login</h1>
            <h2>Email</h2>
            <div className={ls.inputbox}>
              <input
                type="email"
                placeholder="Example: johndoe@travelohi.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdEmail className={ls.icon} />
            </div>

            <h2>Password</h2>
            <div className={ls.inputbox}>
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className={ls.icon} />
            </div>

            <div className={ls.rememberforgot}>
              <a href="/forgot-password">Forgot password?</a>
            </div>

            <div className={ls.center}>
              <ReCAPTCHA
                className={ls.recaptchacontainer}
                sitekey="6Ld-0V0pAAAAAO9Nm-9eqVKK_ShMAOxIt3Bq8h95"
                onChange={(val) => setCapVal(val)}
              />
            </div>

            {errorMessage && (
              <div className={ls.errorText}>
                <p>{errorMessage}</p>
              </div>
            )}

            <button disabled={!capVal} className={ls.button} type="submit">
              Login
            </button>
            <button className={ls.otpbutton} onClick={navigateToOTP}>
              Login with OTP
            </button>

            <div className={ls.registerlink}>
              <p>
                Don't have an account? <a href="register">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
