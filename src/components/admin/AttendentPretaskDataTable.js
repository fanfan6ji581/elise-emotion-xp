import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { extractPretaskData } from "../../util/pretask_data";

const columns = [
  { field: "id", headerName: "Trial #", width: 60 },
  { field: "n", headerName: "N (blue ball count)", width: 150 },
  { field: "betResult", headerName: "Random result", width: 150 },
  { field: "bet", headerName: "Bet", width: 120 },
  { field: "betChosen", headerName: "Bet Chosen", width: 120 },
  {
    field: "reset",
    headerName: "Reset",
    valueFormatter: (p) => `${p.value ? `true` : "-"}`,
    width: 60
  },
  {
    field: "resetStatus",
    headerName: "Reset Status",
    valueFormatter: (p) => `${p.value != null ? `${p.value}` : "-"}`,
    width: 120
  },
  { field: "reaction", headerName: "Reaction ms", width: 95 },
  {
    field: "moneyOutcome",
    headerName: "Outcome$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 80,
  },
  {
    field: "pickedOutcome",
    headerName: "Picked$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 80,
  },
  {
    field: "accumulateOutcome",
    headerName: "Accumulate$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 100,
  },
  { field: 'gender', headerName: 'gender', width: 60 },
  { field: 'age', headerName: 'age', width: 60 },
  { field: 'major', headerName: 'major', width: 100 },
  { field: 'education', headerName: 'education', width: 120 },
];

const AttendentPretaskDataTable = ({ attendant }) => {
  const rows = extractPretaskData(attendant);
  const csvOptions = {
    fileName: `pretask-${attendant.xp_alias}-${attendant.username}`,
  };
  const CustomToolbar = (props) => (
    <GridToolbarContainer {...props}>
      <GridToolbarDensitySelector />
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
      </GridToolbarExportContainer>
    </GridToolbarContainer>
  );

  return (
    <>
      <p>Final earning is ${attendant.pretaskEarning}</p>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        rowHeight={32}
        components={{ Toolbar: CustomToolbar }}
      />
    </>
  );
};

export default AttendentPretaskDataTable;
