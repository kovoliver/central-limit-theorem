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
import { BlockMath } from "react-katex";

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
            <div className="bg-light border-light p-3 text-left text-secondary-darker">
                <h1>Centrális határeloszlás-tétel</h1>

                <p>
                    A <b>centrális határeloszlás-tétel</b> a statisztika egyik legfontosabb alaptétele.
                    Kimondja, hogy megfelelő feltételek mellett, független, azonos eloszlású mintavétel esetén,
                    a minták átlagainak eloszlása kellően nagy mintanagyság esetén a <b>normális eloszláshoz</b> közelít,
                    függetlenül az alapsokaság eredeti eloszlásától.
                </p>

                <p>
                    Érdemes megvizsgálni a fenti fogalmakat, hogy jobban értsd a tételt.
                </p>

                <h2>Alapfogalmak</h2>
                <h3>Független, azonos eloszlású mintavétel</h3>
                <p>
                    A független azonos eloszlású (FAE) mintavétel egy statisztikai eljárás, 
                    amely során a mintaelemek valószínűségi változói függetlenek egymástól 
                    és azonos eloszlást követnek.
                </p>

                <h3>Mi az a valószínűségi változó?</h3>
                <p>
                    <p>
                        A <strong>valószínűségi változó</strong> egy véletlen kísérlet
                        kimeneteléhez rendelt számszerű érték, amely lehet diszkrét
                        vagy folytonos.
                    </p>

                    <ul>
                        <li>
                            <strong>Diszkrét:</strong> egy szabályos kockával dobott
                            szám (1-6).
                        </li>
                        <li>
                            <strong>Folytonos:</strong> egy véletlenszerűen kiválasztott,
                            utcán szembejövő ember testmagassága.
                        </li>
                    </ul>
                </p>

                <h3>Mi az az sűrűségfüggvény?</h3>
                <p>
                    A sűrűségfüggvény megmutatja, hogy a megfigyelések hogyan koncentrálódnak az egyes értékek környezetében.
                    Egy adott intervallumhoz tartozó görbe alatti terület az adott intervallumba eső megfigyelések tömegét szemlélteti.
                </p>

                <h3>Mi az az eloszlásfüggvény?</h3>
                <p>
                    Az eloszlásfüggvény a sűrűségfüggvény integráltja, amelynek segítségével meghatározhatjuk,
                    hogy egy adott intervallumba tartozás mekkora valószínűséggel következik be.
                    Például a testmagasság esetében megadhatjuk annak valószínűségét, hogy egy véletlenszerűen
                    kiválasztott személy magassága 170 és 175 cm közé essen.
                </p>

                <h3>Normális eloszlás</h3>

                <p>
                    A normális eloszlás egy folytonos valószínűségi eloszlás,
                    amelynek sűrűségfüggvényét az alábbi matematikai képlet írja le:
                </p>

                <BlockMath math="f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}" />

                <p>
                    A képletben:
                </p>

                <ul>
                    <li>
                        <strong>σ:</strong> az eloszlás szórása.
                    </li>
                    <li>
                        <strong>μ:</strong> az eloszlás várható értéke (átlaga).
                    </li>
                    <li>
                        <strong>x:</strong> a vizsgált érték, amelyhez a sűrűségfüggvény értékét meghatározzuk.
                    </li>
                </ul>


                <h3>Standard hiba</h3>

                <p>
                    Ha egy alapsokaságból azonos elemszámú, független mintákat veszünk,
                    akkor az egyes minták átlaga nem feltétlenül fog megegyezni
                    az alapsokaság átlagával. A különböző minták átlagai közötti
                    ingadozás mértéke azonban egy egyszerű képlettel kiszámítható.
                    Ezt nevezzük <b>standard hibának</b>, amelynek képlete:
                </p>

                <p>
                    <BlockMath math="\text{SE} = \frac{\sigma}{\sqrt{n}}" />
                </p>

                <p>
                    Ahol:
                </p>

                <ul>
                    <li>
                        <strong>σ:</strong> az alapsokaság szórása.
                    </li>
                    <li>
                        <strong>n:</strong> a minta elemszáma.
                    </li>
                </ul>

                <h2>A lenti program működése</h2>
                <p>
                    Ahhoz, hogy jobban megértsd a lenti program működését és ezáltal a centrális határeloszlás-tételt
                    is, bemutatom működését.
                    <ol>
                        <li>
                            A program egymillió véletlenszámot generál egy adott intervallumban. 
                            Ezek az értékek egyenletes eloszlást követnek, vagyis az intervallumon 
                            belül a sűrűség mindenütt azonos.
                        </li>

                        <li>
                            A program <b>k</b>-elemű mintákat vesz a véletlenszámokból és kiszámolja ezen minták átlagát.
                        </li>

                        <li>
                            A program megszámolja, hogy az egyes osztályközökbe hány érték tartozik.
                        </li>

                        <li>
                            A szoftver az osztályközök középpontjainál kiszámítja az elméleti normáleloszlás 
                            sűrűségfüggvényének értékét is. Így összehasonlíthatóvá válik az empirikus 
                            eloszlás és az elméleti normáleloszlás, amelyhez a minták átlagai a centrális 
                            határeloszlás-tétel értelmében közelítenek.
                        </li>
                    </ol>
                </p>

                <h3>A paraméterek</h3>
                <ul>
                    <li>
                        <b>Mintavételek száma:</b> hány mintavételt hajtson végre a program a generált véletlenszámokból.
                    </li>
                    <li>
                        <b>Minta elemszáma:</b> hány elemű mintákat képezzel a szoftver.
                    </li>
                    <li>
                        <b>Osztályköz mérete:</b> az intervallum, amelyben összeszámolja a minták átlagainak gyakoriságát a program.
                    </li>
                    <li>
                        <b>Mintaérték:</b> milyen intervallumban generáljon véletlenszámokat a szoftver.
                    </li>
                </ul>

                <div className="alert alert-info bg-opacity-10 border-start border-4 mb-3">
                    <p className="fw-bold mb-2">
                        <i className="bi bi-lightbulb me-2"></i>
                        Tipp
                    </p>
                    <p className="mb-0">
                        Vedd le ezerre a mintavételek számát, és egyre az
                        osztályközök méretét! Ilyenkor, mivel csak 1000 mintát
                        vettünk, az empirikus gyakoriságok sokkal kevésbé fognak
                        igazodni az elméleti sűrűségfüggvényhez. Ha ezt követően
                        felveszed százezerre a mintavételek számát, a nagyobb
                        mintavétel segít az empirikus gyakoriságnak jobban
                        idomulni az elméleti függvény értékeihez.
                    </p>
                </div>
            </div>

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

                <div className="col-xl-2 col-md-6">
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

                <div className="col-xl-3 col-md-6">
                    <div className="form-group px-1 py-3">
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

                <div className="col-xl-1 col-md-12 d-flex align-items-center justify-content-center">
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