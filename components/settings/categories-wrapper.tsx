"use client"

import { useTranslation } from "@/lib/i18n/context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CategoriesList } from "@/app/settings/categories/categories-list"
import { Plus, Tag, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategoriesWrapperProps {
  categories: Category[]
}

export function CategoriesWrapper({ categories }: CategoriesWrapperProps) {
  const { t } = useTranslation(["common", "settings"]);

  const incomeCategories = categories.filter(cat => cat.type === 'income')
  const expenseCategories = categories.filter(cat => cat.type === 'expense')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-8 w-8 text-primary" />
            {t('nav.categories')}
          </h1>
          <p className="text-muted-foreground">{t('settings.categories.subtitle')}</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/settings/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            {t('settings.categories.addNew')}
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 dark:border-green-800 dark:from-green-950/20 dark:to-green-900/10 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5" />
              </div>
              {t('settings.categories.incomeCategories')}
            </CardTitle>
            <CardDescription className="text-green-600/80 dark:text-green-400/80">
              {t('settings.categories.manageCategoriesIncome')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomeCategories.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-green-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    {t('settings.categories.noIncomeCategories')}
                  </p>
                </div>
              ) : (
                incomeCategories.map((category, index) => (
                  <div 
                    key={category.id} 
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-green-100 dark:border-green-800/30 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/settings/categories/edit/${category.id}`}>
                        {t('common.edit')}
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 dark:border-red-800 dark:from-red-950/20 dark:to-red-900/10 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-red-700 dark:text-red-400">
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="h-5 w-5" />
              </div>
              {t('settings.categories.expenseCategories')}
            </CardTitle>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              {t('settings.categories.manageCategoriesExpense')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenseCategories.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingDown className="h-12 w-12 text-red-300 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    {t('settings.categories.noExpenseCategories')}
                  </p>
                </div>
              ) : (
                expenseCategories.map((category, index) => (
                  <div 
                    key={category.id} 
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-red-100 dark:border-red-800/30 hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{category.name}</p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/settings/categories/edit/${category.id}`}>
                        {t('common.edit')}
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.categories.allCategories')}</CardTitle>
          <CardDescription>
            {t('settings.categories.totalCategories', { count: categories.length })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoriesList categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}