import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStructuredSelector } from "reselect";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { KeyboardDatePicker } from "@material-ui/pickers";
import PeopleIcon from "@material-ui/icons/People";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { watchUnitsStart } from "../store/unit/unitState";
import {
  watchAddNewUnitStart,
  watchUpdateUnitStart,
} from "../store/unit/unit.saga";
import {
  selectUnits,
  selectError,
  selectUnitsLoading,
} from "../store/unit/unit.selector";
import EnhancedTable from "../ui/EnhancedTable";
const useStyles = makeStyles((theme) => ({
  service: {
    fontWeight: 300,
  },
  button: {
    color: "#fff",
    backgroundColor: theme.palette.common.orange,
    borderRadius: 50,
    textTransform: "none",
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
  },
}));

const Services = ["Security", "Housekeeping", "Outsourcing"];

const LandingPage = () => {
  const { units } = useSelector(
    createStructuredSelector({ units: selectUnits })
  );

  const { unitUploadError } = useSelector(
    createStructuredSelector({ unitUploadError: selectError })
  );
  const { unitLoading } = useSelector(
    createStructuredSelector({ unitLoading: selectUnitsLoading })
  );

  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  // search State
  const [search, SetSearch] = useState("");

  // toggle state
  const [securityChecked, setSecurityChecked] = useState(false);
  const [housekeepingChecked, setHousekeepingChecked] = useState(false);
  const [outsourcingChecked, setOutsourcingChecked] = useState(false);
  const [unitActivechecked, setUnitActiveChecked] = useState(false);

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // new unit state
  const [unitName, setUnitName] = useState("");
  const [location, setLocation] = useState("");
  const [startdate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [employees, setEmployess] = useState("");
  const [activeService, setActiveService] = useState(false);
  const [sector, setSector] = useState("");
  const [service, setService] = useState([]);

  // enhancedTable pages(for fallback to first page if user tries to search using filter text search)
  const [page, setPage] = React.useState(0);

  // storing data to tableData from redux store
  const [tableData, setTableData] = useState([]);

  // state for updating unit
  const [unitID, setUnitId] = useState("");
  const [updateUnitState, setUpdateUnitState] = useState([]);
  // filing Data for updating Unit
  const clearUnitState = () => {
    setUnitName("");
    setLocation("");
    setStartDate(new Date());
    setEndDate(new Date());
    setEmployess("");
    setActiveService(false);
    setSector("");
    setService([]);
  };

  const updateUnit = () => {
    const needToUpdate = [
      {
        unitName: null,
        location: null,
        startedAt: null,
        activeUpto: null,
        employees: null,
        active: null,
        sector: null,
        typesOfService: null,
      },
    ];
    if (updateUnitState[0].unitName !== unitName) {
      needToUpdate[0]["unitName"] = unitName;
    }
    if (updateUnitState[0].location !== location) {
      needToUpdate[0]["location"] = location;
    }
    if (updateUnitState[0].startedAt !== startdate) {
      needToUpdate[0]["startedAt"] = `${startdate}`;
    }
    if (updateUnitState[0].activeUpto !== endDate) {
      needToUpdate[0]["activeUpto"] = `${endDate}`;
    }
    if (updateUnitState[0].employees !== employees) {
      needToUpdate[0]["employees"] = employees;
    }
    if (updateUnitState[0].sector !== sector) {
      needToUpdate[0]["sector"] = sector;
    }
    if (updateUnitState[0].active !== activeService) {
      needToUpdate[0]["active"] = activeService === "Yes" ? "Yes" : "No";
    }
    if (updateUnitState[0].tos !== service) {
      needToUpdate[0]["typesOfService"] = service.join(",");
    }

    var filledProps = needToUpdate.map((el) => {
      return Object.keys(el).reduce((newObj, key) => {
        const value = el[key];
        if (value !== null) {
          newObj[key] = value;
        }
        return newObj;
      }, {});
    });

    dispatch(watchUpdateUnitStart({ filledProps, id: updateUnitState[0]._id }));
    if (!unitUploadError) {
      setDialogOpen(false);
      clearUnitState();
      setUnitId("");
    }
  };

  const updateUnitCheck = (unitIDUpdate) => {
    if (unitIDUpdate) {
      const filtredUnit = tableData.filter((unit) => unit._id === unitIDUpdate);
      setUpdateUnitState(filtredUnit);
      setUnitName(filtredUnit[0].unitName);
      setLocation(filtredUnit[0].location);
      setStartDate(filtredUnit[0].startedAt);
      setEndDate(filtredUnit[0].activeUpto);
      setEmployess(filtredUnit[0].employees);
      setSector(filtredUnit[0].sector);
      setActiveService(filtredUnit[0].active);
      setService(filtredUnit[0].tos);
    } else {
      clearUnitState();
    }
  };

  useEffect(() => {
    dispatch(watchUnitsStart());
    if (!unitLoading) {
      setTableData(units);
    }
    updateUnitCheck(unitID);
  }, [watchUnitsStart, dispatch, unitLoading, unitID, watchUnitsStart]);

  const addUnit = () => {
    let startedAt = `${startdate}`;
    let activeUpto = `${endDate}`;
    // let startedAt = format(startdate, "dd/MM/yyyy");
    // let activeUpto = format(endDate, "dd/MM/yyyy");
    let present = activeService ? "Yes" : "No";
    dispatch(
      watchAddNewUnitStart({
        unitName,
        location,
        startedAt,
        activeUpto,
        employees,
        sector,
        active: present,
        typesOfService: service.join(","),
      })
    );

    if (!unitUploadError) {
      setDialogOpen(false);
      clearUnitState();
    }
  };

  // filtering logic of text search and navigating user to first page if they are applying search filter
  // so that search result is present at second page it will be moved to first page
  const handleSearch = (event) => {
    SetSearch(event.target.value);

    // filtering out search value from the option because it contain true or false value
    const rowData = tableData.map((row) =>
      Object.values(row).filter((option) => option !== true && option !== false)
    );

    // if search input matches it stores in matches array
    const matches = rowData.map((row) =>
      row.map((option) =>
        option
          .toString()
          .toLowerCase()
          .includes(event.target.value.toString().toLowerCase())
      )
    );
    const newRows = [...tableData];
    matches.map((row, index) =>
      row.includes(true)
        ? (newRows[index].search = true)
        : (newRows[index].search = false)
    );

    setTableData(newRows);
    setPage(0);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems={matchesSM ? "center" : undefined}
    >
      <Grid
        item
        style={{ marginTop: "2em", marginLeft: matchesSM ? 0 : "5em" }}
      >
        <Typography variant="h1">Units</Typography>
      </Grid>
      <Grid item>
        <TextField
          placeholder="Search for the Unit or Create New."
          style={{
            width: matchesSM ? "25em" : "35em",
            marginLeft: matchesSM ? 0 : "5em",
          }}
          value={search}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() => setDialogOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <Tooltip title="New Unit">
                  <AddIcon color="primary" style={{ fontSize: 30 }} />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid
        item
        style={{ marginLeft: matchesSM ? 0 : "5em", marginTop: "2em" }}
      >
        <FormGroup row>
          <Grid
            container
            direction={matchesSM ? "column" : "row"}
            justify={matchesSM ? "center" : undefined}
          >
            <Grid item>
              <FormControlLabel
                style={{ marginRight: matchesSM ? 0 : "5em" }}
                control={
                  <Switch
                    checked={securityChecked}
                    color="primary"
                    onChange={() => setSecurityChecked(!securityChecked)}
                  />
                }
                label="Security"
                labelPlacement={matchesSM ? "end" : "start"}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                style={{ marginRight: matchesSM ? 0 : "5em" }}
                control={
                  <Switch
                    checked={housekeepingChecked}
                    color="primary"
                    onChange={() =>
                      setHousekeepingChecked(!housekeepingChecked)
                    }
                  />
                }
                label="Housekeeping"
                labelPlacement={matchesSM ? "end" : "start"}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                style={{ marginRight: matchesSM ? 0 : "5em" }}
                control={
                  <Switch
                    checked={outsourcingChecked}
                    color="primary"
                    onChange={() => setOutsourcingChecked(!outsourcingChecked)}
                  />
                }
                label="Outsourcing"
                labelPlacement={matchesSM ? "end" : "start"}
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={unitActivechecked}
                    color="primary"
                    onChange={() => setUnitActiveChecked(!unitActivechecked)}
                  />
                }
                label="Active units"
                labelPlacement={matchesSM ? "end" : "start"}
              />
            </Grid>
          </Grid>
        </FormGroup>
      </Grid>

      <Grid
        item
        style={{
          marginTop: "5em",
          marginBottom: matchesMD ? "40em" : "35em",
          maxWidth: "100%",
        }}
      >
        {/* Passing tableData and setTableData for deleting the rows and page and setpage to move user to first page
        if they are using search filter
        */}
        {/* passing setDialogOpen and setUnitId to update the unit */}
        {/* passing filter switch sate for filtering */}
        <EnhancedTable
          tableData={tableData}
          setTableData={setTableData}
          page={page}
          setPage={setPage}
          setDialogOpen={setDialogOpen}
          setUnitId={setUnitId}
          securityChecked={securityChecked}
          housekeepingChecked={housekeepingChecked}
          outsourcingChecked={outsourcingChecked}
          unitActivechecked={unitActivechecked}
        />
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="md"
        fullScreen={matchesSM}
        style={{ zIndex: 1302 }}
      >
        <Grid container justify="center">
          <Grid item>
            <Typography variant="h1" gutterBottom>
              Add a new unit
            </Typography>
          </Grid>
        </Grid>
        <DialogContent>
          <Grid
            container
            justify="space-between"
            direction={matchesSM ? "column" : "row"}
          >
            <Grid item>
              <Grid
                container
                item
                direction="column"
                sm
                alignItems={matchesSM ? "center" : undefined}
              >
                <Grid item>
                  <TextField
                    label="Unit Name"
                    id="name"
                    style={{ width: matchesSM ? 250 : undefined }}
                    fullWidth={!matchesSM}
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  style={{ marginTop: matchesSM ? 50 : "5em" }}
                  alignItems={matchesSM ? "center" : undefined}
                >
                  <Grid item>
                    <Typography variant="h4">Sector</Typography>
                  </Grid>
                  <Grid item>
                    <RadioGroup
                      aria-label="sector"
                      name="sector"
                      value={sector}
                      onChange={(event) => setSector(event.target.value)}
                    >
                      <FormControlLabel
                        classes={{ label: classes.service }}
                        value="public"
                        label="Public"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        classes={{ label: classes.service }}
                        value="private"
                        label="Private"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        classes={{ label: classes.service }}
                        value="public-private"
                        label="Public-Private"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
                <Grid item style={{ marginTop: matchesSM ? 50 : "5em" }}>
                  <FormGroup row>
                    <FormControlLabel
                      style={{ marginRight: "5em" }}
                      control={
                        <Switch
                          checked={activeService}
                          color="primary"
                          onChange={() => setActiveService(!activeService)}
                        />
                      }
                      label="Active"
                      labelPlacement="start"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                item
                direction="column"
                sm
                alignItems={matchesSM ? "center" : undefined}
              >
                <Grid item>
                  <TextField
                    label="Location"
                    style={{ width: matchesSM ? 250 : undefined }}
                    id="location"
                    fullWidth={!matchesSM}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  container
                  direction="column"
                  style={{ marginTop: "5em" }}
                  alignItems={matchesSM ? "center" : undefined}
                >
                  <Grid item>
                    <Typography variant="h4">Active From</Typography>
                    <KeyboardDatePicker
                      DialogProps={{ style: { zIndex: 1302 } }}
                      style={{ width: matchesSM ? 250 : undefined }}
                      format="dd/MM/yyyy"
                      value={startdate}
                      onChange={(newDate) => setStartDate(newDate)}
                    />
                  </Grid>

                  <Grid item item style={{ marginTop: "1em" }}>
                    <Typography variant="h4">Active Upto</Typography>
                    <KeyboardDatePicker
                      DialogProps={{ style: { zIndex: 1302 } }}
                      style={{ width: matchesSM ? 250 : undefined }}
                      format="dd/MM/yyyy"
                      value={endDate}
                      onChange={(newDat) => setEndDate(newDat)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid
                container
                item
                direction="column"
                sm
                alignItems={matchesSM ? "center" : undefined}
                style={{ marginTop: matchesSM ? 50 : undefined }}
              >
                <Grid item>
                  <TextField
                    fullWidth={!matchesSM}
                    label="Total Employess"
                    style={{ width: matchesSM ? 250 : undefined }}
                    id="employess"
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployess(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PeopleIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item style={{ marginTop: matchesSM ? 50 : "5em" }}>
                  {!matchesSM ? (
                    <InputLabel id="service">Choose Services</InputLabel>
                  ) : undefined}
                  <Select
                    labelId="service"
                    id="service"
                    MenuProps={{ style: { zIndex: 1302 } }}
                    style={{ width: matchesSM ? 250 : "12em" }}
                    multiple
                    displayEmpty
                    fullWidth={!matchesMD}
                    value={service}
                    onChange={(event) => setService(event.target.value)}
                    renderValue={
                      !matchesSM
                        ? undefined
                        : service.length > 0
                        ? () => "Choose Services"
                        : undefined
                    }
                  >
                    {Services.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justify="center" style={{ marginTop: "3em" }}>
            <Grid item>
              <Button
                color="primary"
                style={{ fontWeight: 300 }}
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                className={classes.button}
                onClick={unitID ? updateUnit : addUnit}
                disabled={
                  unitName.length === 0 ||
                  location.length === 0 ||
                  employees.length === 0 ||
                  sector.length === 0 ||
                  service.length === 0
                }
              >
                {unitID ? "Update Unit" : " Add Unit +"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default LandingPage;
