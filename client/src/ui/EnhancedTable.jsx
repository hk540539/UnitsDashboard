import React, { useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Update";
import FilterListIcon from "@material-ui/icons/FilterList";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TexTField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import PeopleIcon from "@material-ui/icons/People";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";

import { watchDeleteNewUnitStart } from "../store/unit/unit.saga";

// datetime utility fn
function convert(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "unitName", label: "Unit Name" },
  { id: "startedAt", label: "Started At" },
  { id: "typesOfService", label: "Service" },
  { id: "sector", label: "Sector" },
  { id: "employees", label: "Employees" },
  { id: "active", label: "Active" },
  { id: "location", label: "Location" },
  { id: "activeUpto", label: "Active Upto" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },

  menu: {
    "&:hover": {
      backgroundColor: "#fff",
    },
    "&.Mui-focusVisible": {
      backgroundColor: "#fff",
    },
  },
  totalFilter: {
    fontSize: "2rem",
    color: theme.palette.common.orange,
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const dispatch = useDispatch();
  const {
    filterPrice,
    SetFilterPrice,
    totalFilterIcon,
    setTotalFilterIcon,
  } = props;

  // state for snackbar
  const [alert, setAlert] = useState({
    open: false,
    color: "#FF3232",
    message: " Unit Deleted",
  });

  // hiding the selcted row from the table before confirmation delete
  const onDelete = () => {
    const copyRows = [...props.tableData];
    const selectedRows = copyRows.filter((row) =>
      props.selected.includes(row.unitName)
    );
    selectedRows.map((row) => (row.search = false));
    props.setTableData(copyRows);
    setUndo(selectedRows);
    props.setSelected([]);

    setAlert({ ...alert, open: true });
  };

  // undo state for storing the deleted selcted option

  const [undo, setUndo] = useState([]);
  // undo delete

  const onUndo = () => {
    setAlert({ ...alert, open: false });
    const copyRows = [...props.tableData];

    const redo = [...undo];

    redo.map((row) => (row.search = true));

    // find and overriding values in of first array with second array
    Array.prototype.push.apply(copyRows, ...redo);
    props.setTableData(copyRows);
  };

  // unit Update
  const onUpdate = () => {
    // props.selected is array
    const copyRows = [...props.tableData];
    const selectedRows = copyRows.filter((row) =>
      props.selected.includes(row.unitName)
    );
    props.setUnitId(selectedRows[0]._id);
    props.setDialogOpen(true);
    props.setSelected([]);
  };

  // state for menu for positioning in the screen and filter logic by employee count
  const [anchorEl, setAnchorEl] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  // Moved totalFilterIcon, setTotalFilterIcon for chip state
  // const [totalFilterIcon, setTotalFilterIcon] = useState(">");

  // evaulating the total and filtering units by employee count using js eval function
  const handleTotalFilter = (event) => {
    SetFilterPrice(event.target.value);
    if (event.target.value !== "") {
      const newFilteredUnitsByCount = [...props.tableData];
      newFilteredUnitsByCount.map((unit) =>
        eval(
          `${event.target.value} ${
            totalFilterIcon === "=" ? "===" : totalFilterIcon
          } ${unit.employees}`
        )
          ? (unit.search = true)
          : (unit.search = false)
      );
      props.setTableData(newFilteredUnitsByCount);
    } else {
      const undonewFilteredUnitsByCount = [...props.tableData];
      undonewFilteredUnitsByCount.map((unit) => (unit.search = true));
      props.setTableData(undonewFilteredUnitsByCount);
    }
  };

  const filterChange = (operator) => {
    if (filterPrice !== "") {
      const newFilteredUnitsByCount = [...props.tableData];
      newFilteredUnitsByCount.map((unit) =>
        eval(
          `${filterPrice} ${operator === "=" ? "===" : operator} ${
            unit.employees
          }`
        )
          ? (unit.search = true)
          : (unit.search = false)
      );
      props.setTableData(newFilteredUnitsByCount);
    }
  };
  const menuHandleClick = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenMenu(true);
  };
  const menuHandleClose = (e) => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {null}
        </Typography>
      )}

      {numSelected === 0 ? (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list" onClick={menuHandleClick}>
            <FilterListIcon style={{ fontSize: 50 }} />
          </IconButton>
        </Tooltip>
      ) : numSelected === 1 ? (
        <React.Fragment>
          <Tooltip title="Update">
            <IconButton aria-label="update" onClick={onUpdate}>
              <UpdateIcon style={{ fontSize: 30 }} color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon style={{ fontSize: 30 }} color="primary" />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ) : (
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={onDelete}>
            <DeleteIcon style={{ fontSize: 30 }} color="primary" />
          </IconButton>
        </Tooltip>
      )}
      {/*  if undo is not selected then deleting after 4000 seconds */}
      <Snackbar
        open={alert.open}
        ContentProps={{
          style: {
            backgroundColor: alert.color,
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        message={alert.message}
        onClose={(event, reason) => {
          setAlert({ ...alert, open: false });
          // managing locally
          //   const copyUnit = [...props.tableData];
          //   const _id = [...undo.map((unit) => unit._id)];
          //   props.setTableData(
          //     copyUnit.filter((unit) => !_id.includes(unit._id))
          //   );

          // click anywhere to close snackbar
          // api to delete units
          if (reason === "clickaway") {
            const _id = [...undo.map((unit) => unit._id)];

            dispatch(watchDeleteNewUnitStart(_id));
          }
        }}
        action={
          <Button onClick={onUndo} style={{ color: "#fff" }}>
            Undo
          </Button>
        }
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={menuHandleClose}
        elevation={0}
        style={{ zIndex: 1302 }}
        keepMounted
      >
        <MenuItem classes={{ root: classes.menu }}>
          <TexTField
            value={filterPrice}
            onChange={handleTotalFilter}
            placeholder="Filter by Emp count"
            InputProps={{
              type: "number",
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setTotalFilterIcon(
                      totalFilterIcon === ">"
                        ? "<"
                        : totalFilterIcon === "<"
                        ? "="
                        : ">"
                    );
                    filterChange(
                      totalFilterIcon === ">"
                        ? "<"
                        : totalFilterIcon === "<"
                        ? "="
                        : ">"
                    );
                  }}
                >
                  <span className={classes.totalFilter}>{totalFilterIcon}</span>
                </InputAdornment>
              ),
            }}
          />
        </MenuItem>
      </Menu>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  chip: {
    marginRight: "2em",
    backgroundColor: theme.palette.common.blue,
    color: "#fff",
  },
}));

