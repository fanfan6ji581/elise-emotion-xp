import {
    Container, Box, Typography, Button, Grid,
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
// import { useSelector } from "react-redux";

const Instruction3Page = () => {
    const { alias } = useParams();
    // const xpConfig = useSelector(xpConfigS);

    return (
        <Container maxWidth="lg">
            <Grid container>

                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ my: 6 }}>
                        IMPORTANT NOTE ABOUT INTEGRITY
                    </Typography>
                </Grid>

                <Grid item xs={12}>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        All information provided about probabilities, odds, and game mechanics is 100% truthful. Our lab follows a strict "no deception" policy – this is our sacred ethical principle. Understanding this is crucial for your gameplay:
                    </Typography>

                    <ul>
                        <li>
                            <Typography variant="h6">Every stated probability (15% risk in dangerous zones, 5% chance of aberrations) is exactly as described
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6">All game parameters are fixed and cannot be altered during play
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6">The system never "adapts" to your choices or manipulates outcomes
                            </Typography>
                        </li>
                    </ul>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        What you see is what you get – no tricks, no hidden mechanics. This transparency allows you to develop genuine strategies based on the actual rules we've shared.

                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-how-to-play`} sx={{ mx: 2 }}>Prev</Button>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Next</Button>
                    </Box>
                </Grid>

            </Grid>
        </Container>
    )
}

export default Instruction3Page