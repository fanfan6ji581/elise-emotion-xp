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
    Alert,
    Divider
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useSelector, useDispatch } from "react-redux";
import { xpConfigS, hideShowDoubleFinalQuizPage, setDoubleFinalQuiz } from "../../../slices/gameSlice";
import { loginAttendant, login } from "../../../slices/attendantSlice";
import { updateAttendant, getAttendant } from "../../../database/attendant";
import { useParams, useNavigate } from "react-router-dom";

/**
 * 把秒数格式化为 mm:ss
 */
function formatTimeLeft(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
}

/**
 * 最终的“双重测验”页面
 */
const FinalDoubleQuizPage = () => {
    // QUIZ #1正确答案 = 第2项 “Choosing -10 (going against...)”
    // QUIZ #2正确答案 = 第1项 “The trend will definitely switch back...”
    const correctAnswerQ1 = 2;
    const correctAnswerQ2 = 1;

    // 每个Quiz最高金额
    const maxBonusPerQuiz = 15;

    // 从 Redux 中获取配置
    const xpConfig = useSelector(xpConfigS);
    const loginAttendantS = useSelector(loginAttendant);
    const dispatch = useDispatch();

    // 用于路由跳转
    const { alias } = useParams();
    const navigate = useNavigate();

    // 计时器：默认 240 秒，如果 xpConfig 没定义就用 120*2
    const totalTime = (xpConfig.secondsBriefMathsQuiz * 2) || 240;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    // 提交后自动跳转倒计时(示例为30s)
    const [autoTimeLeft, setAutoTimeLeft] = useState(120);

    // 两道题的选择
    const [q1, setQ1] = useState(0);
    const [q2, setQ2] = useState(0);

    // 两道题的信心度(滑条)
    const [slider1, setSlider1] = useState(50);
    const [slider2, setSlider2] = useState(50);

    // 是否已提交
    const [submitted, setSubmitted] = useState(false);
    // 是否禁止编辑表单（比如已经做过或正在加载）
    const [disableForm, setDisableForm] = useState(true);

    // 最终计算
    const [finalPayoff, setFinalPayoff] = useState(0);
    const [bothCorrect, setBothCorrect] = useState(false);

    // 用于计算答题耗时
    const startTimeRef = useRef(Date.now());

    // Slider 的刻度：从5%到100%
    const marks = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => ({
        value: val,
        label: `${val}%`
    }));

    // 获取该用户的最新信息，若已做过本测验就直接跳过
    useEffect(() => {
        const fetchData = async () => {
            const refreshedAttendant = await getAttendant(loginAttendantS.id);
            if (refreshedAttendant?.doubleFinalQuiz) {
                // 已做过，则回填并隐藏
                const { q1, q2, slider1, slider2, finalPayoff } = refreshedAttendant.doubleFinalQuiz;
                setQ1(q1);
                setQ2(q2);
                setSlider1(slider1);
                setSlider2(slider2);
                setFinalPayoff(finalPayoff || 0);
                setSubmitted(true);

                // 判断是否都对
                const correct1 = (q1 === correctAnswerQ1);
                const correct2 = (q2 === correctAnswerQ2);
                setBothCorrect(correct1 && correct2);

                // 隐藏页面
                dispatch(hideShowDoubleFinalQuizPage());
            } else {
                // 未做过，启用表单
                setDisableForm(false);
            }
        };
        fetchData();
    }, [loginAttendantS.id, dispatch]);

    // 倒计时，每秒-1，若到0自动提交
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

    // 提交后自动跳转计时
    useEffect(() => {
        let autoTimer = null;
        if (submitted) {
            setAutoTimeLeft(120);
            autoTimer = setInterval(() => {
                setAutoTimeLeft((prev) => {
                    const nextVal = prev - 1;
                    if (nextVal <= 0) {
                        clearInterval(autoTimer);
                        handleGotoNext();
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
     * 提交整个“双重测验”
     */
    const handleSubmit = async (missed = false) => {
        // 已提交 or 两道题未都选择 => 不提交
        if (submitted || q1 === 0 || q2 === 0) return;

        const endTime = Date.now();
        const totalTimeUsed = (endTime - startTimeRef.current) / 1000;

        // 判断每道题是否正确
        const correct1 = (q1 === correctAnswerQ1);
        const correct2 = (q2 === correctAnswerQ2);
        const both = correct1 && correct2;
        setBothCorrect(both);

        // 分别计算每道题的金额（若正确则是正的，若错则只用于计算绝对值）
        const payoffQ1 = (slider1 / 100) * maxBonusPerQuiz;
        const payoffQ2 = (slider2 / 100) * maxBonusPerQuiz;

        // - 两题都正确 => 最终正收益 = payoffQ1 + payoffQ2
        // - 任意题错误 => 最终负收益 = - (payoffQ1 + payoffQ2)
        let finalMoney = 0;
        if (both) {
            finalMoney = payoffQ1 + payoffQ2;
        } else {
            finalMoney = - (payoffQ1 + payoffQ2);
        }
        setFinalPayoff(finalMoney);

        // 更新数据库
        const updateObj = {
            doubleFinalQuiz: {
                q1,
                q2,
                slider1,
                slider2,
                earnedAmount: finalMoney,
                timeUsed: totalTimeUsed,
                missed
            }
        };
        await updateAttendant(loginAttendantS.id, updateObj);

        // 更新 Redux store 并隐藏页面
        dispatch(login(Object.assign({}, loginAttendantS, updateObj)));
        dispatch(setDoubleFinalQuiz(updateObj));
        dispatch(hideShowDoubleFinalQuizPage());

        setSubmitted(true);
    };

    /**
     * 提交后跳转到下一页
     */
    const handleGotoNext = () => {
        dispatch(hideShowDoubleFinalQuizPage());
        navigate(`/xp/${alias}/earning-questions`);
    };

    // Quiz #1 选项
    const quiz1Options = [
        "Choosing +10 (following the current trend)",
        "Choosing -10 (going against the current trend)", // correct
        "Choosing Pass",
        "All three choices have the same expected value"
    ];

    // Quiz #2 选项
    const quiz2Options = [
        "The trend will definitely switch back to +1 on the next day.", // correct
        "The trend will most likely remain the same (-1)",
        "The trend will switch to +1 with 15% chance."
    ];

    return (
        <Container sx={{ position: "relative", my: 4 }}>
            {/* 若未提交，显示倒计时 */}
            {!submitted && (
                <Box sx={{ position: "absolute", top: 16, right: 16 }}>
                    <Typography variant="h5">
                        Time Left: {formatTimeLeft(timeLeft)}
                    </Typography>
                </Box>
            )}

            {/* 标题 & 说明 */}
            <Typography variant="h4" textAlign="center" sx={{ my: 2 }}>
                🔥 FINAL CHALLENGE: DOUBLE OR NOTHING! 🔥
            </Typography>
            <Typography variant="h5" textAlign="center" sx={{ my: 2 }}>
                💰 YOUR FINAL OPPORTUNITY TO MAXIMIZE EARNINGS 💰
            </Typography>
            <Typography variant="h6" sx={{ my: 2 }}>
                Congratulations on completing the main experiment! Now to the final bit: 
                your chance to significantly boost your earnings with our Double Quiz Challenge.
            </Typography>
            <Typography variant="body1" sx={{ my: 1 }}>
                <b>HOW "DOUBLE OR NOTHING" WORKS (per your custom logic):</b><br/>
                - You'll face TWO consecutive math quizzes as a single challenge.<br/>
                - If both answers are correct: you earn a positive bonus.<br/>
                - If either is incorrect: you get a negative bonus.<br/>
                - Each quiz can earn or lose up to $15, so total can be up to $30.
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
                <b>STRATEGY WARNING:</b> Even if you nail the first quiz, 
                getting the second quiz wrong means your total will be negative. 
                So choose carefully!
            </Typography>

            {/* Quiz #1 */}
            <Typography variant="h5" sx={{ mb: 1 }}>
                🎯 QUIZ #1 BEGINS NOW!
            </Typography>

            {/* Step 1 标识 */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                Step 1: Select your answer
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
                Quick Scenario: The indicator = 1 and the current trend is +1.
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
                From a pure maths perspective, which option offers the highest expected value?
            </Typography>

            {/* 选择题 #1 */}
            <RadioGroup
                sx={{ mt: 2 }}
                value={q1}
                onChange={(e) => setQ1(Number(e.target.value))}
            >
                {quiz1Options.map((option, idx) => {
                    const isCorrect = (idx + 1 === correctAnswerQ1);
                    const isUserWrong = (q1 === idx + 1) && (q1 !== correctAnswerQ1);
                    return (
                        <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                            <FormControlLabel
                                control={
                                    <Radio
                                        disabled={disableForm || submitted}
                                        value={idx + 1}
                                    />
                                }
                                label={
                                    submitted && isCorrect ? (
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                            {option}
                                        </Typography>
                                    ) : (
                                        option
                                    )
                                }
                            />
                            {/* 提交后若正确 */}
                            {submitted && isCorrect && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        ml: 2,
                                        py: 0,
                                        whiteSpace: "normal",
                                        maxWidth: "600px",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Correct Answer
                                </Alert>
                            )}
                            {/* 提交后若用户选错 */}
                            {submitted && isUserWrong && (
                                <Box sx={{ ml: 2 }}>
                                    <ErrorOutlineIcon color="error" />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </RadioGroup>

            {/* Step 2 标识 */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
                Step 2: How confident are you in your answer?
            </Typography>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Slider
                        value={slider1}
                        onChange={(e, val) => {
                            if (!submitted && !disableForm) {
                                setSlider1(val);
                            }
                        }}
                        step={5}
                        min={5}
                        max={100}
                        marks={marks}
                        valueLabelDisplay="auto"
                        disabled={disableForm || submitted}
                    />
                </Grid>
            </Grid>
            <Typography variant="body1" align="center">
                Confidence: {slider1}%
                <br/>
                Potential bonus/penalty: $
                {((slider1 / 100) * maxBonusPerQuiz).toFixed(2)}
            </Typography>

            {/* 分割线 */}
            <Divider sx={{ my: 4 }} />

            {/* Quiz #2 */}
            <Typography variant="h5" sx={{ mb: 1 }}>
                🎯 QUIZ #2 BEGINS NOW!
            </Typography>

            {/* Step 1 标识 */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2 }}>
                Step 1: Select your answer
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
                Quick Scenario: The indicator is at baseline (0) and the current trend 
                switches from +1 to -1. What will happen next?
            </Typography>

            {/* 选择题 #2 */}
            <RadioGroup
                sx={{ mt: 2 }}
                value={q2}
                onChange={(e) => setQ2(Number(e.target.value))}
            >
                {quiz2Options.map((option, idx) => {
                    const isCorrect = (idx + 1 === correctAnswerQ2);
                    const isUserWrong = (q2 === idx + 1) && (q2 !== correctAnswerQ2);
                    return (
                        <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                            <FormControlLabel
                                control={
                                    <Radio
                                        disabled={disableForm || submitted}
                                        value={idx + 1}
                                    />
                                }
                                label={
                                    submitted && isCorrect ? (
                                        <Typography sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                            {option}
                                        </Typography>
                                    ) : (
                                        option
                                    )
                                }
                            />
                            {/* 提交后若正确 */}
                            {submitted && isCorrect && (
                                <Alert
                                    severity="success"
                                    sx={{
                                        ml: 2,
                                        py: 0,
                                        whiteSpace: "normal",
                                        maxWidth: "600px",
                                        display: "flex",
                                        alignItems: "flex-start",
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    Correct Answer
                                </Alert>
                            )}
                            {/* 提交后若用户选错 */}
                            {submitted && isUserWrong && (
                                <Box sx={{ ml: 2 }}>
                                    <ErrorOutlineIcon color="error" />
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </RadioGroup>

            {/* Step 2 标识 */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3 }}>
                Step 2: How confident are you in your answer?
            </Typography>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Slider
                        value={slider2}
                        onChange={(e, val) => {
                            if (!submitted && !disableForm) {
                                setSlider2(val);
                            }
                        }}
                        step={5}
                        min={5}
                        max={100}
                        marks={marks}
                        valueLabelDisplay="auto"
                        disabled={disableForm || submitted}
                    />
                </Grid>
            </Grid>
            <Typography variant="body1" align="center">
                Confidence: {slider2}%
                <br/>
                Potential bonus/penalty: $
                {((slider2 / 100) * maxBonusPerQuiz).toFixed(2)}
            </Typography>

            {/* 提交按钮 */}
            {!submitted && (
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => handleSubmit(false)}
                        disabled={
                            disableForm ||
                            q1 === 0 || q2 === 0
                        }
                        sx={{ fontSize: "1.25rem" }}
                    >
                        Confirm Both Answers
                    </Button>
                </Grid>
            )}

            {/* 提交后，显示最终结果 */}
            {submitted && (
                <Grid container sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Alert
                            variant="outlined"
                            icon={false}
                            severity="info"
                            sx={{ display: "block" }}
                        >
                            <Grid container>
                                <Grid item xs={12}>
                                    {bothCorrect ? (
                                        <Typography variant="h5" gutterBottom>
                                            <b>Congrats!</b> 👍 An extra $
                                            {Math.abs(finalPayoff).toFixed(2)} 
                                            {" "}will be added to your final score.
                                            <br/>
                                            Thanks for participating, we truly appreciate your input! ⭐
                                        </Typography>
                                    ) : (
                                        <Typography variant="h5" gutterBottom>
                                            <b>Thanks for participating in the experiment ☺</b>
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
                                    <Button variant="contained" onClick={handleGotoNext}>
                                        Next
                                    </Button>
                                </Grid>

                                {/* 自动跳转倒计时 */}
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

export default FinalDoubleQuizPage;
