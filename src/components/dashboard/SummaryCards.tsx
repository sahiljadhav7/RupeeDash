import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useMemo } from "react";

export default function SummaryCards() {
  const transactions = useStore((s) => s.transactions);

  const { totalBalance, totalIncome, totalExpenses, savingsRate } = useMemo(() => {
    const inc = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const exp = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      totalIncome: inc,
      totalExpenses: exp,
      totalBalance: inc - exp,
      savingsRate: inc > 0 ? ((inc - exp) / inc) * 100 : 0,
    };
  }, [transactions]);

  const cards = [
    {
      label: "Total Balance",
      value: totalBalance,
      icon: Wallet,
      accent: "primary" as const,
      change: "+12.5%",
      up: true,
    },
    {
      label: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      accent: "income" as const,
      change: "+8.2%",
      up: true,
    },
    {
      label: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      accent: "expense" as const,
      change: "-3.1%",
      up: false,
    },
    {
      label: "Savings Rate",
      value: savingsRate,
      icon: ArrowUpRight,
      accent: "primary" as const,
      change: "+2.4%",
      up: true,
      isPercent: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="rounded-xl bg-card border border-border p-5 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <div className={`p-2 rounded-lg ${card.accent === "income" ? "bg-income/10" : card.accent === "expense" ? "bg-expense/10" : "bg-primary/10"}`}>
              <card.icon className={`w-4 h-4 ${card.accent === "income" ? "text-income" : card.accent === "expense" ? "text-expense" : "text-primary"}`} />
            </div>
          </div>
          <div className="font-bold text-2xl text-card-foreground font-mono">
            {card.isPercent
              ? `${card.value.toFixed(1)}%`
              : `$${card.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div className="flex items-center gap-1 mt-2">
            {card.up ? (
              <ArrowUpRight className="w-3 h-3 text-income" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-expense" />
            )}
            <span className={`text-xs font-medium ${card.up ? "text-income" : "text-expense"}`}>
              {card.change}
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
