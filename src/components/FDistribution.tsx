import { useEffect } from "react";
import { useDistribution } from "../app/hooks/useDistribution";
import {
    fDistributionPDF,
    getFDistribution, getHistogramData,
    numberFormat
} from "../app/utils";
import HistogramChart from "./HistogramChart";

export function FDistribution({ initFuncSteps = 0.5 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from:0,
            to:1000
        };

        const samples = getFDistribution(
            ctx.df1,
            ctx.df2,
            range,
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
            funcSteps
        );

        ctx.setHistogramData(groups);
    };

    useEffect(() => {
        ctx.setFuncSteps(initFuncSteps);
        generate(initFuncSteps);
    }, []);

    return (
        <>
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-xl-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
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
                            onChange={e =>
                                ctx.setSampleSize(parseInt(e.target.value))
                            }
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">
                            {ctx.sampleSize}
                        </label>
                    </div>
                </div>

                <div className="col-xl-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Szf<sub>1</sub>
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

                <div className="col-xl-2">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
                            Szf<sub>2</sub>
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

                <div className="col-xl-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2">
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

                <div className="col-xl-1 d-flex align-items-center justify-content-center">
                    <button
                        className="btn btn-generate btn-md"
                        onClick={() => generate()}
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