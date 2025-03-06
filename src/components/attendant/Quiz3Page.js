import {
    Container, Box, Typography, Button, Alert, Grid,
    FormControlLabel, RadioGroup, Radio, Backdrop, CircularProgress, Link as MuiLink,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useParams } from "react-router-dom";
import { loginAttendant } from "../../slices/attendantSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import img15 from "../../assets/2025/15.png";

const QuizPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);

    const [mcq1, setMcq1] = useState(0);
    const [mcq2, setMcq2] = useState(0);
    const [mcq3, setMcq3] = useState(0);
    const [mcq4, setMcq4] = useState(0);
    const [mcq5, setMcq5] = useState(0);
    const [mcq6, setMcq6] = useState(0);
    const [mcq7, setMcq7] = useState(0);
    const [mcq8, setMcq8] = useState(0);
    const [mcq9, setMcq9] = useState(0);
    const [mcq10, setMcq10] = useState(0);
    const [mcq11, setMcq11] = useState(0);
    const [mcq12, setMcq12] = useState(0);
    const [mcq13, setMcq13] = useState(0);

    const [correction, setCorrection] = useState({});
    const [disableForm, setDisableForm] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(true);
    const [open, setOpen] = useState(false);

    const solution = {
        mcq1: 1,
        mcq2: 2,
        mcq3: 1,
        mcq4: 1,
        mcq5: 1,
        mcq6: 1,
        mcq7: 3,
        mcq8: 4,
        mcq9: 4,
        mcq10: 1,
        mcq11: 2,
        mcq12: 1,
        mcq13: 1,
    };

    const solutionText = {
        mcq1: '(Correct Answer) The expected value is 0.85 x 10 – 0.15 x 100 = -6 << 0.',
        mcq2: '(Correct Answer) You lose $1 AUD every time you do not reply within the allowed time.',
        mcq3: '(Correct Answer)',
        mcq4: '(Correct Answer) When the asset trend shifts while the indicator remains at its baseline value (0), the trend will always return to its previous direction on the next day',
        mcq5: `(Correct Answer) The shift probability is fixed at 0.15 and the dangerous zone continues until the shift is realized. Each day in the dangerous zone represents an independent 15% chance of a trend shift, regardless of how long you've already been in this zone.`,
        mcq6: '(Correct Answer) You win $10. This happens because your position (+10) matches the realized trend (+1). Since the trend remains unchanged from the previous day, you receive the standard payoff of $10.',
        mcq7: '(Correct Answer) You win $100. This happens because your position (-10) matches the realized trend (-1). Since the trend just switched direction, you win the magnified reward of $100.',
        mcq8: `(Correct Answer) You lose $100. This happens because there's a mismatch between your position (+10) and the realized trend (-1). Since the trend just switched direction, you suffer the magnified loss of $100.`,
        mcq9: `(Correct Answer) Unlucky, an aberration just occurred! You lose $100 since there's a mismatch between your position (+10) and the realized trend (-1) which just switched direction—hence the magnified loss of $100. `,
        mcq10: '(Correct Answer)',
        mcq11: '(Correct Answer) You can earn a significant reward in this experiment (up to $100 AUD) if you master the game, but if not, expect to receive only the minimum payment of $5 AUD from the game.',
        mcq12: '(Correct Answer) Every single trial counts toward your potential payment, so bring your A-game to each decision!',
        mcq13: `(Correct Answer) Absolutely correct! Our lab follows a strict 'no deception' policy. Every probability, rule, and mechanic described is 100% accurate and fixed throughout the game. This transparency is what makes developing optimal strategies possible and rewarding!`,
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const questions = [
        {
            id: "mcq1",
            text: "In the dangerous zone, from a pure maths perspective, what is the expected outcome if you follow the current asset trend (for example, selling (-10) on Day 33 as shown earlier, ",
            extra: (
                <Typography variant="span" sx={{}}>
                    click&nbsp;
                    <MuiLink onClick={handleClickOpen} sx={{ cursor: 'pointer' }}>
                        HERE
                    </MuiLink>
                    &nbsp;to go back to the previous example ?&#41;
                </Typography>
            ),
            options: ["It’s negative", "It’s positive", "I’m not quite sure"],
            state: mcq1,
            setState: setMcq1,
            solution: solution.mcq1,
            solutionText: solutionText.mcq1,
        },
        {
            id: "mcq2",
            text: "If you do not click anything within the allowed time, you proceed to the next trial without any penalty.",
            options: ["True", "False"],
            state: mcq2,
            setState: setMcq2,
            solution: solution.mcq2,
            solutionText: solutionText.mcq2,
        },
        {
            id: "mcq3",
            text: "When the indicator jumps to 1, you've entered a dangerous zone. In this zone, there's a 15% daily chance that the trend will shift, and this chance remains constant until a shift eventually happens.",
            options: ["True", "False"],
            state: mcq3,
            setState: setMcq3,
            solution: solution.mcq3,
            solutionText: solutionText.mcq3,
        },
        {
            id: "mcq4",
            text: "If the indicator value is currently 0 and the asset trend switches, this must be an aberration that will definitely reverse back on the next day. ",
            options: ["True", "False"],
            state: mcq4,
            setState: setMcq4,
            solution: solution.mcq4,
            solutionText: solutionText.mcq4,
        },
        {
            id: "mcq5",
            text: "If the current indicator is at 1 (meaning I am in the dangerous zone), the probability of a trend shift on the next day remains exactly 15%, regardless of how many days I've already spent in this dangerous zone.",
            options: ["True", "False"],
            state: mcq5,
            setState: setMcq5,
            solution: solution.mcq5,
            solutionText: solutionText.mcq5,
        },
        {
            id: "mcq6",
            text: `Scenario 1: I am in the dangerous zone and the current asset trend is +1. If I choose to buy 10 shares and the next day's asset trend remains +1, what will my payoff be?`,
            options: ["Win of $10", "Loss of $10", "Win of $100", "Loss of $100"],
            state: mcq6,
            setState: setMcq6,
            solution: solution.mcq6,
            solutionText: solutionText.mcq6,
        },
        {
            id: "mcq7",
            text: `Scenario 2: I am in the dangerous zone and the current asset trend is +1. If I choose to sell 10 shares and the asset trend switches to -1, what will my payoff be?`,
            options: ["Win of $10", "Loss of $10", "Win of $100", "Loss of $100"],
            state: mcq7,
            setState: setMcq7,
            solution: solution.mcq7,
            solutionText: solutionText.mcq7,
        },
        {
            id: "mcq8",
            text: `Scenario 3: I am in the dangerous zone and the current asset trend is +1. If I choose to buy 10 shares and the asset trend switches to -1, what will my payoff be?`,
            options: ["Win of $10", "Loss of $10", "Win of $100", "Loss of $100"],
            state: mcq8,
            setState: setMcq8,
            solution: solution.mcq8,
            solutionText: solutionText.mcq8,
        },
        {
            id: "mcq9",
            text: `Scenario 4: I am outside the dangerous zone and the current asset trend is +1. If I choose to buy 10 shares and the asset trend switches to -1, what will my payoff be?`,
            options: ["Win of $10", "Loss of $10", "Win of $100", "Loss of $100"],
            state: mcq9,
            setState: setMcq9,
            solution: solution.mcq9,
            solutionText: solutionText.mcq9,
        },
        {
            id: "mcq10",
            text: `When the indicator is at baseline (0), aberrations can happen, but they are rare events with only 5% chance.`,
            options: ["True", "False"],
            state: mcq10,
            setState: setMcq10,
            solution: solution.mcq10,
            solutionText: solutionText.mcq10,
        },
        {
            id: "mcq11",
            text: "No matter how well I performed, I will definitely leave the lab with no less than $25.",
            options: ["True", "False"],
            state: mcq11,
            setState: setMcq11,
            solution: solution.mcq11,
            solutionText: solutionText.mcq11,
        },
        {
            id: "mcq12",
            text: "I should focus on doing my best on every single trial as any trial may be selected for payment at the end of the experiment.",
            options: ["True", "False"],
            state: mcq12,
            setState: setMcq12,
            solution: solution.mcq12,
            solutionText: solutionText.mcq12,
        },
        {
            id: "mcq13",
            text: `All information provided about game probabilities, rules, and mechanics is completely truthful and remains unchanged throughout the experiment.`,
            options: ["True", "False"],
            state: mcq13,
            setState: setMcq13,
            solution: solution.mcq13,
            solutionText: solutionText.mcq13,
        },
    ];

    const fetchAttdendantAnswer = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        setLoadingOpen(false);
        if (!docSnap.exists()) {
            window.alert("Submit failed, Please refresh the page and try again");
            return;
        }
        const attendant = docSnap.data();
        if (attendant.quizAnswers) {
            setMcq1(attendant.quizAnswers.mcq1);
            setMcq2(attendant.quizAnswers.mcq2);
            setMcq3(attendant.quizAnswers.mcq3);
            setMcq4(attendant.quizAnswers.mcq4);
            setMcq5(attendant.quizAnswers.mcq5);
            setMcq6(attendant.quizAnswers.mcq6);
            setMcq7(attendant.quizAnswers.mcq7);
            setMcq8(attendant.quizAnswers.mcq8);
            setMcq9(attendant.quizAnswers.mcq9);
            setMcq10(attendant.quizAnswers.mcq10);
            setMcq11(attendant.quizAnswers.mcq11);
            setMcq12(attendant.quizAnswers.mcq12);
            setMcq13(attendant.quizAnswers.mcq13);
        }
        if (attendant.submitted) {
            validateForm(attendant.quizAnswers);
        }
    };

    const validateForm = (quizAnswers) => {
        const newCorrection = {};
        let diffCount = 0;
        for (let fieldName in solution) {
            if (solution[fieldName] !== quizAnswers[fieldName]) {
                diffCount++;
                newCorrection[fieldName] = solutionText[fieldName];
            }
        }
        setDisableForm(true);
        setCorrection(newCorrection);
        if (diffCount === 0) {
            navigate(`/xp/${alias}/start-game`);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        switch (true) {
            case mcq1 === 0:
                return window.alert("Please fill question #1");
            case mcq2 === 0:
                return window.alert("Please fill question #2");
            case mcq3 === 0:
                return window.alert("Please fill question #3");
            case mcq4 === 0:
                return window.alert("Please fill question #4");
            case mcq5 === 0:
                return window.alert("Please fill question #5");
            case mcq6 === 0:
                return window.alert("Please fill question #6");
            case mcq7 === 0:
                return window.alert("Please fill question #7");
            case mcq8 === 0:
                return window.alert("Please fill question #8");
            case mcq9 === 0:
                return window.alert("Please fill question #9");
            case mcq10 === 0:
                return window.alert("Please fill question #10");
            case mcq11 === 0:
                return window.alert("Please fill question #11");
            case mcq12 === 0:
                return window.alert("Please fill question #12");
            case mcq13 === 0:
                return window.alert("Please fill question #13");
            default:
                break;
        }
        const quizAnswers = {
            mcq1, mcq2, mcq3, mcq4, mcq5, mcq6,
            mcq7, mcq8, mcq9, mcq10, mcq11,
            mcq12, mcq13
        };
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { submitted: true, quizAnswers });
        validateForm(quizAnswers);
    };

    const saveFormWithoutSubmit = async () => {
        const quizAnswers = {
            mcq1, mcq2, mcq3, mcq4, mcq5, mcq6,
            mcq7, mcq8, mcq9, mcq10, mcq11,
            mcq12, mcq13
        };
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { submitted: false, quizAnswers });
    };

    const handleLinkClick = async (path) => {
        await saveFormWithoutSubmit();
        navigate(path);
    };

    const onKeyDown = (e) => {
        if ((e.ctrlKey && e.key === 'm') || e.key === ' ') {
            navigate(`/xp/${alias}/start-game`);
        }
    };

    useEffect(() => {
        fetchAttdendantAnswer();
        document.addEventListener("keydown", onKeyDown, false);
        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const handleBeforeUnload = async () => {
            await saveFormWithoutSubmit();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" sx={{ my: 5 }}>
                Pre-Game Quiz
            </Typography>

            <Alert variant="outlined" icon={false} severity="info" sx={{ my: 1 }}>
                <Typography variant="h5">
                    <b>
                        Please answer the following questions about the game rules.
                    </b>
                </Typography>
                <Typography variant="h5" sx={{ my: 1, color: 'red' }}>
                    <b>
                    IMPORTANT: Because these are basic questions, even one wrong answer could disqualify you from the experiment. So focus carefully, take your time, and if any wording seems unclear, ask before answering!
                    </b>
                </Typography>
            </Alert>

            <form onSubmit={onSubmit}>
                {questions.slice(0, 13).map((q, index) => (
                    <Box key={q.id}>
                        <Typography variant="h6" sx={{ mt: 3 }}>
                            {index + 1}. {q.text}
                            {q.extra && q.extra}
                        </Typography>
                        <RadioGroup sx={{ mx: 3 }}>
                            {q.options.map((option, idx) => (
                                <Box
                                    key={idx}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start', // 保证多行文本时顶部对齐
                                        mb: 1
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                disabled={disableForm}
                                                value={idx + 1}
                                                checked={q.state === idx + 1}
                                                onChange={() => q.setState(idx + 1)}
                                            />
                                        }
                                        label={option}
                                    />
                                    {disableForm && q.solution === idx + 1 && (
                                        <Alert
                                            severity="success"
                                            sx={{
                                                ml: 2,
                                                py: 0,
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                // 允许在内部换行
                                                whiteSpace: 'normal',
                                                // 控制最大宽度，避免无限延伸
                                                maxWidth: '700px',
                                                // 如果想让文本自动换行，可以省略 display: 'inline-flex'
                                                // 或改成 display: 'flex', 并 alignItems: 'flex-start'
                                                display: 'flex',
                                                alignItems: 'flex-start'
                                            }}
                                        >
                                            {q.solutionText}
                                        </Alert>
                                    )}
                                    {disableForm && correction[q.id] && q.state === idx + 1 && (
                                        <Box sx={{ ml: 2 }}>
                                            <ErrorOutlineIcon color="error" />
                                        </Box>
                                    )}
                                </Box>
                            ))}
                        </RadioGroup>


                    </Box>
                ))}

                <Box textAlign="center" sx={{ py: 3 }}>
                    <Button
                        onClick={() => handleLinkClick(`/xp/${alias}/instruction-almost-ready-to-start`)}
                        sx={{ mx: 3 }}
                        variant="outlined"
                        size="large"
                    >
                        Prev
                    </Button>
                    {!disableForm && (
                        <Button
                            disabled={disableForm}
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Submit
                        </Button>
                    )}
                    {disableForm && (
                        <Typography variant="h4" sx={{ my: 5 }}>
                            Please wait, the experimenter will come shortly.
                        </Typography>
                    )}
                </Box>
            </form>

            {/* If you want to display mcq12 and mcq13 in the UI, you can map them here similarly:
                {questions.slice(11).map((q, index) => (
                  ...
                ))}
            */}

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="xl"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        width: '90%',
                        height: '90%',
                        maxWidth: 'none',
                    },
                }}
            >
                <DialogTitle>
                    {/* <Typography variant="h5" sx={{ my: 2 }}>A Quick Reminder of the payoff in the dangerous zone</Typography> */}
                </DialogTitle>
                <DialogContent>
                    <Grid container alignItems="center" sx={{ my: 0 }}>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Box component="img" alt="" src={img15} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuizPage;
