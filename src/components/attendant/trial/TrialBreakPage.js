import { useState } from 'react';
import { Typography, Button, Box, 
    // Grid, Container, Divider
 } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
    xpConfigS,
    setIsTrialBreakTaken,
} from "../../../slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import Countdown from 'react-countdown';
import { updateAttendant } from '../../../database/attendant';
import { loginAttendant } from "../../../slices/attendantSlice";
// import img15 from "../../../assets/2025/15.png";

const zeroPad = (num, places) => String(num).padStart(places, '0')

const TrialBreakPage = () => {
    const dispatch = useDispatch();
    const { alias } = useParams();
    const navigate = useNavigate();
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const [countDown] = useState(xpConfig.trialBreakSeconds || 180);
    const currentime = Date.now();
    const targetEndTime = currentime + (countDown) * 1000;

    const renderer = ({ minutes, seconds, completed }) => {
        return <span>{zeroPad(minutes, 2)}:{zeroPad(seconds, 2)}</span>;
    };

    const onFinish = async () => {
        const breakPageTimeTakes = Date.now() - currentime;
        await updateAttendant(loginAttendantS.id, { breakPageTimeTakes });
        dispatch(setIsTrialBreakTaken(true));
        navigate(`/xp/${alias}/trial-break2`);
    }

    return (
        <>
            <Typography variant="h5" align="center" sx={{ pt: 8 }}>
                Time for a short break. Please remain seated, the task is going to resume in
            </Typography>
            <Typography variant="h5" align="center" sx={{ pt: 8 }}>
                <Countdown date={targetEndTime} renderer={renderer} onComplete={onFinish} />
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={onFinish}>End the break now</Button>
            </Box>


            {/* {xpConfig.showExampleWhenTrialBreak && <>
                <Container maxWidth="lg" sx={{ mt: 10 }}>
                    <Divider sx={{ mt: 4 }} />
                    <Grid container alignItems="center" sx={{ my: 1 }}>
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
            </>} */}
        </>
    )
}

export default TrialBreakPage