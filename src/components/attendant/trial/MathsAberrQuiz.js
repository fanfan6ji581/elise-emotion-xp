// MathsAberrQuiz.js
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
import { useSelector, useDispatch } from "react-redux";
import { xpConfigS, hideShowMathAberrQuizPage, setMathAberrQuiz } from "../../../slices/gameSlice";
import { loginAttendant, login } from "../../../slices/attendantSlice";
import { updateAttendant, getAttendant } from "../../../database/attendant";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Utility to format seconds into MM:SS
 */
function formatTimeLeft(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
}

const MathsAberrQuizPage = () => {
    // According to the PDF, the first option is correct:
    // "The trend will definitely switch back to -1 on the next day."
    const correctAnswer = 1;
    const maxBonus = 20;

    // Config / Redux
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const dispatch = useDispatch();

    // Router
    const { alias, trialIndexParam } = useParams();
    const navigate = useNavigate();

    // Timers
    // Default to 120 if xpConfig.secondsBriefMathsQuiz is undefined
    const totalTime = xpConfig.secondsBriefMathsQuiz || 120;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    // Post-submit auto redirect
    const [autoTimeLeft, setAutoTimeLeft] = useState(30);

    // States
    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    // For measuring how long user took
    const startTimeRef = useRef(Date.now());

    // Marks on the confidence slider
    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // Attendant data fetch at mount
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.mathAberrQuiz) {
                // Already answered
                const { q1, q2, earnedAmount } = refreshedAttendant.mathAberrQuiz;
                setQ1(q1);
                setSliderValue(q2);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);

                // Hide current page if quiz completed
                dispatch(hideShowMathAberrQuizPage());
            } else {
                // Enable form if quiz not done yet
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id, dispatch]);

    // Main countdown: auto-submit if time runs out
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

    // After submission, start post-submit countdown to auto-redirect
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
        // eslint-disable-next-line
    }, [submitted]);

    // Submit quiz
    const handleSubmit = async (missed = false) => {
        if (submitted || q1 === 0) return;

        const endTime = Date.now();
        const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

        const correct = q1 === correctAnswer;
        setIsCorrect(correct);

        const money = (sliderValue / 100) * maxBonus * (correct ? 1 : -1);
        setEarnedAmount(money);

        // Save to DB under "mathAberrQuiz"
        const updateObj = {
            mathAberrQuiz: {
                q1,
                q2: sliderValue,
                earnedAmount: money,
                timeUsed: totalTimeUsed,
                missed,
                trialIndexParam: parseInt(trialIndexParam),
            },
        };
        await updateAttendant(loginAttendantS.id, updateObj);

        // Update Redux
        dispatch(login(Object.assign({}, loginAttendantS, updateObj)));
        dispatch(setMathAberrQuiz(updateObj));
        // Hide page
        dispatch(hideShowMathAberrQuizPage());
        setSubmitted(true);
    };

    // Navigation back to trial
    const handleBackToTrial = () => {
        dispatch(hideShowMathAberrQuizPage());
        navigate(`/xp/${alias}/trial`);
    };

    // Options from the PDF
    const q1Options = [
        "The trend will definitely switch back to -1 on the next day.", // correct
        "The trend will most likely remain the same (+1) since the indicator is at baseline",
        "The trend will switch to -1 with 15% chance."
    ];

    return (
        <Container sx={{ position: "relative", my: 4 }}>
            {/* Timer display if not submitted */}
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="h5">
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            {/* Title and Intro */}
            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                BRIEF MATHS QUIZ
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                <b>⭐ Get it right and earn up to a $20 bonus! ⭐</b>
            </Typography>
            <Typography variant="h5" gutterBottom>
                <i>
                    Your confidence level determines both potential gain AND loss: high confidence
                    means bigger rewards if correct, but larger penalties if wrong.
                </i>
            </Typography>
            <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                <b>Quick Scenario</b>: The indicator is at baseline (0) and the current trend
                switches from -1 to +1.
            </Typography>

            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 1: Select your answer</b>
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
                What will happen next?
            </Typography>

            {/* RadioGroup for Q1 */}
            <RadioGroup
                value={q1}
                onChange={(e) => setQ1(Number(e.target.value))}
                sx={{ mb: 3, mt: 1 }}
            >
                {q1Options.map((option, idx) => {
                    const isOptionCorrect = idx + 1 === correctAnswer;
                    const isUserSelection = q1 === idx + 1 && q1 !== correctAnswer;

                    return (
                        <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                            <FormControlLabel
                                control={
                                    <Radio
                                        disabled={disableForm || submitted}
                                        value={idx + 1}
                                        checked={q1 === idx + 1}
                                    />
                                }
                                label={
                                    submitted && correctAnswer === idx + 1 ? (
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.125rem' }}>
                                            {option}
                                        </Typography>
                                    ) : (
                                        option
                                    )
                                }
                            />
                            {submitted && isOptionCorrect && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        ml: 2,
                                        py: 0,
                                        whiteSpace: "normal",
                                        maxWidth: "700px",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                    }}
                                >
                                    Correct Answer
                                </Alert>
                            )}
                            {submitted && isUserSelection && (
                                <Box sx={{ ml: 2 }}>
                                    <ErrorOutlineIcon color="error" />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </RadioGroup>

            {/* Confidence Slider */}
            <Typography variant="h5" sx={{ mb: 1 }}>
                <b>Step 2: How confident are you in your answer?</b>
            </Typography>
            <Grid container sx={{ mb: 2 }}>
                <Grid item xs={6} sx={{ mx: "auto" }}>
                    <Slider
                        value={sliderValue}
                        onChange={(e, val) => {
                            if (!submitted && !disableForm) {
                                setSliderValue(val);
                            }
                        }}
                        step={5}
                        min={5}
                        max={100}
                        marks={marks}
                        valueLabelDisplay="auto"
                        disabled={disableForm || submitted}
                    />
                    <Typography variant="h5" align="center">
                        Confidence: {sliderValue}%
                        <br />
                        Potential bonus/penalty: $
                        {((sliderValue / 100) * maxBonus).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>

            {/* Single button that confirms confidence (previously "Submit") */}
            {!submitted && (
                <Grid textAlign="center">
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={disableForm || q1 === 0}
                        sx={{fontSize: '1.25rem'}}
                    >
                        Confirm Confidence
                    </Button>
                </Grid>
            )}

            {/* If submitted, show outcome in an Alert */}
            {submitted && (
                <Alert variant="outlined" icon={false} severity="info" sx={{ mt: 4 }}>
                    {isCorrect ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                <b>Correct reply</b> 👍. Thanks for your input, it will help us better
                                understand the experimental results. An extra $
                                {Math.abs(earnedAmount).toFixed(2)} will be added to your net balance
                                ⭐.
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <b>Let's continue the game now.</b>
                            </Typography>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" gutterBottom>
                                <b>Thanks for your input!</b> Your reply will help us better
                                understand the experimental results.
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <b>Quick Reminder:</b>
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold', fontSize: '1.5rem' }}>
                                A switch that occurs when the indicator is at baseline (0) must be an
                                <b> aberration</b>: the trend will switch back to -1 for sure on the next
                                day (no uncertainty).
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <b>Let's continue the game now.</b>
                            </Typography>
                        </>
                    )}

                    {/* Post-submit "Continue" button, auto-redirect countdown */}
                    <Grid container justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                        <Grid item>
                            <Button variant="contained" onClick={handleBackToTrial}>
                                Continue the game
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" textAlign="right" sx={{ mt: 2 }}>
                        You will be redirected in <strong>{autoTimeLeft}</strong> seconds...
                    </Typography>
                </Alert>
            )}
        </Container>
    );
};

export default MathsAberrQuizPage;
