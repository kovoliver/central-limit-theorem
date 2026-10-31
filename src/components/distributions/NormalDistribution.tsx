import { useEffect } from "react";
import {
    generateRandNumbers,
    getHistogramData,
    numberFormat,
    normalDistribution,
    getStandardNormalDist,
} from "../../app/shared/utils";
import { useDistribution } from "../../app/hooks/useDistribution";
import HistogramChart from "../charts/HistogramChart";

export function NormalDistribution({ initFuncSteps = 0.1 }: { initFuncSteps: number }) {
    const ctx = useDistribution();

    const generate = (funcSteps = ctx.funcSteps) => {
        const range = {
            from: 0,
            to: 1000
        };

        const randNumbers = generateRandNumbers(
            range.from,
            range.to,
            1_000_000
        );

        const samples = getStandardNormalDist(
            randNumbers,
            ctx.sampleSize,
            ctx.sampleCount
        );

        const densityFunction = (x: number) =>
            normalDistribution(x, 0, 1);

        const groups = getHistogramData(
            samples,
            ctx.range,
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
            <div className="border border-dark bg-dark p-2 row m-0 text-light text-center">
                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
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

                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
                        <label className="d-block mb-2">
                            Minta elemszáma
                        </label>

                        <input
                            type="range"
                            step={1}
                            min={2}
                            max={20}
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

                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
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

                <div className="col-xl-3 col-md-6 d-flex align-items-center justify-content-center">
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