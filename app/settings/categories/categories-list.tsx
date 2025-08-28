"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteCategory } from "@/app/actions/categories"
import Link from "next/link"
import { Category } from "@/lib/types"
import { useTranslation } from "react-i18next"

interface CategoriesListProps {
  categories: Category[]
  onDelete: (id: string) => Promise<void>
}

export function CategoriesList({ categories, onDelete }: CategoriesListProps) {
  const { t } = useTranslation();

  const transactionTypeTranslationKeys = {
    income: 'transactions.income',
    expense: 'transactions.expense',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('common.name')}</TableHead>
          <TableHead>{t('settings.categories.description')}</TableHead>
          <TableHead>{t('type', { ns: 'transactions' })}</TableHead>
          <TableHead className="text-center">{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">{category.description || '-'}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                category.type === 'income'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {t(transactionTypeTranslationKeys[category.type])}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/settings/categories/edit/${category.id}`}>
                    {t('common.edit')}
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm(t('settings.categories.deleteConfirm'))) {
                      await onDelete(category.id);
                    }
                  }}
                >
                  {t('common.delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
