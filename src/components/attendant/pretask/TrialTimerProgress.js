import { LinearProgress, Backdrop } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  timerProgress,
  recordBet,
  showMoneyOutcome,
  showAfterClickDelay,
  setShowMoneyOutcome,
  setProgressStartTime,
  setTimerProgress,
} from "../../../slices/pretaskSlice";
import { useRef, useEffect } from "react";

export default function TrialTimer({ pretask }) {
  const dispatch = useDispatch();
  const timerProgressS = useSelector(timerProgress);
  const progressStartTime = useRef(0);
  const showMoneyOutcomeS = useSelector(showMoneyOutcome);
  const showAfterClickDelayS = useSelector(showAfterClickDelay);
  const timerInterval = useRef(null);
  const delayLoadingInterval = useRef(null);

  const restartGameTimer = () => {
    clearInterval(timerInterval.current);
    progressStartTime.current = Date.now();
    dispatch(setProgressStartTime(progressStartTime.current));
    timerInterval.current = setInterval(() => {
      const timePassed = Date.now() - progressStartTime.current;
      const progress = Math.round((timePassed * 100) / pretask.afkTimeout);
      dispatch(setTimerProgress(progress));
    }, 30);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerInterval.current);
      clearInterval(delayLoadingInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showMoneyOutcomeS) {
      // when showing delay or showing money outcome, pause progress bar
      clearInterval(timerInterval.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMoneyOutcomeS]);

  useEffect(() => {
    if (showAfterClickDelayS) {
      clearInterval(timerInterval.current);
      delayLoadingInterval.current = setTimeout(() => {
        dispatch(setShowMoneyOutcome(true));
      }, pretask.choiceDelay)
    }

    return () => clearInterval(delayLoadingInterval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAfterClickDelayS])

  useEffect(() => {
    if (timerProgressS >= 100) {
      clearInterval(timerInterval.current);
      dispatch(recordBet({ bets: [], missed: true }));
    }
    if (timerProgressS === 0) {
      restartGameTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerProgressS]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showAfterClickDelayS}
      >
      </Backdrop>
      <LinearProgress
        className="instant"
        style={{ width: "100%" }}
        variant={"determinate"}
        value={timerProgressS}
        color={timerProgressS >= 55 ? "secondary" : "primary"}
      />

    </>
  );
}
