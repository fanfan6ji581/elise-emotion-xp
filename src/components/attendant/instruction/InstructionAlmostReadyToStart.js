import {
    Container, Box, Typography, Button, Grid,
} from "@mui/material";
import React from 'react';
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { loginAttendant } from "../../../slices/attendantSlice";
// import { xpConfigS } from "../../../slices/gameSlice";
import image12 from "../../../assets/12.png";
import image13 from "../../../assets/13.png";
import image14 from "../../../assets/14.png";
import TrainingTimer from '../trial/TrainingTimer';
import { useState, useEffect } from "react";
import { getAttendant, updateAttendant } from '../../../database/attendant';

const InstructionHowToPlayPage = () => {
    const { alias } = useParams();
    const [enable, setEnable] = useState(false);
    const [fetched, setFetched] = useState(false);
    const loginAttendantS = useSelector(loginAttendant);

    const fetchData = async () => {
        const attendant = await getAttendant(loginAttendantS.id);
        setEnable(attendant.isDoneQuizStartWaiting || false)
        setFetched(true)
    }

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onFinish = async () => {
        await updateAttendant(loginAttendantS.id, { isDoneQuizStartWaiting: true });
        setEnable(true)
    }

    return (
        <>
            <Container maxWidth="lg">

                <Grid container justifyContent="center" alignItems="center" sx={{ my: 3 }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" >
                            Almost ready to start!
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container alignItems="center" sx={{ my: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ my: 2 }}>
                            Here is an example to quickly remind you how the payoff works in the dangerous zone. Please double-check that all is clear to you, and if in doubt of anything, please ask!
                        </Typography>

                    </Grid>
                </Grid>

                <Grid container alignItems="center" sx={{ my: 5 }}>
                    <Grid item xs={5} sx={{ textAlign: "center" }}>
                        <Box component="img" alt="" src={image12} sx={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={7} sx={{ textAlign: "center" }}>
                        <Box component="img" alt="" src={image13} sx={{ width: '100%' }} />
                        <Box component="img" alt="" src={image14} sx={{ width: '100%' }} />
                    </Grid>
                </Grid>

                <Box textAlign="center" sx={{ my: 10 }}>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }} >Prev</Button>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/start-quiz`} sx={{ mx: 2 }} disabled={!fetched || (fetched && !enable)}>Next</Button>
                </Box>
            </Container>

            {(!fetched || (fetched && !enable)) && <TrainingTimer trainingSessionSeconds={120} onFinish={onFinish} text={"Time left"} />}
        </>)
}

export default InstructionHowToPlayPage