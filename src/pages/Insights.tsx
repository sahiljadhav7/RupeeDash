import { useMemo } from "react";
import {
  AlertTriangle,
  Landmark,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";

import Header from "@/components/dashboard/Header";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import MetricCard from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  getExpenseBreakdown,
  getInsightSnapshot,
  getMonthlyCashFlow,
  getSummaryMetrics,
} from "@/lib/finance";
import { useStore } from "@/store/useStore";

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const summary = useMemo(() => getSummaryMetrics(transactions), [transactions]);
  const monthly = useMemo(() => getMonthlyCashFlow(transactions), [transactions]);
  const breakdown = useMemo(() => getExpenseBreakdown(transactions), [transactions]);
  const insightSnapshot = useMemo(() => getInsightSnapshot(transactions), [transactions]);

  const strongestMonthValue = insightSnapshot.strongestMonth
    ? `${insightSnapshot.strongestMonth.label} - ${formatCurrency(insightSnapshot.strongestMonth.net)}`
    : "Not enough data";

  const recommendations = [
    summary.savingsRate >= 20
      ? `Savings are healthy at ${summary.savingsRate.toFixed(1)}%, which suggests your income is outpacing expenses with room to reinvest.`
      : `Savings are at ${summary.savingsRate.toFixed(1)}%, so trimming one or two non-essential categories would create more breathing room.`,
    insightSnapshot.topCategory
      ? `${insightSnapshot.topCategory.name} accounts for ${insightSnapshot.topCategory.percentage.toFixed(0)}% of spend, making it the first place to watch for budget drift.`
      : "There is not enough expense data yet to identify a dominant spending category.",
    insightSnapshot.expenseChange > 0
      ? `Expenses are up ${insightSnapshot.expenseChange.toFixed(1)}% versus the previous month, so keeping an eye on recurring charges would help.`
      : `Expenses are stable or down compared with the previous month, which is a solid signal that spending is under control.`,
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header
          title="Insights"
          eyebrow="Analysis Hub"
          description="Explore category concentration, month-over-month change, and the strongest signals hidden inside your cash flow history."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Radar}
            label="Spending Concentration"
            value={insightSnapshot.topCategory ? `${insightSnapshot.topCategory.percentage.toFixed(0)}%` : "0%"}
            description={insightSnapshot.topCategory
              ? `${insightSnapshot.topCategory.name} is your largest expense category at ${formatCurrency(insightSnapshot.topCategory.value)}.`
              : "Add more expense activity to surface category concentration."}
          />
          <MetricCard
            icon={AlertTriangle}
            label="Monthly Expense Shift"
            value={`${insightSnapshot.expenseChange > 0 ? "+" : ""}${insightSnapshot.expenseChange.toFixed(1)}%`}
            description={insightSnapshot.previousMonth
              ? `Compared with ${insightSnapshot.previousMonth.label}, the latest month shows how quickly spending momentum is moving.`
              : "At least two months of transactions are needed for a month-over-month read."}
            tone={insightSnapshot.expenseChange > 0 ? "expense" : "income"}
          />
          <MetricCard
            icon={Landmark}
            label="Strongest Month"
            value={strongestMonthValue}
            description="Best-performing month measured by net cash flow after expenses."
            tone="income"
          />
          <MetricCard
            icon={Target}
            label="Average Expense"
            value={formatCurrency(insightSnapshot.averageExpense)}
            description={`${summary.expenseCount} expense entries are contributing to this current average ticket size.`}
            tone="neutral"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <BalanceTrendChart />
          </div>
          <Card className="border-border/80 bg-card/90 xl:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Category Deep Dive</CardTitle>
              <CardDescription>See where expense pressure is concentrated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {breakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expense records are available yet.</p>
              ) : (
                breakdown.slice(0, 6).map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{category.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {category.count} transactions - Avg {formatCurrency(category.average)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-card-foreground">
                          {formatCurrency(category.value)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.percentage.toFixed(0)}% of expense
                        </p>
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

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-2">
            <InsightsPanel />
          </div>
          <Card className="border-border/80 bg-card/90 xl:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Performance</CardTitle>
              <CardDescription>How each month contributed to overall momentum.</CardDescription>
            </CardHeader>
            <CardContent>
              {monthly.length === 0 ? (
                <p className="text-sm text-muted-foreground">Monthly performance will appear once transactions are added.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <th className="pb-3 font-medium">Month</th>
                        <th className="pb-3 font-medium">Income</th>
                        <th className="pb-3 font-medium">Expenses</th>
                        <th className="pb-3 font-medium">Net</th>
                        <th className="pb-3 font-medium">Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...monthly].reverse().map((month) => (
                        <tr key={month.key} className="border-b border-border/70 last:border-0">
                          <td className="py-3 font-medium text-card-foreground">{month.label}</td>
                          <td className="py-3 text-income">{formatCurrency(month.income)}</td>
                          <td className="py-3 text-expense">{formatCurrency(month.expenses)}</td>
                          <td className={`py-3 font-medium ${month.net >= 0 ? "text-income" : "text-expense"}`}>
                            {formatCurrency(month.net)}
                          </td>
                          <td className="py-3 font-mono text-card-foreground">{formatCurrency(month.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommended Focus
              </CardTitle>
              <CardDescription>Actionable prompts based on the current transaction history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendations.map((recommendation) => (
                <div key={recommendation} className="rounded-2xl bg-muted/60 p-4 text-sm leading-6 text-muted-foreground">
                  {recommendation}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/90">
            <CardHeader>
              <CardTitle className="text-lg">Trend Signals</CardTitle>
              <CardDescription>A quick read on the most important changes in your dataset.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Largest expense</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">
                  {insightSnapshot.largestExpense
                    ? `${insightSnapshot.largestExpense.description} - ${formatCurrency(insightSnapshot.largestExpense.amount)}`
                    : "No expense activity yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Largest income</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">
                  {insightSnapshot.largestIncome
                    ? `${insightSnapshot.largestIncome.description} - ${formatCurrency(insightSnapshot.largestIncome.amount)}`
                    : "No income activity yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Income sources</p>
                <p className="mt-2 text-lg font-semibold text-card-foreground">
                  {insightSnapshot.incomeSources} tracked categories
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
