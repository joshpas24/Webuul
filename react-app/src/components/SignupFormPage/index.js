import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import '../LoginFormPage/LoginForm.css';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import './SignupForm.css'
import { useNavigation } from "../../context/NavigationView";

function SignupFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true)

  const { setNavView } = useNavigation()

  useEffect(() => {
    setNavView('signup')
  }, [])

  useEffect(() => {
    if (password.length > 0 && password.length < 8) {
      setErrors({"password": "Password must be a minimum of 8 characters"})
    } else {
      setErrors({})
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword && (confirmPassword !== password) && confirmPassword.length < 8) {
      setErrors({"confirmPassword": "Passwords do not match"})
    } else {
      setErrors({})
    }
  }, [confirmPassword])

  useEffect(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.length) {
      const isValid = emailPattern.test(email);
      setIsValidEmail(isValid);
    }
  }, [email]);

  useEffect(() => {
    if (firstName && firstName.length < 2) {
      setErrors({'firstName': 'Minimum 2 characters'})
    } else {
      setErrors({})
    }
  }, [firstName])

  useEffect(() => {
    if (lastName && lastName.length < 2) {
      setErrors({'lastName': 'Minimum 2 characters'})
    } else {
      setErrors({})
    }
  }, [lastName])

  useEffect(() => {
    if (errors.firstName || errors.lastName || !isValidEmail || errors.email || errors.password || errors.confirmPassword) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [errors])

  if (sessionUser) return <Redirect to="/markets" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(firstName, lastName, email, password));
        if (data) {
          let message = data['email'][0]
          setErrors({'email': message})
        }
    } else {
        setErrors({"confirmPassword": 'Passwords do not match'});
        // setDisabled(true)
    }
  };

  return (
    <div className="login-container">
      <div className="signup-left">
        <h1>Paper trade stocks and ETFs</h1>
        <h3>Join webuul today and start investing with $100,000</h3>
        <div>*Relevant regulatory and exchange fees do not apply because this is a clone of Webull.</div>
        <div>*Options are risky and not suitable for all investors. Investors can rapidly lose 100% or more of their investment trading options. Before trading options, carefully read Characteristics and Risks of Standardized Options, available somewhere on the internet.</div>
        <div>*Please note this website does not allow users to trade options, or anything real.</div>
      </div>
      <div className="signup-right">
        <h2>Sign up for <span>webuul</span></h2>
        <form onSubmit={handleSubmit}>
          {/* {errors.map((error, idx) => <li key={idx}>{error}</li>)} */}
          <label>
            <div>FIRST NAME</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && (<p className="error-message">{errors.firstName}</p>)}
          </label>
          <label>
            <div>LAST NAME</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && (<p className="error-message">{errors.lastName}</p>)}
          </label>
          <label>
            <div>EMAIL</div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (<p className="error-message">{errors.email}</p>)}
            {!isValidEmail && <p className="error-message">Invalid email</p>}
          </label>
          <label>
            <div>PASSWORD</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (<p className="error-message">{errors.password}</p>)}
          </label>
          <label>
            <div>CONFIRM PASSWORD</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (<p className="error-message">{errors.confirmPassword}</p>)}
          </label>
          <div className="login-button-div">
            <button type="submit" disabled={disabled}>Sign Up</button>
          </div>
          <div className="login-button-demo">
              Already have an account? Log in
              <span onClick={() => history.push("/login")} className="demo-button">
                here.
              </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
