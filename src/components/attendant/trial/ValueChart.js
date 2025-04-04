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

    // 当 trialIndexS == 0 时，originalLabels 包含 10 个历史值加上一个空值标签
    let originalLabels = Array.from({ length: historyLength + trialIndexS + 1 }, (_, i) => i);
    let labels = _.clone(originalLabels);
    let lengthLimit = xpConfig.trialWindowLength || 20;
    let originalLabelLength = labels.length;

    useEffect(() => {
        // dispatch(doShowVolumeChart);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showVolumeChartS]);

    if (originalLabelLength < lengthLimit) {
        // 如果长度不足，则补充空值
        labels = _.concat(labels, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    if (labels.length > lengthLimit) {
        labels = labels.slice(-lengthLimit);
    }

    if (originalLabels.length > lengthLimit) {
        originalLabels = originalLabels.slice(-lengthLimit);
    }

    let dataValues1 = asset && _.slice(
        asset,
        originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1)
    );
    if (originalLabelLength < lengthLimit) {
        dataValues1 = _.concat(dataValues1, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    labels = labels.map(l => l === null ? '' : l < historyLength ? '' : l - historyLength + 1);

    // 先计算最后两个有效数据点的索引
    let validIndices = [];
    for (let i = dataValues1.length - 1; i >= 0; i--) {
        if (dataValues1[i] !== null && typeof dataValues1[i] === 'number') {
            validIndices.unshift(i);
            if (validIndices.length === 2) break;
        }
    }

    // 判断这两个数据是否不同
    const isDifferent = validIndices.length === 2 && dataValues1[validIndices[0]] !== dataValues1[validIndices[1]];

    // 使用同样的逻辑为每个数据点生成颜色
    const pointBgColors = dataValues1.map((value, index) => {
        if (isDifferent && (index === validIndices[0] || index === validIndices[1])) {
            return '#d32f2f';
        }
        return 'rgb(0,0,0)'; // 默认颜色
    });

    // 修改后的 Asset Trend 数据集：最后一个数据点和线段变为红色
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Asset Trend',
                data: dataValues1,
                backgroundColor: 'rgb(0,0,0)',
                borderColor: 'rgba(0,0,0,0.2)', // 默认线条颜色
                // 设置各数据点的颜色，最后一个点为红色
                pointBackgroundColor: pointBgColors,
                // 使用 scriptable options 调整线段颜色：最后一段为红色
                segment: {
                    borderColor: ctx => {
                        const { p0DataIndex, p1DataIndex, chart, datasetIndex } = ctx;
                        const currentDataset = chart.data.datasets[datasetIndex];
                        const data = currentDataset.data;

                        // 找到最后两个非 null 的数据点索引
                        const validIndices = [];
                        for (let i = data.length - 1; i >= 0; i--) {
                            if (data[i] !== null && typeof data[i] === 'number') {
                                validIndices.unshift(i); // 保持顺序从小到大
                                if (validIndices.length === 2) break;
                            }
                        }

                        // 如果没有找到足够的数据，则返回默认颜色
                        if (validIndices.length < 2) {
                            return 'rgba(0,0,0,0.2)'
                        }

                        // 如果当前线段正好连接最后两个有效数据点
                        if (p0DataIndex === validIndices[0] && p1DataIndex === validIndices[1]) {
                            if (data[validIndices[0]] !== data[validIndices[1]]) {
                                return '#d32f2f';
                            }
                        }

                        return 'rgba(0,0,0,0.2)'
                    }
                }
            },
        ],
    };

    let dataValues2 = volume && _.slice(
        volume,
        originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1)
    );
    if (originalLabelLength < lengthLimit) {
        dataValues2 = _.concat(dataValues2, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    const data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Indicator history',
                data: dataValues2,
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
                onClick: () => { },
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
                    stepSize: 1, // 确保刻度只显示整数
                    font: {
                        size: 32,
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
                enabled: false // 关闭提示框
            },
            datalabels: {
                display: false,
            },
            legend: {
                display: false,
                onClick: () => { },
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
    };

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
                <Box sx={{
                    pt: 12,
                    opacity: (xpConfig.hideVolumeChartWhenShowOutcome && showMoneyOutcomeS) ? '0' : (showVolumeChartS ? '1' : '0'),
                }} onClick={onClickAssetChart}>
                    <Bar style={{ paddingLeft: '25px' }} data={data2} options={options2} />
                    <Typography variant="p" sx={{ position: "absolute", top: 200, left: -40, width: 70, textAlign: 'center' }}>
                        Indicator
                    </Typography>
                    <Typography variant="p" sx={{ position: "absolute", bottom: -30, left: 560, width: 70, textAlign: 'center' }}>
                        Day #
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
