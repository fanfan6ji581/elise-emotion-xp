import { getDocs, collection, query, where } from "firebase/firestore";
import db from "../../database/firebase";
import { useEffect, useState } from "react";
import { Container, Grid, Typography, Alert, Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Link, useParams } from 'react-router-dom';
import AttendantDataTable from "./AttendantDataTable";
import AttendentPretaskDataTable from "./AttendentPretaskDataTable";
import AttendantInfo from "./AttendantInfo";

const Attendant = () => {
    const [attendant, setAttendent] = useState([]);
    const [xp, setXp] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const { alias, username } = useParams()
    const [tab, setTab] = useState('2');

    const onChangeTab = (e, newValue) => {
        setTab(newValue);
    };

    const fetchXP = async () => {
        const snapshot = await getDocs(query(collection(db, "xp"), where("alias", "==", alias)));
        const xps = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (xps.length === 1) {
            setXp(xps[0]);
        } else {
            setErrorMsg(`Cannot find such XP with alias "${alias}"`)
        }
    };

    const fetchAttendant = async () => {
        const snapshot = await getDocs(query(collection(db, "attendant"),
            where("xp_alias", "==", alias),
            where("username", "==", username),
        ));

        const attendants = snapshot.docs.map(d => (Object.assign({ id: d.id }, d.data())));
        if (attendants.length === 1) {
            setAttendent(attendants[0]);
        } else {
            setErrorMsg("Could not find this attendant")
        }
    };


    useEffect(() => {
        fetchAttendant();
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h4'>Attednant <b>{username}</b> for <Link to={`/admin/xp/${alias}`}>Experiment {alias}</Link></Typography >

                        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                        <br />
                        {xp && attendant && <>
                            <TabContext value={tab}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={onChangeTab} aria-label="lab API tabs example">
                                        <Tab label="Pretask Data" value="1" />
                                        <Tab label="XP Data" value="2" />
                                        <Tab label="Info" value="3" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <AttendentPretaskDataTable attendant={attendant} />
                                </TabPanel>

                                <TabPanel value="2">
                                    {attendant.xpData &&
                                        <AttendantDataTable attendant={attendant} xp={xp} />}
                                    {!attendant.xpData &&
                                        <Typography variant='h6'>No XP Data yet, please assign a data series, then wait attend to login to view this page</Typography>
                                    }
                                </TabPanel>
                                <TabPanel value="3">
                                    <AttendantInfo attendant={attendant} />
                                </TabPanel>
                            </TabContext>
                        </>}
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Attendant