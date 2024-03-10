import {
    DataGrid, GridToolbarDensitySelector,
    GridToolbarContainer, GridToolbarExportContainer, GridCsvExportMenuItem
} from '@mui/x-data-grid';

const columns = [
    { field: 'gender', headerName: 'gender', width: 80 },
    { field: 'age', headerName: 'age', width: 80 },
    { field: 'major', headerName: 'major', width: 150 },
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
    { field: 'mcq11', headerName: 'mcq11', width: 60 },
    { field: 'mcq12', headerName: 'mcq12', width: 60 },
    { field: 'strategy', headerName: 'strategy', width: 80 },
    // { field: 'strategy2', headerName: 'strategy2', width: 80 },
    { field: 'earningQuiz1', headerName: 'earningQuiz1', width: 200 },
    { field: 'earningQuiz2', headerName: 'earningQuiz2', width: 200 },
    { field: 'earningQuiz3', headerName: 'earningQuiz3', width: 200 },
    { field: 'earningQuiz4', headerName: 'earningQuiz4', width: 200 },
    { field: 'earningQuiz5', headerName: 'earningQuiz5', width: 200 },
];

const AttendentInfo = ({ attendant }) => {
    const rows = [
        Object.assign({
            id: attendant.id,
            age: attendant.age,
            gender: attendant.gender,
            major: attendant.major,
            education: attendant.education,
        }, attendant.quizAnswers, { strategy: attendant.strategy,
            earningQuiz1: attendant?.earningQuiz?.question1,
            earningQuiz2: attendant?.earningQuiz?.question2,
            earningQuiz3: attendant?.earningQuiz?.question3,
            earningQuiz4: attendant?.earningQuiz?.question4,
            earningQuiz5: attendant?.earningQuiz?.question5,

        }),
    ];

    const csvOptions = { fileName: `${attendant.xp_alias}-${attendant.username}-info` };
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
            <DataGrid autoHeight rows={rows} columns={columns}
                components={{ Toolbar: CustomToolbar }}
            />
        </>
    )
}

export default AttendentInfo