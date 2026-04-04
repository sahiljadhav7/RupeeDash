import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Target, BarChart3 } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function InsightsPanel() {
  const transactions = useStore((s) => s.transactions);

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    // Highest spending category
    const catTotals: Record<string, number> = {};
    expenses.forEach((t) => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
    const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

    // Monthly comparison
    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      if (t.type === "income") months[m].income += t.amount;
      else months[m].expense += t.amount;
    });
    const sortedMonths = Object.keys(months).sort();
    const currentMonth = sortedMonths[sortedMonths.length - 1];
    const prevMonth = sortedMonths[sortedMonths.length - 2];
    const expenseChange = prevMonth && months[currentMonth] && months[prevMonth]
      ? ((months[currentMonth].expense - months[prevMonth].expense) / months[prevMonth].expense) * 100
      : 0;

    // Average transaction
    const avgExpense = expenses.length > 0 ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length : 0;

    // Largest single transaction
    const largest = expenses.sort((a, b) => b.amount - a.amount)[0];

    return [
      {
        icon: AlertTriangle,
        title: "Top Spending Category",
        value: topCategory ? `${topCategory[0]}: $${topCategory[1].toLocaleString()}` : "No data",
        description: topCategory ? `${((topCategory[1] / expenses.reduce((s, t) => s + t.amount, 0)) * 100).toFixed(0)}% of total expenses` : "",
        color: "text-chart-4",
        bg: "bg-chart-4/10",
      },
      {
        icon: BarChart3,
        title: "Monthly Expense Trend",
        value: `${expenseChange > 0 ? "+" : ""}${expenseChange.toFixed(1)}%`,
        description: expenseChange > 0 ? "Spending increased vs last month" : "Spending decreased vs last month",
        color: expenseChange > 0 ? "text-expense" : "text-income",
        bg: expenseChange > 0 ? "bg-expense/10" : "bg-income/10",
      },
      {
        icon: Target,
        title: "Average Expense",
        value: `$${avgExpense.toFixed(2)}`,
        description: `Across ${expenses.length} transactions`,
        color: "text-chart-2",
        bg: "bg-chart-2/10",
      },
      {
        icon: TrendingUp,
        title: "Income Sources",
        value: `${incomes.length} transactions`,
        description: `Total: $${incomes.reduce((s, t) => s + t.amount, 0).toLocaleString()}`,
        color: "text-income",
        bg: "bg-income/10",
      },
    ];
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="rounded-xl bg-card border border-border p-6"
    >
      <h3 className="text-sm font-semibold text-card-foreground mb-1">Insights</h3>
      <p className="text-xs text-muted-foreground mb-4">Key observations from your financial data</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((insight, i) => (
          <motion.div
            key={insight.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            className="flex gap-3 p-3 rounded-lg bg-muted/50"
          >
            <div className={`p-2 rounded-lg ${insight.bg} self-start`}>
              <insight.icon className={`w-4 h-4 ${insight.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{insight.title}</p>
              <p className="text-sm font-semibold text-card-foreground">{insight.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
