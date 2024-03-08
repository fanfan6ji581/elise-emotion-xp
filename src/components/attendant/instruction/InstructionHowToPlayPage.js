import {
    Container, Box, Typography, Button, Alert,
    Grid, Stack, Divider
} from "@mui/material";
// import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
import image3 from "../../../assets/3.png";
import image4 from "../../../assets/4.png";
import image5 from "../../../assets/5.png";
import image6 from "../../../assets/6.png";
import image7 from "../../../assets/7.png";
import image8 from "../../../assets/8.png";
import image9 from "../../../assets/9.png";


const InstructionHowToPlayPage = () => {
    const { alias } = useParams();
    // const xpConfig = useSelector(xpConfigS);

    return (
        <Container maxWidth="lg">

            <Grid container justifyContent="center" alignItems="center" sx={{ my: 3 }}>
                <Grid item xs={12}>
                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
                        <Box component="img" alt="" src={image3} sx={{ width: '128px', display: 'block', mr: 3 }} />
                        <Typography variant="h4" align="center" >
                            Tricks of the Game
                        </Typography>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container alignItems="center" sx={{ my: 1 }}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        As shown in the demo, on each trial, before you make your decision, you have the option to make a graph appear underneath the asset history graph. What for?
                    </Typography>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        This graph shows you the value of an indicator on each day, which can help you forecast the next asset trend as
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            {' there is a pattern '}
                        </Box>
                        linking the indicator to the asset value:
                    </Typography>
                </Grid>
            </Grid>

            <Alert icon={false} severity="primary" sx={{ mb: 5 }}>
                <Typography variant="h6">
                    When the indicator is at its baseline value (0), you can infer the current trend should generally remain the same next day. Whenever you see the indicator departs from its baseline value on a certain day, you can infer there are <b>*<u>very high chances</u>*</b>—70%, that is, 0.7 probability—that the asset trend will shift on the next day.
                </Typography>
            </Alert>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h5">
                    Here are a few examples:
                </Typography>
            </Grid>


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image4} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        In this example, the indicator departs from the baseline (0) in Day #4. This means that in Day #5, the asset trend will shift from the current uptrend (+1) to a downtrend (-1) with 0.7 probability (i.e., 70% chance of a shift, 30% chance of no shift). It turns out the shift occurs in Day #5; accordingly, the indicator falls back to 0 as the new phase (a downtrend here) begins.
                    </Typography>
                </Grid>
            </Grid>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h5">
                    Here is a second example
                </Typography>
            </Grid>


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        You can see the indicator departs from the baseline (0) in Day #14. This means  the probability that the asset trend is going to shift on the next day (Day #15) is 0.7. That is, there are very high (70%) chances of a shift and small (30%) chances of no shift. It turns out the asset trend does not shift in Day #15, so the indicator continues to increase on that day. The chances that the asset trend is going to shift on the next day (Day #16) are as high as before (70% chances). You can see the shift happens to occur in Day #16 and the indicator falls back to 0 as the new phase (an uptrend here) begins.
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image5} sx={{ width: '100%' }} />
                </Grid>
            </Grid>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image6} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        Sometimes during the game, the asset trend suddenly switches while the indicator is at 0! This kind of switch is not a real shift but an <b>“aberration”</b>: the asset trend always shifts back to the previous value. See the example below.
                    </Typography>
                </Grid>
            </Grid>

            <Divider />


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image7} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        The asset trend shifts from “-1” to “+1” in Day #78, but the indicator has been at 0 so this cannot be a real shift. It is an aberration and the asset immediately shits back to its current value “-1” in the next day (Day #79). In contrast, the shift of the asset trend from “+1” to “-1” on Day #74 is a real shift as signalled by the indicator departing from the baseline on Day #73.
                    </Typography>
                </Grid>
            </Grid>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                    As you could see on the demo, by default the indicator graph is not shown on screen. If you wish to see the indicator on a given trial, you have to click anywhere on the blank space below the asset chart, and the indicator chart will instantaneously appear on screen.
                </Typography>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center" sx={{ my: 2 }}>
                        <u>Before Clicking:</u>
                    </Typography>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Box sx={{ textAlign: "center", my: 2 }}>
                        <Box component="img" alt="" src={image8} sx={{ width: '80%', boxShadow: 3 }} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" align="center" sx={{ my: 2 }}>
                        <u>After Clicking:</u>
                    </Typography>
                </Grid>
                <Grid item xs={2} />
                <Grid item xs={8}>
                    <Box sx={{ textAlign: "center", my: 2 }}>
                        <Box component="img" alt="" src={image9} sx={{ width: '80%', boxShadow: 3 }} />
                    </Box>
                </Grid>
            </Grid>






            <Box textAlign="center" sx={{ my: 10 }}>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction`} sx={{ mx: 2 }}>Prev</Button>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-payment`} sx={{ mx: 2 }}>Next</Button>
            </Box>
        </Container>
    )
}

export default InstructionHowToPlayPage