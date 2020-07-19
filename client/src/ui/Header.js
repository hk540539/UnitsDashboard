import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/styles";
import { useSelector } from "react-redux";

import Button from "@material-ui/core/Button";

import { selectToken } from "../store/user/user.selector";
import { logoutBegin } from "../store/user/user.saga";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: "#fff",
    marginLeft: "2em",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0.2em",
    },
  },
  appbar: {
    zIndex: theme.zIndex.modal + 1,
    flexGrow: 1,
    minHeight: "5em",
    [theme.breakpoints.down("sm")]: {
      minHeight: "3em",
    },
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "3.9em",
    [theme.breakpoints.down("md")]: {
      marginBottom: "2.2em",
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "2.5em",
    },
  },
}));

export default function Header(props) {
  const classes = useStyles();

  const { token } = useSelector((state) => ({
    token: selectToken(state),
  }));

  const dispatch = useDispatch();
  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appbar}>
        <Toolbar disableGutters>
          <Typography variant="h6" className={classes.title}>
            Demo of Freelance Project on units management
          </Typography>
          {token ? (
            <Button
              variant="contained"
              color="secondary"
              style={{ marginRight: "0.2em" }}
              onClick={() => dispatch(logoutBegin())}
            >
              Logout
            </Button>
          ) : undefined}
        </Toolbar>
      </AppBar>

      <div className={classes.toolbarMargin} />
    </React.Fragment>
  );
}
