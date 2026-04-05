import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
  tone?: "primary" | "income" | "expense" | "neutral";
  className?: string;
}

const toneClasses: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  income: "bg-income/10 text-income",
  expense: "bg-expense/10 text-expense",
  neutral: "bg-secondary text-foreground",
};

export default function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  tone = "primary",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("border-border/80 bg-card/90 backdrop-blur", className)}>
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-card-foreground">{value}</p>
          </div>
          <div className={cn("rounded-2xl p-3", toneClasses[tone])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
