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

export function CentralLimitTheorem() {
    const ctx = useDistribution();

    const generate = () => {
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
            densityFunction
        );

        ctx.setHistogramData(groups);
    };

    const setRangeSecure = (
        key: keyof NumberRange,
        value: number
    ) => {
        const range = { ...ctx.range };

        if (
            !Number.isFinite(value) ||
            value < 0 ||
            (key === "from" && value >= range.to) ||
            value > 1000
        ) {
            return;
        }

        range[key] = value;
        ctx.setRange(range);
    };

    useEffect(() => {
        generate();
    }, []);

    return (
        <div className="container-lg text-center">
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-md-4">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
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

                <div className="col-md-4">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
                            Minta méret
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
                            {ctx.sampleSize} db.
                        </label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
                            Mintaértékek
                        </label>

                        <div className="row">
                            <div className="col-6 d-flex align-items-center">
                                <label className="me-2">Tól:</label>

                                <input
                                    type="number"
                                    value={ctx.range.from}
                                    min={0}
                                    max={900}
                                    onChange={(e) =>
                                        setRangeSecure(
                                            "from",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="col-6 d-flex align-items-center">
                                <label className="me-2">Ig:</label>

                                <input
                                    type="number"
                                    value={ctx.range.to}
                                    min={100}
                                    max={1000}
                                    onChange={(e) =>
                                        setRangeSecure(
                                            "to",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className="form-control form-control-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-1 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={generate}
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
        </div>
    );
}