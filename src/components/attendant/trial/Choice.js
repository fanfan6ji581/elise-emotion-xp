import { Button, Grid, } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
    showMoneyOutcome, recordChoice, setShowMoneyOutcome, showAfterClickDelay,
    choiceHistory
} from "../../../slices/gameSlice";
import { useEffect, useRef, useState } from 'react';

export default function Choice({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const choiceHistoryS = useSelector(choiceHistory);
    const loadingInterval = useRef(null);
    const { choiceDelay } = xpConfig;
    const [choice, setChoice] = useState('')

    const clickedAction = (choice) => {
        setChoice(choice);
        dispatch(recordChoice({ choice, missed: false }));
    }

    useEffect(() => {
        if (showAfterClickDelayS) {
            loadingInterval.current = setTimeout(() => {
                dispatch(setShowMoneyOutcome(true));
            }, choiceDelay)
        }

        // missed
        const filterd = choiceHistoryS.filter(i => i != null);
        if (filterd[filterd.length - 1] === '') {
            setChoice('');
        }

        return () => clearInterval(loadingInterval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAfterClickDelayS, showMoneyOutcomeS, choiceHistoryS])


    return (
        <>
            <Grid container
                sx={{ my: 5 }}
            // style={(showAfterClickDelayS || showMoneyOutcomeS) ?
            //     { filter: "grayscale(100%)", pointerEvents: "none" } : {}}
            >
                <Grid item xs={2} />
                <Grid item xs={8} style={{ textAlign: "center" }}>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160, boxShadow: 5 }} onClick={() => clickedAction("shift")}
                        disabled={choice !== 'shift' && (showAfterClickDelayS || showMoneyOutcomeS)}
                        style={choice === 'shift' && (showAfterClickDelayS || showMoneyOutcomeS) ?
                            { pointerEvents: "none" } : {}}
                    >
                        Switch
                    </Button>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160 }} onClick={() => clickedAction("no shift")}
                        disabled={choice !== 'no shift' && (showAfterClickDelayS || showMoneyOutcomeS)}
                        style={choice === 'no shift' && (showAfterClickDelayS || showMoneyOutcomeS) ?
                            { pointerEvents: "none" } : {}}
                    >
                        No Switch
                    </Button>
                    <Button size="large" variant="contained" sx={{ mx: 5, width: 160 }} onClick={() => clickedAction("skip")}
                        disabled={choice !== 'skip' && (showAfterClickDelayS || showMoneyOutcomeS)}
                        style={choice === 'skip' && (showAfterClickDelayS || showMoneyOutcomeS) ?
                            { pointerEvents: "none" } : {}}
                    >
                        Skip
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}