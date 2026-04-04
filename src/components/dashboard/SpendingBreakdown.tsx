import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

const COLORS = [
  "hsl(153, 60%, 40%)",
  "hsl(200, 80%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(35, 90%, 55%)",
  "hsl(340, 70%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(60, 70%, 50%)",
  "hsl(220, 60%, 50%)",
];

export default function SpendingBreakdown() {
  const transactions = useStore((s) => s.transactions);

  const data = useMemo(() => {
    const cats: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        cats[t.category] = (cats[t.category] || 0) + t.amount;
      });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 flex items-center justify-center h-80">
        <p className="text-muted-foreground">No expenses to display</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <h3 className="text-sm font-semibold text-card-foreground mb-1">Spending Breakdown</h3>
      <p className="text-xs text-muted-foreground mb-4">Expenses by category</p>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 20%, 10%)",
                border: "none",
                borderRadius: "8px",
                color: "hsl(220, 15%, 90%)",
                fontSize: 12,
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2 w-full">
          {data.map((d, i) => (
            <div key={d.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-sm text-card-foreground flex-1">{d.name}</span>
              <span className="text-sm font-mono font-medium text-card-foreground">${d.value.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground w-10 text-right">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
