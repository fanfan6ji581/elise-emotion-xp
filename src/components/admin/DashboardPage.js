import { useEffect, useState } from "react";
import { Container, Grid, Typography, IconButton, Divider, Tooltip } from "@mui/material";
import { Visibility as VisibilityIcon, Delete as DeleteIcon, Lock, LockOpen } from '@mui/icons-material';
import { collection, getDocs, deleteDoc, doc, addDoc, query, where, writeBatch, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { addPretask, deletePretask, createPretask } from "../../database/pretask";
import { DataGrid } from '@mui/x-data-grid';
import Form from '@rjsf/mui';
import validator from "@rjsf/validator-ajv8";
import moment from "moment";
import { Link } from "react-router-dom";
import { deleteDataForXp } from '../../database/data';

const DashboardPage = () => {
    const [xps, setXps] = useState([]);

    const columns = [
        { field: 'alias', headerName: 'Alias', width: 400 },
        {
            field: 'created', headerName: 'Created', width: 200,
            valueFormatter: params => moment(params?.value).format("YYYY-MM-DD HH:mm:ss")
        },
        {
            field: 'action', headerName: 'Actions', width: 200,
            sortable: false,
            renderCell: (params) => {
                const xp = params.row;
                const onDelete = async (e) => {
                    e.stopPropagation();
                    if (!window.confirm(`Are you sure to delete "${xp.alias}"?`)) {
                        return;
                    }
                    // delete attendents
                    const snapshot = await getDocs(query(collection(db, "attendant"), where("xp_alias", "==", xp.alias)));
                    const batch = writeBatch(db);
                    snapshot.docs.forEach((document) => {
                        batch.delete(document.ref);
                    });
                    await batch.commit();

                    // delete pretask
                    await deletePretask(xp.alias);

                    // delete xp
                    const xpDocRef = doc(db, "xp", xp.id)
                    await deleteDoc(xpDocRef);
                    setXps(xps.filter(x => x.id !== xp.id))

                    // delete data series
                    await deleteDataForXp(xp.alias);

                }
                const onLock = async (e) => {
                    e.stopPropagation();
                    const xpDocRef = doc(db, "xp", xp.id)
                    await updateDoc(xpDocRef, { locked: true });
                    const newXps = xps.map(x => {
                        if (x.id === xp.id) {
                            x.locked = true;
                        }
                        return x;
                    });
                    setXps(newXps);
                };
                const onUnLock = async (e) => {
                    e.stopPropagation();
                    if (!window.confirm(`Are you sure to unlock "${xp.alias}"?`)) {
                        return;
                    }
                    const xpDocRef = doc(db, "xp", xp.id)
                    await updateDoc(xpDocRef, { locked: false });
                    const newXps = xps.map(x => {
                        if (x.id === xp.id) {
                            x.locked = false;
                        }
                        return x;
                    });
                    setXps(newXps);
                }
                return (
                    <>
                        <Tooltip title="View xp">
                            <IconButton component={Link} to={`/admin/xp/${xp.alias}`}><VisibilityIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Delete xp">
                            <IconButton onClick={onDelete} disabled={xp.locked}><DeleteIcon /></IconButton>
                        </Tooltip>
                        {!xp.locked &&
                            <Tooltip title="Lock xp, so you cant delete">
                                <IconButton onClick={onLock}><Lock /></IconButton>
                            </Tooltip>
                        }
                        {xp.locked && <Tooltip title="Unlock xp, so you can delete">
                            <IconButton onClick={onUnLock}><LockOpen /></IconButton>
                        </Tooltip>}
                    </>
                )
            },
        },
    ];

    const schema = {
        "type": "object",
        "properties": {
            "alias": {
                "type": "string",
            },
        },
        required: [
            "alias",
        ]
    };

    const fetchXPs = async () => {
        const snapshot = await getDocs(collection(db, "xp"));
        setXps(snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data()))));
    };

    const onAddXp = async ({ formData }, e) => {
        e.preventDefault();

        // validate if there are any exsiting same alias
        if (xps.find(xp => xp.alias === formData.alias)) {
            window.alert("Duplicate alias, please rename it");
            return;
        }

        const xp = {
            alias: formData.alias,
            created: Date.now(),
            // following are default value
            dangerZoneChance: "1/6",
            lambda: "1/3",
            aberrationChance: "1/12",
            delta: 100,
            // costToSwitch: 1,
            missLimit: 10,
            choiceDelay: 0,
            outcomeShowTime: 2000,
            outcome0ShowTime: 2000,
            afkTimeout: 10000,
            afkTimeoutCost: 1,
            numberOfTrials: 300,
            percentageEarning: 40,
            trainingSessionSeconds: 180,
            historySessionSeconds: 120,
            showChoiceButtonOnTop: true,
            clickToShowVolumeChart: true,
            enablePlaying: false,
            enableSignUpContinue: false,
            treatment: 3,
            hideVolumeChartWhenShowOutcome: false,
            trialBreakSeconds: 180,
            useMultiColorChoiceButton: false,
            winShift: 1,
            loseShift: 1,
            trialWindowLength: 50,
            magnifyChoice: 10,
            showExampleWhenTrialBreak: false,
        };

        const resp = await addDoc(collection(db, "xp"), xp);
        xp.id = resp.id;
        setXps([...xps, xp]);

        // create a pretask as well
        const pretask = createPretask(formData.alias);
        await addPretask(pretask);
    };

    useEffect(() => {
        fetchXPs();
        // eslint-disable-next-line
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h4'>Dashboard</Typography>
                </Grid>
                <Grid item xs={9}>
                    <DataGrid autoHeight rows={xps} columns={columns}
                        initialState={{
                            sorting:
                            {
                                sortModel: [{
                                    field: 'created', sort: 'desc'
                                }]
                            }
                        }} />
                </Grid>
                <Divider flexItem={true} />
                <Grid item xs={3}>
                    <Typography variant='h6'>Add new XP</Typography>
                    <Form schema={schema} onSubmit={onAddXp} validator={validator} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default DashboardPage