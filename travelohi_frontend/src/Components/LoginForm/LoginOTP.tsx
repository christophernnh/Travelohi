import ls from "./Login.module.scss";
import { SyntheticEvent, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaLock } from "react-icons/fa";
import { GiDolphin } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import ReCAPTCHA from "react-google-recaptcha";
import { IoClose } from "react-icons/io5";

const LoginOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [capVal, setCapVal] = useState(null);

  const navigate = useNavigate();

  const submitsendOTP = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOTP();
    } finally {
      setLoading(false);
    }
  }

  const sendOTP = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
        }),
      });
      const data = await response.json();
      if(response.ok){
        alert('OTP sent successfully');
        setOtpSent(true);
      }else{
        throw new Error();
      }
    } catch (error) {
      alert("Email not found!");
      console.error('Error sending OTP:', error);
    }
  };

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/api/login-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email,
        otp
      })
    });

    if(response.ok){
      navigate('/home');
      setEmail('');
      setOtp('');
    }else{
      alert("Invalid OTP!");
    }


  };

  return (
    <div className={ls.loginbackground}>
      <IoClose className={ls.crossIcon} onClick={() => navigate("/home")} />
      <div className={ls.wrapper}>
        {otpSent ? (
          <form onSubmit={handleLogin}>
            <h3><GiDolphin /> travelohi</h3>
            <h1>OTP Login</h1>
            <h2>OTP</h2>
            <div className={ls.inputbox}>
              <input type="password" placeholder="OTP" required onChange={e => setOtp(e.target.value)} value={otp}/>
              <FaLock className={ls.icon} />
            </div>
            <button className={ls.button} >Login</button>
          </form>
        ) : (
          <form onSubmit={submitsendOTP}>
            <h3><GiDolphin /> travelohi</h3>
            <h1>OTP Login</h1>
            <h2>Email</h2>
            <div className={ls.inputbox}>
              <input type="email" placeholder="Example: johndoe@travelohi.com" required onChange={e => setEmail(e.target.value)} value={email}/>
              <MdEmail className={ls.icon} />
            </div>
            <div className={ls.center}>
              <ReCAPTCHA
                  className={ls.recaptchacontainer}
                  sitekey="6Ld-0V0pAAAAAO9Nm-9eqVKK_ShMAOxIt3Bq8h95"
                  onChange={(val) => setCapVal(val)}
                />
            </div>

            <button className={ls.otpbuttonotp} type="submit" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        <div className={ls.registerlink}>
          <p>Back to login? <a href="login">Login</a></p>
        </div>
      </div>
    </div>
  )
}

export default LoginOTP;
