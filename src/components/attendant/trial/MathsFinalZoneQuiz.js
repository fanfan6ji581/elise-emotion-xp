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

function formatTimeLeft(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
}

const MathsFinalQuizPage = () => {
    // 根据 PDF：Choosing -10 (going against the current trend) 是正确答案（第2个）
    const correctAnswer = 2;
    const maxBonus = 20;

    // Redux/Config
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const dispatch = useDispatch();

    // Router
    const { alias } = useParams();
    const navigate = useNavigate();

    // 计时器：默认 120 秒
    const totalTime = xpConfig.secondsBriefMathsQuiz || 120;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    // 提交后，自动跳转倒计时（PDF 要求示例是 10 秒）
    const [autoTimeLeft, setAutoTimeLeft] = useState(10);

    // 表单状态
    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    // 用于计算耗时
    const startTimeRef = useRef(Date.now());

    // Slider 的刻度，从 5% 到 100%，步长 5
    const marks = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // 获取最新用户信息，判断是否已经做过测验
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.mathFinalQuiz) {
                // 如果已经做过，读取其答题信息
                const { q1, q2, earnedAmount } = refreshedAttendant.mathFinalQuiz;
                setQ1(q1);
                setSliderValue(q2);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);

                // 隐藏页面
                dispatch(hideShowMathFinalQuizPage());
            } else {
                // 未做过，启用表单
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id, dispatch]);

    // 主倒计时，每秒更新
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

    // 提交后自动跳转倒计时
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

    const handleSubmit = async (missed = false) => {
        // 若已提交 or 没选答案，直接返回
        if (submitted || q1 === 0) return;

        const endTime = Date.now();
        const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

        // 判断正误
        const correct = q1 === correctAnswer;
        setIsCorrect(correct);

        // 计算盈亏
        const money = (sliderValue / 100) * maxBonus * (correct ? 1 : -1);
        setEarnedAmount(money);

        // 更新数据库
        const updateObj = {
            mathFinalQuiz: {
                q1,
                q2: sliderValue,
                earnedAmount: money,
                timeUsed: totalTimeUsed,
                missed
            }
        };
        await updateAttendant(loginAttendantS.id, updateObj);

        // 更新 Redux 并隐藏页面
        dispatch(login(Object.assign({}, loginAttendantS, updateObj)));
        dispatch(hideShowMathFinalQuizPage());

        setSubmitted(true);
    };

    const handleBackToTrial = () => {
        dispatch(hideShowMathFinalQuizPage());
        navigate(`/xp/${alias}/earning-questions`);
    };

    // 题目选项（对齐 PDF，只保留四个）
    const q1Options = [
        "Choosing +10 (following the current trend)",
        "Choosing -10 (going against the current trend)", // correct
        "Choosing Pass",
        "All three choices have the same expected value"
    ];

    return (
        <Container sx={{ position: "relative", my: 4 }}>
            {/* 未提交时显示剩余时间 */}
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="h5">
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            {/* 标题和开场文案，对齐 PDF */}
            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                FINAL CHALLENGE
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                💰 YOUR FINAL OPPORTUNITY TO BOOST YOUR EARNINGS 💰
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                ⭐ Get it right and earn a bonus up to $20! ⭐
            </Typography>
            <Typography variant="h5" gutterBottom>
                <i>
                    Your confidence level determines both potential gain AND loss: high confidence
                    means bigger rewards if correct, but larger penalties if wrong.
                </i>
            </Typography>

            {/* Quick Scenario */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                <b>Quick Scenario</b>: The indicator = 1 and the current trend is +1.
            </Typography>

            {/* Step 1 */}
            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 1: Select your answer</b>
            </Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>
                From a pure maths perspective, which option offers the highest expected value
                (the average outcome when considering all possible results and their probabilities)?
            </Typography>

            {/* Radio 选项 */}
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
                                    submitted && isOptionCorrect ? (
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.125rem' }}>
                                            {option}
                                        </Typography>
                                    ) : (
                                        option
                                    )
                                }
                            />
                            {/* 正确答案标识 */}
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
                            {/* 如果用户选错，显示一个小红叉 */}
                            {submitted && isUserSelection && (
                                <Box sx={{ ml: 2 }}>
                                    <ErrorOutlineIcon color="error" />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </RadioGroup>

            {/* Step 2 */}
            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 2: How confident are you in your answer?</b>
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                <i>
                    Your bonus/penalty will match your confidence:<br />
                    - Correct answer: Win up to $20 based on your confidence<br />
                    - Incorrect answer: Lose up to $20 based on your confidence<br />
                </i>
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

            {/* 提交按钮 */}
            {!submitted && (
                <Grid textAlign="center">
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={disableForm || q1 === 0}
                        sx={{ fontSize: '1.25rem' }}
                    >
                        Confirm Confidence
                    </Button>
                </Grid>
            )}

            {/* 提交后展示结果 */}
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
                                        <Typography variant="h5" gutterBottom>
                                            <b>Correct!</b> 👍 An extra ${Math.abs(earnedAmount).toFixed(2)} 
                                            will be added to your final score. Thanks for participating, 
                                            we truly appreciate your input! ⭐
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" textAlign="center" gutterBottom>
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

                                {/* 10秒自动跳转提示 */}
                                <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
                                    <Typography variant="body1">
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
