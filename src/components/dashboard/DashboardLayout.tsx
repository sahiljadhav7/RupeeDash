import { Outlet } from "react-router-dom";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar />
      <SidebarInset className="bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_30%),linear-gradient(180deg,_hsl(var(--background)),_hsl(var(--background)))]">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
