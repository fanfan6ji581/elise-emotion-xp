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
import { xpConfigS, hideShowMathFinalQuizPage } from "../../../slices/gameSlice";
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

const MathsFinalQuizPage = () => {
    // According to the PDF, the second option is correct: "Choosing -10 ..."
    const correctAnswer = 2;
    const maxBonus = 20;

    // Redux/Config
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const dispatch = useDispatch();

    // Router
    const { alias } = useParams();
    const navigate = useNavigate();

    // Timer states
    const totalTime = xpConfig.secondsBriefMathsQuiz || 120; // 2 minutes
    const [timeLeft, setTimeLeft] = useState(totalTime);
    const [autoTimeLeft, setAutoTimeLeft] = useState(30); // Post-submission countdown

    // Form states
    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [finalConfidence, setFinalConfidence] = useState(50);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    // To measure time used
    const startTimeRef = useRef(Date.now());

    // Slider marks
    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // Fetch attendant data on mount
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.mathFinalQuiz) {
                // If user already completed this final quiz
                const { q1, q2, earnedAmount } = refreshedAttendant.mathFinalQuiz;
                setQ1(q1);
                setFinalConfidence(q2);
                setIsConfirmed(true);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);

                // Hide the page if already completed
                dispatch(hideShowMathFinalQuizPage());
            } else {
                // Enable form if quiz not done
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id, dispatch, correctAnswer]);

    // Main countdown for auto-submit
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

    // Post-submit countdown for auto-redirect
    useEffect(() => {
        let autoTimer = null;
        if (submitted) {
            setAutoTimeLeft(10);
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

    // Confirm confidence
    const handleConfirmConfidence = () => {
        setFinalConfidence(sliderValue);
        setIsConfirmed(true);
    };

    // Submit
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

        // Save to DB under "mathFinalQuiz"
        const updateObj = {
            mathFinalQuiz: {
                q1,
                q2: lockedConfidence,
                earnedAmount: money,
                timeUsed: totalTimeUsed,
                missed
            }
        };
        await updateAttendant(loginAttendantS.id, updateObj);

        // Update Redux attendant
        dispatch(login(Object.assign({}, loginAttendantS, updateObj)));

        // Hide the quiz page
        dispatch(hideShowMathFinalQuizPage());

        setSubmitted(true);
    };

    // After quiz
    const handleBackToTrial = () => {
        // Hide the quiz page, then proceed
        dispatch(hideShowMathFinalQuizPage());
        navigate(`/xp/${alias}/earning-questions`);
    };

    // The question options
    const q1Options = [
        "Choosing +10 (following the current trend)",
        "Choosing -10 (going against the current trend)", // correct
        "Choosing Pass",
        "All three choices have the same expected value"
    ];

    return (
        <Container sx={{ position: "relative", mt: 4 }}>
            {/* Timer if not submitted */}
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="body1">
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            {/* Title & Intro */}
            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                FINAL MATHS QUIZ
            </Typography>
            <Typography variant="h6" textAlign="center" sx={{ my: 2 }}>
                <b>
                    ⭐ Get it right and earn a bonus up to $20 plus a chance at a special secret prize!
                    ⭐
                </b>
            </Typography>
            <Typography variant="body1" gutterBottom>
                <i>
                    Your confidence level determines both potential gain AND loss: high confidence
                    means bigger rewards if correct, but larger penalties if wrong.
                </i>
            </Typography>
            <Typography variant="body1" sx={{ mt: 5, mb: 2 }}>
                <b>Quick Scenario</b>: The indicator = 1 and the current trend is +1.
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                <b>Step 1: Select your answer</b>
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                From a pure maths perspective, which option offers the highest expected value
                (the average outcome when considering all possible results and their probabilities)?
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
                                label={option}
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
                                        alignItems: "flex-start"
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

            <Typography variant="body1" sx={{ my: 2 }}>
                <b>Step 2: How confident are you in your answer?</b>
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
                            Please click "Confirm Confidence" to lock in your confidence level. Once
                            confirmed, you cannot change it.
                        </Typography>
                    )}
                </Grid>
            </Grid>

            {/* If not submitted, show the form buttons */}
            {!submitted && (
                <>
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

            {/* If submitted, show final outcome */}
            {submitted && (
                <Grid container>
                    <Grid item xs={12}>
                        <Alert
                            variant="outlined"
                            icon={false}
                            severity="info"
                            sx={{ mt: 4, display: 'block' }}
                        >
                            <Grid container>
                                <Grid item xs={12}>
                                    {isCorrect ? (
                                        <Typography variant="h6" gutterBottom>
                                            <b>Correct!</b> 👍 An extra ${Math.abs(earnedAmount).toFixed(2)} will be added
                                            to your final score, and you're now entered into our drawing for
                                            the special secret prize! We'll notify the winner at the end of
                                            the experiment. ⭐
                                        </Typography>
                                    ) : (
                                        <Typography variant="h6" textAlign="center" gutterBottom>
                                            <b>Thanks for participating, we truly appreciate your input!</b>
                                        </Typography>
                                    )}
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sx={{ mt: 3 }}
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Button variant="contained" onClick={handleBackToTrial}>
                                        Next
                                    </Button>
                                </Grid>

                                <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        You will be redirected in <strong>{autoTimeLeft}</strong> seconds...
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Alert>
                    </Grid>
                </Grid>
            )}

        </Container>
    );
};

export default MathsFinalQuizPage;
