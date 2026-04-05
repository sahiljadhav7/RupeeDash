import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { formatCurrency, getSummaryMetrics } from "@/lib/finance";
import { useStore } from "@/store/useStore";

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview, balances, and the core dashboard view.",
  },
  {
    title: "Insights",
    href: "/insights",
    icon: BarChart3,
    description: "Patterns, trends, and category-level performance.",
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
    description: "Detailed activity, filters, and transaction intelligence.",
  },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const role = useStore((state) => state.role);
  const transactions = useStore((state) => state.transactions);
  const summary = getSummaryMetrics(transactions);
  const profile = role === "admin"
    ? {
        name: "Admin Account",
        detail: "Full access",
        initials: "AD",
        icon: ShieldCheck,
      }
    : {
        name: "Viewer Account",
        detail: "Read-only access",
        initials: "VW",
        icon: User,
      };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="gap-4 border-b border-sidebar-border px-4 py-5">
        <Link to="/" className="flex items-center gap-3 rounded-2xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="grid flex-1 text-left">
            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground">RupeeDash</span>
            <span className="text-xs text-sidebar-foreground/70">Personal finance command center</span>
          </div>
        </Link>

        <div className="rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/60 p-4">
          <p className="text-[11px] uppercase tracking-[0.28em] text-sidebar-foreground/60">Net Balance</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-sidebar-foreground">
            {formatCurrency(summary.totalBalance)}
          </p>
          <div className="mt-4 space-y-2 text-xs text-sidebar-foreground/70">
            <div className="flex items-center justify-between gap-3">
              <span>Income</span>
              <span className="font-medium text-sidebar-foreground">{formatCurrency(summary.totalIncome, true)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Expenses</span>
              <span className="font-medium text-sidebar-foreground">{formatCurrency(summary.totalExpenses, true)}</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = item.href === "/"
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-auto min-h-14 items-start gap-3 rounded-xl px-3 py-3"
                    >
                      <Link to={item.href}>
                        <item.icon className="mt-0.5 h-4 w-4" />
                        <div className="grid text-left">
                          <span className="font-medium">{item.title}</span>
                          <span className="text-xs leading-5 text-sidebar-foreground/65 group-data-[collapsible=icon]:hidden">
                            {item.description}
                          </span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Transactions" && (
                      <SidebarMenuBadge>{summary.transactionCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Snapshot</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid gap-3 px-2 text-sm group-data-[collapsible=icon]:hidden">
              <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3">
                <p className="text-xs text-sidebar-foreground/65">Savings rate</p>
                <p className="mt-1 text-lg font-semibold text-sidebar-foreground">
                  {summary.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3">
                <p className="text-xs text-sidebar-foreground/65">Tracked records</p>
                <p className="mt-1 text-lg font-semibold text-sidebar-foreground">
                  {summary.transactionCount}
                </p>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/60 p-3">
          <Avatar className="h-10 w-10 border border-sidebar-border/70">
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-sidebar-foreground">
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{profile.name}</p>
            <p className="text-xs text-sidebar-foreground/70">{profile.detail}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sidebar-background/80 text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            <profile.icon className="h-4 w-4" />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
