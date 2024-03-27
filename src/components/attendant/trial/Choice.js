import { Button, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Xarrow from 'react-xarrows';
import {
    showMoneyOutcome, recordChoice, setShowMoneyOutcome, showAfterClickDelay,
    choiceHistory, missHistory, trialIndex
} from "../../../slices/gameSlice";
import { useEffect, useRef, useState } from 'react';
import { blue, grey } from '@mui/material/colors'; // Import grey from MUI colors

export default function Choice({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const showAfterClickDelayS = useSelector(showAfterClickDelay);
    const choiceHistoryS = useSelector(choiceHistory);
    const missHistoryS = useSelector(missHistory);
    const loadingInterval = useRef(null);
    const { choiceDelay } = xpConfig;
    const [choice, setChoice] = useState('')
    const trialIndexS = useSelector(trialIndex);

    const missedTrial = missHistoryS[trialIndexS];

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
                return choice === value ? blue[700] : grey[300];
            }
            if (choice === '0') {
                return grey[300];
            }
        }
        return blue[700]; // Default color
    }

    return (
        <>
            <Grid container sx={{ my: 5 }}>
                <Grid item xs={12} sx={{ mb: 4, textAlign: "center" }} >
                    <Button id="sell" size="large" variant="contained" sx={{ mr: 29.5, py: 2, width: 120 }}
                        disabled={missedTrial || (choice >= 0 && (showAfterClickDelayS || showMoneyOutcomeS))}
                    >Sell</Button>
                    <Button id="buy" size="large" variant="contained" sx={{ ml: 29.5, py: 2, width: 120 }}
                        disabled={missedTrial || (choice <= 0 && (showAfterClickDelayS || showMoneyOutcomeS))}
                    >Buy</Button>
                </Grid>
                <Grid item xs={12} style={{ textAlign: "center" }}>
                    {['-20', '-10', '0', '10', '20'].map((val, index) => (
                        <Button key={val} size="large" variant="contained" sx={{ mx: 5, py: 2, width: 120 }} onClick={() => clickedAction(val)}
                            disabled={choice !== val && (showAfterClickDelayS || showMoneyOutcomeS)}
                            id={`choice${val}`}
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