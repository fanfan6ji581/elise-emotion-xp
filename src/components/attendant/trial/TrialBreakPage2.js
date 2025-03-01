import { useState } from 'react';
import { Typography, Box, Grid, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from "react-redux";

import { xpConfigS, setIsTrialBreakTaken } from "../../../slices/gameSlice";
import { updateAttendant } from '../../../database/attendant';
import { loginAttendant } from "../../../slices/attendantSlice";

import img15 from "../../../assets/2025/15.png";

// Helper to zero-pad time parts
const zeroPad = (num, places) => String(num).padStart(places, '0');

const TrialBreakPage = () => {
    const dispatch = useDispatch();
    const { alias } = useParams();
    const navigate = useNavigate();

    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);

    // Example: 10 seconds (or any configured value)
    const [countDown] = useState(xpConfig.trialBreak2Seconds || 10);

    // We'll store the current time and the target end time
    const currentime = Date.now();
    const targetEndTime = currentime + countDown * 1000;

    // React-countdown renderer that returns "MM:SS"
    const renderer = ({ minutes, seconds, completed }) => {
        return <span>{zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}</span>;
    };

    // Callback when the countdown completes
    const onFinish = async () => {
        const breakPageTimeTakes = Date.now() - currentime; // how long the user stayed
        await updateAttendant(loginAttendantS.id, { breakPageTimeTakes });
        dispatch(setIsTrialBreakTaken(true));
        navigate(`/xp/${alias}/trial`);
    };

    return (
        <Container maxWidth="lg" sx={{ position: 'relative', pt: 4 }}>
            {/* Countdown in top-right corner */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Typography variant="h5">
                    <Countdown date={targetEndTime} renderer={renderer} onComplete={onFinish} />
                </Typography>
            </Box>

            {/* Page Content */}
            <Grid container alignItems="center" sx={{ mt: 10 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ my: 2, textAlign: 'center' }}>
                        Reminder
                    </Typography>
                </Grid>
            </Grid>

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img15} sx={{ width: '100%' }} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default TrialBreakPage;
