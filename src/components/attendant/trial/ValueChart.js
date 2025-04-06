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
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    trialIndex, showMoneyOutcome, showVolumeChart, choiceHistory,
    doShowVolumeChart
} from "../../../slices/gameSlice";

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

    // 控制 Indicator 图 blink 动画的状态
    const [blinkActive, setBlinkActive] = useState(false);
    const [blinkToggle, setBlinkToggle] = useState(false);
    // 将 blinkCondition 存入 state
    const [blinkCondition, setBlinkCondition] = useState(false);
    // 保存 interval id
    const blinkIntervalRef = useRef(null);

    const historyLength = 10;
    let originalLabels = Array.from({ length: historyLength + trialIndexS + 1 }, (_, i) => i);
    let labels = _.clone(originalLabels);
    let lengthLimit = xpConfig.trialWindowLength || 20;
    let originalLabelLength = labels.length;

    if (originalLabelLength < lengthLimit) {
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

    // 计算 Asset Trend 图中最后两个有效数据点的索引及颜色
    let validIndices1 = [];
    for (let i = dataValues1.length - 1; i >= 0; i--) {
        if (dataValues1[i] !== null && typeof dataValues1[i] === 'number') {
            validIndices1.unshift(i);
            if (validIndices1.length === 2) break;
        }
    }
    const isDifferent1 = validIndices1.length === 2 && dataValues1[validIndices1[0]] !== dataValues1[validIndices1[1]];
    const pointBgColors = dataValues1.map((value, index) => {
        if (isDifferent1 && (index === validIndices1[0] || index === validIndices1[1])) {
            return '#d32f2f';
        }
        return 'rgb(0,0,0)';
    });

    // Asset Trend 图数据配置
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Asset Trend',
                data: dataValues1,
                backgroundColor: 'rgb(0,0,0)',
                borderColor: 'rgba(0,0,0,0.2)',
                pointBackgroundColor: pointBgColors,
                segment: {
                    borderColor: ctx => {
                        const { p0DataIndex, p1DataIndex, chart, datasetIndex } = ctx;
                        const currentDataset = chart.data.datasets[datasetIndex];
                        const data = currentDataset.data;
                        const validIndices = [];
                        for (let i = data.length - 1; i >= 0; i--) {
                            if (data[i] !== null && typeof data[i] === 'number') {
                                validIndices.unshift(i);
                                if (validIndices.length === 2) break;
                            }
                        }
                        if (validIndices.length < 2) {
                            return 'rgba(0,0,0,0.2)';
                        }
                        if (p0DataIndex === validIndices[0] && p1DataIndex === validIndices[1]) {
                            if (data[validIndices[0]] !== data[validIndices[1]]) {
                                return '#d32f2f';
                            }
                        }
                        return 'rgba(0,0,0,0.2)';
                    }
                }
            },
        ],
    };

    // Indicator history 图使用 volume 数据
    let dataValues2 = volume && _.slice(
        volume,
        originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1)
    );
    if (originalLabelLength < lengthLimit) {
        dataValues2 = _.concat(dataValues2, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    let validIndices2 = [];
    for (let i = dataValues2.length - 1; i >= 0; i--) {
        if (dataValues2[i] !== null && typeof dataValues2[i] === 'number') {
            validIndices2.unshift(i);
            if (validIndices2.length === 2) break;
        }
    }

    // 计算 blinkCondition 并存入 state
    useEffect(() => {
        const condition = validIndices2.length === 2 &&
            dataValues2[validIndices2[0]] === 0 &&
            dataValues2[validIndices2[1]] === 1;
        setBlinkCondition(condition);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataValues2]); // 当 volume 数据更新时

    // Indicator 图柱子的背景色：blinkActive 为 true 时在两种颜色间切换
    const barBgColors = dataValues2.map((value, index) => {
        let color = '#d32f2f';
        if (blinkActive && validIndices2.includes(index)) {
            color = blinkToggle ? '#fefefe' : '#d32f2f';
        }
        return color;
    });

    const data2 = {
        labels: labels,
        datasets: [
            {
                label: 'Indicator history',
                data: dataValues2,
                backgroundColor: barBgColors,
                borderColor: '#d32f2f',
                borderWidth: dataValues2.map(value => value === 0 ? 2 : 1),
            },
        ],
    };

    // 启动 blink 效果：当满足条件时启动 interval
    useEffect(() => {
        if (showVolumeChartS && blinkCondition) {
            setBlinkActive(true);
            let count = 0;
            blinkIntervalRef.current = setInterval(() => {
                setBlinkToggle(prev => !prev);
                count++;
                if (count >= 10) { // 200ms 一次，共 10 次切换后自动结束
                    clearInterval(blinkIntervalRef.current);
                    blinkIntervalRef.current = null;
                    setBlinkActive(false);
                    setBlinkToggle(false);
                }
            }, 200);
            return () => {
                if (blinkIntervalRef.current) {
                    clearInterval(blinkIntervalRef.current);
                    blinkIntervalRef.current = null;
                    setBlinkActive(false);
                    setBlinkToggle(false);
                }
            };
        }
    }, [showVolumeChartS, blinkCondition]);


    // 点击切换 Indicator 图显示
    const onClickAssetChart = () => {
        if (showMoneyOutcomeS) return;
        dispatch(doShowVolumeChart());
    };

    const options = {
        aspectRatio: 4.5,
        animation: { duration: 0 },
        scales: {
            y: {
                grid: { display: false },
                ticks: {
                    beginAtZero: true,
                    major: true,
                    callback: function (value) {
                        if (value === 1) return '+1';
                        if (value === -1) return '-1';
                        return '';
                    },
                    font: { size: 32 },
                },
                suggestedMax: 1,
                suggestedMin: -1
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: { size: 12 },
                },
            }
        },
        plugins: {
            datalabels: { display: false },
            legend: {
                display: false,
                onClick: () => {},
                labels: { font: { size: 12 } }
            }
        },
    };

    const options2 = {
        aspectRatio: 4.5,
        animation: { duration: 0 },
        scales: {
            y: {
                grid: { display: false },
                ticks: {
                    beginAtZero: true,
                    major: true,
                    stepSize: 1,
                    font: { size: 32 },
                },
                suggestedMax: _.max(dataValues2),
                suggestedMin: _.min(dataValues2),
            },
            x: {
                ticks: {
                    autoSkip: false,
                    font: { size: 12 },
                },
            }
        },
        plugins: {
            tooltip: { enabled: false },
            datalabels: { display: false },
            legend: {
                display: false,
                onClick: () => {},
                labels: { font: { size: 16 } }
            }
        },
        minBarLength: 1,
        barThickness: 45,
        categorySpacing: 0,
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
