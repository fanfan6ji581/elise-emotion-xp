import {
    Container, Box, Typography, Button, Alert, Grid,
    FormControlLabel, RadioGroup, Radio, Backdrop, CircularProgress, Link as MuiLink,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useParams } from "react-router-dom"
import { loginAttendant } from "../../slices/attendantSlice";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import image12 from "../../assets/12.png";
import image13 from "../../assets/13.png";
import image15 from "../../assets/15.png";
import downArrowImg from "../../assets/down-arrow.png";

const QuizPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    // const xpConfig = useSelector(xpConfigS);
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const solution = {
        mcq1: 1,
        mcq2: 2,
        mcq3: 1,
        mcq4: 1,
        mcq5: 1,
        mcq6: 1,
        mcq7: 4,
        mcq8: 2,
        mcq9: 1,
        mcq10: 2,
        mcq11: 1,
        mcq12: 1,
        mcq13: 1,
    }

    const solutionText = {
        mcq1: 'correct answer. The expected value is (for each share traded) 0.9 x 1 – 0.1 x 25 <<0.',
        mcq2: 'correct answer. You lose $1 AUD every time you do not reply within the allowed time.',
        mcq3: 'correct answer. When the indicator departs from its baseline (0) value, this is the signal that a shift is going to occur sometime in the coming trials.',
        mcq4: 'correct answer. If the asset trend shifts but the indicator is at baseline, it is certain that the trend will switch back next trial.',
        mcq5: 'correct answer. The shift probability is fixed at 0.1 and the dangerous zone continues until the shift is realized.]',
        mcq6: 'correct answer',
        mcq7: 'correct answer. Upon a shift in the dangerous zone, the outcome will be magnified by 25 times.',
        mcq8: 'correct answer. Aberrations are not real shifts, so the outcome will not be magnified.',
        mcq9: 'correct answer',
        mcq10: 'correct answer. You can earn a significant amount of money in this experiment (up to $100 AUD) if you perform well in the task, but if you do not, expect to leave the lab with $10 AUD.]',
        mcq11: 'correct answer. The computer randomly selects 100 consecutive trials you played and computes your net accumulated outcomes in these trials, which determines your final payment. This means that each trial will potentially count for your payment, so try to do your very best on each trial!',
        mcq12: 'correct answer. You can earn a significant amount of money in this experiment (up to $100 AUD) if you perform well in the task, but if you do not, expect to leave the lab with $10 AUD.',
        mcq13: `correct answer. The computer randomly selects 100 consecutive trials you played and computes your net accumulated outcomes in these trials, which determines your final payment. This means that each trial will potentially count for your payment, so try to do your very best on each trial!`,
    }

    const fetchAttdendantAnswer = async () => {
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        const docSnap = await getDoc(attendantRef);
        setLoadingOpen(false);
        if (!docSnap.exists()) {
            window.alert("Submit failed, Please refresh the page and try again");
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
            validateForm(attendant.quizAnswers)
        }
    }

    const validateForm = (quizAnswers) => {
        const correction = {};
        let diffCount = 0;
        for (let fieldName in solution) {
            if (solution[fieldName] !== quizAnswers[fieldName]) {
                diffCount++;
                correction[fieldName] = solutionText[fieldName];
            }
        }

        // save attendant quiz response
        setDisableForm(true);
        setCorrection(correction);

        if (diffCount === 0) {
            navigate(`/xp/${alias}/start-game`);
        }
    }

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
            // case mcq12 === 0:
            //     return window.alert("Please fill question #12");
            // case mcq13 === 0:
            //     return window.alert("Please fill question #13");
            default:
                break;
        }

        const quizAnswers = { mcq1, mcq2, mcq3, mcq4, mcq5, mcq6, mcq7, mcq8, mcq9, mcq10, mcq11, mcq12, mcq13 };
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { submitted: true, quizAnswers });

        validateForm(quizAnswers);
    }

    const saveFormWithoutSubmit = async () => {
        const quizAnswers = { mcq1, mcq2, mcq3, mcq4, mcq5, mcq6, mcq7, mcq8, mcq9, mcq10, mcq11, mcq12, mcq13 };
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { submitted: false, quizAnswers });
    };

    const handleLinkClick = async (path) => {
        await saveFormWithoutSubmit();
        navigate(path);
    };

    const onKeyDown = (e) => {
        if (
            (e.ctrlKey && e.key === 'm') ||
            e.key === ' '
        ) {
            navigate(`/xp/${alias}/start-game`);
        }
    }

    useEffect(() => {
        fetchAttdendantAnswer();
        document.addEventListener("keydown", onKeyDown, false);
        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const handleBeforeUnload = async (event) => {
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
            <Typography variant="h4" align="center" sx={{ my: 3 }}>
                Pre-Game Quiz
            </Typography>

            <Alert variant="outlined" icon={false} severity="info" sx={{ my: 1 }}>
                <Typography variant="h6">
                    Please answer the following basic questions about the game; the idea is to double-check that the essentials are clear to you before you start to play.
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                    Your answers will be recorded and <b>replying incorrectly to several questions may lead to your exclusion from the experiment.</b>
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                    So please pay attention and if you find the wording of a question unclear, please make sure you seek clarification with the experimenter before you answer, to avoid any penalty.
                </Typography>
            </Alert>

            <form onSubmit={onSubmit}>
                <Typography variant="h5" sx={{ mt: 3, mb: 0 }}>
                    1. In the dangerous zone, the expected payoff of betting on <b>the current asset trend (that is, choosing -1 or -2 on day 33 in the previous example)</b> is:
                </Typography>
                <Typography variant="h6" sx={{ ml: 6, mt: -3, mb: 2 }}>
                    <br />click&nbsp;
                    <MuiLink onClick={handleClickOpen} sx={{ cursor: 'pointer' }}>
                        {'HERE'}
                    </MuiLink>
                    &nbsp;to check the previous example
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Negative", "Positive", "I’m not quite sure"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center" sx={{ mb: 1 }}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq1 === idx + 1}
                                                onChange={() => setMcq1(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq1 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq1}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq1 &&
                                        mcq1 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    2. If I do not click anything within the allowed time, I proceed to the next trial without any penalty.
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center" sx={{ mb: 1 }}>
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq2 === idx + 1}
                                                onChange={() => setMcq2(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq2 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq2}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq2 &&
                                        mcq2 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    3. Whenever I see the current indicator being above 0, I know that I am now in a dangerous zone where a shift may occur in the next trial with a shift probability 0.1.
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq3 === idx + 1}
                                                onChange={() => setMcq3(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq3 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq3}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq3 &&
                                        mcq3 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    4. If the indicator value is currently 0, and the asset trend switches at this trial, it must be an aberration and the asset trend will surely switch back at the next trial
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq4 === idx + 1}
                                                onChange={() => setMcq4(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq4 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq4}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq4 &&
                                        mcq4 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    5. If the current indicator is at 1 (I am in the dangerous zone), then, no matter how long this dangerous zone has lasted so far, the likelihood of a shift in the next trial is always 10%
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq5 === idx + 1}
                                                onChange={() => setMcq5(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq5 === idx + 1 &&
                                        <Grid item xs={10}>
                                            <Alert severity="success">{solutionText.mcq5}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq5 &&
                                        mcq5 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>


                <Typography variant="h5" sx={{ mt: 3 }}>
                    6. Assume I am in the dangerous zone and the current asset trend is <b>+1</b>, if I choose to buy 2 share (the choice “<b>+2</b>” on the interface), and on the next day, the asset trend turns out to be <b>+1</b>, then my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $2", "Loss of $2", "Win of $50", "Loss of $50"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq6 === idx + 1}
                                                onChange={() => setMcq6(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq6 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq6}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq6 &&
                                        mcq6 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    7. Assume I am in the dangerous zone and the current asset trend is <b>+1</b>, if I choose to buy 1 share (the choice “<b>+1</b>” on the interface), and on the next day, the asset trend turns out to be <b>-1</b>, then my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Loss of $1", "Win of $25", "Loss of $25"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq7 === idx + 1}
                                                onChange={() => setMcq7(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq7 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq7}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq7 &&
                                        mcq7 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    8. Assume I am <b>NOT</b> in the dangerous zone and the current asset trend is <b>-1</b>, if I choose to sell 1 share (the choice “<b>-1</b>” on the interface), but on the next day, the asset trend turns out to be <b>+1</b>. In this case my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Loss of $1", "Win of $25", "Loss of $25"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq8 === idx + 1}
                                                onChange={() => setMcq8(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq8 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq8}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq8 &&
                                        mcq8 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    9. When the indicator is at baseline (0), aberrations can happen but they are rare with less than 15% chances.
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq9 === idx + 1}
                                                onChange={() => setMcq9(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq9 === idx + 1 &&
                                        <Grid item>
                                            <Alert severity="success">{solutionText.mcq9}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq9 &&
                                        mcq9 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    10. No matter how well I performed, I can definitely leave the lab with no less than $25.
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item xs={2}>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq10 === idx + 1}
                                                onChange={() => setMcq10(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq10 === idx + 1 &&
                                        <Grid item xs={10}>
                                            <Alert severity="success">{solutionText.mcq10}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq10 &&
                                        mcq10 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>

                <Typography variant="h5" sx={{ mt: 3 }}>
                    11. I should focus on doing my best on every single trial as any trial may be selected for payment at the end of the experiment.
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["True", "False"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
                                    <Grid item xs={2}>
                                        <FormControlLabel
                                            control={<Radio disabled={disableForm}
                                                value={idx + 1}
                                                checked={mcq11 === idx + 1}
                                                onChange={() => setMcq11(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq11 === idx + 1 &&
                                        <Grid item xs={10}>
                                            <Alert severity="success">{solutionText.mcq11}</Alert>
                                        </Grid>
                                    }
                                    {
                                        disableForm &&
                                        correction.mcq11 &&
                                        mcq11 === idx + 1 &&
                                        <Grid item>
                                            <ErrorOutlineIcon color="error" />
                                        </Grid>
                                    }
                                </Grid>
                            </Fragment>
                        )
                    }
                </RadioGroup>


                <Box textAlign="center" sx={{ py: 3 }}>
                    <Button onClick={() => handleLinkClick(`/xp/${alias}/instruction-almost-ready-to-start`)} sx={{ mx: 3 }} variant="outlined" size="large">Prev</Button>
                    {!disableForm &&
                        <>
                            <Button disabled={disableForm} type="submit" variant="contained" size="large">Submit</Button>
                        </>
                    }
                    {disableForm &&
                        <Typography variant="h4" sx={{ my: 5 }}>Please wait, the experimenter will come shortly.</Typography>
                    }
                </Box>

                <br />
            </form>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingOpen}
                onClick={() => setLoadingOpen(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog open={open} onClose={handleClose} maxWidth="xl"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        width: '90%',
                        height: '90%',
                        maxWidth: 'none',
                    },
                }}>
                <DialogTitle>A Quick Reminder of the payoff in the dangerous zone</DialogTitle>
                <DialogContent>
                    <Grid container alignItems="center" sx={{ my: 0 }}>
                        <Grid item xs={5} sx={{ textAlign: "center" }}>
                            <Box component="img" alt="" src={image12} sx={{ width: '100%' }} />
                        </Grid>
                        <Grid item xs={7} sx={{ textAlign: "center" }}>
                            <Box component="img" alt="" src={image13} sx={{ width: '100%', mb: -2 }} />
                            <Box component="img" alt="" src={downArrowImg} sx={{ width: '40px' }} />
                            <Box component="img" alt="" src={image15} sx={{ width: '100%' }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default QuizPage