export default function EnhancedTable({
  tableData,
  setTableData,
  page,
  setPage,
  setDialogOpen,
  setUnitId,
  securityChecked,
  housekeepingChecked,
  outsourcingChecked,
  unitActivechecked,
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("unitName");
  const [selected, setSelected] = React.useState([]);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // brougth this state here for managing chip state
  const [filterPrice, SetFilterPrice] = useState("");
  const [totalFilterIcon, setTotalFilterIcon] = useState(">");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableData.map((n) => n.unitName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, unitName) => {
    const selectedIndex = selected.indexOf(unitName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, unitName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // filter switch logic

  const switchFilters = () => {
    // every filter return matched array

    const security = tableData.filter((unit) =>
      unit.tos.some((service) =>
        securityChecked ? service === "Security" : null
      )
    );

    // const housekeeping = tableData.filter((unit) =>
    //   unit.tos.some((service) =>
    //     housekeepingChecked ? service == "Housekeeping" : null
    //   )
    // );

    const housekeeping = tableData.filter((service) =>
      housekeepingChecked
        ? service.typesOfService.includes("Housekeeping")
        : null
    );

    const outsourcing = tableData.filter((unit) =>
      unit.tos.some((service) =>
        outsourcingChecked ? service === "Outsourcing" : null
      )
    );
    const activeunit = tableData.filter((unit) =>
      unitActivechecked ? unit.active === "Yes" : null
    );

    if (
      !securityChecked &&
      !outsourcingChecked &&
      !housekeepingChecked &&
      !unitActivechecked
    ) {
      return tableData;
    } else {
      let newUnits = security.concat(
        housekeeping.filter((item) => security.indexOf(item) < 0)
      );
      let newUnits2 = newUnits.concat(
        outsourcing.filter((item) => newUnits.indexOf(item) < 0)
      );
      let newUnits3 = newUnits2.concat(
        activeunit.filter((item) => newUnits2.indexOf(item) < 0)
      );
      return newUnits3;
    }
  };

  // pricefilter takes swithfilter fn as argument(composition)

  // 1) important, Here we are checking unit.search === false(because switchfilter(alias switchUnits)
  // ... sets the search state to true or flase based on match)
  // 2) if search is already false we are setting the search value to null and
  // ... and applying the pricefilter to the left units and setting the search value to true or false
  // based on eval condition

  const priceFilters = (switchUnits) => {
    if (filterPrice !== "") {
      const newFilteredUnitsByCount = [...switchUnits];
      newFilteredUnitsByCount.map((unit) =>
        eval(
          `${filterPrice} ${
            totalFilterIcon === "=" ? "===" : totalFilterIcon
          } ${unit.employees}`
        )
          ? unit.search === false
            ? null
            : (unit.search = true)
          : (unit.search = false)
      );
      return newFilteredUnitsByCount;
    } else {
      return switchUnits;
    }
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={0}>
        <EnhancedTableToolbar
          tableData={tableData}
          selected={selected}
          setSelected={setSelected}
          numSelected={selected.length}
          setTableData={setTableData}
          setDialogOpen={setDialogOpen}
          setUnitId={setUnitId}
          filterPrice={filterPrice}
          SetFilterPrice={SetFilterPrice}
          totalFilterIcon={totalFilterIcon}
          setTotalFilterIcon={setTotalFilterIcon}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
            />
            <TableBody>
              {stableSort(
                priceFilters(switchFilters()).filter((row) => row.search),
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.unitName);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.unitName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.unitName}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="center"
                      >
                        {row.unitName}
                      </TableCell>
                      <TableCell align="center">
                        {convert(row.startedAt)}
                      </TableCell>

                      <TableCell style={{ width: "5em" }} align="center">
                        {row.typesOfService}
                      </TableCell>

                      <TableCell align="center">{row.sector}</TableCell>
                      <TableCell align="center">{row.employees}</TableCell>
                      <TableCell align="center">
                        {row.active.toString()}
                      </TableCell>
                      <TableCell align="center">{row.location}</TableCell>

                      <TableCell align="center">
                        {convert(row.activeUpto)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={
            priceFilters(switchFilters()).filter((row) => row.search).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <Grid container justify="flex-end">
          <Grid item>
            {filterPrice !== "" ? (
              <Chip
                onDelete={() => {
                  SetFilterPrice("");
                  const renderUnitsAfterClear = [...tableData];
                  renderUnitsAfterClear.map((unit) => (unit.search = true));
                  setTableData(renderUnitsAfterClear);
                }}
                className={classes.chip}
                label={
                  totalFilterIcon === ">"
                    ? `Less than ${filterPrice}`
                    : totalFilterIcon === "<"
                    ? `Greater than ${filterPrice}`
                    : ` Equal to ${filterPrice}`
                }
              />
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
