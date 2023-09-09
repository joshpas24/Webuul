import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import SplashPage from "./components/SplashPage";
import './App.css'
import MarketsPage from "./components/MarketsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import TestChart from "./components/TestChat";
import LoadingComponent from "./components/LoadingVid";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SplashPage />
          </Route>
          <Route exact path="/login" >
            <LoginFormPage />
          </Route>
          <Route exact path="/signup">
            <SignupFormPage />
          </Route>
          <ProtectedRoute exact path="/markets">
            <MarketsPage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/test">
            <TestChart />
          </ProtectedRoute>
          <Route>
            <LoadingComponent />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
