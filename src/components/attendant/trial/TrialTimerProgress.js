import { LinearProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  trialIndex,
  timerProgress,
  recordChoice,
  showMoneyOutcome,
  showAfterClickDelay,
  setProgressStartTime,
  setTimerProgress,
  xpConfigS,
} from "../../../slices/gameSlice";
import { useRef, useEffect } from "react";

export default function TrialTimer() {
  const dispatch = useDispatch();
  const timerProgressS = useSelector(timerProgress);
  const progressStartTime = useRef(0);
  const showMoneyOutcomeS = useSelector(showMoneyOutcome);
  const showAfterClickDelayS = useSelector(showAfterClickDelay);
  const xpConfig = useSelector(xpConfigS);
  const timerInterval = useRef(null);
  const trialIndexS = useSelector(trialIndex);

  const restartGameTimer = () => {
    clearInterval(timerInterval.current);
    progressStartTime.current = Date.now();
    dispatch(setProgressStartTime(progressStartTime.current));
    timerInterval.current = setInterval(() => {
      const timePassed = Date.now() - progressStartTime.current;
      const progress = Math.round((timePassed * 100) / xpConfig.afkTimeout / ((trialIndexS === 0 ? 2 : 1)));
      dispatch(setTimerProgress(progress));
    }, 30);
  };

  useEffect(() => {
    return () => {
      clearInterval(timerInterval.current);
    };
  }, []);

  useEffect(() => {
    if (showMoneyOutcomeS || showAfterClickDelayS) {
      // when showing delay or showing money outcome, pause progress bar
      clearInterval(timerInterval.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMoneyOutcomeS, showAfterClickDelayS]);

  useEffect(() => {
    if (timerProgressS >= 100) {
      clearInterval(timerInterval.current);
      dispatch(recordChoice({ missed: true }));
    }
    if (timerProgressS === 0) {
      restartGameTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerProgressS, xpConfig]);

  return (
    <LinearProgress
      className="instant"
      style={{ width: "100%" }}
      variant={"determinate"}
      value={timerProgressS}
      color={timerProgressS >= 55 ? "secondary" : "primary"}
    />
  );
}
