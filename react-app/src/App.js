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
import StockDetailsPage from "./components/StockDetailsPage";
import PortfolioPage from "./components/Portfolio";
import TradingPage from "./components/TradingPage";
import Footer from "./components/Footer";
import StockPieChart from "./components/PieChart";
import TradingSplash from "./components/TradingPage/TradingSplash";
import NewsComponent from "./components/News";

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
          <ProtectedRoute exact path="/markets/:symbol">
            <StockDetailsPage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/test">
            <TestChart />
          </ProtectedRoute>
          <ProtectedRoute exact path="/portfolio">
            <PortfolioPage />
          </ProtectedRoute>
          <ProtectedRoute exact path="/trading/:symbol">
            <TradingPage />
          </ProtectedRoute>
          <Route exact path='/trading'>
            <TradingSplash />
          </Route>
          <Route exact path='/news'>
            <NewsComponent />
          </Route>
        </Switch>
      )}
      <Footer />
    </>
  );
}

export default App;
