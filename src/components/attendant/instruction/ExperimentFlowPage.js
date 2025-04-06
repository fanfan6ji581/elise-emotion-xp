import {
    Container,
    Box,
    Grid,
    Typography,
    // Button,
    Divider,
} from "@mui/material";
// import {
//      Link,
//      useParams } from "react-router-dom";

const ExperimentFlowPage = () => {
    // const { alias } = useParams();
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* ⏱ EXPERIMENT FLOW */}
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ my: 2, fontWeight: "bold" }}
                    >
                        ⏱ EXPERIMENT FLOW
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ mx: "auto", maxWidth: 600 }}>
                        <Typography variant="body1" sx={{ my: 1 }}>
                            <b>1.</b> ARRIVE AT BIZLAB
                        </Typography>
                        <Typography variant="body1" sx={{ my: 1 }}>
                            <b>2.</b> LEARN THE RULES OF THE GAME (1-HOUR INSTRUCTION PHASE)
                        </Typography>
                        <Typography variant="body1" sx={{ my: 1 }}>
                            <b>3.</b> PLAY ONE RUN OF THE GAME
                        </Typography>
                        <Typography variant="body1" sx={{ my: 1 }}>
                            <b>4.</b> COLLECT YOUR CASH
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* 💰 POTENTIAL EARNINGS 💰 */}
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ my: 2, fontWeight: "bold" }}
                    >
                        💰 POTENTIAL EARNINGS 💰
                    </Typography>
                </Grid>

                {/* Individual Performance */}
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ my: 1, fontWeight: "bold" }}
                    >
                        Individual Performance
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ my: 1 }}>
                        <b>Strong performers</b> → $80-$100<br />
                        <b>Poor performers</b> → just $5
                    </Typography>
                </Grid>
                {/* <Grid item xs={12}>
            <Divider />
          </Grid> */}

                {/* Grand Champion */}
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ my: 1, fontWeight: "bold" }}
                    >
                        🏆 Grand Champion
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ my: 1 }}>
                        Highest score across all 5 sessions → Extra $100 prize on top of game
                        earnings
                    </Typography>
                </Grid>
                {/* <Grid item xs={12}>
            <Divider />
          </Grid> */}

                {/* Best Session */}
                <Grid item xs={12}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ my: 1, fontWeight: "bold" }}
                    >
                        🎖️ Best Session
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ my: 1 }}>
                        The session with the highest average score → Extra $20 bonus for{" "}
                        <b>EACH</b> participant in that session
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>

                {/* ⚠ ESSENTIAL CONDITIONS ⚠ */}
                <Grid item xs={12}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ my: 2, fontWeight: "bold" }}
                    >
                        ⚠ ESSENTIAL CONDITIONS ⚠
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ my: 2 }}>
                        For your session to qualify for special prizes, <b>EVERYONE</b> must follow these basic requirements:
                    </Typography>
                    <Typography variant="body1" sx={{ my: 2 }}>
                        1. <b>COMPLETE SILENCE, FULL FOCUS, AND ACTIVE PARTICIPATION THROUGHOUT INSTRUCTION PHASE</b>.<br />
                        All game rules will be explained in detail during the instruction phase. You cannot succeed in the game without perfectly understanding these rules.
                    </Typography>
                    <Typography variant="body1" sx={{ my: 2 }}>
                        2. <b>STRICTLY INDIVIDUAL EXPERIENCE</b>. <br />
                        NO TALKING to neighbours (people at computers next to yours) at any point during the session.
                    </Typography>
                    <Typography variant="body1" sx={{ my: 2, fontWeight: "bold" }}>
                        MAXIMIZE YOUR EARNINGS BY FOCUSING AND FOLLOWING THESE TWO CRUCIAL REQUIREMENTS!
                    </Typography>
                </Grid>

                {/* Next Button */}
                {/* <Grid item xs={12}>
                    <Box textAlign="center" sx={{ my: 6 }}>
                        <Button
                            component={Link}
                            variant="contained"
                            size="large"
                            to={`/xp/${alias}/instruction-next-step`}
                        >
                            Next
                        </Button>
                    </Box>
                </Grid> */}
            </Grid>
        </Container>
    );
};

export default ExperimentFlowPage;
