import {
    Container, Box, Typography, Button, Grid,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

const InstructionHeadUpPage = () => {
    const { alias } = useParams();

    return (
        <Container maxWidth="lg">
            <Grid container>

                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ my: 6 }}>
                        ⚠️ IMPORTANT INSTRUCTION ⚠️
                    </Typography>
                </Grid>

                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        The following page contains crucial information.
                    </Typography>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        Please study it very carefully.
                    </Typography>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        <strong>Note:</strong> You won't be able to proceed to the quiz until you spend enough time reviewing the following page (minimum 2 minutes — a timer will appear in the upper right corner of your screen).
                    </Typography>

                    <Typography variant="h6" sx={{ my: 2 }}>
                        Your success in the experiment—and your potential earnings—depend directly on how well you understand these instructions.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box textAlign="center" sx={{ my: 10 }}>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-ready`} sx={{ mx: 2 }}>Prev</Button>
                        <Button component={Link} variant="contained" size="large" to={`/xp/${alias}/instruction-almost-ready-to-start`} sx={{ mx: 2 }}>Next</Button>
                    </Box>
                </Grid>

            </Grid>
        </Container>
    );
};

export default InstructionHeadUpPage;
