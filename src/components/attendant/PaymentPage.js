import * as _ from "lodash";
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
    const [earning, setEarning] = useState("...");
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [xp, setXp] = useState({});

    const fetchXP = async () => {
        const xp = await getXp(alias);
        setXp(xp);
        await calculateFinalOutcomes(xp);
    }

    useEffect(() => {
        fetchXP();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const calculateFinalOutcomes = async (xp) => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        if (!docSnap.exists()) {
            return;
        }

        const attendant = docSnap.data();
        let { xpRecord, pickedOutcomeIndexes, finalEarning } = attendant;
        const { outcomeHistory, missHistory } = xpRecord;

        if (finalEarning) {
            setEarning(finalEarning);
            setLoadingOpen(false);
            return;
        }

        // check if pickedOutcomeIndexes is calculated already
        let shuffledIndex = outcomeHistory.map((_, idx) => (idx)).filter(i => outcomeHistory[i] !== null);
        shuffledIndex = _.shuffle(shuffledIndex);
        const length = Math.round(shuffledIndex.length * (xp.percentageEarning || 40) / 100);
        const pickedIndex = shuffledIndex.slice(0, length);
        pickedOutcomeIndexes = pickedIndex.sort((a, b) => a - b);

        // when miss too much, ignore result
        if (missHistory.filter(x => x).length >= xp.missLimit) {
            setEarning(0);
            await updateDoc(attendantRef, { missTooMuch: true, finalEarning: 0, pickedOutcomeIndexes });
            setLoadingOpen(false);
            return;
        }

        const sumEarning = pickedOutcomeIndexes.reduce((a, b) => a + outcomeHistory[b], 0);
        const cap = xp.treatment === 1 ? 150 : 100;
        const earning = Math.min(cap, sumEarning);
        await updateDoc(attendantRef, { finalEarning: earning, pickedOutcomeIndexes });
        setEarning(earning);
        setLoadingOpen(false);
    }



    return (
        <Container maxWidth="md">
            <Grid container justifyContent="center">
                <Grid item xs={1} />
                <Grid item xs={8} sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" align="center" sx={{ my: 5 }}>
                        Game over!
                    </Typography>

                    <Typography variant="body1" sx={{ my: 5 }}>
                        The game is over. The computer just randomly selected {xp.percentageEarning}%
                        of the trials you played and computed your net accumulated outcomes at these trials.
                    </Typography>

                    <Typography variant="body1" sx={{ my: 5 }}>
                        Your earnings are <b>${earning}</b>. Please wait, the experimenter will come shortly.
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