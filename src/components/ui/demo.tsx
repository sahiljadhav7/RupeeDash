import { ToggleTheme } from "@/components/ui/toggle-theme";
import { cn } from "@/lib/utils";

export default function DemoOne() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center">
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 -z-10 size-full",
          "bg-[radial-gradient(circle,_hsl(var(--foreground)/0.12)_1px,_transparent_1px)]",
          "bg-[length:12px_12px]"
        )}
      />
      <ToggleTheme />
    </div>
  );
}
