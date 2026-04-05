import Header from "@/components/dashboard/Header";
import SummaryCards from "@/components/dashboard/SummaryCards";
import BalanceTrendChart from "@/components/dashboard/BalanceTrendChart";
import SpendingBreakdown from "@/components/dashboard/SpendingBreakdown";
import TransactionsTable from "@/components/dashboard/TransactionsTable";
import InsightsPanel from "@/components/dashboard/InsightsPanel";

export default function Index() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header
          title="Home"
          eyebrow="Overview"
          description="Track your balance, spending behavior, and recent transactions from the same dashboard you already had, now anchored inside a navigable workspace."
        />
        <div className="space-y-6">
          <SummaryCards />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <BalanceTrendChart />
            </div>
            <div className="lg:col-span-2">
              <SpendingBreakdown />
            </div>
          </div>
          <InsightsPanel />
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
}
