import {
  Container, Box, Grid, Typography,
  Backdrop, CircularProgress, Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  trialIndex,
  ballAQty,
  reset,
  resetTraining,
  // removeData,
  recordBet,
  bets,
  resetHistory,
  betResultHistory,
  betHistory,
  betChosenHistory,
  moneyOutcomeHistory,
  missHistory,
  reactionHistory,
} from "../../../slices/pretaskSlice";
import { useDispatch, useSelector } from "react-redux";
import TrialTimerProgress from "./TrialTimerProgress";
import { getPretask } from "../../../database/pretask"
import { getAttendant, updatePretaskRecord } from "../../../database/attendant"
import { useParams } from "react-router-dom"
import Jar from "./Jar"
import BallOption from "./BallOption"
import BallOptionSkip from "./BallOptionSkip"

import profitImg from "../../../assets/profit.png";
import lossImg from "../../../assets/loss.png";
import coinImg from "../../../assets/coin.png";
import trendDownImg from "../../../assets/trend_down.png";
import trendUpImg from "../../../assets/trend_up.png";
import outcomeLossImg from "../../../assets/outcome_loss.png";
import outcomeProfitsImg from "../../../assets/outcome_profits.png";
import happyImg from "../../../assets/happy.png";
import laughingImg from "../../../assets/laughing.png";
import downRightImg from "../../../assets/down-right.png";
import MoneyOutcome from "./MoneyOutcome";
import { loginAttendant } from "../../../slices/attendantSlice";
import { useNavigate } from "react-router-dom"
import TextTransition, { presets } from "react-text-transition";

const Pretask = ({ isTraining }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alias } = useParams()
  const [pretask, setPretask] = useState(null);
  const [loadingOpen, setLoadingOpen] = useState(true);
  const loginAttendantS = useSelector(loginAttendant);
  const trialIndexS = useSelector(trialIndex);
  const ballAQtyS = useSelector(ballAQty);
  const betsS = useSelector(bets);
  const resetHistoryS = useSelector(resetHistory);
  const betResultHistoryS = useSelector(betResultHistory);
  const betHistoryS = useSelector(betHistory);
  const betChosenHistoryS = useSelector(betChosenHistory);
  const moneyOutcomeHistoryS = useSelector(moneyOutcomeHistory);
  const missHistoryS = useSelector(missHistory);
  const reactionHistoryS = useSelector(reactionHistory);
  let attendant = null;

  const fetchPretask = async () => {
    try {
      const pretask = await getPretask(alias);
      setPretask(pretask);

      if (loginAttendantS) {
        attendant = await getAttendant(loginAttendantS.id);
        if (isTraining) {
          dispatch(resetTraining({ pretask }));
        } else {
          dispatch(reset({
            pretask,
            pretaskRecord: attendant.pretaskRecord
          }));
        }
      }
      setLoadingOpen(false);
    } catch (error) {
      console.error(error)
    }
  }
  const storeToDB = async () => {
    if (isTraining) {
      return;
    }
    if (!loginAttendantS) {
      return;
    }

    const pretaskRecord = {
      trialIndex: betResultHistoryS.length,
      ballAQty: ballAQtyS,
      resetHistory: resetHistoryS,
      betResultHistory: betResultHistoryS,
      betHistory: betHistoryS.map(arr => arr.join(',')),
      betChosenHistory: betChosenHistoryS,
      moneyOutcomeHistory: moneyOutcomeHistoryS,
      missHistory: missHistoryS,
      reactionHistory: reactionHistoryS,
    };
    await updatePretaskRecord(loginAttendantS.id, pretaskRecord);

  };

  const onSubmit = async () => {
    dispatch(recordBet({
      missed: false,
      bets: betsS,
    }));
  }

  useEffect(() => {
    fetchPretask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (trialIndexS > 0 && !isTraining) {
      storeToDB();
    }

    if (pretask && missHistoryS &&
      missHistoryS.filter(x => x).length >= pretask.missLimit) {
      if (isTraining) {
        // dont do anything for training
        //   dispatch(removeData(pretask));
        //   navigate(`/xp/${alias}/pretask/start`);
      } else {
        navigate(`/xp/${alias}/pretask/payment`);
      }
    }

    if (pretask && resetHistoryS &&
      resetHistoryS.length >= pretask.repeatLimit) {
      if (isTraining) {
        // do nothing for training
        // dispatch(removeData(pretask));
        // navigate(`/xp/${alias}/pretask/start`);
      } else {
        navigate(`/xp/${alias}/pretask/payment`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballAQtyS, resetHistoryS, trialIndexS, missHistoryS]);

  return (
    <>
      <img id="profitImg" src={profitImg} alt="coin" style={{ display: 'none' }} />
      <img id="lossImg" src={lossImg} alt="coin" style={{ display: 'none' }} />
      <img id="coinImg" src={coinImg} alt="coin" style={{ display: 'none' }} />
      <img id="outcomeLossImg" src={outcomeLossImg} alt="coin" style={{ display: 'none' }} />
      <img id="outcomeProfitsImg" src={outcomeProfitsImg} alt="coin" style={{ display: 'none' }} />
      <img id="coinImg" src={coinImg} alt="coin" style={{ display: 'none' }} />
      <img id="trendUpImg" src={trendUpImg} alt="coin" style={{ display: 'none' }} />
      <img id="trendDownImg" src={trendDownImg} alt="coin" style={{ display: 'none' }} />
      <img id="laughingImg" src={laughingImg} alt="coin" style={{ display: 'none' }} />
      <img id="happyImg" src={happyImg} alt="coin" style={{ display: 'none' }} />
      <img id="downRightImg" src={downRightImg} alt="coin" style={{ display: 'none' }} />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {pretask &&
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography variant="h5" align="center" sx={{ mt: 2, mb: 1 }}>
                {isTraining ? 'Training' : ''} Trial:
                <Box sx={{ display: 'inline-block', ml: 1 }}>
                  <TextTransition springConfig={presets.wobbly}>
                    {trialIndexS + 1}
                  </TextTransition>
                </Box>
              </Typography>
              <TrialTimerProgress pretask={pretask} />
              <Grid container>
                <Grid item xs={12}>
                  <Box sx={{ height: 0, my: 0, textAlign: 'center' }}>
                    <MoneyOutcome pretask={pretask} />
                  </Box>
                </Grid>
              </Grid>
              <Grid container alignItems="center" sx={{ mt: 5 }}>
                <Grid item xs={12}>
                  <Jar />
                </Grid>

                <Grid container alignItems="center" sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <BallOption
                      type="a"
                      winQty={ballAQtyS[trialIndexS]}
                      lossQty={pretask.totalQty - ballAQtyS[trialIndexS]}
                      winCash={pretask.ballAWin}
                      lossCash={pretask.ballALose}
                      label="Bet Blue"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <BallOption
                      type="b"
                      winQty={pretask.totalQty - ballAQtyS[trialIndexS]}
                      lossQty={ballAQtyS[trialIndexS]}
                      winCash={pretask.ballBWin}
                      lossCash={pretask.ballBLose}
                      label="Bet Green"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <BallOptionSkip />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Button variant="contained"
              disabled={betsS.length === 0}
              onClick={() => onSubmit()} sx={{ mt: 3, mb: 1 }}>Submit</Button>
          </Grid>
        </Container>
      }
    </>

  );
};

export default Pretask;
