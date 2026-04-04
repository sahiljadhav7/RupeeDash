import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function BalanceTrendChart() {
  const transactions = useStore((s) => s.transactions);

  const data = useMemo(() => {
    const monthly: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const month = t.date.slice(0, 7);
      if (!monthly[month]) monthly[month] = { income: 0, expense: 0 };
      if (t.type === "income") monthly[month].income += t.amount;
      else monthly[month].expense += t.amount;
    });

    let balance = 0;
    return Object.keys(monthly)
      .sort()
      .map((month) => {
        balance += monthly[month].income - monthly[month].expense;
        const label = new Date(month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        return { month: label, income: monthly[month].income, expenses: monthly[month].expense, balance };
      });
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6 flex items-center justify-center h-80">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <h3 className="text-sm font-semibold text-card-foreground mb-1">Balance Trend</h3>
      <p className="text-xs text-muted-foreground mb-4">Monthly income, expenses & running balance</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(153, 60%, 40%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(153, 60%, 40%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" strokeOpacity={0.4} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
          <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
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
          <Area type="monotone" dataKey="income" stroke="hsl(153, 60%, 40%)" fill="url(#incomeGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="expenses" stroke="hsl(0, 72%, 51%)" fill="url(#expenseGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
