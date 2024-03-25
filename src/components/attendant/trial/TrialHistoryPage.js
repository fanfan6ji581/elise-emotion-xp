import * as _ from "lodash";
import TrainingTimer from './TrainingTimer';
import { loginAttendant } from "../../../slices/attendantSlice";
import { xpConfigS } from "../../../slices/gameSlice";
import { useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, } from "react-redux";
import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
);

const TrialHistoryPage = () => {
    const { alias } = useParams();
    const navigate = useNavigate();
    const loginAttendantS = useSelector(loginAttendant);
    const xpConfig = useSelector(xpConfigS);
    const chart1Ref = useRef(null);
    const chart2Ref = useRef(null);
    let data1 = {};
    let data2 = {};

    const onKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'm') {
            navigate(`/xp/${alias}/strategy`);
        }
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown, false);

        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
    }, [xpConfig])

    const { asset, volume } = loginAttendantS.xpData;
    let balloonValues = _.slice(asset, 0, 100);
    let balloonSpeed = _.slice(volume, 0, 100);

    let labels = Array.from({ length: balloonValues.length }, (_, i) => i + 1);
    data1 = {
        labels: labels,
        datasets: [
            {
                label: 'Asset Trend',
                data: balloonValues,
                backgroundColor: 'rgb(14,133,255)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Indicator',
                data: balloonSpeed,
                backgroundColor: 'rgb(141,168,181)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    const options = {
        aspectRatio: 8.5,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    display: false,
                    min: 2,
                    max: 2,
                },
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                    maxRotation: 0,
                    minRotation: 0,
                },
            }
        },
        responsive: true,
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
            },
        },
    };

    const options2 = {
        aspectRatio: 8.5,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 14,
                    },
                },
                suggestedMax: _.max(_.slice(volume, 0, 100)),
                suggestedMin: _.min(_.slice(volume, 0, 100)),
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                    maxRotation: 0,
                    minRotation: 0,
                },
            }
        },
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
            },
        }
    };


    const onFinish = async () => {
        navigate(`/xp/${alias}/strategy`)
    }

    const timer = useMemo(() => {
        return <TrainingTimer trainingSessionSeconds={xpConfig.historySessionSeconds} onFinish={onFinish} text={"Time left"} />
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xpConfig]);

    return (
        <Container maxWidth="lg">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" align="center" sx={{ mt: 5 }}>
                        Trial History
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mt: 1, }}>
                        You can scroll from left to right to see the total 100 trials.
                        {xpConfig?.treatment === 3 && <>
                            <br />
                            <Typography variant="span">
                                We're showing you the history so you can learn the probability of a switch within the dangerous zone as well as the probability of an aberration.
                            </Typography>
                        </>}
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mb: 5 }}>
                        You have 5 minutes to observe the history before the game starts.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ position: "relative" }}>
                        <Typography align="center" sx={{ position: "absolute", left: -38, top: 35 }}>
                            1
                        </Typography>
                        <Typography align="center" sx={{ position: "absolute", left: -38, top: 265 }}>
                            -1
                        </Typography>

                        <Box sx={{ overflowX: "scroll" }}>
                            <Box sx={{ position: "absolute", width: '100%', left: 0 }}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Box sx={{
                                        width: 40,
                                        height: 18,
                                        backgroundColor: 'rgb(14,133,255)',
                                        borderColor: 'rgba(99,104,255,0.2)',
                                        boxShadow: 2,
                                        mr: 1,
                                    }}></Box>
                                    <Typography>Asset history</Typography>
                                </Stack>
                            </Box>
                            <Box sx={{ width: 2300, mt: 5 }}>
                                <Line data={data1} options={options} ref={chart1Ref} style={{ width: 2300 }} />
                            </Box>

                            <Box sx={{ mt: 5 }} />
                            <Box sx={{ position: "absolute", width: '100%', left: 0 }}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Box sx={{
                                        width: 40,
                                        height: 18,
                                        backgroundColor: 'rgb(141,168,181)',
                                        borderColor: 'rgba(99,104,255,0.2)',
                                        boxShadow: 2,
                                        mr: 1,
                                    }}></Box>
                                    <Typography>Indicator history</Typography>
                                </Stack>
                            </Box>
                            <Box sx={{ width: 2300, mt: 9, mb: 2 }}>
                                <Line data={data2} options={options2} ref={chart2Ref} style={{ width: 2300 }} />
                            </Box>
                        </Box>
                    </Box>

                    {xpConfig.historySessionSeconds &&
                        timer
                    }
                </Grid>
            </Grid>
        </Container>
    )
}

export default TrialHistoryPage