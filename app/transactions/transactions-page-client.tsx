"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, DollarSign } from "lucide-react"
import Link from "next/link"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { useTranslation } from "@/lib/i18n/hooks/useTranslation"
import { CreateForm } from "@/components/transactions/CreateForm"
import { createTransaction } from "@/app/actions/transactions"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface TransactionsPageClientProps {
  session: any
  transactions: any[]
  categories: any[]
  lofts: any[]
  currencies: any[]
  paymentMethods: any[]
}

export function TransactionsPageClient({
  session,
  transactions: initialTransactions,
  categories,
  lofts,
  currencies,
  paymentMethods
}: TransactionsPageClientProps) {
  const { t } = useTranslation(["transactions", "common"])
  const [transactions, setTransactions] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    let filteredTransactions = initialTransactions
    if (dateRange?.from) {
      filteredTransactions = filteredTransactions.filter(
        (transaction: any) => new Date(transaction.date) >= dateRange.from!
      )
    }
    if (dateRange?.to) {
      filteredTransactions = filteredTransactions.filter(
        (transaction: any) => new Date(transaction.date) <= dateRange.to!
      )
    }
    setTransactions(filteredTransactions)
  }, [initialTransactions, dateRange])

  const handleCreateTransaction = async (data: any) => {
    try {
      const newTransaction = await createTransaction(data)
      setTransactions(prev => [newTransaction, ...prev])
    } catch (error) {
      console.error("Failed to create transaction:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title', { ns: 'transactions' })}</h1>
          <p className="text-muted-foreground">{t('subtitle', { ns: 'transactions' })}</p>
        </div>
        <div className="flex gap-2">
          {(session.user.role === "admin" || session.user.role === "manager") && (
            <Button asChild variant="outline">
              <Link href="/transactions/reference-amounts">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('referenceAmounts', { ns: 'transactions' })}
              </Link>
            </Button>
          )}
          {session.user.role === "admin" && (
            <Button asChild>
              <Link href="/transactions/new">
                <Plus className="mr-2 h-4 w-4" />
                {t('addNewTransaction', { ns: 'transactions' })}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DatePickerWithRange value={dateRange} onChange={setDateRange} />
      </div>
      
      {session.user.role === "admin" && (
        <CreateForm
          onSubmit={handleCreateTransaction}
          categories={categories}
          lofts={lofts}
          currencies={currencies}
          paymentMethods={paymentMethods}
        />
      )}

      <TransactionsList
        transactions={transactions}
        categories={categories}
        lofts={lofts}
        currencies={currencies}
        paymentMethods={paymentMethods}
        isAdmin={session.user.role === "admin"}
      >
        {transactions.map((transaction: any) => (
          <div key={transaction.id} className="transaction-item border p-4 rounded-md mb-2">
            {/* Affichage simplifié - date, montant et description cachés */}
            <div className="font-semibold">Transaction #{transaction.id}</div>
            <div className="text-sm text-gray-600">
              Type: {transaction.type === 'expense' ? 'Dépense' : 'Revenu'} • 
              Statut: {transaction.status}
            </div>
          </div>
        ))}
      </TransactionsList>
    </div>
  )
}
