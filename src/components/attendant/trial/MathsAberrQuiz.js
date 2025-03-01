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

const MathsAberrQuizPage = () => {
    // The correct answer here is the 1st option
    const correctAnswer = 1;
    const maxBonus = 20;

    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);

    const { alias } = useParams();
    const navigate = useNavigate();

    // If there's a specific time limit from xpConfig, use it; otherwise default
    const totalTime = xpConfig.secondsBriefMathsQuiz || 125;

    // States for the quiz
    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [finalConfidence, setFinalConfidence] = useState(50);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    // Timer for the quiz
    const [timeLeft, setTimeLeft] = useState(totalTime);
    // Timer for the post-submission auto-return
    const [autoTimeLeft, setAutoTimeLeft] = useState(30);

    // Reference for calculating total time used
    const startTimeRef = useRef(Date.now());

    // Slider marks for 0%, 10%, ..., 100%
    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // 1) Fetch attendant data on mount to see if quiz was already completed
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.mathAberrQuiz) {
                // If user already did this quiz, set final state
                const { q1, q2, earnedAmount } = refreshedAttendant.mathAberrQuiz;
                setQ1(q1);
                setFinalConfidence(q2);
                setIsConfirmed(true);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);
            } else {
                // Not submitted yet, enable form
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id]);

    // 2) Countdown for the quiz; auto-submit on time out
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 3) Post-submission countdown (30s) to auto-return
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted]);

    // Confirm slider
    const handleConfirmConfidence = () => {
        setFinalConfidence(sliderValue);
        setIsConfirmed(true);
    };

    // Submit quiz
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

        // Save results in DB under "mathAberrQuiz"
        await updateAttendant(loginAttendantS.id, {
            mathAberrQuiz: {
                q1,
                q2: lockedConfidence,
                earnedAmount: money,
                timeUsed: totalTimeUsed,
                missed
            }
        });

        setSubmitted(true);
    };

    // Navigate away after finishing
    const handleBackToTrial = () => {
        navigate(`/xp/${alias}/trial`);
    };

    // The single question from the new PDF
    const q1Options = [
        // The 1st option is correct
        "The trend will definitely switch back to -1 on the next day.",
        "The trend will most likely remain the same (+1) since the indicator is at baseline",
        "The trend will switch to -1 with 15% chance."
    ];

    return (
        <Container sx={{ position: "relative", mt: 4 }}>
            {/* Timer top-right (only if form not submitted) */}
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="body1">
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            {/* Intro text from the new PDF */}
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
                <b>Quick Scenario:</b> The indicator is at baseline (0) and the current trend switches from -1 to +1.
            </Typography>

            {/* If not submitted, show the quiz */}
            {!submitted && (
                <>
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        What will happen next?
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
                        Step 2: How confident are you in your answer?
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

            {/* If submitted, show the results */}
            {submitted && (
                <>
                    <RadioGroup sx={{ mt: 3 }}>
                        {q1Options.map((option, idx) => (
                            <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                                <FormControlLabel
                                    control={<Radio disabled value={idx + 1} checked={q1 === idx + 1} />}
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
                                <Typography variant="h6" gutterBottom>
                                    Thanks for your input! Your reply will help us better understand the experimental results.
                                </Typography>
                                <Typography variant="h6" gutterBottom>
                                    <b>Quick Reminder:</b>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    A switch that occurs when the indicator is at baseline (0) must be an aberration:
                                    the trend will switch back to -1 for sure on the next day (no uncertainty).
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Let's continue the game now.
                                </Typography>
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

export default MathsAberrQuizPage;
