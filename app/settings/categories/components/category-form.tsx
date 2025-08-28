"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Category } from "@/lib/types"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useTranslation } from "react-i18next"
import { Tag, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().nullable(),
  type: z.enum(["income", "expense"]),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
  category?: Category
  createCategory: (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
  updateCategory: (id: string, data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<any>
}

export function CategoryForm({
  category,
  createCategory,
  updateCategory,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const router = useRouter()
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      type: category?.type || "income",
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        await updateCategory(category.id, data)
        toast({
          title: "✅ " + t('common.success'),
          description: t('settings.categories.categoryUpdated', { name: data.name }),
          duration: 3000,
        })
      } else {
        await createCategory(data)
        toast({
          title: "✅ " + t('common.success'),
          description: t('settings.categories.categoryCreated', { name: data.name }),
          duration: 3000,
        })
      }
      setTimeout(() => {
        router.push("/settings/categories")
      }, 1000)
    } catch (error) {
      console.error('Error saving category:', error)
      toast({
        title: "❌ " + t('common.error'),
        description: t('settings.categories.saveError'),
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-8 w-8 text-primary" />
            {category ? t('settings.categories.editCategory') : t('settings.categories.createCategory')}
          </h1>
          <p className="text-muted-foreground">
            {category ? t('settings.categories.updateCategoryInfo') : t('settings.categories.createNewCategory')}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                {t('settings.categories.categoryDetails')}
              </CardTitle>
              <CardDescription>
                {t('settings.categories.enterCategoryInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {t('settings.categories.categoryName')}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={t('settings.categories.namePlaceholder')}
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        {t('settings.categories.categoryType')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('settings.categories.selectType')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="income" className="flex items-center">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              {t('income', { ns: 'transactions' })}
                            </div>
                          </SelectItem>
                          <SelectItem value="expense" className="flex items-center">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-600" />
                              {t('expense', { ns: 'transactions' })}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {t('settings.categories.description')} ({t('optional', { ns: 'transactions' })})
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        placeholder={t('settings.categories.descriptionPlaceholder')}
                        className="min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/settings/categories")}
                >
                  {t('common.cancel')}
                </Button>
                <Button 
                  type="submit" 
                  disabled={form.formState.isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {form.formState.isSubmitting
                    ? t('common.saving')
                    : category
                    ? t('settings.categories.saveChanges')
                    : t('settings.categories.createCategory')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}
