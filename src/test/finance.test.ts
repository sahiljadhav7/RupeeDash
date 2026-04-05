import { describe, expect, it } from "vitest";

import {
  getExpenseBreakdown,
  getInsightSnapshot,
  getMonthlyCashFlow,
  getSummaryMetrics,
} from "@/lib/finance";
import type { Transaction } from "@/store/useStore";

const transactions: Transaction[] = [
  { id: "1", date: "2025-01-04", description: "Salary", amount: 5000, type: "income", category: "Salary" },
  { id: "2", date: "2025-01-08", description: "Groceries", amount: 300, type: "expense", category: "Food" },
  { id: "3", date: "2025-02-01", description: "Freelance", amount: 1200, type: "income", category: "Freelance" },
  { id: "4", date: "2025-02-03", description: "Rent", amount: 1400, type: "expense", category: "Bills" },
  { id: "5", date: "2025-02-10", description: "Dinner", amount: 120, type: "expense", category: "Food" },
];

describe("finance analytics", () => {
  it("calculates summary metrics", () => {
    const summary = getSummaryMetrics(transactions);

    expect(summary.totalIncome).toBe(6200);
    expect(summary.totalExpenses).toBe(1820);
    expect(summary.totalBalance).toBe(4380);
    expect(summary.transactionCount).toBe(5);
  });

  it("builds monthly cash flow in chronological order", () => {
    const monthly = getMonthlyCashFlow(transactions);

    expect(monthly).toHaveLength(2);
    expect(monthly[0]).toMatchObject({
      key: "2025-01",
      income: 5000,
      expenses: 300,
      net: 4700,
      balance: 4700,
    });
    expect(monthly[1]).toMatchObject({
      key: "2025-02",
      income: 1200,
      expenses: 1520,
      net: -320,
      balance: 4380,
    });
  });

  it("surfaces category breakdown and insight snapshot", () => {
    const breakdown = getExpenseBreakdown(transactions);
    const insightSnapshot = getInsightSnapshot(transactions);

    expect(breakdown[0]).toMatchObject({
      name: "Bills",
      value: 1400,
    });
    expect(insightSnapshot.topCategory?.name).toBe("Bills");
    expect(insightSnapshot.largestExpense?.description).toBe("Rent");
    expect(insightSnapshot.strongestMonth?.key).toBe("2025-01");
  });
});
