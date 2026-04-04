import { Shield, Eye } from "lucide-react";
import { useStore, type Role } from "@/store/useStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ToggleTheme } from "@/components/ui/toggle-theme";

export default function Header() {
  const { role, setRole } = useStore();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Finance Dashboard</h1>
        <p className="text-sm text-muted-foreground">Track your financial activity at a glance</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Badge variant={role === "admin" ? "default" : "secondary"} className="gap-1">
            {role === "admin" ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {role === "admin" ? "Admin" : "Viewer"}
          </Badge>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="w-28 h-8 text-xs">
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
    </header>
  );
}
