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
            <Grid container justifyContent="center">

                <Typography variant="h4" align="center" sx={{ my: 5 }}>
                    How much money will you earn in this experiment?
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    The computer will randomly select 100 consecutive trials out of the 300 trials you’re going to play, and will compute the accumulated outcomes from those selected trials. What you will receive at the end of the experiment is a percentage of those accumulated outcomes (not the whole amount as we cannot afford to pay you more than $100 😄), minus a threshold.
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    We have fixed the percentage and threshold parameters to ensure that a sophisticated player is almost guaranteed to leave the lab with more than $80 AUD, and highly likely to get the max payment of $100 AUD. In contrast, if you do not implement the optimal strategy for the task, your most likely payoff from the task will be $5 AUD. The reason for such a payment rule is that we want to incentivise you to master the game 😄.
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    <strong>Note:</strong> We will tell you the value of the percentage and threshold only after you’ve completed the task because the knowledge of these values beforehand could disturb you during the game and we want you to focus on doing your best on every single trial — recall that any trial could be selected for payment by the computer.
                </Typography>

                <Typography variant="h6" sx={{ my: 2 }}>
                    To have a chance to master the game, you need to understand every single aspect of it, so if anything of the above is unclear, please seek clarification!
                </Typography>

                <Box textAlign="center" sx={{ my: 10 }}>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-how-to-play`} sx={{ mx: 2 }}>Prev</Button>
                    <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Next</Button>
                </Box>

            </Grid>
        </Container>
    )
}

export default Instruction3Page