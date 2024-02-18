import { Container, Box, Typography, Button, Grid, } from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux";
import { xpConfigS } from "../../../slices/gameSlice";

const BeforeTrainingStart = () => {
    const { alias } = useParams();
    const xpConfig = useSelector(xpConfigS);

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item xs={12}>

                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Please Note
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        The training session you're going to do is just to familiarize yourself with the game interface.
                        Your choices won't be recorded and hence we won't be showing you the history for the asset in the previous 100 days, as your choices during that training do not matter.

                    </Typography>

                    {xpConfig.treatment !== 1 &&
                        <Typography variant="h6" sx={{ my: 5 }}>
                            Please recall that you can make the volume chart appear on screen by clicking anywhere on the blank space below the asset chart, and the volume chart will instantaneously appear on screen.
                            Please try it during that training!
                        </Typography>
                    }

                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Prev</Button>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/training`} sx={{ mx: 2 }}>Next</Button>
                    </Box>

                </Grid>
            </Grid>

        </Container>
    )
}

export default BeforeTrainingStart