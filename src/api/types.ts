export interface Transaction {
  id: string
  date: string
  type: "income" | "expense" | "savings"
  category: string
  amount: number
  details: string
}

export interface TransactionFilters {
  year?: number
  period?: "total" | number
  type?: Transaction["type"]
  category?: string
  sortBy?: "date" | "amount"
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface BudgetPlanEntry {
  category: string
  type: "income" | "expense" | "savings"
  amounts: Record<number, number>
}

export interface BudgetPlan {
  year: number
  entries: BudgetPlanEntry[]
}

export interface UpdateBudgetPlanRequest {
  year: number
  entries: BudgetPlanEntry[]
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
}

export interface BudgetVsActualEntry {
  category: string
  type: "income" | "expense" | "savings"
  budgeted: number
  actual: number
  remaining: number
  excess: number
  percentComplete: number
}

export class ApiError extends Error {
  public readonly status: number
  public readonly body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}
