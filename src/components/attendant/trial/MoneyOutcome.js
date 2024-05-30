import { useDispatch, useSelector } from "react-redux";
import profitImg from '../../../assets/outcome_profits.png';
import lossImg from '../../../assets/outcome_loss.png';
// import happySVG from '../../../assets/happy.svg';
// import sadSVG from '../../../assets/sad.svg';
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { showMoneyOutcome, outcomeHistory, missHistory, trialIndex, nextTrial, 
    // isOutComeShift,
 } from "../../../slices/gameSlice";
import { useEffect, useRef } from "react";

export default function MoneyOutcome({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const loadingInterval = useRef(null);
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const outcomeHistoryS = useSelector(outcomeHistory);
    const missHistoryS = useSelector(missHistory);
    const trialIndexS = useSelector(trialIndex);
    // const isOutComeShiftS = useSelector(isOutComeShift);

    const { afkTimeoutCost, outcomeShowTime, useMultiColorChoiceButton } = xpConfig;

    const moneyEarned = outcomeHistoryS[trialIndexS];
    const missedTrial = missHistoryS[trialIndexS];

    const changeMoneyVariants = {
        left: {
            opacity: [0, 1]
        },
        right: {
            opacity: [1, 0, 1]
        },
        hidden: {
            opacity: 0
        }
    }

    useEffect(() => {
        if (showMoneyOutcomeS) {
            loadingInterval.current = setTimeout(() => {
                dispatch(nextTrial())
            }, outcomeShowTime)
        }

        return () => clearInterval(loadingInterval.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showMoneyOutcomeS])


    if (!showMoneyOutcomeS) {
        return <></>
    }

    return (
        <>
            <motion.div variants={changeMoneyVariants} animate={(trialIndexS % 2 === 0) ? "left" : "left"}>
                <Box sx={{ position: 'absolute', width: '100%', left: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mt: 0 }}>
                        {moneyEarned !== 0 && (
                            <Box component="img"
                                sx={{ width: 200, mr: 3 }}
                                src={missedTrial ? lossImg : (moneyEarned < 0 ? lossImg : profitImg)}
                                alt="profitImg" />
                        )}
                        <Typography variant="h1" color={useMultiColorChoiceButton ? moneyEarned === 0 ? "" : moneyEarned > 0 ? "rgb(56, 142, 60)" : "error" : ""}>
                            {
                                missedTrial ?
                                    `Missed trial, you lost -$${afkTimeoutCost}!` :
                                    moneyEarned < 0 ?
                                        `You just lost $${-moneyEarned}` :
                                        moneyEarned === 0 ?
                                            `You just got $${moneyEarned}`
                                            :
                                            `You just won $${moneyEarned}`
                            }
                        </Typography>

                        {/* {isOutComeShiftS && moneyEarned > 0 ? <><Box component="img" sx={{ width: 200 }} src={happySVG} /></> : <></>}
                        {isOutComeShiftS && moneyEarned < 0 ? <><Box component="img" sx={{ width: 200 }} src={sadSVG} /> </> : <></>} */}
                    </Box>
                </Box>
            </motion.div>
        </>
    )
}

