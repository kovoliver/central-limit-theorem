import { useDistribution } from "../../app/hooks/useDistribution";
import { numberFormat } from "../../app/utils";

export default function DistributionForm({generate}:{generate:(initFuncSteps?:number)=>void}) {
    const ctx = useDistribution();

    return (
        <div className="border border-dark bg-dark p-2 row m-0 text-light">
            <div className="col-xl-3">
                <div className="form-group px-1 py-3">
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
                <div className="form-group px-1 py-3">
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
                <div className="form-group px-1 py-3">
                    <label className="d-block mb-2">
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

            <div className="col-xl-3">
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

            <div className="col-xl-2 d-flex align-items-center justify-content-center">
                <button
                    className="btn btn-generate btn-md"
                    onClick={() => generate()}
                >
                    Generálás
                </button>
            </div>
        </div>
    );
}