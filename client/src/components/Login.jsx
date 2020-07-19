import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Typography, Button, TextField, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";

import { signInStart } from ".././store/user/userState";
import { selectToken, selectError } from "../store/user/user.selector";
const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: "2em",

    marginBottom: "2em",
    height: "1.5em",
    minWidth: "20em",
  },
  loginConatiner: {
    marginTop: "3em",
    [theme.breakpoints.down("sm")]: {
      marginTop: "1em",
    },
    marginBottom: "5em",
    minWidth: "20em",
    minHeight: "24em",
    [theme.breakpoints.down("md")]: {
      minWidth: "20em",
    },
  },
  button: {
    marginTop: "2em",

    marginBottom: "2em",
  },
}));
const Login = (props) => {
  const { token, error } = useSelector((state) => ({
    token: selectToken(state),
    error: selectError(state),
  }));

  useEffect(() => {
    if (token) {
      props.history.push("/");
      // clearErrors();
    }

    if (error) {
      setAlert({
        open: true,
        message: "Something went wrong, verify and please try again!",
        backgroundColor: "#ff3232",
      });
    }
    // eslint-disable-next-line
  }, [token, props.history, error]);
  const [email, setEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [errorFormat, setError] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    backgroundColor: "",
  });
  const dispatch = useDispatch();
  const onchange = (event) => {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);

        let emailValid;
        emailValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
          event.target.value
        );
        if (!emailValid) {
          setError({ ...errorFormat, email: "Invalid email" });
        } else {
          setError({ ...errorFormat, email: "" });
        }
        break;
      case "password":
        SetPassword(event.target.value);
        break;

      default:
        break;
    }
  };
  const onsubmit = (e) => {
    e.preventDefault();
    dispatch(signInStart({ email, password }));
    // setAlert({
    //   open: error.length,
    //   message: "Something went wrong, verify and please try again!",

    //   backgroundColor: "#ff3232",
    // });
  };

  const classes = useStyles();
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      direction="column"
      className={classes.loginConatiner}
    >
      <Typography variant="h1">Login</Typography>
      <form onSubmit={onsubmit}>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          style={{ minWidth: "15em" }}
        >
          <TextField
            name="email"
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={onchange}
            className={classes.textField}
            error={errorFormat.email.length !== 0}
            helperText={errorFormat.email}
            variant="outlined"
            margin="normal"
            fullWidth
            autoComplete="email"
            autoFocus
          />
          <TextField
            id="standard-password-input"
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={onchange}
            variant="outlined"
            className={classes.textField}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={classes.button}
            disabled={
              email.length === 0 ||
              errorFormat.email.length !== 0 ||
              password.length < 6
            }
          >
            Login
          </Button>
        </Grid>
      </form>
      <Grid item container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4" color="secondary">
            <span style={{ color: "#0B72B9" }}> Use:</span> guest@email.com
          </Typography>
        </Grid>
        <Grid item style={{ marginTop: "1em" }}>
          <Typography variant="h4" color="secondary">
            <span style={{ color: "#0B72B9" }}> Use:</span> guest123
          </Typography>
        </Grid>
      </Grid>

      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
    </Grid>
  );
};
export default Login;
