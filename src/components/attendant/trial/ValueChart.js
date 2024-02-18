import * as _ from "lodash";
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
import { Box } from "@mui/material";
import { trialIndex, showMoneyOutcome, showVolumeChart, showVolumeChartInitialValue, doShowVolumeChart } from "../../../slices/gameSlice";
import questionMarkImg from "../../../assets/question-mark.png";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function ValueChart({ xpData, xpConfig }) {
    const dispatch = useDispatch();
    const showMoneyOutcomeS = useSelector(showMoneyOutcome);
    const trialIndexS = useSelector(trialIndex);
    const { asset, volume } = xpData;
    const showVolumeChartS = useSelector(showVolumeChart);
    const showVolumeChartInitialValueS = useSelector(showVolumeChartInitialValue);

    let originalLabels = Array.from({ length: trialIndexS + (showMoneyOutcomeS ? 1 : 0) }, (_, i) => i);
    let labels = _.clone(originalLabels);
    let lengthLimit = 50;
    let originalLabelLength = labels.length

    useEffect(() => {
        // dispatch(doShowVolumeChart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showVolumeChartS])

    // add history
    if (originalLabelLength < lengthLimit) {
        labels = _.concat(labels, Array.from({ length: lengthLimit - originalLabelLength }, () => null))
    }

    if (labels.length > lengthLimit) {
        labels = labels.slice(-lengthLimit);
    }

    if (originalLabels.length > lengthLimit) {
        originalLabels = originalLabels.slice(-lengthLimit);
    }

    let dataValues1 = asset && _.slice(asset, originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0]);
    if (originalLabelLength < lengthLimit) {
        dataValues1 = _.concat(dataValues1, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    if (!showMoneyOutcomeS && dataValues1) {
        dataValues1.pop();
    }

    labels = labels.map(l => l === null ? '' : l + 1)

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Asset history',
                data: dataValues1,
                backgroundColor: 'rgb(14,133,255)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    let dataValues2 = volume && _.slice(volume, originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0]);
    if (originalLabelLength < lengthLimit) {
        dataValues2 = _.concat(dataValues2, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    if (!showMoneyOutcomeS && dataValues2) {
        dataValues2.pop();
    }
    const data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Volume history',
                data: dataValues2,
                backgroundColor: 'rgb(141,168,181)',
                borderColor: 'rgba(99,104,255,0.2)',
            },
        ],
    };

    const options = {
        aspectRatio: 4,
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
                            return '1';
                        } else if (value === -1) {
                            return '-1';
                        }
                        return '';
                    },
                    font: {
                        size: 16,
                    },
                },
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
                display: true,
                onClick: () => {
                },
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        },
    };

    const options2 = {
        aspectRatio: 4,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                display: false,
                ticks: {
                    // beginAtZero: true,
                    font: {
                        size: 14,
                    },
                },
                suggestedMax: _.max(volume),
                suggestedMin: _.min(volume),
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
                display: true,
                onClick: () => {
                },
                labels: {
                    font: {
                        size: 16
                    }
                }
            }
        }
    };

    const onClickAssetChart = () => {
        if (showMoneyOutcomeS) {
            return;
        }
        dispatch(doShowVolumeChart());
    }

    return (
        <Box style={{
            position: "relative"
        }}>
            {!showMoneyOutcomeS &&
                <img id="questionMarkImg" src={questionMarkImg} alt="question" style={{
                    height: 80,
                    position: "absolute",
                    right: -30,
                    top: 100,
                }} />
            }

            <Box>
                <Line data={data} options={options} />
            </Box>
            {xpConfig.treatment === 1 ?
                <Box sx={{
                    mt: 1,
                }}>
                    <Line style={{ paddingLeft: '25px' }} data={data2} options={options2} />
                </Box>

                :
                <Box sx={{
                    mt: 1,
                    opacity: (xpConfig.hideVolumeChartWhenShowOutcome && !showVolumeChartInitialValueS && showMoneyOutcomeS) ? '0' : (showVolumeChartS ? '1' : '0'),
                }} onClick={onClickAssetChart}>
                    <Line style={{ paddingLeft: '25px' }} data={data2} options={options2} />
                </Box>
            }
        </Box>
    );
}