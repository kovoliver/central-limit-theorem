import { useEffect, useState } from "react";
import { 
    generateRandNumbers, getHistogramData, 
    getSamples, calcStd, 
    calcSampleStd, numberFormat,
    normalDistribution,
} from "../app/utils";
import type { HistogramData, NumberRange } from "../app/types";
import HistogramChart from "../components/HistogramChart";

export function CentralLimitTheorem() {
    const [histogramData, setHistogramData] = useState<HistogramData[]>([]);
    const [sampleCount, setSampleCount] = useState<number>(10_000);
    const [sampleSize, setSampleSize] = useState<number>(3);
    const [range, setRange] = useState<NumberRange>({
        from: 0,
        to: 100
    });

    const generate = () => {
        const randNumbers = generateRandNumbers(range.from, range.to, 1_000_000);
        const samples = getSamples(randNumbers, sampleSize, sampleCount);
        const std = calcStd(randNumbers);
        const sampleStd = calcSampleStd(std, sampleSize);
        const mean = (range.from + range.to)/2;
        const densityFunction = (x:number)=>normalDistribution(x, mean, sampleStd);
        const groups = getHistogramData(samples, range, densityFunction);
        setHistogramData(groups);
    };

    const setRangeSecure = (key: keyof NumberRange, value: number) => {
        const r = { ...range };

        if (!Number.isFinite(value)
            || value < 0
            || key === "from" && value >= r.to
            || value > 1000) {
            return r;
        }

        r[key] = value;
        setRange(r);
    };

    useEffect(() => {
        generate();
    }, []);

    return (
        <div className="container-lg text-center">
            <div className="border border-dark bg-dark p-2 row m-0 text-light">
                <div className="col-md-4">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">Mintavételek száma</label>

                        <input
                            type="range"
                            step={1_000}
                            value={sampleCount}
                            max={100_000}
                            min={1_000}
                            onChange={e => setSampleCount(parseInt(e.target.value))}
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">{numberFormat(sampleCount/1000)}e</label>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">Minta méret</label>

                        <input
                            type="range"
                            step={1}
                            min={2}
                            max={10}
                            value={sampleSize}
                            onChange={e => setSampleSize(parseInt(e.target.value))}
                            className="w-75 custom-range"
                        />

                        <label className="mx-2">{sampleSize} db.</label>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group p-3">
                        <label className="d-block mb-2 fw-bold">Mintaértékek</label>

                        <div className="row">
                            <div className="col-6 d-flex align-items-center">
                                <label className="me-2">Tól:</label>

                                <input
                                    type="number"
                                    value={range.from}
                                    min={0}
                                    max={900}
                                    onChange={e => setRangeSecure("from", parseInt(e.target.value))}
                                    className="form-control form-control-sm"
                                />
                            </div>

                            <div className="col-6 d-flex align-items-center">
                                <label className="me-2">Ig:</label>

                                <input
                                    type="number"
                                    value={range.to}
                                    min={100}
                                    max={1_000}
                                    onChange={e => setRangeSecure("to", parseInt(e.target.value))}
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

            <div style={{marginTop:"-1px"}} className="w-100 bg-light border">
                <HistogramChart
                    data={histogramData}
                />
            </div>
        </div>
    );
}