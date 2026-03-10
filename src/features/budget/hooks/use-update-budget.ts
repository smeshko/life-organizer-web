import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateBudgetPlan } from "@/api/budget-plan"
import type { BudgetPlan } from "@/api/types"

interface UpdateBudgetParams {
  category: string
  month: number
  value: number
}

export function useUpdateBudget(year: number) {
  const queryClient = useQueryClient()
  const queryKey = ["budget-plan", year]

  return useMutation({
    mutationFn: async (params: UpdateBudgetParams) => {
      const current = queryClient.getQueryData<BudgetPlan>(queryKey)
      if (!current) throw new Error("No budget plan in cache")

      const updatedEntries = current.entries.map((entry) => {
        if (entry.category === params.category) {
          return {
            ...entry,
            amounts: { ...entry.amounts, [params.month]: params.value },
          }
        }
        return entry
      })

      return updateBudgetPlan(year, { year, entries: updatedEntries })
    },

    onMutate: async (params: UpdateBudgetParams) => {
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<BudgetPlan>(queryKey)

      if (previous) {
        const updatedEntries = previous.entries.map((entry) => {
          if (entry.category === params.category) {
            return {
              ...entry,
              amounts: { ...entry.amounts, [params.month]: params.value },
            }
          }
          return entry
        })

        queryClient.setQueryData<BudgetPlan>(queryKey, {
          ...previous,
          entries: updatedEntries,
        })
      }

      return { previous }
    },

    onError: (_error, _params, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous)
      }

      toast.error("Failed to update budget", {
        duration: Infinity,
        action: {
          label: "Retry",
          onClick: () => {},
        },
      })
    },

    onSuccess: () => {
      toast.success("Budget updated", { duration: 3000 })
    },
  })
}
