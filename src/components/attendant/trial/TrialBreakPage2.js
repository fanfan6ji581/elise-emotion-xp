import { useState } from 'react';
import { Typography, Box, Grid, Container } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Countdown from 'react-countdown';
import { useDispatch, useSelector } from "react-redux";

import { xpConfigS, setIsTrialBreakTaken } from "../../../slices/gameSlice";
import { updateAttendant } from '../../../database/attendant';
import { loginAttendant } from "../../../slices/attendantSlice";

import img14 from "../../../assets/2025/14.png";

// Helper to zero-pad time parts
const zeroPad = (num, places) => String(num).padStart(places, '0');

const TrialBreakPage = () => {
    const dispatch = useDispatch();
    const { alias } = useParams();
    const navigate = useNavigate();

    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);

    // Example: 10 seconds (or any configured value)
    const [countDown] = useState(xpConfig.trialBreak2Seconds);

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

            <Grid container sx={{ my: 3 }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">
                        QUICK GAME REFRESHER
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{mt: 5, mb: 5}}>
                        Two Types of Trend Switches:
                    </Typography>
                </Grid>
            </Grid>

            {/* Page Content */}
            <Grid container justifyContent="center" alignItems="center" sx={{ my: 1 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img14} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">
                        <i>Left: An aberration (indicator stays at 0) - a one-day blip that always reverts back </i>
                    </Typography>
                    <Typography variant="h6">
                        <i>Right: A real shift (after indicator jumps to 1) - starts a new trend phase                        </i>
                    </Typography>

                    <ul>
                        <li><Typography variant="h6"><b>Real Shifts</b> (Indicator = 1)</Typography>
                            <ul>
                                <li><Typography variant="h6">🔄 Start new trend phase </Typography></li>
                                <li><Typography variant="h6">⚡ 15% daily chance in dangerous zone until shift occurs
                                </Typography></li>
                                <li><Typography variant="h6">💥 Trigger 10× payoffs ($100 win/loss)
                                </Typography></li>
                            </ul>
                        </li>
                        <li><Typography variant="h6"><b>Aberrations</b> (Indicator = 0)
                        </Typography>
                            <ul>
                                <li><Typography variant="h6">⚠️ Always revert back next day
                                </Typography></li>
                                <li><Typography variant="h6">⚡ 5% chance only

                                </Typography></li>
                                <li><Typography variant="h6">💥 Still trigger 10× payoffs ($100 win/loss)
                                </Typography></li>
                            </ul>
                        </li>
                    </ul>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        <b>Payoff Cheat Sheet:</b>
                    </Typography>

                    <ul>
                        <li><Typography variant="h6"><b>Regular Day</b>: Match next trend = +$10 | Mismatch = -$10
                        </Typography></li>
                        <li><Typography variant="h6"><b>Switch Day</b>: Match next trend = +$100 | Mismatch = -$100

                        </Typography></li>
                        <li><Typography variant="h6"><b>Pass</b>: Always $0

                        </Typography></li>
                    </ul>
                </Grid>

            </Grid>
        </Container>
    );
};

export default TrialBreakPage;
