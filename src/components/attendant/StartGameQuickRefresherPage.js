import {
    Container, Typography, Button, Box, Grid
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import img14 from "../../assets/2025/14.png";

const StartGamePage = () => {
    const { alias } = useParams();

    return (
        <Container maxWidth="lg">
            <Grid container sx={{ my: 3 }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ my: 1 }}>
                        QUICK GAME REFRESHER
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        Two Types of Trend Switches:
                    </Typography>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" alignItems="center" sx={{ my: 1 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img14} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">
                        <i>Left: An aberration (indicator stays at 0) - a one-day blip that always reverts back </i>
                    </Typography>
                    <Typography variant="h6">
                        <i>Right: A real shift (after indicator jumps to 1) - starts a new trend phase</i>
                    </Typography>

                    <ul>
                        <li>
                            <Typography variant="h6"><b>Real Shifts</b> (Indicator = 1)</Typography>
                            <ul>
                                <li><Typography variant="h6">🔄 Start new trend phase</Typography></li>
                                <li><Typography variant="h6">⚡ 15% daily chance in dangerous zone until shift occurs</Typography></li>
                                <li><Typography variant="h6">💥 Trigger 10× payoffs ($100 win/loss)</Typography></li>
                            </ul>
                        </li>
                        <li>
                            <Typography variant="h6"><b>Aberrations</b> (Indicator = 0)</Typography>
                            <ul>
                                <li><Typography variant="h6">⚠️ Always revert back next day</Typography></li>
                                <li><Typography variant="h6">⚡ 5% chance only</Typography></li>
                                <li><Typography variant="h6">💥 Still trigger 10× payoffs ($100 win/loss)</Typography></li>
                            </ul>
                        </li>
                    </ul>

                    <Typography variant="h6" sx={{ mt: 4 }}>
                        <b>Payoff Cheat Sheet:</b>
                    </Typography>

                    <ul>
                        <li>
                            <Typography variant="h6"><b>Regular Day</b>: Match next trend = +$10 | Mismatch = -$10</Typography>
                        </li>
                        <li>
                            <Typography variant="h6"><b>Switch Day</b>: Match next trend = +$100 | Mismatch = -$100</Typography>
                        </li>
                        <li>
                            <Typography variant="h6"><b>Pass</b>: Always $0</Typography>
                        </li>
                    </ul>
                </Grid>
            </Grid>

            <Grid container alignItems="center" sx={{ my: 3 }}>
                <Grid item xs={12}>
                    <Box textAlign="center" sx={{ py: 5 }}>
                        <Button component={Link} variant="contained" size="large"
                            to={`/xp/${alias}/count-down`}
                        >
                            I am fully aware of it
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default StartGamePage;
