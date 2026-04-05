import { useMemo } from "react";
import {
  Activity,
  ArrowRightLeft,
  Clock3,
  Receipt,
} from "lucide-react";

import Header from "@/components/dashboard/Header";
import MetricCard from "@/components/dashboard/MetricCard";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  formatDisplayDate,
  getExpenseBreakdown,
  getRecentTransactions,
  getSummaryMetrics,
} from "@/lib/finance";
import { useFilteredTransactions } from "@/store/useStore";

export default function Transactions() {
  const filteredTransactions = useFilteredTransactions();

  const summary = useMemo(() => getSummaryMetrics(filteredTransactions), [filteredTransactions]);
  const categoryBreakdown = useMemo(
    () => getExpenseBreakdown(filteredTransactions).slice(0, 5),
    [filteredTransactions],
  );
  const recentTransactions = useMemo(
    () => getRecentTransactions(filteredTransactions, 6),
    [filteredTransactions],
  );

  const largestExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort((left, right) => right.amount - left.amount)[0];

  const latestTransaction = recentTransactions[0];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header
          title="Transactions"
          eyebrow="Detailed Activity"
          description="Inspect the records behind every balance change, with supporting context that makes the table easier to reason about."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Receipt}
            label="Records in View"
            value={summary.transactionCount.toString()}
            description="This count tracks the same dataset currently shown in the transactions table."
            tone="neutral"
          />
          <MetricCard
            icon={ArrowRightLeft}
            label="Net Movement"
            value={formatCurrency(summary.totalBalance)}
            description={`${formatCurrency(summary.totalIncome)} in income against ${formatCurrency(summary.totalExpenses)} in expenses.`}
            tone={summary.totalBalance >= 0 ? "income" : "expense"}
          />
          <MetricCard
            icon={Activity}
            label="Largest Expense"
            value={largestExpense ? formatCurrency(largestExpense.amount) : formatCurrency(0)}
            description={largestExpense ? largestExpense.description : "No expense transaction is currently in view."}
            tone="expense"
          />
          <MetricCard
            icon={Clock3}
            label="Latest Activity"
            value={latestTransaction ? formatDisplayDate(latestTransaction.date, { month: "short", day: "numeric" }) : "No activity"}
            description={latestTransaction ? latestTransaction.description : "Recent activity will show here once transactions are available."}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <Card className="border-border/80 bg-card/90 xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity Feed</CardTitle>
              <CardDescription>The latest entries in the current filtered set.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions match the current filters.</p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category} - {formatDisplayDate(transaction.date)}
                      </p>
                    </div>
                    <span className={transaction.type === "income" ? "text-income" : "text-expense"}>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/90 xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Expense Hotspots</CardTitle>
              <CardDescription>Where the current transaction view is spending the most money.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No expense categories match the current filters. Try clearing the filters in the table below.
                </p>
              ) : (
                categoryBreakdown.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.count} transactions - Avg {formatCurrency(category.average)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">{formatCurrency(category.value)}</p>
                        <p className="text-xs text-muted-foreground">{category.percentage.toFixed(0)}% share</p>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <TransactionsTable />
      </div>
    </div>
  );
}
