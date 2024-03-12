import { useSelector } from "react-redux";
import { loginAttendant } from "../../slices/attendantSlice";
import { Container, Grid, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { useParams, } from "react-router-dom"
import { getXp } from "../../database/xp";

export default function PaymentPage() {
    const { alias } = useParams();
    const loginAttendantS = useSelector(loginAttendant);
    const [finalEarning, setFinalEarning] = useState("...");
    const [adjustedEarning, setAdjustedEarning] = useState("...");
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [xp, setXp] = useState({});

    const fetchXP = async () => {
        const xp = await getXp(alias);
        setXp(xp);
        await calculateFinalOutcomes();
    }

    useEffect(() => {
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateFinalOutcomes = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        if (!docSnap.exists()) {
            return;
        }

        const attendant = docSnap.data();
        let { xpRecord, pickedOutcomeIndexes, finalEarning, adjustedEarning } = attendant;
        const { outcomeHistory, missHistory } = xpRecord;

        if (typeof finalEarning !== 'undefined' && adjustedEarning) {
            setFinalEarning(attendant.finalEarning)
            setAdjustedEarning(adjustedEarning);
            setLoadingOpen(false);
            return;
        }

        if (missHistory.filter(x => x).length >= xp.missLimit) {
            await updateDoc(attendantRef, { missTooMuch: true, finalEarning: 0, adjustedEarning: 10, pickedOutcomeIndexes });
            setFinalEarning(0)
            setAdjustedEarning(10);
            setLoadingOpen(false);
            return;
        }

        const validOutcomes = outcomeHistory.map((outcome, index) => ({ outcome, index })).filter(item => item.outcome !== null);

        const maxStartIndex = validOutcomes.length - 100;
        const startIndex = Math.floor(Math.random() * (maxStartIndex + 1));
        const endIndex = startIndex + 100;
        pickedOutcomeIndexes = validOutcomes.slice(startIndex, endIndex).map(item => item.index).sort((a, b) => a - b);       

        if (validOutcomes.length < 100) {
            console.warn("Not enough outcomes to pick a contiguous block of 100 trials.");
            setLoadingOpen(false);
            return;
        }

        const sumEarning = pickedOutcomeIndexes.reduce((a, b) => a + outcomeHistory[b], 0);
        finalEarning = 0.5 * sumEarning - 680;

        if (finalEarning <= 5) {
            adjustedEarning = 10;
        } else if (finalEarning > 5 && finalEarning < 95) {
            adjustedEarning = finalEarning + 5;
        } else if (finalEarning >= 95) {
            adjustedEarning = 100;
        }

        await updateDoc(attendantRef, { finalEarning: finalEarning, adjustedEarning: adjustedEarning, pickedOutcomeIndexes });
        setFinalEarning(finalEarning)
        setAdjustedEarning(adjustedEarning);
        setLoadingOpen(false);
    };


    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center">
                <Grid item xs={1} />
                <Grid item xs={10} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Game over!
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        The game is over. The computer randomly selected 100 consecutive trials from the task and computed your net accumulated outcomes across these consecutive trials.
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        We take 50% of these outcomes and deduct a threshold of $680, which results in your initial earnings being ${typeof finalEarning === 'number' ? Math.max(0, finalEarning) : finalEarning}. So your final earnings (including the show-up fee) are ${adjustedEarning}.
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        Please wait, the experimenter will come shortly.
                    </Typography>

                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loadingOpen}
                        onClick={() => setLoadingOpen(false)}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </Grid>
            </Grid>
        </Container>
    )
}