import {
    Container, Typography, Button, Box,
} from "@mui/material";
import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { loginAttendant } from "../../slices/attendantSlice";
import { useSelector } from "react-redux";

const StartGamePage = () => {
    const { alias } = useParams();
    const loginAttendantS = useSelector(loginAttendant);
    const [xp, setXp] = useState(null);

    const fetchXP = async () => {
        const xpRef = doc(db, "xp", loginAttendantS.xp_id);
        const docSnap = await getDoc(xpRef);
        if (docSnap.exists()) {
            setXp(docSnap.data());
        }
    }

    useEffect(() => {
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ py: 5 }}>
                Ready to Start?
            </Typography>

            <Box textAlign="center" sx={{ py: 15 }}>
                <Button component={Link} variant="contained" size="large"
                    to={`/xp/${alias}/count-down`}
                    disabled={!xp || !xp.enablePlaying}
                >Start Game</Button>
                {
                    xp && !xp.enablePlaying &&
                    <Typography variant="h6" align="center" sx={{my: 5}}>Waiting for experimenter to enable the game.</Typography>
                }
            </Box>
        </Container>
    )
}

export default StartGamePage