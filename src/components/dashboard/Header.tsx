import { Eye, Shield } from "lucide-react";

import { useStore, type Role } from "@/store/useStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleTheme } from "@/components/ui/toggle-theme";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export default function Header({ title, description, eyebrow }: HeaderProps) {
  const { role, setRole } = useStore();

  return (
    <header className="rounded-[1.75rem] border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <SidebarTrigger className="mt-1 h-10 w-10 rounded-2xl border border-border bg-background/80 shadow-sm" />
          <div>
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="flex items-center gap-2">
            <Badge variant={role === "admin" ? "default" : "secondary"} className="gap-1 px-3 py-1">
              {role === "admin" ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              {role === "admin" ? "Admin" : "Viewer"}
            </Badge>
            <Select value={role} onValueChange={(value) => setRole(value as Role)}>
              <SelectTrigger className="h-9 w-32 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ToggleTheme />
        </div>
      </div>
    </header>
  );
}
