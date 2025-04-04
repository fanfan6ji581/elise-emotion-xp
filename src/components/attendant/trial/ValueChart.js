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
import { useState, useEffect } from "react";
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

    // 用于控制 Indicator 图的 blink 动画状态
    const [blinkActive, setBlinkActive] = useState(false);
    const [blinkToggle, setBlinkToggle] = useState(false);

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

    // 对于 Asset Trend 图，计算最后两个有效数据点的索引及颜色
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
        return 'rgb(0,0,0)'; // 默认颜色
    });

    // Asset Trend 图配置
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
                        // 找出最后两个有效的数据点索引
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
                        // 如果当前线段正好连接最后两个有效数据点，且数值不相等，则显示深红色
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

    // Indicator history 图使用 volume 数据，数据与 dataValues1 类似
    let dataValues2 = volume && _.slice(
        volume,
        originalLabels[0],
        Math.min(originalLabelLength, lengthLimit) + originalLabels[0] - (showMoneyOutcomeS ? 0 : 1)
    );
    if (originalLabelLength < lengthLimit) {
        dataValues2 = _.concat(dataValues2, Array.from({ length: lengthLimit - originalLabelLength }, () => null));
    }

    // 计算 dataValues2 中最后两个有效数据点的索引
    let validIndices2 = [];
    for (let i = dataValues2.length - 1; i >= 0; i--) {
        if (dataValues2[i] !== null && typeof dataValues2[i] === 'number') {
            validIndices2.unshift(i);
            if (validIndices2.length === 2) break;
        }
    }
    // blink 条件：倒数第二个有效值为 0，最后一个有效值为 1
    const blinkCondition = validIndices2.length === 2 &&
        dataValues2[validIndices2[0]] === 0 &&
        dataValues2[validIndices2[1]] === 1;

    // Indicator 图柱子的背景色：如果处于 blink 状态，则最后两个有效柱子在深红和浅红之间交替
    const barBgColors = dataValues2.map((value, index) => {
        let color = '#d32f2f';
        if (blinkActive && validIndices2.includes(index)) {
            // 当 blinkToggle 为 true 显示浅红色，否则显示深红色
            color = blinkToggle ? '#ef5350' : '#d32f2f';
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

    // 如果 Indicator 图一直显示且满足 blink 条件，则自动触发 blink 动画
    useEffect(() => {
        if (showVolumeChartS && blinkCondition) {
            setBlinkActive(true);
            let count = 0;
            const interval = setInterval(() => {
                setBlinkToggle(prev => !prev);
                count++;
                if (count >= 10) { // 200ms 一次，共 8 次切换
                    clearInterval(interval);
                    setBlinkActive(false);
                    setBlinkToggle(false);
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [showVolumeChartS, blinkCondition]);

    // 点击仅用于切换 Indicator 图的显示
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
