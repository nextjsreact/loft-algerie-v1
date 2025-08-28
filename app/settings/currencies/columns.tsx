"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Currency } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

export const getColumns = (
  onSetDefault: (id: string) => Promise<void>,
  onDelete: (id: string) => Promise<void>,
  router: ReturnType<typeof useRouter>,
  t: (key: string) => string
): ColumnDef<Currency>[] => {
  return [
    {
      accessorKey: "code",
      header: t('common.code'),
    },
    {
      accessorKey: "name",
      header: t('common.name'),
    },
    {
      accessorKey: "symbol",
      header: t('common.symbol'),
    },
    {
      accessorKey: "ratio",
      header: t('common.ratio'),
      cell: ({ row }) => {
        const ratio = parseFloat(row.getValue("ratio"))
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(ratio)
      }
    },
    {
      accessorKey: "is_default", // Change to snake_case
      header: t('settings.currencies.default'),
      cell: ({ row }) => {
        console.log(`Currency ${row.original.code} is_default:`, row.original.is_default); // Debugging log
        return (row.original.is_default ? t('common.yes') : t('common.no')); // Change to snake_case
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currency = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(currency.id)}
              >
                {t('common.copyId')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/settings/currencies/edit/${currency.id}`)}>
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSetDefault(currency.id)}>
                {t('settings.currencies.setAsDefault')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={async () => {
                  if (confirm(t('common.confirmDelete'))) {
                    await onDelete(currency.id)
                  }
                }}
              >
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
