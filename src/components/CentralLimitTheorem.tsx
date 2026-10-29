import { useEffect } from "react";

import {
    generateRandNumbers,
    getHistogramData,
    getNormalDist,
    calcStd,
    calcSampleStd,
    numberFormat,
    normalDistribution,
} from "../app/utils";

import type { NumberRange } from "../app/types";
import { useDistribution } from "../app/hooks/useDistribution";
import HistogramChart from "../components/HistogramChart";
import { SecureNumberInput } from "./SecureNumberInput";

export function CentralLimitTheorem({ initFuncSteps = 1 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const randNumbers = generateRandNumbers(
            ctx.range.from,
            ctx.range.to,
            1_000_000
        );

        const samples = getNormalDist(
            randNumbers,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const std = calcStd(randNumbers);
        const sampleStd = calcSampleStd(std, ctx.sampleSize);
        const mean = (ctx.range.from + ctx.range.to) / 2;

        const densityFunction = (x: number) =>
            normalDistribution(x, mean, sampleStd);

        const groups = getHistogramData(
            samples,
            ctx.range,
            densityFunction,
            funcSteps
        );

        ctx.setHistogramData(groups);
    };

    const setRangeSecure = (
        key: keyof NumberRange,
        value: number
    ) => {
        if (isNaN(value)) return;

        const nextRange = {
            ...ctx.range,
            [key]: value
        };

        if (nextRange.from >= nextRange.to) {
            nextRange.from = 0;
            nextRange.to = 100;
        }

        ctx.setRange(nextRange);
    };

    useEffect(() => {
        ctx.setFuncSteps(initFuncSteps);
        generate(initFuncSteps);
    }, []);

    return (
        <>
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-xl-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Mintavételek száma
                        </label>

                        <input
                            type="range"
                            step={1000}
                            value={ctx.sampleCount}
                            max={100_000}
                            min={1000}
                            onChange={(e) =>
                                ctx.setSampleCount(
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {numberFormat(ctx.sampleCount / 1000)}e
                        </label>
                    </div>
                </div>

                <div className="col-xl-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Minta elemszáma
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={2}
                            max={10}
                            value={ctx.sampleSize}
                            onChange={(e) =>
                                ctx.setSampleSize(
                                    parseInt(e.target.value)
                                )
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.sampleSize}
                        </label>
                    </div>
                </div>

                <div className="col-xl-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Osztályköz mérete
                        </label>

                        <input
                            type="range"
                            min={0}
                            max={2}
                            step={1}
                            value={[1, 5, 10].indexOf(ctx.funcSteps)}
                            onChange={e => {
                                const values = [1, 5, 10];
                                ctx.setFuncSteps(values[parseInt(e.target.value, 10)]);
                            }}
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.funcSteps}
                        </label>
                    </div>
                </div>

                <div className="col-xl-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Mintaértékek (tól-ig)
                        </label>

                        <div className="row">
                            <div className="col-6 d-flex align-items-center">

                                <SecureNumberInput
                                    value={ctx.range.from}
                                    onChange={(val) => setRangeSecure("from", val)}
                                    defaultValue={0}
                                    min={-1000}
                                    max={900}
                                />
                            </div>

                            <div className="col-6 d-flex align-items-center">
                                <SecureNumberInput
                                    value={ctx.range.to}
                                    onChange={(val) => setRangeSecure("to", val)}
                                    defaultValue={100}
                                    min={-9000}
                                    max={1000}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-1 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-generate btn-md"
                        onClick={() => generate()}
                    >
                        Generálás
                    </button>
                </div>
            </div>

            <div
                style={{ marginTop: "-1px" }}
                className="w-100 bg-light border"
            >
                <HistogramChart data={ctx.histogramData} />
            </div>
        </>
    );
}