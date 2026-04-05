import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown, Plus, Pencil, Trash2, X, Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore, useFilteredTransactions, type Category, type TransactionType } from "@/store/useStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const categories: Category[] = ["Food", "Transport", "Shopping", "Entertainment", "Bills", "Salary", "Freelance", "Investment", "Health", "Education"];

function TransactionForm({ onSubmit, initial, onClose }: {
  onSubmit: (data: { date: string; description: string; amount: number; type: TransactionType; category: Category }) => void;
  initial?: { date: string; description: string; amount: number; type: TransactionType; category: Category };
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial || { date: new Date().toISOString().slice(0, 10), description: "", amount: 0, type: "expense" as TransactionType, category: "Food" as Category });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as TransactionType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Amount</Label>
          <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{initial ? "Update" : "Add"} Transaction</Button>
      </div>
    </form>
  );
}

const PAGE_SIZE = 10;

export default function TransactionsTable() {
  const { role, filters, setFilter, addTransaction, editTransaction, deleteTransaction, resetFilters } = useStore();
  const filtered = useFilteredTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const editingTx = editingId ? useStore.getState().transactions.find((t) => t.id === editingId) : null;

  const visibleTransactions = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.ceil(visibleCount / PAGE_SIZE);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters.search, filters.type, filters.category]);

  // Infinite scroll observer
  useEffect(() => {
    if (!useInfiniteScroll || !hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [useInfiniteScroll, hasMore, filtered.length]);

  const goToPage = (page: number) => {
    setVisibleCount(page * PAGE_SIZE);
  };

  const exportCSV = () => {
    const header = "Date,Description,Amount,Type,Category\n";
    const rows = filtered.map((t) => `${t.date},"${t.description}",${t.amount},${t.type},${t.category}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "transactions.csv";
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl bg-card border border-border"
    >
      <div className="p-5 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Transactions</h3>
            <p className="text-xs text-muted-foreground">
              Showing {visibleTransactions.length} of {filtered.length} transactions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-3 h-3 mr-1" /> Export
            </Button>
            {role === "admin" && (
              <Button size="sm" onClick={() => { setEditingId(null); setDialogOpen(true); }}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilter("search", e.target.value)}
            />
          </div>
          <Select
            value={filters.type}
            onValueChange={(value) => setFilter("type", value as TransactionType | "all")}
          >
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.category}
            onValueChange={(value) => setFilter("category", value as Category | "all")}
          >
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          {(filters.search || filters.type !== "all" || filters.category !== "all") && (
            <Button variant="ghost" size="icon" onClick={resetFilters} title="Clear filters">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p className="text-lg font-medium mb-1">No transactions found</p>
            <p className="text-sm">Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          <table className="w-full min-w-0 table-fixed sm:table-auto">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left p-2 sm:p-3 font-medium w-12 sm:w-auto">Date</th>
                <th className="text-left p-2 sm:p-3 font-medium">Description</th>
                <th className="text-left p-2 sm:p-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-right p-2 sm:p-3 font-medium whitespace-nowrap">Amount</th>
                {role === "admin" && <th className="text-right p-2 sm:p-3 font-medium hidden sm:table-cell">Actions</th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {visibleTransactions.map((t) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-mono text-muted-foreground">{new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm text-card-foreground truncate max-w-[120px] sm:max-w-none">{t.description}</td>
                    <td className="p-2 sm:p-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs font-normal">{t.category}</Badge>
                    </td>
                    <td className={`p-2 sm:p-3 text-xs sm:text-sm font-mono text-right font-medium whitespace-nowrap ${t.type === "income" ? "text-income" : "text-expense"}`}>
                      {t.type === "income" ? "+" : "-"}${t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>
                    {role === "admin" && (
                      <td className="p-2 sm:p-3 text-right hidden sm:table-cell">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingId(t.id); setDialogOpen(true); }}>
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-expense hover:text-expense" onClick={() => deleteTransaction(t.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination footer */}
      {filtered.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={useInfiniteScroll ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => { setUseInfiniteScroll(true); setVisibleCount(PAGE_SIZE); }}
            >
              Infinite Scroll
            </Button>
            <Button
              variant={!useInfiniteScroll ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              onClick={() => { setUseInfiniteScroll(false); setVisibleCount(PAGE_SIZE); }}
            >
              Paginated
            </Button>
          </div>

          {!useInfiniteScroll && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage <= 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={currentPage >= totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {useInfiniteScroll && hasMore && (
            <div ref={sentinelRef} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Loading more...
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {visibleTransactions.length} of {filtered.length} shown
          </p>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm
            initial={editingTx ? { date: editingTx.date, description: editingTx.description, amount: editingTx.amount, type: editingTx.type, category: editingTx.category } : undefined}
            onClose={() => setDialogOpen(false)}
            onSubmit={(data) => {
              if (editingId) editTransaction(editingId, data);
              else addTransaction(data);
              setDialogOpen(false);
              setEditingId(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
