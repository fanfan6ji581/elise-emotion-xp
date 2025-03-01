import { Container, Box, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { loginAttendant } from "../../../slices/attendantSlice";
import {
  trialIndex,
  onLogin,
  choiceHistory,
  outcomeHistory,
  missHistory,
  reactionHistory,
  onLoginTraining,
  reset,
  xpConfigS,
  xpDataS,
  isTrialBreakTaken,
  clickToShowChartHistory,
  zoneBreakCount,
  aberrBreakCount,
  showMathZoneQuizPage,
  showAberrZoneQuizPage,
  showFinalMathsQuiz,
} from "../../../slices/gameSlice";
import { login } from "../../../slices/attendantSlice";
import { useDispatch, useSelector } from "react-redux";
import TrialTimerProgress from "./TrialTimerProgress";
import Choice from "./Choice";
import MoneyOutcome from "./MoneyOutcome";
import ValueChart from "./ValueChart";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../database/firebase";
import { useNavigate, useParams } from "react-router-dom";

const BalloonTrial = ({ isTrainingMode, onFinish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { alias } = useParams();
  const loginAttendantS = useSelector(loginAttendant);
  const trialIndexS = useSelector(trialIndex);
  const choiceHistoryS = useSelector(choiceHistory);
  const outcomeHistoryS = useSelector(outcomeHistory);
  const missHistoryS = useSelector(missHistory);
  const reactionHistoryS = useSelector(reactionHistory);
  const clickToShowChartHistoryS = useSelector(clickToShowChartHistory);
  const isTrialBreakTakenS = useSelector(isTrialBreakTaken);
  const zoneBreakCountS = useSelector(zoneBreakCount);
  const aberrBreakCountS = useSelector(aberrBreakCount);
  const showMathZoneQuizPageS = useSelector(showMathZoneQuizPage);
  const showAberrZoneQuizPageS = useSelector(showAberrZoneQuizPage);
  const showFinalMathsQuizS = useSelector(showFinalMathsQuiz);

  
  const xpData = useSelector(xpDataS);
  const xpConfig = useSelector(xpConfigS);

  const storeToDB = async () => {
    // do nothing in training mode
    if (isTrainingMode) {
      return;
    }
    const attendantRef = doc(db, "attendant", loginAttendantS.id);
    const xpRecord = {
      trialIndex: trialIndexS,
      choiceHistory: choiceHistoryS,
      outcomeHistory: outcomeHistoryS,
      missHistory: missHistoryS,
      reactionHistory: reactionHistoryS,
      clickToShowChartHistory: clickToShowChartHistoryS,
      zoneBreakCount: zoneBreakCountS,
      aberrBreakCount: zoneBreakCountS,
    };
    await updateDoc(attendantRef, { xpRecord });
    // store into local storage as well
    dispatch(login(Object.assign({}, loginAttendantS, { xpRecord })));
  };

  useEffect(() => {
    // fetch Login attdendant detail every time
    if (isTrainingMode) {
      dispatch(onLoginTraining(loginAttendantS));
    } else {
      dispatch(onLogin(loginAttendantS));
    }

    return () => {
      // reset game data
      dispatch(reset());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // store user click into database   
    if (!isTrainingMode) {
      storeToDB();
    }

    // trial break page
    if (!isTrainingMode && trialIndexS === xpConfig.numberOfTrials / 2 && !isTrialBreakTakenS) {
      navigate(`/xp/${alias}/trial-break`);
      return;
    }

    if (!isTrainingMode) {
      // do math quizpage checking when not training mode
      if (showMathZoneQuizPageS) {
        navigate(`/xp/${alias}/maths-zone-quiz`);
        return;
      }
    }


    if (missHistoryS &&
      missHistoryS.filter(x => x).length >= xpConfig.missLimit) {
      if (isTrainingMode) {
        // dont do anything for training
      } else {
        onFinish();
      }
    }

    if (trialIndexS >= xpConfig.numberOfTrials) {
      onFinish();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    trialIndexS,
    choiceHistoryS,
    outcomeHistoryS,
    missHistoryS,
    reactionHistoryS,
    clickToShowChartHistoryS,
    xpConfig,
    isTrialBreakTakenS,
    zoneBreakCountS,
    aberrBreakCountS,
    showMathZoneQuizPageS,
    showAberrZoneQuizPageS,
    showFinalMathsQuizS,
  ]);

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h5" align="center" sx={{ mt: 2, mb: 1 }}>
            Day: {trialIndexS + 1}/{xpConfig.numberOfTrials}
          </Typography>
          <TrialTimerProgress />

          <Grid container alignItems="center">
            {xpConfig && xpConfig.showChoiceButtonOnTop &&
              <Grid item xs={12}>
                <Box
                  sx={{
                    // position: 'absolute', top: 450, left: 0
                    width: '100%'
                  }}
                >
                  <Choice xpData={xpData} xpConfig={xpConfig} />
                </Box>
              </Grid>
            }
            {/* <Box sx={{ height: 40 }} /> */}

            <Grid container>
              <Grid item xs={12} sx={{ position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: choiceHistoryS[trialIndexS] === '0' ? 380 : 150, left: 0, width: '100%' }}>
                  <MoneyOutcome xpData={xpData} xpConfig={xpConfig} />
                </Box>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <ValueChart xpData={xpData} xpConfig={xpConfig} />
            </Grid>

            {xpConfig && !xpConfig.showChoiceButtonOnTop &&
              <Grid item xs={12}>
                <Choice xpData={xpData} xpConfig={xpConfig} />
              </Grid>
            }
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default BalloonTrial;
