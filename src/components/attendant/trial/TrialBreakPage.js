import { useState } from 'react';
import { Typography, Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
    xpConfigS,
    setIsTrialBreakTaken,
} from "../../../slices/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import Countdown from 'react-countdown';
import { updateAttendant } from '../../../database/attendant';
import { loginAttendant } from "../../../slices/attendantSlice";
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
        navigate(`/xp/${alias}/trial`);
    }

    return (
        <>
            <Typography variant="h5" align="center" sx={{ pt: 10 }}>
                Time for a short break. Please remain seated, the task is going to resume in
            </Typography>
            <Typography variant="h5" align="center" sx={{ pt: 10 }}>
                <Countdown date={targetEndTime} renderer={renderer} onComplete={onFinish} />
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="contained" sx={{ mt: 3 }} onClick={onFinish}>End the break now</Button>
            </Box>
        </>
    )
}

export default TrialBreakPage