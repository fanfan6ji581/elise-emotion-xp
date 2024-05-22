import {
    Container, Box, Typography, Button,    Grid,
} from "@mui/material";
import React from 'react';
// import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
// import { xpConfigS } from "../../../slices/gameSlice";
import image12 from "../../../assets/12.png";
import image13 from "../../../assets/13.png";
import image14 from "../../../assets/14.png";


const InstructionHowToPlayPage = () => {
    const { alias } = useParams();
    // const xpConfig = useSelector(xpConfigS);

    // useEffect(() => {
    //     // Scroll to the top of the page when the component is mounted
    //     window.scrollTo(0, 0);
    // }, []); // Empty dependency array means this effect runs only once on mount

    return (
        <Container maxWidth="lg">

            <Grid container justifyContent="center" alignItems="center" sx={{ my: 3 }}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" >
                        Almost ready to start!
                    </Typography>
                </Grid>
            </Grid>

            <Grid container alignItems="center" sx={{ my: 1 }}>
                <Grid item xs={12}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        Here is an example to quickly remind you how the payoff works in the dangerous zone. Please double-check that all is clear to you, and if in doubt of anything, please ask!
                    </Typography>

                </Grid>
            </Grid>

            <Grid container alignItems="center" sx={{ my: 5 }}>
                <Grid item xs={4} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image12} sx={{ width: '100%' }} />
                </Grid>
                <Grid item xs={8} sx={{ textAlign: "center" }}>
                    <Box component="img" alt="" src={image13} sx={{ width: '100%' }} />
                    <Box component="img" alt="" src={image14} sx={{ width: '100%' }} />
                </Grid>
            </Grid>

            <Box textAlign="center" sx={{ my: 10 }}>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Prev</Button>
                <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/start-quiz`} sx={{ mx: 2 }}>Next</Button>
            </Box>
        </Container>
    )
}

export default InstructionHowToPlayPage