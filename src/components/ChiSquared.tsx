import { chiSquarePDF, getChiSquared, getHistogramData, numberFormat } from "../app/utils";
import { useDistribution } from "../app/hooks/useDistribution";
import HistogramChart from "../components/HistogramChart";
import { useEffect } from "react";

export function ChiSquared({initFuncSteps = 1}:{initFuncSteps:number}) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from:0,
            to:1000
        };

        const samples = getChiSquared(
            ctx.df1, range,
            ctx.sampleSize, ctx.sampleCount
        );

        const densityFunction = (x: number) => {
            return chiSquarePDF(x, ctx.df1);
        };

        const groups = getHistogramData(samples, ctx.range, densityFunction, funcSteps);
        ctx.setHistogramData(groups);
    };

    useEffect(() => {
        ctx.setFuncSteps(initFuncSteps);
        generate(initFuncSteps);
    }, []);

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
                            Osztályköz mérete
                        </label>

                        <input
                            type="range"
                            step={0.05}
                            min={0.05}
                            max={5}
                            value={ctx.funcSteps}
                            onChange={e =>
                                ctx.setFuncSteps(parseFloat(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.funcSteps.toFixed(2)}
                        </label>
                    </div>
                </div>

                <div className="col-md-2 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={()=>generate()}
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