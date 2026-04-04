import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "viewer";
export type TransactionType = "income" | "expense";
export type Category = "Food" | "Transport" | "Shopping" | "Entertainment" | "Bills" | "Salary" | "Freelance" | "Investment" | "Health" | "Education";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

interface Filters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface Store {
  role: Role;
  setRole: (role: Role) => void;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filters: Filters;
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date",
  sortOrder: "desc",
};

const mockTransactions: Transaction[] = [
  { id: "1", date: "2025-03-01", description: "Monthly Salary", amount: 5200, type: "income", category: "Salary" },
  { id: "2", date: "2025-03-02", description: "Grocery Store", amount: 85.5, type: "expense", category: "Food" },
  { id: "3", date: "2025-03-03", description: "Uber Ride", amount: 24.0, type: "expense", category: "Transport" },
  { id: "4", date: "2025-03-05", description: "Netflix Subscription", amount: 15.99, type: "expense", category: "Entertainment" },
  { id: "5", date: "2025-03-06", description: "Freelance Project", amount: 1200, type: "income", category: "Freelance" },
  { id: "6", date: "2025-03-07", description: "Electric Bill", amount: 142.0, type: "expense", category: "Bills" },
  { id: "7", date: "2025-03-08", description: "New Shoes", amount: 89.99, type: "expense", category: "Shopping" },
  { id: "8", date: "2025-03-10", description: "Restaurant Dinner", amount: 67.5, type: "expense", category: "Food" },
  { id: "9", date: "2025-03-12", description: "Gym Membership", amount: 45.0, type: "expense", category: "Health" },
  { id: "10", date: "2025-03-14", description: "Online Course", amount: 199.0, type: "expense", category: "Education" },
  { id: "11", date: "2025-03-15", description: "Investment Return", amount: 340, type: "income", category: "Investment" },
  { id: "12", date: "2025-03-16", description: "Gas Station", amount: 52.0, type: "expense", category: "Transport" },
  { id: "13", date: "2025-03-18", description: "Water Bill", amount: 38.0, type: "expense", category: "Bills" },
  { id: "14", date: "2025-03-20", description: "Movie Tickets", amount: 28.0, type: "expense", category: "Entertainment" },
  { id: "15", date: "2025-03-22", description: "Freelance Bonus", amount: 500, type: "income", category: "Freelance" },
  { id: "16", date: "2025-03-24", description: "Supermarket", amount: 112.3, type: "expense", category: "Food" },
  { id: "17", date: "2025-03-25", description: "Phone Case", amount: 19.99, type: "expense", category: "Shopping" },
  { id: "18", date: "2025-03-27", description: "Dental Checkup", amount: 75.0, type: "expense", category: "Health" },
  { id: "19", date: "2025-02-01", description: "February Salary", amount: 5200, type: "income", category: "Salary" },
  { id: "20", date: "2025-02-05", description: "Rent Payment", amount: 1400, type: "expense", category: "Bills" },
  { id: "21", date: "2025-02-10", description: "Amazon Order", amount: 234.5, type: "expense", category: "Shopping" },
  { id: "22", date: "2025-02-14", description: "Valentine Dinner", amount: 95.0, type: "expense", category: "Food" },
  { id: "23", date: "2025-02-20", description: "Freelance Work", amount: 800, type: "income", category: "Freelance" },
  { id: "24", date: "2025-01-01", description: "January Salary", amount: 5200, type: "income", category: "Salary" },
  { id: "25", date: "2025-01-15", description: "Winter Jacket", amount: 189.0, type: "expense", category: "Shopping" },
];

export const useStore = create<Store>()(
  persist(
    (set) => ({
      role: "admin",
      setRole: (role) => set({ role }),
      transactions: mockTransactions,
      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: crypto.randomUUID() }, ...s.transactions],
        })),
      editTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      filters: defaultFilters,
      setFilter: (key, value) =>
        set((s) => ({ filters: { ...s.filters, [key]: value } })),
      resetFilters: () => set({ filters: defaultFilters }),
    }),
    {
      name: "finance-dashboard",
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
      }),
    }
  )
);

// Selectors
export const useFilteredTransactions = () => {
  const { transactions, filters } = useStore();
  let filtered = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }
  if (filters.type !== "all") {
    filtered = filtered.filter((t) => t.type === filters.type);
  }
  if (filters.category !== "all") {
    filtered = filtered.filter((t) => t.category === filters.category);
  }

  filtered.sort((a, b) => {
    const mul = filters.sortOrder === "asc" ? 1 : -1;
    if (filters.sortBy === "date") return mul * (new Date(a.date).getTime() - new Date(b.date).getTime());
    return mul * (a.amount - b.amount);
  });

  return filtered;
};
