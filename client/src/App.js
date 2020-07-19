import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Header from "./ui/Header";
import Footer from "./ui/Footer";
import theme from "./ui/Theme";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <Header />
          <Switch>
            <PrivateRoute exact path="/" component={LandingPage} />

            <Route exact path="/login" component={Login} />
          </Switch>
          <Footer />
        </Router>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
