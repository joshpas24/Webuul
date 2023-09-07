import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/session";
import '../LoginFormPage/LoginForm.css';

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
        const data = await dispatch(signUp(firstName, lastName, email, password));
        if (data) {
          setErrors(data)
        }
    } else {
        setErrors(['Confirm Password field must be the same as the Password field']);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Invest in Stocks, ETFs, and Options</h1>
        <h3>Join webuul today and start investing with 0 commission*</h3>
        <div>*Relevant regulatory and exchange fees do not apply because this is a clone of Webull.</div>
        <div>*Options are risky and not suitable for all investors. Investors can rapidly lose 100% or more of their investment trading options. Before trading options, carefully read Characteristics and Risks of Standardized Options, available somewhere on the internet.</div>
        <div>*Please note this website does not allow users to trade options, or anything real.</div>
      </div>
      <div className="login-right">
        <h2>Sign up for <span>webuul</span></h2>
        <form onSubmit={handleSubmit}>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          <label>
            <div>FIRST NAME</div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label><label>
            <div>LAST NAME</div>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            <div>EMAIL</div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <div>PASSWORD</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <label>
            <div>CONFIRM PASSWORD</div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <div className="login-button-div">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupFormPage;
