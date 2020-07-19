import { createSelector } from "@reduxjs/toolkit";

const selectUnitState = (state) => state.unit;

const selectUnitss = createSelector([selectUnitState], (unit) => unit.units);
export const filterSearch = createSelector(
  [selectUnitState],
  (unit) => unit.filterSearch
);

export const selectUnits = createSelector([selectUnitss], (units) => {
  if (units.length) {
    let modifiedUnits = units.map((elem) => {
      const {
        _id,
        unitName,
        typesOfService,
        employees,
        location,
        startedAt,
        activeUpto,
        sector,
        active,
      } = elem;
      let seprated = typesOfService.split(",").join(" ");
      let tos = typesOfService.split(",");
      return {
        _id,
        unitName,
        typesOfService: seprated,
        employees,
        location,
        startedAt,
        activeUpto,
        sector,
        active,
        search: true,
        tos,
      };
    });
    return modifiedUnits;
  }

  return [];
});

export const selectUnitsLoading = createSelector(
  [selectUnitState],
  (unit) => unit.loading
);

// export const selectUnitByID = createSelector([selectUnitState], (unitByID) => {
//   if (unitByID.updateUnitByID !== "") {
//     console.log(
//       unitByID.units.filter((unit) => unit._id === unitByID.updateUnitByID)
//     );
//     return unitByID.units.filter(
//       (unit) => unit._id === unitByID.updateUnitByID
//     );
//   }
// });

export const selectError = createSelector(
  [selectUnitState],
  (unit) => unit.error
);
