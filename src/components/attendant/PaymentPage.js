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
    // const [finalEarning, setFinalEarning] = useState("...");
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
            // setFinalEarning(attendant.finalEarning)
            if (adjustedEarning) {
                setAdjustedEarning(adjustedEarning);
            }
            setLoadingOpen(false);
            return;
        }

        if (missHistory.filter(x => x).length >= xp.missLimit) {
            await updateDoc(attendantRef, { missTooMuch: true, finalEarning: 0, adjustedEarning: 10, pickedOutcomeIndexes });
            // setFinalEarning(0)
            setAdjustedEarning(10);
            setLoadingOpen(false);
            return;
        }

        let accumulatedOutcomes = [];

        for (let i = 0; i < 100; i++) {
            const maxStartIndex = outcomeHistory.length;
            const startIndex = Math.floor(Math.random() * (maxStartIndex - 10 - 100));
            const sumEarning = outcomeHistory.slice(startIndex, startIndex + 100).reduce((a, b) => a + b, 0);
            accumulatedOutcomes.push({ sumEarning, startIndex });
        }

        accumulatedOutcomes.sort((a, b) => a.sumEarning - b.sumEarning);
        const quantileIndex = Math.ceil(0.5 * accumulatedOutcomes.length) - 1;
        const medianOutcome = accumulatedOutcomes[quantileIndex].sumEarning;
        const medianStartIndex = accumulatedOutcomes[quantileIndex].startIndex;
        pickedOutcomeIndexes = Array.from({ length: 100 }, (_, i) => medianStartIndex + i);

        let afterQuizEarning = medianOutcome + (loginAttendantS?.mathZoneQuiz?.earnedAmount || 0) +
            (loginAttendantS?.mathAberrQuiz?.earnedAmount || 0) +
            (loginAttendantS?.mathFinalQuiz?.earnedAmount || 0);
        finalEarning = Math.round(0.8 * afterQuizEarning) - 550;

        if (finalEarning <= 5) {
            adjustedEarning = 10;
        } else if (finalEarning > 5 && finalEarning < 95) {
            adjustedEarning = finalEarning + 5;
        } else if (finalEarning >= 95) {
            adjustedEarning = 100;
        }

        await updateDoc(attendantRef, { finalEarning, adjustedEarning, afterQuizEarning, pickedOutcomeIndexes });
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
                        The game is over. The computer randomly selected 100 consecutive trials from the task and computed your net balance across these consecutive trials. If you encountered math quiz breaks during the game, the outcomes are also added up to the net balance.
                    </Typography>

                    <Typography variant="h6" sx={{ my: 5 }}>
                        We take 80% of your net balance and deduct a threshold of $550. So your earnings in this experiment (including the $5 show-up reward) are <b>${adjustedEarning}</b>. Thanks very much for your participation, we're going to proceed with the payment procedure very soon
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