import { chiSquarePDF, getChiSquared, getHistogramData, numberFormat } from "../app/utils";
import { useDistribution } from "../app/hooks/useDistribution";
import type { NumberRange } from "../app/types";
import HistogramChart from "../components/HistogramChart";
import { useEffect } from "react";

export function ChiSquared() {
    const ctx = useDistribution();

    const generate = () => {
        const samples = getChiSquared(
            ctx.df1, ctx?.range,
            ctx.sampleSize, ctx.sampleCount
        );

        const densityFunction = (x: number) => {
            return chiSquarePDF(x, ctx.df1);
        };

        const groups = getHistogramData(samples, ctx.range, densityFunction, 1);
        ctx.setHistogramData(groups);
    };

    useEffect(() => {
        generate();
    }, []);

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

    return (
        <>
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-md-3">
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
                            Szabadságfok
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

                <div className="col-md-2 d-flex align-items-center justify-content-center">
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