import {
    Container, Box, Typography, Button, Alert, Grid,
    FormControlLabel, RadioGroup, Radio, Backdrop, CircularProgress,
} from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useParams } from "react-router-dom"
import { loginAttendant } from "../../slices/attendantSlice";
import { xpConfigS } from "../../slices/gameSlice";
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../../database/firebase";
import { Link } from 'react-router-dom';

const QuizPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
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
    const [correction, setCorrection] = useState({});
    const [disableForm, setDisableForm] = useState(false);
    const [loadingOpen, setLoadingOpen] = useState(true);

    const solution = {
        mcq1: 2,
        mcq2: 2,
        mcq3: 3,
        mcq4: 4,
        mcq5: 1,
        mcq6: 1,
        mcq7: 1,
        mcq8: 2,
        mcq9: 1,
        mcq10: 1,
    }

    const solutionText = {
        mcq1: 'correct answer',
        mcq2: 'correct answer',
        mcq3: 'correct answer',
        mcq4: 'correct answer',
        mcq5: 'correct answer',
        mcq6: 'correct answer',
        mcq7: `There is a pattern linking the volume indicator to the regime shifts. If you manage to identify what the pattern is, you may be able to forecast the shifts from the value of the volume indicator.`,
        mcq8: `You can earn a significant amount of money in this experiment (up to $100 AUD) if you perform well in the task, but if you do not, you will most likely leave the lab with only $10.`,
        mcq9: `The computer randomly selects ${xpConfig.percentageEarning}% of the trials you played and computes your net accumulated outcomes in these trials. You receive that amount, up to $100. In case of a negative score, you leave the lab with $10.`,
        mcq10: 'correct answer',
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
            default:
                break;
        }

        const quizAnswers = { mcq1, mcq2, mcq3, mcq4, mcq5, mcq6, mcq7, mcq8, mcq9, mcq10 };
        const attendantRef = doc(db, "attendant", loginAttendantS.id);
        await updateDoc(attendantRef, { quizAnswers });

        validateForm(quizAnswers);
    }

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

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" sx={{ my: 3 }}>
                Pre-Game Quiz
            </Typography>

            <Alert variant="outlined" icon={false} severity="info" sx={{ my: 3 }}>
                <Typography variant="h5">
                    <b>Please focus on the following quiz which is to check your understanding of the game before you start to play. Your answers will be recorded and replying incorrectly to several questions may lead to your exclusion from the experiment, so please be very careful.</b>
                </Typography>
                <Typography variant="h5" sx={{ mt: 3 }}>
                    <b>If you find the wording of a question unclear, please make sure you seek clarification with the experimenter before you answer, to avoid any penalty.</b>
                </Typography>
            </Alert>

            <form onSubmit={onSubmit}>
                <Typography variant="h5" sx={{ mt: 3 }}>
                    1. If I do not reply within the allowed time, I proceed to the next trial without any penalty.
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
                    2. If on a given trial I forecast a <b>switch</b>, and there is a <b>switch</b>. In this case my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Win of $3", "Loss of $1", "Loss of $3"].map((v, idx) =>
                            <Fragment key={idx}>
                                <Grid container alignItems="center">
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
                    3. If on a given trial I forecast a <b>switch</b>, and there is <b>no switch</b>. In this case my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Win of $3", "Loss of $1", "Loss of $3"].map((v, idx) =>
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
                    4. If on a given trial I forecast <b>no switch</b>, and there is a <b>switch</b>. In this case my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Win of $3", "Loss of $1", "Loss of $3"].map((v, idx) =>
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
                    5. If on a given trial I forecast <b>no switch</b>, and there is <b>no switch</b>. In this case my payoff is
                </Typography>
                <RadioGroup sx={{ mx: 3 }} >
                    {
                        ["Win of $1", "Win of $3", "Loss of $1", "Loss of $3"].map((v, idx) =>
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
                                        <Grid item>
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
                    6. If on a given trial I choose to skip, then my payoff is always zero no matter of the result.
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
                    7. I can use the volume indicator to help forecast the regime shifts by differentiating them from aberrations.
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
                    8. I will definitely leave the lab with no less than $25.
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
                                                checked={mcq8 === idx + 1}
                                                onChange={() => setMcq8(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq8 === idx + 1 &&
                                        <Grid item xs={10}>
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
                    9. I should focus on doing my best on every single trial as any trial may be selected for payment.
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
                                                checked={mcq9 === idx + 1}
                                                onChange={() => setMcq9(idx + 1)} />}
                                            label={v} />
                                    </Grid>
                                    {
                                        disableForm &&
                                        solution.mcq9 === idx + 1 &&
                                        <Grid item xs={10}>
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
                    10. At anytime during the game, I can click anywhere on the blank space below the asset chart, and the volume chart will instantaneously appear on screen.
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

                <Box textAlign="center" sx={{ py: 3 }}>
                    <Button component={Link} to={`/xp/${alias}/instruction-ready`} sx={{ mx: 3 }} variant="outlined" size="large">Prev</Button>
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
        </Container>
    )
}

export default QuizPage