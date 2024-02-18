import { useDispatch, useSelector } from "react-redux";
import coins from '../../../assets/coins.png';
import coinsdown from '../../../assets/coinsdown.png';
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";
import { showMoneyOutcome, outcomeHistory, missHistory, trialIndex, nextTrial } from "../../../slices/gameSlice";
import { useEffect, useRef } from "react";

export default function MoneyOutcome({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const loadingInterval = useRef(null);
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const outcomeHistoryS = useSelector(outcomeHistory);
    const missHistoryS = useSelector(missHistory);
    const trialIndexS = useSelector(trialIndex);
    const { afkTimeoutCost, outcomeShowTime } = xpConfig;

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
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', mt:3 }}>
                        <Box component="img"
                            sx={{ width: 42, height: 42, mr: 2 }}
                            src={(moneyEarned < 0 || missedTrial) ? coinsdown : coins}
                            alt="coins" />
                        <Typography variant="h5">
                            {
                                missedTrial ?
                                    `Missed trial, you lost -$${afkTimeoutCost}!` :
                                    moneyEarned < 0 ?
                                        `You just lost $${-moneyEarned}` :
                                        `You just won $${moneyEarned}`
                            }
                        </Typography>
                    </Box>
                </Box>
            </motion.div>
        </>
    )
}

