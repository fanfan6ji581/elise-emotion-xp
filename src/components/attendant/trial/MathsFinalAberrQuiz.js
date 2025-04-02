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
import { xpConfigS, hideShowAberFinalQuizPage } from "../../../slices/gameSlice";
import { loginAttendant, login } from "../../../slices/attendantSlice";
import { updateAttendant, getAttendant } from "../../../database/attendant";
import { useParams, useNavigate } from "react-router-dom";

/**
 * 格式化秒数成 mm:ss
 */
function formatTimeLeft(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
}

/**
 * 这是一个终极测试页面（FinalAberQuizPage），
 * 参考 PDF: "FINAL_ABER_QUIZ.docx"
 */
const FinalAberQuizPage = () => {
    // 根据 PDF：第1个选项是正确答案
    // "The trend will definitely switch back to +1 on the next day."
    const correctAnswer = 1;
    const maxBonus = 20;

    // 从 Redux 中获取配置
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const dispatch = useDispatch();

    // 从路由拿到参数，以便跳转
    const { alias } = useParams();
    const navigate = useNavigate();

    // 计时器：默认 120 秒
    const totalTime = xpConfig.secondsBriefMathsQuiz || 120;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    // 提交后自动跳转倒计时（PDF 示例 10 秒）
    const [autoTimeLeft, setAutoTimeLeft] = useState(10);

    // 表单状态
    const [q1, setQ1] = useState(0);
    const [sliderValue, setSliderValue] = useState(50);
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [earnedAmount, setEarnedAmount] = useState(0);
    const [disableForm, setDisableForm] = useState(true);

    // 计算答题时间
    const startTimeRef = useRef(Date.now());

    // 让 Slider 从5%开始，步长5，一直到100%
    const marks = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // 读数据库，判断此人是否已做过这个测验
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.aberFinalQuiz) {
                // 如果已经做过，读取它
                const { q1, q2, earnedAmount } = refreshedAttendant.aberFinalQuiz;
                setQ1(q1);
                setSliderValue(q2);
                setSubmitted(true);
                setIsCorrect(q1 === correctAnswer);
                setEarnedAmount(earnedAmount || 0);

                // 隐藏该页面
                dispatch(hideShowAberFinalQuizPage());
            } else {
                // 未做过
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id, dispatch]);

    // 主倒计时，每秒递减
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // 超时自动提交
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 提交后，自动倒计时跳转
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

    /**
     * 提交答案
     * @param {boolean} missed 是否因时间耗尽自动提交
     */
    const handleSubmit = async (missed = false) => {
        if (submitted || q1 === 0) return; // 已提交或未选答案则无效

        const endTime = Date.now();
        const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

        // 判断是否正确
        const correct = q1 === correctAnswer;
        setIsCorrect(correct);

        // 计算加减金额
        const money = (sliderValue / 100) * maxBonus * (correct ? 1 : -1);
        setEarnedAmount(money);

        // 更新数据库
        const updateObj = {
            aberFinalQuiz: {
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
        dispatch(hideShowAberFinalQuizPage());

        setSubmitted(true);
    };

    /**
     * 提交后跳转
     */
    const handleBackToTrial = () => {
        dispatch(hideShowAberFinalQuizPage());
        navigate(`/xp/${alias}/earning-questions`);
    };

    // PDF 中的3个选项
    const q1Options = [
        "The trend will definitely switch back to +1 on the next day.", // correct
        "The trend will most likely remain the same (-1) since the indicator is at baseline",
        "The trend will switch to +1 with 15% chance."
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

            {/* 标题和开场文案（参考 PDF） */}
            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                FINAL CHALLENGE
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                💰 YOUR FINAL OPPORTUNITY TO BOOST YOUR EARNINGS 💰
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                ⭐ Get it right and earn up to a $20 bonus! ⭐
            </Typography>
            <Typography variant="h5" gutterBottom>
                <i>
                    Your confidence level determines both potential gain AND loss:
                    high confidence means bigger rewards if correct,
                    but larger penalties if wrong.
                </i>
            </Typography>

            {/* Quick Scenario */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                <b>Quick Scenario:</b> The indicator is at baseline (0) and the current trend
                switches from +1 to -1. What will happen next?
            </Typography>

            {/* Step 1: 选择答案 */}
            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 1: Select your answer</b>
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
                                    submitted && isOptionCorrect ? (
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.125rem' }}>
                                            {option}
                                        </Typography>
                                    ) : (
                                        option
                                    )
                                }
                            />
                            {/* 如果是正确答案且已提交，显示“Correct Answer”标识 */}
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
                            {/* 如果用户选错了选项 */}
                            {submitted && isUserSelection && (
                                <Box sx={{ ml: 2 }}>
                                    <ErrorOutlineIcon color="error" />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </RadioGroup>

            {/* Step 2: 选择信心度 */}
            <Typography variant="h5" sx={{ my: 2 }}>
                <b>Step 2: How confident are you in your answer?</b>
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Your bonus/penalty will match your confidence:
                <br />
                - Correct answer: Win up to $20 based on your confidence
                <br />
                - Incorrect answer: Lose up to $20 based on your confidence
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

            {/* 提交后显示结果 */}
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
                                            {" "}will be added to your final score. 
                                            Thanks for participating, we truly appreciate your input! ⭐
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

                                {/* 10 秒倒计时后自动跳转 */}
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

export default FinalAberQuizPage;
