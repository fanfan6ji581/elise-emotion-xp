import {
    Container, Box, Typography, Button, Alert,
    Grid, Stack, Divider
} from "@mui/material";
import React, { useEffect } from 'react';
// import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
import image3 from "../../../assets/3.png";
import image4 from "../../../assets/4.png";
import image6 from "../../../assets/6.png";
import image7 from "../../../assets/7.png";
import image8 from "../../../assets/8.png";
import image9 from "../../../assets/9.png";


const InstructionHowToPlayPage = () => {
    const { alias } = useParams();
    // const xpConfig = useSelector(xpConfigS);

    useEffect(() => {
        // Scroll to the top of the page when the component is mounted
        window.scrollTo(0, 0);
    }, []); // Empty dependency array means this effect runs only once on mount

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
                        This graph shows you the value of an indicator on each day, which can help you forecast the
                        <Box component="span" sx={{ color: 'error.main' }}>
                            {' shifts '}
                        </Box> as
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            {' there is a pattern '}
                        </Box>
                        linking the indicator to the asset value:
                    </Typography>
                </Grid>
            </Grid>

            <Alert icon={false} severity="primary" sx={{ mb: 5 }}>
                <Typography variant="h6">
                    When the indicator is at its baseline value (0), you can infer the current trend should
                    generally remain the same next day. Whenever you see the indicator departs from its
                    baseline value on a certain day to take on positive value (1), you can infer the asset
                    trend will shift <b><u>on the next day</u></b> with probability 0.1—that is, there are 10% chances
                    that the asset trend will shift <b><u>on the next day</u></b>.
                </Typography>
            </Alert>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h5">
                    Here are an example:
                </Typography>
            </Grid>


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image4} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        In this example, the indicator
                        departs from the baseline (0) and
                        takes value 1 in Day #2. This means
                        that starting from the next day (Day
                        #3), the asset trend may shift, i.e.,
                        we have entered into <Box component="span" sx={{ color: 'error.main' }}><b>“a dangerous zone”</b></Box>.
                        To be more specific, the asset
                        will shift from the current uptrend
                        (+1) to a downtrend (-1) with 0.1
                        probability (i.e., 10% chance of a
                        shift, 90% chance of no shift). The
                        shift probability <b>is fixed at 0.1</b> and
                        the dangerous zone continues until
                        the shift is realized. It turns out the
                        shift occurs in Day #8. Accordingly,
                        the indicator falls back to 0 on Day
                        #8, which means that this dangerous
                        zone is over and the new asset phase (a downtrend here) begins from that day.

                    </Typography>
                </Grid>
            </Grid>

            <Divider />


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image6} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={10}>
                    <Typography variant="h6" sx={{ my: 5, ml: 5 }}>
                        Sometimes during the game, the asset trend suddenly
                        switches while the indicator is at 0! This kind of switch is <u>NOT</u> a real shift but an <b>“aberration</b>”: the asset trend always
                        switches back to the previous value on the next day. See the
                        example below.
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
                        The asset trend switches from “-1” to
                        “+1” in Day #29 but the indicator has
                        been at 0 on the previous Day #28 so this
                        cannot be a real shift. It is an aberration
                        and the asset immediately switches back
                        to “-1” in the next day (Day #30). In
                        contrast, the shift of the asset trend from
                        “-1” to “+1” on Day #35 is a real <Box component="span" sx={{ color: 'error.main' }}>
                            {' shifts '}
                        </Box> as
                        signalled by the indicator departing from
                        the baseline on Day #31 and returning to
                        0 on Day #35. After this shift, a new
                        phrase (an uptrend here) begins.

                    </Typography>
                </Grid>
            </Grid>


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h6">
                    <b>Note:</b> The outcome upon an aberration is normal <b>(NOT magnified)</b>, consistent with the fact
                    that aberrations are not real shifts as you are not in a dangerous zone. Therefore, in the above
                    example, the outcome upon Days #29 and #30 are normal and only the outcome on Day #35
                    is magnified by 20 times. Moreover, aberrations are rare (less than 15% chance) and they can
                    occur only when the indicator is at baseline (0); they cannot occur in the dangerous zone.
                </Typography>
            </Grid>


            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                    As you could see on the demo, by default the indicator graph is not shown on screen. If you
                    wish to see the indicator on a given trial, you have to click anywhere on the blank space
                    below the asset chart, and the indicator chart will instantaneously appear on screen.
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