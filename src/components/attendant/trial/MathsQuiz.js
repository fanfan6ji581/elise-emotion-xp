import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Slider,
  Box,
  Grid,
  Alert
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSelector } from "react-redux";
import { xpConfigS } from "../../../slices/gameSlice";
import { loginAttendant } from "../../../slices/attendantSlice";
import { updateAttendant, getAttendant } from "../../../database/attendant";
import { useParams, useNavigate } from "react-router-dom";

function formatTimeLeft(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = m.toString().padStart(2, "0");
  const ss = s.toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

const MathsQuizPage = () => {
  const correctAnswer = 2;
  const maxBonus = 20;
  const xpConfig = useSelector(xpConfigS);
  const loginAttendantS = useSelector(loginAttendant);

  const { alias } = useParams();
  const navigate = useNavigate();

  const totalTime = xpConfig.secondsBriefMathsQuiz || 125;

  const [q1, setQ1] = useState(0);
  const [sliderValue, setSliderValue] = useState(50);
  const [finalConfidence, setFinalConfidence] = useState(50);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [disableForm, setDisableForm] = useState(true);

  const [timeLeft, setTimeLeft] = useState(totalTime);
  const startTimeRef = useRef(Date.now());

  const [autoTimeLeft, setAutoTimeLeft] = useState(30);

  const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
    value: val,
    label: `${val}%`
  }));

  useEffect(() => {
    const fetchData = async () => {
      const refreshedAttendant = await getAttendant(loginAttendantS.id);
      if (refreshedAttendant?.mathQuiz) {
        const { q1, q2, earnedAmount } = refreshedAttendant.mathQuiz;
        setQ1(q1);
        setFinalConfidence(q2);
        setIsConfirmed(true);
        setSubmitted(true);
        setIsCorrect(q1 === correctAnswer);
        setEarnedAmount(earnedAmount || 0);
      } else {
        setDisableForm(false);
      }
    };
    fetchData();
  }, [loginAttendantS.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let autoTimer = null;
    if (submitted) {
      setAutoTimeLeft(30);
      autoTimer = setInterval(() => {
        setAutoTimeLeft((prev) => {
          const nextVal = prev - 1;
          if (nextVal <= 0) {
            clearInterval(autoTimer);
            handleBackToTrial();
            return 0;
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => {
      if (autoTimer) clearInterval(autoTimer);
    };
  }, [submitted]);

  const handleConfirmConfidence = () => {
    setFinalConfidence(sliderValue);
    setIsConfirmed(true);
  };

  const handleSubmit = async (missed = false) => {
    if (submitted || q1 === 0) return;
    const endTime = Date.now();
    const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

    const lockedConfidence = isConfirmed ? finalConfidence : sliderValue;
    setFinalConfidence(lockedConfidence);

    const correct = q1 === correctAnswer;
    setIsCorrect(correct);

    const money = (lockedConfidence / 100) * maxBonus * (correct ? 1 : -1);
    setEarnedAmount(money);

    await updateAttendant(loginAttendantS.id, {
      mathQuiz: {
        q1,
        q2: lockedConfidence,
        earnedAmount: money,
        timeUsed: totalTimeUsed,
        missed
      }
    });

    setSubmitted(true);
  };

  const handleBackToTrial = () => {
    navigate(`/xp/${alias}/trial`);
  };

  const q1Options = [
    "Choosing -10 (following the current trend)",
    "Choosing +10 (going against the current trend)",
    "Choosing Pass",
    "All three choices offer similar results on average"
  ];

  return (
    <Container sx={{ position: "relative", mt: 4 }}>
      {!submitted && (
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Typography variant="body1">
            Time Left: {formatTimeLeft(timeLeft)}
          </Typography>
        </Box>
      )}

      <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
        BRIEF MATHS QUIZ
      </Typography>
      <Typography variant="h6" textAlign="center" sx={{ my: 2 }}>
        <b>⭐ Get it right and earn up to a $20 bonus! ⭐</b>
      </Typography>
      <Typography variant="body1" gutterBottom>
        <i>
          Your confidence level determines both potential gain AND loss: high
          confidence means bigger rewards if correct, but larger penalties if
          wrong.
        </i>
      </Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        Quick Scenario: The indicator just jumped to 1 and the current trend is -1.
      </Typography>

      {!submitted && (
        <>
          <Typography variant="body1" sx={{ mt: 4 }}>
            1. From a pure maths perspective, which option results in higher average outcomes if repeated many times in this scenario?
          </Typography>
          <RadioGroup
            value={q1}
            onChange={(e) => setQ1(Number(e.target.value))}
            sx={{ mb: 3, mt: 1 }}
          >
            {q1Options.map((option, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <FormControlLabel
                  control={
                    <Radio
                      disabled={disableForm}
                      value={idx + 1}
                      checked={q1 === idx + 1}
                    />
                  }
                  label={option}
                />
              </Box>
            ))}
          </RadioGroup>

          <Typography variant="body1" sx={{ mb: 1 }}>
            2. How confident are you in your answer?
          </Typography>
          <Grid container sx={{ mb: 2 }}>
            <Grid item xs={6} sx={{ mx: "auto" }}>
              <Slider
                value={isConfirmed ? finalConfidence : sliderValue}
                onChange={(e, val) => {
                  if (!isConfirmed && !disableForm) {
                    setSliderValue(val);
                  }
                }}
                step={5}
                min={0}
                max={100}
                marks={marks}
                valueLabelDisplay="auto"
                disabled={disableForm || isConfirmed}
              />
              <Typography variant="body1" align="center">
                Confidence: {isConfirmed ? finalConfidence : sliderValue}%
                <br />
                Potential bonus/penalty: $
                {(
                  ((isConfirmed ? finalConfidence : sliderValue) / 100) *
                  maxBonus
                ).toFixed(2)}
              </Typography>
              {!isConfirmed && !disableForm && (
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Please click "Confirm Confidence" to lock in your confidence level. Once confirmed, you cannot change it.
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Button
              onClick={handleConfirmConfidence}
              disabled={disableForm || isConfirmed}
              variant="outlined"
              sx={{ mb: 3, mr: 2 }}
            >
              {isConfirmed ? "Confidence Confirmed" : "Confirm Confidence"}
            </Button>
          </Box>
          <Grid textAlign="center">
            <Button
              variant="contained"
              onClick={() => handleSubmit(false)}
              disabled={disableForm || !isConfirmed || q1 === 0}
            >
              Submit
            </Button>
          </Grid>
        </>
      )}

      {submitted && (
        <>
          <RadioGroup sx={{ mt: 3 }}>
            {q1Options.map((option, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <FormControlLabel
                  control={
                    <Radio disabled value={idx + 1} checked={q1 === idx + 1} />
                  }
                  label={option}
                />
                {idx + 1 === correctAnswer && (
                  <Alert
                    severity="success"
                    sx={{
                      ml: 2,
                      py: 0,
                      whiteSpace: "normal",
                      maxWidth: "700px",
                      display: "flex",
                      alignItems: "flex-start"
                    }}
                  >
                    Correct Answer
                  </Alert>
                )}
                {q1 === idx + 1 && q1 !== correctAnswer && (
                  <Box sx={{ ml: 2 }}>
                    <ErrorOutlineIcon color="error" />
                  </Box>
                )}
              </Box>
            ))}
          </RadioGroup>

          <Alert variant="outlined" icon={false} severity="info" sx={{ mt: 4 }}>
            {isCorrect ? (
              <>
                <Typography variant="h6" gutterBottom>
                  <b>Correct reply</b> 👍. Thanks for your input, it will help us better
                  understand the experimental results. An extra $
                  {Math.abs(earnedAmount).toFixed(2)} will be added to your final
                  score ⭐.
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Let's continue the game now.
                </Typography>
              </>
            ) : (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h6" textAlign="left" gutterBottom>
                      <b>Thanks for your input!</b> Your reply will help us better
                      understand the experimental results.
                    </Typography>
                    <Typography variant="h6" textAlign="left" gutterBottom>
                      <b>Quick Math Reminder:</b>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
                        From a pure maths perspective, when in the dangerous zone
                        (indicator = 1):
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
                        - Choosing with the current trend: 0.85 × $10 win - 0.15 × $100
                        loss <b>&lt; 0</b>
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2, textAlign: "left" }}>
                        - Choosing against the current trend: 0.15 × $100 win - 0.85 ×
                        $10 loss <b>&gt; 0</b>
                      </Typography>
                    </Grid>
                    <Typography variant="body1" gutterBottom>
                      Let's continue the game now.
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
            <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
              <Grid item>
                <Button variant="contained" onClick={handleBackToTrial}>
                  Continue the game
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body2" textAlign="right" sx={{ mt: 2 }}>
              You will be redirected in <strong>{autoTimeLeft}</strong> seconds...
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default MathsQuizPage;
