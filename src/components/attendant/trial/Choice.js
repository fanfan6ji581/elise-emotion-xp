import { Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Xarrow from 'react-xarrows';
import {
    showMoneyOutcome, recordChoice, setShowMoneyOutcome, showAfterClickDelay,
    choiceHistory, missHistory, trialIndex, outcomeHistory
} from "../../../slices/gameSlice";
import { useEffect, useRef, useState } from 'react';
import { green, grey, red } from '@mui/material/colors'; // Import grey from MUI colors

export default function Choice({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const choiceHistoryS = useSelector(choiceHistory);
    const missHistoryS = useSelector(missHistory);
    const loadingInterval = useRef(null);
    const { choiceDelay, useMultiColorChoiceButton } = xpConfig;
    const [choice, setChoice] = useState('')
    const trialIndexS = useSelector(trialIndex);
    const outcomeHistoryS = useSelector(outcomeHistory);

    const missedTrial = missHistoryS[trialIndexS];
    const moneyEarned = outcomeHistoryS[trialIndexS];

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

    // Function to determine the color of the arrows
    const getArrowColor = (value) => {
        if (missedTrial) {
            return grey[300];
        }
        if ((showAfterClickDelayS || showMoneyOutcomeS)) {
            if (choice === '-10' || choice === '-20' || choice === '10' || choice === '20') {
                return choice === value ?
                    useMultiColorChoiceButton ? moneyEarned > 0 ? green[700] : red[700] :
                        "#242424" :
                    grey[300];
            }
            if (choice === '0') {
                return grey[300];
            }
        }
        return "#242424";
    }

    const getParentButtonColor = (value) => {
        if (!useMultiColorChoiceButton) {
            return "black";
        }

        if (showMoneyOutcomeS) {
            if (choice > 0 && value === "buy") {
                return moneyEarned > 0 ? "green" : "error"
            }
            if (choice < 0 && value === "sell") {
                return moneyEarned > 0 ? "green" : "error"
            }
        }
        return "black";
    }

    const getButtonColor = (value) => {
        if (!useMultiColorChoiceButton) {
            return "black";
        }

        if (showMoneyOutcomeS) {
            if (value === choice) {
                return moneyEarned === 0 ? "black" : moneyEarned > 0 ? "green" : "error"
            }
        }
        return "black";
    }

    return (
        <>
            <Grid container sx={{ my: 8 }}>
                <Grid item xs={12} sx={{ mb: 8, textAlign: "center" }} >
                    <Button id="sell" size="large" variant="contained" sx={{ mr: 32, py: 3.5, width: 160 }}
                        disabled={missedTrial || (choice >= 0 && (showAfterClickDelayS || showMoneyOutcomeS))}
                        color={getParentButtonColor("sell")}
                    >Sell</Button>
                    <Button id="buy" size="large" variant="contained" sx={{ ml: 32, py: 3.5, width: 160 }}
                        disabled={missedTrial || (choice <= 0 && (showAfterClickDelayS || showMoneyOutcomeS))}
                        color={getParentButtonColor("buy")}
                    >Buy</Button>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    {['-20', '-10', '0', '10', '20'].map((val, index) => (
                        <Button key={val} size="large" variant="contained" sx={{ mx: 4, py: 3.5, width: 160 }} onClick={() => clickedAction(val)}
                            disabled={choice !== val && (showAfterClickDelayS || showMoneyOutcomeS)}
                            id={`choice${val}`}
                            color={getButtonColor(val)}
                        >
                            {val !== '0' ? (val > 0 ? '+' + val : val) : 'Pass'}
                        </Button>
                    ))}
                </Grid>
            </Grid>

            <Xarrow start="sell" end="choice-20" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} color={getArrowColor('-20')} />
            <Xarrow start="sell" end="choice-10" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} color={getArrowColor('-10')} />
            <Xarrow start="buy" end="choice10" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} color={getArrowColor('10')} />
            <Xarrow start="buy" end="choice20" startAnchor="bottom" endAnchor="top" path="straight" headSize={0} color={getArrowColor('20')} />
        </>
    )
}