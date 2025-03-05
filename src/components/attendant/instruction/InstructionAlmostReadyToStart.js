import {
    Container, Box, Typography, Button, Grid,
} from "@mui/material";
import React from 'react';
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import { loginAttendant } from "../../../slices/attendantSlice";
// import { xpConfigS } from "../../../slices/gameSlice";
import img15 from "../../../assets/2025/15.png";
import TrainingTimer from '../trial/TrainingTimer';
import { useState, useEffect } from "react";
import { getAttendant, updateAttendant } from '../../../database/attendant';
import { useNavigate } from "react-router-dom"

const InstructionHowToPlayPage = () => {
    const navigate = useNavigate();
    const { alias } = useParams();
    const [enable, setEnable] = useState(false);
    const [fetched, setFetched] = useState(false);
    const loginAttendantS = useSelector(loginAttendant);

    const fetchData = async () => {
        const attendant = await getAttendant(loginAttendantS.id);
        setEnable(attendant.isDoneQuizStartWaiting || false)
        setFetched(true)
    }

    const onKeyDown = (e) => {
        if (
            (e.ctrlKey && e.key === 'm')
        ) {
            navigate(`/xp/${alias}/start-quiz`);
        }
    }

    useEffect(() => {
        fetchData();
        document.addEventListener("keydown", onKeyDown, false);
        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        }
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
                            Launch Ready! Quick Payoff Reminder for Dangerous Zones
                        </Typography>
                    </Grid>
                </Grid>

                {/* <Grid container alignItems="center" sx={{ my: 1 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ my: 2 }}>
                            Quick Payoff Reminder for Dangerous Zones!
                        </Typography>

                    </Grid>
                </Grid> */}

                <Grid container alignItems="center" sx={{ my: 5 }}>
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Box component="img" alt="" src={img15} sx={{ width: '100%' }} />
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