import type { Transaction } from "@/store/useStore";

export interface SummaryMetrics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  averageTransaction: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface MonthlyCashFlowPoint {
  key: string;
  label: string;
  income: number;
  expenses: number;
  net: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdownPoint {
  name: string;
  value: number;
  percentage: number;
  count: number;
  average: number;
}

export interface InsightSnapshot {
  topCategory: CategoryBreakdownPoint | null;
  currentMonth: MonthlyCashFlowPoint | null;
  previousMonth: MonthlyCashFlowPoint | null;
  strongestMonth: MonthlyCashFlowPoint | null;
  weakestMonth: MonthlyCashFlowPoint | null;
  expenseChange: number;
  averageExpense: number;
  largestExpense: Transaction | null;
  largestIncome: Transaction | null;
  latestTransaction: Transaction | null;
  incomeSources: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getMonthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

export const formatCurrency = (value: number, compact = false) =>
  compact ? compactCurrencyFormatter.format(value) : currencyFormatter.format(value);

export const formatDisplayDate = (
  value: string,
  options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" },
) => parseLocalDate(value).toLocaleDateString("en-US", options);

export function getSummaryMetrics(transactions: Transaction[]): SummaryMetrics {
  let totalIncome = 0;
  let totalExpenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
      incomeCount += 1;
      return;
    }

    totalExpenses += transaction.amount;
    expenseCount += 1;
  });

  const totalBalance = totalIncome - totalExpenses;

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    savingsRate: totalIncome > 0 ? (totalBalance / totalIncome) * 100 : 0,
    averageTransaction: transactions.length > 0
      ? transactions.reduce((sum, transaction) => sum + transaction.amount, 0) / transactions.length
      : 0,
    transactionCount: transactions.length,
    incomeCount,
    expenseCount,
  };
}

export function getMonthlyCashFlow(transactions: Transaction[]): MonthlyCashFlowPoint[] {
  const monthly = new Map<string, { income: number; expenses: number; transactionCount: number }>();

  transactions.forEach((transaction) => {
    const monthKey = transaction.date.slice(0, 7);
    const entry = monthly.get(monthKey) ?? { income: 0, expenses: 0, transactionCount: 0 };

    entry.transactionCount += 1;
    if (transaction.type === "income") {
      entry.income += transaction.amount;
    } else {
      entry.expenses += transaction.amount;
    }

    monthly.set(monthKey, entry);
  });

  let runningBalance = 0;

  return [...monthly.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => {
      const net = value.income - value.expenses;
      runningBalance += net;

      return {
        key,
        label: getMonthLabel(key),
        income: value.income,
        expenses: value.expenses,
        net,
        balance: runningBalance,
        transactionCount: value.transactionCount,
      };
    });
}

export function getExpenseBreakdown(transactions: Transaction[]): CategoryBreakdownPoint[] {
  const totals = new Map<string, { value: number; count: number }>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const current = totals.get(transaction.category) ?? { value: 0, count: 0 };
      current.value += transaction.amount;
      current.count += 1;
      totals.set(transaction.category, current);
    });

  const totalExpenseValue = [...totals.values()].reduce((sum, current) => sum + current.value, 0);

  return [...totals.entries()]
    .map(([name, value]) => ({
      name,
      value: Math.round(value.value * 100) / 100,
      percentage: totalExpenseValue > 0 ? (value.value / totalExpenseValue) * 100 : 0,
      count: value.count,
      average: value.count > 0 ? value.value / value.count : 0,
    }))
    .sort((left, right) => right.value - left.value);
}

export function getRecentTransactions(transactions: Transaction[], count = 5): Transaction[] {
  return [...transactions]
    .sort((left, right) => parseLocalDate(right.date).getTime() - parseLocalDate(left.date).getTime())
    .slice(0, count);
}

export function getInsightSnapshot(transactions: Transaction[]): InsightSnapshot {
  const monthly = getMonthlyCashFlow(transactions);
  const expenses = transactions.filter((transaction) => transaction.type === "expense");
  const incomes = transactions.filter((transaction) => transaction.type === "income");
  const expenseBreakdown = getExpenseBreakdown(transactions);

  const currentMonth = monthly.at(-1) ?? null;
  const previousMonth = monthly.at(-2) ?? null;

  const strongestMonth = monthly.length > 0
    ? [...monthly].sort((left, right) => right.net - left.net)[0]
    : null;
  const weakestMonth = monthly.length > 0
    ? [...monthly].sort((left, right) => left.net - right.net)[0]
    : null;

  const largestExpense = expenses.length > 0
    ? [...expenses].sort((left, right) => right.amount - left.amount)[0]
    : null;
  const largestIncome = incomes.length > 0
    ? [...incomes].sort((left, right) => right.amount - left.amount)[0]
    : null;
  const latestTransaction = transactions.length > 0 ? getRecentTransactions(transactions, 1)[0] : null;

  const expenseChange =
    currentMonth && previousMonth && previousMonth.expenses > 0
      ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
      : 0;

  return {
    topCategory: expenseBreakdown[0] ?? null,
    currentMonth,
    previousMonth,
    strongestMonth,
    weakestMonth,
    expenseChange,
    averageExpense: expenses.length > 0
      ? expenses.reduce((sum, transaction) => sum + transaction.amount, 0) / expenses.length
      : 0,
    largestExpense,
    largestIncome,
    latestTransaction,
    incomeSources: new Set(incomes.map((transaction) => transaction.category)).size,
  };
}
