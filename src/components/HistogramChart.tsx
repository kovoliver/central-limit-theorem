
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import { type HistogramData } from "../app/types";

export default function HistogramChart({
    data,
}: {
    data: HistogramData[];
}) {
    const maxTickCount = 25;
    const step = Math.max(1, Math.ceil(data.length / maxTickCount));

    const tickIndexes: number[] = [];

    for (let i = 0; i < data.length; i += step) {
        tickIndexes.push(i);
    }

    if (
        data.length > 0 &&
        tickIndexes[tickIndexes.length - 1] !== data.length - 1
    ) {
        tickIndexes.push(data.length - 1);
    }

    const ticks = tickIndexes.map((i) => data[i].midPoint);

    const colors = {
        grid: "#33445C",
        axis: "#A8B6C9",
        text: "#F1F5F9",
        cyan: "#38BDF8",
        green: "#7DD3C7",
        greenDark: "#367F78",
        greenHover: "#A7E8DF",
        surface: "#172337",
        border: "#4B6380",
    };
    return (
        <section className="w-100">
            <div style={{ height: 520 }}>
                <ResponsiveContainer>
                    <ComposedChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 25,
                            bottom: 35,
                            left: 20,
                        }}
                        barCategoryGap={1}
                    >
                        <CartesianGrid
                            stroke={colors.grid}
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        <XAxis
                            type="number"
                            dataKey="midPoint"
                            label={{
                                value: "Osztályközök",
                                position: "insideBottom",
                                offset: -20,
                                fill: colors.border,
                            }}
                            padding={{ left: 50, right: 0 }}
                            domain={[
                                data[0]?.midPoint ?? "auto",
                                data[data.length - 1]?.midPoint ?? "auto",
                            ]}
                            ticks={ticks}
                            tickFormatter={(value) => {
                                const item = data.find(
                                    (d) => d.midPoint === value
                                );
                                return item ? item.bin : "";
                            }}
                            tick={{ fill: colors.axis, fontSize: 12 }}
                            axisLine={{ stroke: colors.border }}
                            tickLine={{ stroke: colors.border }}
                        />

                        <YAxis
                            label={{
                                value: "Gyakoriság",
                                angle: -90,
                                position: "insideLeft",
                                fill: colors.border,
                            }}
                            domain={[0, "auto"]}
                            tick={{ fill: colors.axis, fontSize: 12 }}
                            axisLine={{ stroke: colors.border }}
                            tickLine={{ stroke: colors.border }}
                        />

                        <Tooltip
                            cursor={{
                                fill: colors.cyan,
                                fillOpacity: 0.07,
                            }}
                            contentStyle={{
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: "10px",
                                color: colors.text,
                                padding: "12px 14px",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                            }}
                            labelStyle={{
                                color: colors.text,
                                fontWeight: 600,
                                marginBottom: "6px",
                            }}
                            itemStyle={{
                                color: colors.text,
                            }}
                            labelFormatter={(_, payload) => {
                                if (payload && payload.length > 0) {
                                    const dataItem =
                                        payload[0].payload as HistogramData;

                                    return dataItem.bin
                                        ? `Osztályköz: ${dataItem.bin}`
                                        : "Origó / Lezárás";
                                }

                                return "";
                            }}
                            formatter={(value: any, name: any) => [
                                Number(value).toFixed(0),
                                name,
                            ]}
                        />

                        <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            wrapperStyle={{
                                paddingBottom: "15px",
                            }}
                            formatter={(value) => (
                                <span style={{ color: colors.border }}>
                                    {value}
                                </span>
                            )}
                        />

                        <Bar
                            dataKey="frequency"
                            name="Empirikus gyakoriság"
                            fill={colors.green}
                            fillOpacity={0.8}
                            stroke={colors.green}
                            strokeOpacity={0.9}
                            strokeWidth={0.5}
                        />
                        
                        <Line
                            type="natural"
                            dataKey="curve"
                            name="Elméleti görbe"
                            stroke={colors.cyan}
                            strokeWidth={3}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: colors.cyan,
                                stroke: colors.surface,
                                strokeWidth: 2,
                            }}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
