import * as _ from "lodash";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Box, Typography } from "@mui/material";
import {
    trialIndex, showMoneyOutcome, showVolumeChart, choiceHistory,
    // showVolumeChartInitialValue,
    doShowVolumeChart
} from "../../../slices/gameSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ValueChart({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const trialIndexS = useSelector(trialIndex);
    const { asset, volume } = xpData;
    const showVolumeChartS = useSelector(showVolumeChart);
    const choiceHistoryS = useSelector(choiceHistory);
    // const showVolumeChartInitialValueS = useSelector(showVolumeChartInitialValue);

    const historyLength = 10;

    // when trialIndexS == 0, originalLabels should have 10 history + 1 label with no value

    let originalLabels = Array.from({ length: historyLength + trialIndexS + 1 }, (_, i) => i);
    let labels = _.clone(originalLabels);
    let lengthLimit = xpConfig.trialWindowLength || 20;
    let originalLabelLength = labels.length

    useEffect(() => {
        // dispatch(doShowVolumeChart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showVolumeChartS])

    if (originalLabelLength < lengthLimit) {
        // append empty ones
        labels = _.concat(labels, Array.from({ length: lengthLimit - originalLabelLength }, () => null))
    }

    if (labels.length > lengthLimit) {
        labels = labels.slice(-lengthLimit);
    }

    if (originalLabels.length > lengthLimit) {
        originalLabels = originalLabels.slice(-lengthLimit);
    }

    let dataValues1 = asset && _.slice(asset, originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1));
    if (originalLabelLength < lengthLimit) {
        dataValues1 = _.concat(dataValues1, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }


    labels = labels.map(l => l === null ? '' : l < historyLength ? '' : l - historyLength + 1)

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Asset Trend',
                data: dataValues1,
                backgroundColor: 'rgb(0,0,0)',
                borderColor: 'rgba(0,0,0,0.2)',
            },
        ],
    };

    let dataValues2 = volume && _.slice(volume, originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1));
    if (originalLabelLength < lengthLimit) {
        dataValues2 = _.concat(dataValues2, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    // let dataValues2After = _.slice(volume, originalLabels[0],
    //     Math.min(originalLabelLength, lengthLimit) + 5 + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1));
    // dataValues2After = dataValues2After.slice(-8);
    // console.log(dataValues2After)


    const data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Indicator history',
                data: dataValues2,
                // fill: true,  // Enable fill for area chart
                // backgroundColor: 'rgba(255, 99, 132, 0.2)', // Softer red with transparency
                // borderColor: 'rgba(255, 99, 132, 1)', // More vivid red for the border

                backgroundColor: '#d32f2f',
                borderColor: '#d32f2f',
                borderWidth: dataValues2.map(value => value === 0 ? 2 : 1),

            },
        ],
    };

    const options = {
        aspectRatio: 4.5,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    beginAtZero: true,
                    major: true,
                    callback: function (value, index, values) {
                        if (value === 1) {
                            return '+1';
                        } else if (value === -1) {
                            return '-1';
                        }
                        return '';
                    },
                    font: {
                        size: 32,
                    },
                },
                // title: {
                //     display: true,
                //     labelString: 'probability',
                //     font: {
                //         size: 32,
                //     },
                // },
                suggestedMax: 1,
                suggestedMin: -1
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                },
            }
        },
        plugins: {
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
                onClick: () => {
                },
                labels: {
                    font: {
                        size: 12
                    }
                }
            }
        },
    };

    const options2 = {
        aspectRatio: 4.5,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    beginAtZero: true,
                    major: true,
                    callback: function (value, index, values) {
                        return '  '; // Adjusted to show space as tick labels
                    },
                    font: {
                        size: 24,
                    },
                },
                suggestedMax: _.max(dataValues2),
                suggestedMin: _.min(dataValues2),
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12,
                    },
                },
            }
        },
        plugins: {
            tooltip: {
                enabled: false // Disable tooltips
            },
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
                onClick: () => {
                },
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        },
        minBarLength: 1,
        barThickness: 45,
        categorySpacing: 0,
    };

    const onClickAssetChart = () => {
        if (showMoneyOutcomeS) {
            return;
        }
        dispatch(doShowVolumeChart());
    }

    return (
        <>
            <Box style={{ position: "relative" }}>
                <Box sx={{
                    mt: 4,
                    opacity: showMoneyOutcomeS ? (choiceHistoryS[trialIndexS] === '0' ? '1' : '0') : '1',
                }}>
                    <Line data={data} options={options} />
                    <Typography variant="p" sx={{ position: "absolute", top: 110, left: -40, width: 70, textAlign: 'center' }}>
                        Asset Trend
                    </Typography>
                    <Typography variant="p" sx={{ position: "absolute", bottom: -30, left: 560, width: 70, textAlign: 'center' }}>
                        Day #
                    </Typography>
                </Box>
            </Box>


            <Box style={{ position: "relative" }}>
                <>
                    <Box sx={{
                        mt: 6,
                        opacity: (xpConfig.hideVolumeChartWhenShowOutcome && showMoneyOutcomeS) ? '0' : (showVolumeChartS ? '1' : '0'),
                    }} onClick={onClickAssetChart}>
                        <Bar style={{ paddingLeft: '25px' }} data={data2} options={options2} />
                        <Typography variant="p" sx={{ position: "absolute", top: 110, left: -40, width: 70, textAlign: 'center' }}>
                            Indicator
                        </Typography>
                        <Typography variant="p" sx={{ position: "absolute", bottom: -30, left: 560, width: 70, textAlign: 'center' }}>
                            Day #
                        </Typography>
                    </Box>
                </>
            </Box>
        </>
    );
}