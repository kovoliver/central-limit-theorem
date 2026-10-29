import { useEffect } from "react";
import { useDistribution } from "../app/hooks/useDistribution";
import type { NumberRange } from "../app/types";
import {
    fDistributionPDF,
    getFDistribution, getHistogramData,
    numberFormat
} from "../app/utils";
import HistogramChart from "./HistogramChart";

export function FDistribution() {
    const ctx = useDistribution();

    const generate = () => {
        const samples = getFDistribution(
            ctx.df1,
            ctx.df2,
            ctx.range,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const displayLimit = 10;

        const visibleSamples = samples.filter(
            x => x >= -displayLimit && x <= displayLimit
        );

        const densityFunction = (x: number) => {
            return fDistributionPDF(x, ctx.df1, ctx.df2);
        };

        const groups = getHistogramData(
            visibleSamples,
            { from: -displayLimit, to: displayLimit },
            densityFunction,
            0.05
        );

        ctx.setHistogramData(groups);
    };

    const setRangeSecure = (key: keyof NumberRange, value: number) => {
        const r = { ...ctx.range };

        if (!Number.isFinite(value)
            || value < 0
            || key === "from" && value >= r.to
            || value > 1000) {
            return r;
        }

        r[key] = value;
        ctx.setRange(r);
    };

    useEffect(() => {
        generate();
    }, []);

    return (
        <>
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-md-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
                            Mintavételek száma
                        </label>

                        <input
                            type="range"
                            step={1_000}
                            value={ctx.sampleCount}
                            max={100_000}
                            min={1_000}
                            onChange={e =>
                                ctx.setSampleCount(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {numberFormat(ctx.sampleCount / 1000)}e
                        </label>
                    </div>
                </div>

                <div className="col-md-2">
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
                            onChange={e =>
                                ctx.setSampleSize(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.sampleSize} db.
                        </label>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
                            Szabadságfok (df₁)
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={1}
                            max={30}
                            value={ctx.df1}
                            onChange={e =>
                                ctx.setDf1(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.df1}
                        </label>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">
                            Szabadságfok (df₂)
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={1}
                            max={30}
                            value={ctx.df2}
                            onChange={e =>
                                ctx.setDf2(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.df2}
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
                                    onChange={e =>
                                        setRangeSecure("from", parseInt(e.target.value))
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
                                    max={1_000}
                                    onChange={e =>
                                        setRangeSecure("to", parseInt(e.target.value))
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

            <div style={{ marginTop: "-1px" }} className="w-100 bg-light border">
                <HistogramChart
                    data={ctx.histogramData}
                />
            </div>
        </>
    );
}