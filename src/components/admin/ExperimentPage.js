import {
    Container, Grid, Alert, Typography, Box, Tab, Stack,
    FormGroup, FormControlLabel, Switch, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import { getXp } from "../../database/xp";
import { updatePretask } from "../../database/pretask";
import { updateXp } from "../../database/xp";
import { getPretask } from "../../database/pretask"
import BalloonXPConfig from './BalloonXPConfig';
import PretaskConfig from './PretaskConfig';
import Attendants from './Attendants';
import DataSeries from './DataSeries';
import { Link } from 'react-router-dom';

const Experiment = () => {
    const [tab, setTab] = useState('3');
    const [xp, setXp] = useState(null);
    const [pretask, setPretask] = useState(null);
    const [treatment, setTreatment] = useState(1);
    const [enablePlaying, setEnablePlaying] = useState(false);
    const [enablePretaskPlaying, setEnablePretaskPlaying] = useState(false);
    const [enableSignUpContinue, setEnableSignUpContinue] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { alias } = useParams()

    const onChangeTab = (e, newValue) => {
        setTab(newValue);
    };

    const fetchXP = async () => {
        const xp = await getXp(alias);
        setXp(xp);
        setEnablePlaying(xp.enablePlaying);
        setEnableSignUpContinue(xp.enableSignUpContinue);
        if (xp.treatment) {
            setTreatment(xp.treatment);
        }

    };

    const fetchPretask = async () => {
        try {
            const pretask = await getPretask(alias);
            setPretask(pretask)
            setEnablePretaskPlaying(pretask.enablePretaskPlaying);
        } catch (error) {
            setErrorMsg(error.message)
        }
    }

    const onSwitchEnablePlaying = async (e, val) => {
        await updateXp(xp.id, { enablePlaying: val });
        setEnablePlaying(val);
        if (val) {
            window.alert('Game play has been enabled');
        } else {
            window.alert('Game play has been disabled');
        }
    }

    const onSwitchEnablePretaskPlaying = async (e, val) => {
        await updatePretask(pretask.id, { enablePretaskPlaying: val });
        setEnablePretaskPlaying(val);
        if (val) {
            window.alert('Pretask play has been enabled');
        } else {
            window.alert('Pretask play has been disabled');
        }
    }

    const onSwitchEnableSignupContinue = async (e, val) => {
        await updateXp(xp.id, { enableSignUpContinue: val });
        setEnableSignUpContinue(val);
        if (val) {
            window.alert('Sign up continue has been enabled');
        } else {
            window.alert('Sign up continue has been disabled');
        }
    }


    const onSwitchTreatment = async (event) => {
        await updateXp(xp.id, { treatment: event.target.value });
        setTreatment(event.target.value);
        window.alert('treatment has been updated');
    }

    useEffect(() => {
        fetchXP();
        fetchPretask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Typography variant='h4'>Experiment <b>{alias}</b>
                    </Typography>
                    <Button sx={{ m: 2, ml: 0 }} variant="outlined" component={Link} to={`/xp/${alias}/signup`} target="_blank"> Attendant Sign up</Button>
                    <Button sx={{ m: 2, ml: 1 }} variant="outlined" component={Link} to={`/xp/${alias}/login`} target="_blank"> Attendant Login</Button>
                </Grid>
                <Grid item>
                    <Stack direction="column">
                        <FormControl fullWidth>
                            <InputLabel>Treatment</InputLabel>
                            <Select label="Treatment"
                                value={treatment}
                                onChange={onSwitchTreatment}
                            >
                                <MenuItem value={1}>Treatment 1</MenuItem>
                                <MenuItem value={2}>Treatment 2</MenuItem>
                                <MenuItem value={3}>Treatment 3</MenuItem>
                            </Select>
                        </FormControl>
                        <Box>
                            <FormGroup>
                                <FormControlLabel control={<Switch checked={enablePlaying} onChange={onSwitchEnablePlaying} />} label="Enable game play" />
                            </FormGroup>
                            <FormGroup>
                                <FormControlLabel control={<Switch checked={enablePretaskPlaying} onChange={onSwitchEnablePretaskPlaying} />} label="Enable pretask play" />
                            </FormGroup>
                            <FormGroup>
                                <FormControlLabel control={<Switch checked={enableSignUpContinue} onChange={onSwitchEnableSignupContinue} />} label="Enable signup continue" />
                            </FormGroup>
                        </Box>
                    </Stack>

                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
                    {xp &&
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={tab}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={onChangeTab} aria-label="lab API tabs example">
                                        <Tab label="Pretask Config" value="1" />
                                        <Tab label="XP Config" value="2" />
                                        <Tab label="Attendants" value="3" />
                                        <Tab label="Data Series" value="4" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1">
                                    <PretaskConfig pretask={pretask} setPretask={setPretask} />
                                </TabPanel>
                                <TabPanel value="2">
                                    <BalloonXPConfig xp={xp} setXp={setXp} />
                                </TabPanel>
                                <TabPanel value="3">
                                    <Attendants xp={xp} />
                                </TabPanel>
                                <TabPanel value="4">
                                    <DataSeries xp={xp} />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default Experiment