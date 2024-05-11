import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarContainer,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
} from "@mui/x-data-grid";
import { extractXpData } from "../../util/xp_data";

const columns = [
  { field: "id", headerName: "Trial #", width: 60 },
  { field: "value", headerName: "Value", width: 60 },
  { field: "speed", headerName: "Speed", width: 60 },
  // { field: "aberration", headerName: "Aberration", width: 80 },
  { field: "shift", headerName: "shift", width: 60 },
  { field: "reaction", headerName: "Reaction ms", width: 95 },
  { field: "choice", headerName: "choice", width: 120 },
  {
    field: "clickToShowChart", headerName: "clicked asset chart", width: 150,
    valueFormatter: (p) => `${p.value != null ? `${p.value}` : "-"}`,
  },
  {
    field: "outcome",
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
    headerName: "Picked Accum$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 120,
  },
  {
    field: "fullAccumulateOutcomeHistory",
    headerName: "Accumulate$",
    valueFormatter: (p) => `${p.value != null ? `$${p.value}` : "-"}`,
    width: 100,
  },

  { field: 'breakPageTimeTakes', headerName: 'Break Page ms', width: 120 },
  { field: 'dataSeriesName', headerName: 'Data Series', width: 120 },
  
  { field: 'gender', headerName: 'gender', width: 60 },
  { field: 'age', headerName: 'age', width: 60 },
  { field: 'major', headerName: 'major', width: 100 },
  { field: 'education', headerName: 'education', width: 120 },
  { field: 'mcq1', headerName: 'mcq1', width: 50 },
  { field: 'mcq2', headerName: 'mcq2', width: 50 },
  { field: 'mcq3', headerName: 'mcq3', width: 50 },
  { field: 'mcq4', headerName: 'mcq4', width: 50 },
  { field: 'mcq5', headerName: 'mcq5', width: 50 },
  { field: 'mcq6', headerName: 'mcq6', width: 50 },
  { field: 'mcq7', headerName: 'mcq7', width: 50 },
  { field: 'mcq8', headerName: 'mcq8', width: 50 },
  { field: 'mcq9', headerName: 'mcq9', width: 50 },
  { field: 'mcq10', headerName: 'mcq10', width: 60 },
  // { field: 'mcq11', headerName: 'mcq11', width: 60 },
  // { field: 'mcq12', headerName: 'mcq12', width: 60 },
  // { field: 'mcq13', headerName: 'mcq13', width: 60 },
  { field: 'strategy', headerName: 'strategy', width: 80 },
  // { field: 'strategy2', headerName: 'strategy2', width: 80 },
  { field: 'earningQuiz1', headerName: 'earningQuiz1', width: 200 },
  { field: 'earningQuiz2', headerName: 'earningQuiz2', width: 200 },
  { field: 'earningQuiz3', headerName: 'earningQuiz3', width: 200 },
  { field: 'earningQuiz4', headerName: 'earningQuiz4', width: 200 },
  { field: 'earningQuiz5', headerName: 'earningQuiz5', width: 200 },
  { field: 'finalEarning_$xx', headerName: 'finalEarning_$xx', width: 200 },
  { field: 'adjustedEarning_$yy', headerName: 'adjustedEarning_$yy', width: 200 },
];

// not in used
const AttendentDataTable = ({ attendant, xp }) => {
  const rows = extractXpData(attendant, xp);
  const csvOptions = {
    fileName: `${attendant.xp_alias}-${attendant.username}`,
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
      <p>Final picked earning ($xx): ${attendant.finalEarning}</p>
      <p>Adjusted picked earning ($yy): ${attendant.adjustedEarning}</p>
      {attendant.xpRecord.outcomeHistory &&
        <p>Accumulate earning: ${attendant.xpRecord.outcomeHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</p>
      }
      <p>Number of Missed trials: {attendant.xpRecord.missHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</p>
      <p>Miss reach limit: {attendant.missTooMuch ? 'Yes' : ''}</p>
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

export default AttendentDataTable;
