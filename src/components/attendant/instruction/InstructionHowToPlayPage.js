import {
    Container, Box, Typography, Button,
    // Alert,
    Grid, Stack, Divider
} from "@mui/material";
import React, { useEffect } from 'react';
// import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
import image3 from "../../../assets/3.png";
import image6 from "../../../assets/6.png";
import img11 from "../../../assets/2025/11.png";
import img12 from "../../../assets/2025/12.png";
import img14 from "../../../assets/2025/14.png";


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

            <Grid container alignItems="center" sx={{ my: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        Want to predict trend shifts? Activate a secret indicator graph below the main chart—by clicking anywhere on the blank space below that chart!
                    </Typography>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img11} sx={{ boxShadow: 0, width: '100%' }} />
                </Grid>
            </Grid>

            {/* <Divider /> */}


            <Grid container alignItems="center" sx={{ my: 2 }}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ my: 1 }}>
                        This tool can help you forecast the shifts as <b>there is a pattern</b> linking the indicator to the asset trend:
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <ul>
                        <li>
                            <Typography variant="h6">
                                <b>Indicator at 0 (baseline)</b> = Current trend likely to continue
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6">
                                <b>Indicator jumps to 1</b> = 15% chance of trend shift tomorrow!
                            </Typography>
                        </li>

                    </ul>
                </Grid>
            </Grid>

            <Divider />




            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ my: 3 }}>
                        Look closely at this example to understand how it works:
                    </Typography>
                </Grid>

                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img12} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 5, ml: 2 }}>
                        Here, when the indicator jumps to 1 on Day #2, the player has entered a <b>"dangerous zone"</b>. What happens next:
                    </Typography>

                    <Grid item xs={12} sx={{ ml: 3 }}>
                        <ul>
                            <li>
                                <Typography variant="h6">
                                    Starting Day #3, there's a 15% chance EACH DAY that the trend will flip from uptrend (+1) to downtrend (-1)
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="h6">
                                    This 15% daily chance CONTINUES until the shift actually happens
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="h6">
                                    In our example, the shift finally occurs on Day #8
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="h6">
                                    The indicator immediately drops back to 0, signalling the dangerous zone is over
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="h6">
                                    A new downtrend phase begins from Day #8
                                </Typography>
                            </li>
                        </ul>
                    </Grid>
                </Grid>
            </Grid>

            <Divider />


            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={2} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image6} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={10}>
                    <Grid item xs={12} sx={{ ml: 3 }}>
                        <Typography variant="h5" sx={{ my: 2 }}><b>Beware of Aberrations!</b></Typography>
                    </Grid>
                    <Typography variant="h6" sx={{ ml: 3 }}>
                        Occasionally during the game, the asset trend suddenly switches while the indicator is at 0!
                        This kind of switch is NOT a real shift but an <b>"aberration"</b>: the asset trend always switches back to the
                        previous value on the next day. These <b>very rare</b> one-day aberrations (occurring with only about 5%
                        chance when the indicator is at 0) are just temporary blips—don't confuse them with the real trend
                        shifts that occur during dangerous zones! Real shifts are preceded by the indicator jumping to 1,
                        while aberrations happen with the indicator at 0.

                    </Typography>
                </Grid>
            </Grid>

            <Divider />

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{ my: 3 }}>
                        A quick example to clear it all up:
                    </Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={img14} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{ my: 3, ml: 2 }}>
                        Look at the difference:
                    </Typography>

                    <Grid item xs={12} sx={{ ml: 3 }}>
                        <ul>
                            <li>
                                <Typography variant="h6">
                                    <b>Day #29</b>: The trend flips from "-1" to "+1" with indicator at 0 = ABERRATION!
                                </Typography>
                            </li>
                            <ul>
                                <li> <Typography variant="h6">Result: Immediate return to "-1" on Day #30</Typography></li>
                                <li><Typography variant="h6">Remember: This one-day blip still triggers the 10× outcome multiplier (at play anytime there is a switch). </Typography>
                                </li>
                            </ul>
                            <li>
                                <Typography variant="h6">
                                    <b>Day #35</b>: The trend shifts from "-1" to "+1" with indicator previously at 1 = REAL SHIFT
                                </Typography>
                            </li>
                            <ul>
                                <li> <Typography variant="h6">Notice: Indicator jumped to 1 on Day #31 ➜ a dangerous zone begins.
                                </Typography></li>
                                <li><Typography variant="h6">When shift occurs on Day #35, indicator returns to 0
                                </Typography>
                                </li>
                                <li><Typography variant="h6">A genuine new uptrend phase begins!
                                </Typography>
                                </li>
                            </ul>
                        </ul>
                    </Grid>
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