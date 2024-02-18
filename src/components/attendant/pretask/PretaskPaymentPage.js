import * as _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Container, Grid, Typography, Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { loginAttendant, logout } from "../../../slices/attendantSlice";
import { getAttendant, updateAttendant } from "../../../database/attendant";
import { getPretask } from "../../../database/pretask";
import { useParams } from 'react-router-dom';

export default function PretaskPaymentPage() {
    const dispatch = useDispatch();
    const { alias } = useParams();
    const loginAttendantS = useSelector(loginAttendant);
    const [earning, setEarning] = useState("...");
    const [loadingOpen, setLoadingOpen] = useState(true);
    // const [missed, setMissed] = useState(false);

    const calculateFinalOutcomes = async () => {
        if (!loginAttendantS || !loginAttendantS.id) {
            return;
        }
        const pretask = await getPretask(alias);
        const attendant = await getAttendant(loginAttendantS.id);
        let { pretaskRecord, pickedPretaskOutcomeIndexes, pretaskEarning } = attendant;

        if (pretaskRecord) {
            if (pretaskEarning !== undefined) {
                setEarning(pretaskEarning);
            } else {
                const { moneyOutcomeHistory, missHistory } = pretaskRecord;

                if (missHistory.filter(x => x).length >= pretask.missLimit) {
                    // setMissed(true);
                    await updateAttendant(attendant.id, {
                        pretaskEarning: 0,
                    });
                    setEarning(0);
                }
                else {
                    const isCalculated = pickedPretaskOutcomeIndexes && pickedPretaskOutcomeIndexes.length !== 0;
                    if (!isCalculated) {
                        const shuffledIndex = _.shuffle(moneyOutcomeHistory.map((_, idx) => (idx)));
                        const length = Math.round(moneyOutcomeHistory.length * pretask.percentageEarning / 100);
                        const pickedIndex = shuffledIndex.slice(0, length);
                        pickedPretaskOutcomeIndexes = pickedIndex.sort((a, b) => a - b);
                        const sumEarning = pickedPretaskOutcomeIndexes.reduce((a, b) => a + pretaskRecord.moneyOutcomeHistory[b], 0);
                        const earning = Math.max(0, Math.min(150, sumEarning));
                        await updateAttendant(attendant.id, {
                            pickedPretaskOutcomeIndexes,
                            pretaskEarning: earning,
                        });
                        setEarning(earning);
                    }
                }
            }
        }

        setLoadingOpen(false);
    }

    useEffect(() => {
        calculateFinalOutcomes();
        dispatch(logout());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="md">
                <Grid container justifyContent="center">
                    <Grid item xs={1} />
                    <Grid item xs={8} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" align="center" sx={{ my: 5 }}>
                            Game over!
                        </Typography>

                        <Typography variant="body1" sx={{ my: 5 }}>
                            The game is over.
                        </Typography>

                        <Typography variant="body1" sx={{ my: 5 }}>
                            Your earnings are <b>${earning}</b>. Please wait, the experimenter will come shortly.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>

        </>
    )
}