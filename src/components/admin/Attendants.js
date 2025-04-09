import * as _ from "lodash";
import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import { doc, writeBatch, collection } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";
import {
    Grid, Typography, IconButton, Button, Tooltip, Divider,
    Dialog, DialogActions, DialogContent, Backdrop, CircularProgress,
    Select, MenuItem, FormControl, InputLabel,
} from "@mui/material";
import { Visibility as VisibilityIcon, Delete as DeleteIcon, Login as LoginIcon, FileDownload } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
// import { generateBalloonData } from '../../util/xp_data'
import { generateXPZip, generatePretaskZip } from '../../util/generate_zip'
import { Link, useParams } from 'react-router-dom';
import AttendantsInfo from './AttendantsInfo';
import { getAttendants, updateAttendant } from '../../database/attendant';
import { getAllDataForXP, getData } from '../../database/data';
import { generateBalloonDataFromDataSeries } from "../../util/xp_data";

const zeroPad = (num, places) => String(num).padStart(places, '0')

const schema = {
    "type": "object",
    "properties": {
        "count": {
            "type": "number",
            "title": "Number of attendants to generate",
            "default": 1,
        },
    },
    required: [
        "count",
    ]
};

const Attendants = ({ xp }) => {
    const { alias } = useParams();
    const [attendants, setAttendants] = useState([]);
    const [datas, setDatas] = useState([]);
    const [selectionModel, setSelectionModel] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [assigning, setAssigning] = useState(false);

    // need to collect the sum of each quiz occurs and the sum of correct answers
    const [zoneQuizOccurrences, setZoneQuizOccurrences] = useState(0);
    const [zoneQuizCorrectAnswers, setZoneQuizCorrectAnswers] = useState(0);
    const [aberQuizOccurrences, setAberQuizOccurrences] = useState(0);
    const [aberQuizCorrectAnswers, setAberQuizCorrectAnswers] = useState(0);
    const [finalZoneQuizOccurrences, setFinalZoneQuizOccurrences] = useState(0);
    const [finalZoneQuizCorrectAnswers, setFinalZoneQuizCorrectAnswers] = useState(0);
    const [finalAberrQuizOccurrences, setFinalAberrQuizOccurrences] = useState(0);
    const [finalAberrQuizCorrectAnswers, setFinalAberrQuizCorrectAnswers] = useState(0);
    const [finalDoubleQuizOccurrences, setFinalDoubleQuizOccurrences] = useState(0);
    const [finalDoubleQuizCorrectAnswers, setFinalDoubleQuizCorrectAnswers] = useState(0);




    const columns = [
        { field: 'username', headerName: 'Username', width: 250 },
        { field: 'password', headerName: 'Password', width: 200 },

        {
            field: 'action', headerName: 'Actions', width: 300,
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel>Data Series</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                defaultValue=""
                                value={params.row.dataId || ''}
                                label="Data Series"
                                onChange={(event) => handleDataSeriesAssign(params.row.id, event.target.value, params.row)}
                            >
                                {datas.map((data, idx) =>
                                    <MenuItem key={idx} value={data.id}>{data.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>

                        <Tooltip title="View">
                            <IconButton component={Link} to={`/admin/xp/${params.row.xp_alias}/attendant/${params.row.username}`}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Quick Login">
                            <IconButton component={Link} to={`/xp/${params.row.xp_alias}/login/${params.row.username}/${params.row.password}`} target="_blank"><LoginIcon /></IconButton>
                        </Tooltip>
                    </>
                )
            },
        },
        {
            field: 'created', headerName: 'Created', width: 160,
            valueFormatter: params => moment(params?.value).format("YYYY-MM-DD HH:mm:ss")
        },
    ];

    const handleDataSeriesAssign = async (attendantId, dataId, attendant) => {
        if (attendant.dataId) {
            if (!window.confirm("Are you sure to change this attendant's data series? it will wipe out attendant responses")) {
                return;
            }
        }

        // await updateAttendant(attendantId, {
        //     dataId
        // })
        const dataSeries = await getData(dataId);
        await updateAttendant(attendantId, Object.assign({
            dataId: dataSeries.id,
        }, generateBalloonDataFromDataSeries(dataSeries)));
        await fetchAttendants();
        // attendant.dataId = dataId;
        // setAttendants(attendants);
    }

    const fetchAttendants = async () => {
        setLoadingOpen(true);
        const attendants = await getAttendants(alias);
        setAttendants(attendants);

        let zoneQuizOccurrences = 0;
        let zoneQuizCorrectAnswers = 0;
        let aberQuizOccurrences = 0;
        let aberQuizCorrectAnswers = 0;
        let finalZoneQuizOccurrences = 0;
        let finalZoneQuizCorrectAnswers = 0;
        let finalAberrQuizOccurrences = 0;
        let finalAberrQuizCorrectAnswers = 0;
        let finalDoubleQuizOccurrences = 0;
        let finalDoubleQuizCorrectAnswers = 0;

        for (let i = 0; i < attendants.length; i++) {
            const attendant = attendants[i];
            if (attendant.mathZoneQuiz) {
                zoneQuizOccurrences += 1;
                zoneQuizCorrectAnswers += attendant.mathZoneQuiz.earnedAmount > 0 ? 1 : 0;
            }
            if (attendant.mathAberrQuiz) {
                aberQuizOccurrences += 1;
                aberQuizCorrectAnswers += attendant.mathAberrQuiz.earnedAmount > 0 ? 1 : 0;
            }
            if (attendant.mathFinalQuiz) {
                finalZoneQuizOccurrences += 1;
                finalZoneQuizCorrectAnswers += attendant.mathFinalQuiz.earnedAmount > 0 ? 1 : 0;
            }
            if (attendant.aberFinalQuiz) {
                finalAberrQuizOccurrences += 1;
                finalAberrQuizCorrectAnswers += attendant.aberFinalQuiz.earnedAmount > 0 ? 1 : 0;
            }
            if (attendant.doubleFinalQuiz) {
                finalDoubleQuizOccurrences += 1;
                finalDoubleQuizCorrectAnswers += attendant.doubleFinalQuiz.earnedAmount > 0 ? 1 : 0;
            }
        }

        setZoneQuizOccurrences(zoneQuizOccurrences);
        setZoneQuizCorrectAnswers(zoneQuizCorrectAnswers);
        setAberQuizOccurrences(aberQuizOccurrences);
        setAberQuizCorrectAnswers(aberQuizCorrectAnswers);
        setFinalZoneQuizOccurrences(finalZoneQuizOccurrences);
        setFinalZoneQuizCorrectAnswers(finalZoneQuizCorrectAnswers);
        setFinalAberrQuizOccurrences(finalAberrQuizOccurrences);
        setFinalAberrQuizCorrectAnswers(finalAberrQuizCorrectAnswers);
        setFinalDoubleQuizOccurrences(finalDoubleQuizOccurrences);
        setFinalDoubleQuizCorrectAnswers(finalDoubleQuizCorrectAnswers);

        setLoadingOpen(false);
    };

    const fetchDatas = async () => {
        setDatas(await getAllDataForXP(alias));
    };

    const onCreateAttendants = async ({ formData }, e) => {
        e.preventDefault();
        if (formData.count <= 0) {
            return;
        }

        const batch = writeBatch(db);
        let maxGuestIndex = 0;
        attendants.forEach((att, i) => {
            const index = parseInt(att.username.replace('guest', '')) || 0;
            maxGuestIndex = Math.max(maxGuestIndex, index, attendants.length);
        });

        for (let i = 0; i < formData.count; i++) {
            // const data = generateBalloonData(xp);

            const attendant = Object.assign({},
                // data,
                {
                    username: `guest${zeroPad(maxGuestIndex + i + 1, 2)}`,
                    password: Math.random().toString(36).slice(-6),
                    created: Date.now(),
                    xp_alias: xp.alias,
                    xp_id: xp.id,
                    xpConfig: xp,
                });
            const ref = doc(collection(db, "attendant"));
            batch.set(ref, attendant);
        }
        await batch.commit();
        await fetchAttendants();
    };

    const onDeleteAttdendants = async (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure to delete?")) {
            return;
        }

        const batch = writeBatch(db);
        for (let i = 0; i < selectionModel.length; i++) {
            const ref = doc(db, "attendant", selectionModel[i]);
            batch.delete(ref);
        }
        await batch.commit();
        await fetchAttendants();
    };

    const onDownloadZip = async (e) => {
        setLoadingOpen(true);
        await generateXPZip(attendants, xp);
        setLoadingOpen(false);
    }

    const onDownloadPretaskZip = async (e) => {
        setLoadingOpen(true);
        await generatePretaskZip(attendants, xp);
        setLoadingOpen(false);
    }

    const assignDataSeries = async () => {
        setAssigning(true);

        // refetch all attendants
        await fetchAttendants();
        await fetchDatas();

        // find attendants with no assigned data series
        const noAssignedAttendants = attendants.filter(att => !att.dataId);

        const usedDataSeriesIds = attendants.filter(att => att.dataId).map(att => att.dataId);
        const unAssignedDataSeries = _.filter(datas, (dataSeries) => {
            return !_.includes(usedDataSeriesIds, dataSeries.id);
        });

        if (noAssignedAttendants.length === 0) {
            alert('No attendants need to be assigned')
            setAssigning(false);
            return;
        }

        for (let i = 0; i < unAssignedDataSeries.length; i++) {
            if (i > noAssignedAttendants.length - 1) {
                break;
            }
            // assign data
            const attendant = noAssignedAttendants[i];
            const dataSeries = unAssignedDataSeries[i];
            // update this page
            attendant.dataId = dataSeries.id;

            await updateAttendant(attendant.id, Object.assign({
                dataId: dataSeries.id,
            }, generateBalloonDataFromDataSeries(dataSeries)));
        }

        await fetchAttendants();

        const diff = noAssignedAttendants.length - unAssignedDataSeries.length;
        if (diff > 0) {
            alert(`There are still ${diff} attendant don't have data series, please manually resolve it`)
        } else {
            alert('Data series assigned successful');
        }
        setAssigning(false);
    }

    useEffect(() => {
        fetchAttendants();
        fetchDatas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <DataGrid autoHeight rows={attendants} columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={m => setSelectionModel(m)}
                        sx={{ mb: 3 }}
                        initialState={{
                            sorting:
                            {
                                sortModel: [{
                                    field: 'created'
                                }]
                            }
                        }} />

                    <Button variant="contained" sx={{ mx: 3 }} disabled={!selectionModel.length} onClick={onDeleteAttdendants}><DeleteIcon /> Delete</Button>
                </Grid>
                <Grid item xs={3}>

                    <Typography>Zone Quiz Occurrs: {zoneQuizOccurrences}</Typography>
                    <Typography>Zone Quiz Correct: {zoneQuizCorrectAnswers}</Typography>
                    <Typography>Aber Quiz Occurrs: {aberQuizOccurrences}</Typography>
                    <Typography>Aber Quiz Correct: {aberQuizCorrectAnswers}</Typography>
                    <Typography>Final Zone Quiz Occurrs: {finalZoneQuizOccurrences}</Typography>
                    <Typography>Final Zone Quiz Correct: {finalZoneQuizCorrectAnswers}</Typography>
                    <Typography>Final Aberr Quiz Occurrs: {finalAberrQuizOccurrences}</Typography>
                    <Typography>Final Aberr Quiz Correct: {finalAberrQuizCorrectAnswers}</Typography>
                    <Typography>Final Double Quiz Occurrs: {finalDoubleQuizOccurrences}</Typography>
                    <Typography>Final Double Quiz Correct: {finalDoubleQuizCorrectAnswers}</Typography>

                    <Divider sx={{ my: 3 }} />

                    <Typography>Add more attendants</Typography>
                    <Form schema={schema} onSubmit={onCreateAttendants} validator={validator} />

                    <Divider sx={{ my: 5 }} />

                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={assignDataSeries} disabled={assigning}>
                        Assign data series
                    </Button>

                    <Divider sx={{ my: 5 }} />

                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={() => setDialogOpen(true)}><VisibilityIcon sx={{ mx: 1 }} /> View mcq Responses</Button>
                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={onDownloadZip}><FileDownload sx={{ mx: 1 }} /> Download Main XP zip</Button>
                    <Button variant="outlined" sx={{ my: 1, width: '100%' }} onClick={onDownloadPretaskZip}><FileDownload sx={{ mx: 1 }} /> Download Pretask zip</Button>
                </Grid>
            </Grid>

            <Dialog maxWidth="lg" fullWidth={true} open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogContent>
                    <AttendantsInfo attendants={attendants} xp={xp} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Attendants