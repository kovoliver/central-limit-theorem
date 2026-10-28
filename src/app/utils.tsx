import type { HistogramData, NumberRange } from "./types";

export const rand = (
    from: number,
    to: number
): number => {
    if (from > to) {
        throw new Error(
            '"from" parameter cannot be greater than "to".'
        );
    }

    return Math.floor(Math.random() * ((to - from) + 1)) + from;
};

export function generateRandNumbers(
    from: number,
    to: number,
    count: number
): number[] {
    if (count <= 0) {
        throw new Error(
            "'Count' parameter must be greater, than zero!"
        );
    }

    if (!Number.isInteger(count)) {
        throw new Error(
            "'Count' parameter must be a positive integer!"
        );
    }

    const numbers = [];

    for (let i = 0; i < count; i++) {
        numbers.push(rand(from, to));
    }

    return numbers;
}

export function getSamples(
    numbers: number[],
    sampleCount: number
) {
    if (numbers.length === 0) {
        throw new Error(
            "'Numbers' parameter cannot be empty!"
        );
    }

    if (numbers.length < sampleCount) {
        throw new Error(
            "'Sample size' parameter cannot be greater than the population size!"
        );
    }

    const samples = [];

    for (let i = 0; i < numbers.length; i++) {
        const sample = [];

        for (let j = 0; j < sampleCount; j++) {
            const randNumber = numbers[rand(0, numbers.length - 1)];
            sample.push(randNumber);
        }

        samples.push(sample);
    }

    return samples;
}

export function roundRange(value: number, range: number) {
    return Math.round(value / range) * range;
}

export function normalDistribution(
    x: number,
    mean: number,
    standardDeviation: number
): number {
    if (standardDeviation <= 0) {
        throw new Error("Standard deviation must be greater than zero.");
    }

    const exponent = -Math.pow(x - mean, 2) /
        (2 * Math.pow(standardDeviation, 2));

    return (
        1 / (standardDeviation * Math.sqrt(2 * Math.PI))
    ) * Math.exp(exponent);
}

export function calcMean(values: number[]) {
    const mean = values.reduce((total, val) => total + val, 0) / values.length;
    return mean;
}

export function calcStd(values: number[]) {
    const avg = calcMean(values);
    return Math.sqrt(values.reduce((total, val) => total + (val - avg) ** 2, 0) / values.length);
}

export function calcSampleStd(
    std: number,
    sampleCount: number
): number {
    return std / Math.sqrt(sampleCount);
}

export function getHistogramData(
    samples: number[][],
    mean: number,
    std: number,
    range: NumberRange,
    interval: number = 5,
): HistogramData[] {
    const avgGroups: HistogramData[] = [];

    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        let avg = roundRange(calcMean(sample), interval);
        const index = avgGroups.findIndex(data => data.midPoint === avg);

        if (index === -1) {
            const normalDistVal = normalDistribution(avg + interval / 2, mean, std) * samples.length * interval;

            avgGroups.push({
                bin: `${avg}-${avg + interval}`,
                midPoint: avg,
                frequency: 1,
                curve: normalDistVal
            });
        } else {
            const element = avgGroups[index];

            avgGroups[index].frequency = element.frequency + 1;
            avgGroups[index].bin = `${avg}-${avg + interval}`;
        }
    }

    const midPointIndex = avgGroups.findIndex(g => g.midPoint === 0);
    const zeroMidPoint = {
        bin: `${range.from}-${range.from + interval}`,
        midPoint: range.from,
        frequency: 0,
        curve: normalDistribution(0, mean, std) * samples.length * interval
    };

    if (midPointIndex !== -1) {
        avgGroups[midPointIndex] = zeroMidPoint;
    } else {
        avgGroups.push(zeroMidPoint);
    }

    avgGroups.push({
        bin: "",
        midPoint: range.to,
        frequency: 0,
        curve: normalDistribution(0, mean, std) * samples.length * interval
    });

    const orderedGroups = avgGroups.filter(g => g.midPoint !== range.to)
        .sort((a, b) => a.midPoint - b.midPoint);
    return orderedGroups;
}