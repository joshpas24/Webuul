import React, { useState, useEffect } from "react";
import { login } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import './LoginForm.css';
import { useNavigation } from "../../context/NavigationView";

function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const { setNavView } = useNavigation()

  useEffect(() => {
    setNavView('')
  }, [])

  if (sessionUser) return <Redirect to="/markets" />;


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const loginDemo = (e) => {
    e.preventDefault();
    let demoEmail = 'demo@aa.io'
    let demoPassword = 'password'
    dispatch(login(demoEmail, demoPassword))

    history.push("/markets")
    return;
  }

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
        <h2>Log in to <span>webuul</span></h2>
        <form onSubmit={handleSubmit}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
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
          <div className="login-button-div">
            <button type="submit">Log In</button>
          </div>
          <div className="login-button-demo">
              Don't have an account? Log in as
              <span onClick={(e) => loginDemo(e)} className="demo-button">
                Demo User
              </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginFormPage;
