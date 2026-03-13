import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTransaction, deleteTransaction } from "@/api/transactions"
import type { Transaction } from "@/api/types"

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<Pick<Transaction, "date" | "category" | "amount" | "details">>
    }) => updateTransaction(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions"] })
      void queryClient.invalidateQueries({ queryKey: ["transactionTotals"] })
      void queryClient.invalidateQueries({ queryKey: ["sidebarTotals"] })
      void queryClient.invalidateQueries({ queryKey: ["categoryBreakdown"] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions"] })
      void queryClient.invalidateQueries({ queryKey: ["transactionTotals"] })
      void queryClient.invalidateQueries({ queryKey: ["sidebarTotals"] })
      void queryClient.invalidateQueries({ queryKey: ["categoryBreakdown"] })
    },
  })
}
