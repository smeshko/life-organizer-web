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
  category?: string[]
  date_from?: string
  date_to?: string
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

export interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
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
