import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import type { EmotionalEntry } from "@/data/emotionalData";

const chartConfig: ChartConfig = {
  score: {
    label: "Emotional Stability",
    color: "hsl(145, 30%, 55%)",
  },
};

interface Props {
  data: EmotionalEntry[];
  onDayClick: (entry: EmotionalEntry) => void;
  selectedDay: EmotionalEntry | null;
}

const EmotionalChart = ({ data, onDayClick, selectedDay }: Props) => {
  const handleDotClick = (dotData: any) => {
    if (dotData?.payload) {
      onDayClick(dotData.payload);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Stability Over Time</CardTitle>
        <p className="text-xs text-muted-foreground">↑ Stable / Calm</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(80, 15%, 88%)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(150, 8%, 50%)" />
            <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} stroke="hsl(150, 8%, 50%)" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine y={70} stroke="hsl(145, 20%, 80%)" strokeDasharray="5 5" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(145, 30%, 55%)"
              strokeWidth={2}
              dot={(props: any) => {
                const isSelected = selectedDay?.date === props.payload?.date;
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={isSelected ? 6 : 3}
                    fill={isSelected ? "hsl(145, 30%, 45%)" : "hsl(145, 30%, 55%)"}
                    stroke="hsl(80, 25%, 97%)"
                    strokeWidth={isSelected ? 2 : 1}
                    cursor="pointer"
                    onClick={() => handleDotClick(props)}
                  />
                );
              }}
              activeDot={{
                r: 6,
                fill: "hsl(145, 30%, 55%)",
                stroke: "hsl(80, 25%, 97%)",
                strokeWidth: 2,
                cursor: "pointer",
                onClick: (_: any, payload: any) => handleDotClick(payload),
              }}
            />
          </LineChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground text-right mt-1">↓ Stressed / Unstable</p>
      </CardContent>
    </Card>
  );
};

export default EmotionalChart;
