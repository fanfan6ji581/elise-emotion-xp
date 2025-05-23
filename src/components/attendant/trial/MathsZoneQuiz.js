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
import { xpConfigS, hideShowMathZoneQuizPage, setMathZoneQuiz } from "../../../slices/gameSlice";
import { loginAttendant } from "../../../slices/attendantSlice";
import { updateAttendant, getAttendant } from "../../../database/attendant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../slices/attendantSlice";

function formatTimeLeft(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
}

const MathsQuizPage = () => {
    const dispatch = useDispatch();
    const correctAnswer = 2;
    const maxBonus = 20;
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);

    const { alias, trialIndexParam } = useParams();
    const navigate = useNavigate();

    const totalTime = xpConfig.secondsBriefMathsQuiz || 120;

    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    const [timeLeft, setTimeLeft] = useState(totalTime);
    const startTimeRef = useRef(Date.now());

    const [autoTimeLeft, setAutoTimeLeft] = useState(120);

    const marks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.mathZoneQuiz) {
                const { q1, q2, earnedAmount } = refreshedAttendant.mathZoneQuiz;
                setQ1(q1);
                setSliderValue(q2);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);
                dispatch(hideShowMathZoneQuizPage());
            } else {
                setDisableForm(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginAttendantS.id, dispatch]);

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

    useEffect(() => {
        let autoTimer = null;
        if (submitted) {
            setAutoTimeLeft(120);
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

    const handleSubmit = async (missed = false) => {
        if (submitted || q1 === 0) return;

        const endTime = Date.now();
        const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

        const lockedConfidence = sliderValue;
        const correct = q1 === correctAnswer;
        setIsCorrect(correct);

        const money = (lockedConfidence / 100) * maxBonus * (correct ? 1 : -1);
        setEarnedAmount(money);

        const updateObj = {
            mathZoneQuiz: {
                q1,
                q2: lockedConfidence,
                earnedAmount: money,
                timeUsed: totalTimeUsed,
                missed,
                trialIndexParam: parseInt(trialIndexParam)
            }
        };

        await updateAttendant(loginAttendantS.id, updateObj);
        dispatch(login(Object.assign({}, loginAttendantS, updateObj)));
        dispatch(setMathZoneQuiz(updateObj));
        dispatch(hideShowMathZoneQuizPage());
        setSubmitted(true);
    };

    const handleBackToTrial = () => {
        dispatch(hideShowMathZoneQuizPage());
        navigate(`/xp/${alias}/trial`);
    };

    const q1Options = [
        "Choosing -10 (following the current trend)",
        "Choosing +10 (going against the current trend)",
        "It depends on where we are in the zone",
        "Choosing Pass",
        "All choices offer similar results on average"
    ];

    return (
        <Container sx={{ position: "relative", my: 4 }}>
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", color: "red" }}>
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                BRIEF MATHS QUIZ
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                <b>⭐ Get it right and earn up to a $20 bonus! ⭐</b>
            </Typography>
            <Typography variant="h5" gutterBottom>
                <i>
                    Your confidence level determines both potential gain AND loss: high
                    confidence means bigger rewards if correct, but larger penalties if
                    wrong.
                </i>
            </Typography>
            <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
                <b>Quick Scenario</b>: The indicator is currently at 1 and the current trend is -1.
            </Typography>

            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 1: Select your answer</b>
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
                From a pure maths perspective, which option results in higher average outcomes if repeated many times in this scenario?
            </Typography>

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

            <Typography variant="h5" sx={{ mb: 1 }}>
                <b>Step 2: How confident are you in your answer?</b>
            </Typography>
            <Grid container sx={{ mb: 2 }}>
                <Grid item xs={6} sx={{ mx: "auto" }}>
                    <Slider
                        value={sliderValue}
                        onChange={(e, val) => {
                            if (!disableForm && !submitted) {
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

            {!submitted && (
                <Grid textAlign="center">
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={disableForm || q1 === 0}
                        sx={{ fontSize: '1.25rem' }}
                    >
                        Confirm and Reveal Outcome
                    </Button>
                </Grid>
            )}

            {submitted && (
                <Alert variant="outlined" icon={false} severity="info" sx={{ mt: 4 }}>
                    {isCorrect ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                <b>Correct reply</b> 👍. Thanks for your input, it will help us
                                better understand the experimental results. An extra $
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
                                <b>Thanks for your input!</b> Your reply will help us better understand the experimental results.
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <b>Quick Math Reminder:</b>
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                From a pure maths perspective, when in the dangerous zone (indicator = 1):
                                <br />- Choosing with the current trend: 0.85 × $10 win - 0.15 × $100 loss &lt; 0
                                <br />- Choosing against the current trend: 0.15 × $100 win - 0.85 × $10 loss &gt; 0
                            </Typography>
                            <Typography variant="h5" sx={{ mb: 2, color: 'success.main', fontWeight: 'bold', fontSize: '1.25rem' }} gutterBottom>
                                These expected values remain constant for every single trial when the indicator equals 1. Whether it's your first trial in the dangerous zone or any subsequent trial, the math doesn't change: going against the current trend offers a positive expected value while following the trend always has a negative expected value.
                            </Typography>
                            <Typography variant="h5" gutterBottom>
                                <b>Let's continue the game now.</b>
                            </Typography>
                        </>
                    )}
                    <Grid container justifyContent="center" alignItems="center" sx={{ my: 2 }}>
                        <Button variant="contained" onClick={handleBackToTrial}>
                            Continue the game
                        </Button>
                    </Grid>
                    <Typography variant="body1" textAlign="right" sx={{ mt: 2 }}>
                        You will be redirected in <strong>{autoTimeLeft}</strong> seconds...
                    </Typography>
                </Alert>
            )}
        </Container>
    );
};

export default MathsQuizPage;
