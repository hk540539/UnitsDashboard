import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import { Grid } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  btm: {
    backgroundColor: "#0B72B9",
  },
  title: {
    flexGrow: 1,
    color: "springgreen",
    marginLeft: "2em",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0.2em",
    },
  },
}));

export default function Footer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <BottomNavigation className={classes.btm}>
      <Grid container justify={matchesMD ? "center" : undefined}>
        <Grid item>
          <Typography variant="h6" className={classes.title}>
            Made using React and Material-UI
          </Typography>
        </Grid>
      </Grid>
    </BottomNavigation>
  );
}
