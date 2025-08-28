import { ModernTransactionsPage } from "@/components/transactions/modern-transactions-page"

// Mock data for demonstration
const mockSession = {
  user: {
    role: "admin",
    name: "Habib"
  }
}

const mockTransactions = [
  {
    id: "1",
    amount: 15000,
    date: "2024-12-15",
    description: "Loyer mensuel Loft Paris Centre",
    transaction_type: "income" as const,
    status: "completed" as const,
    category: "Loyer",
    loft_id: "1",
    currency_id: "1",
    payment_method_id: "1",
    equivalent_amount_default_currency: 15000,
    ratio_at_transaction: 1
  },
  {
    id: "2",
    amount: 2500,
    date: "2024-12-14",
    description: "Maintenance climatisation",
    transaction_type: "expense" as const,
    status: "pending" as const,
    category: "Maintenance",
    loft_id: "1",
    currency_id: "1",
    payment_method_id: "2",
    equivalent_amount_default_currency: 2500,
    ratio_at_transaction: 1
  },
  {
    id: "3",
    amount: 850,
    date: "2024-12-13",
    description: "Facture électricité",
    transaction_type: "expense" as const,
    status: "completed" as const,
    category: "Énergie",
    loft_id: "2",
    currency_id: "1",
    payment_method_id: "1",
    equivalent_amount_default_currency: 850,
    ratio_at_transaction: 1
  },
  {
    id: "4",
    amount: 12000,
    date: "2024-12-12",
    description: "Loyer mensuel Loft Lyon",
    transaction_type: "income" as const,
    status: "completed" as const,
    category: "Loyer",
    loft_id: "2",
    currency_id: "1",
    payment_method_id: "3",
    equivalent_amount_default_currency: 12000,
    ratio_at_transaction: 1
  },
  {
    id: "5",
    amount: 320,
    date: "2024-12-11",
    description: "Nettoyage professionnel",
    transaction_type: "expense" as const,
    status: "failed" as const,
    category: "Nettoyage",
    loft_id: "1",
    currency_id: "1",
    payment_method_id: "2",
    equivalent_amount_default_currency: 320,
    ratio_at_transaction: 1
  }
]

const mockCategories = [
  { id: "1", name: "Loyer", type: "income" },
  { id: "2", name: "Maintenance", type: "expense" },
  { id: "3", name: "Énergie", type: "expense" },
  { id: "4", name: "Nettoyage", type: "expense" },
  { id: "5", name: "Freelance", type: "income" }
]

const mockLofts = [
  { id: "1", name: "Loft Paris Centre" },
  { id: "2", name: "Loft Lyon Presqu'île" },
  { id: "3", name: "Loft Marseille Vieux-Port" }
]

const mockCurrencies = [
  { id: "1", name: "Dinar Algérien", symbol: "DA", ratio: 1, is_default: true },
  { id: "2", name: "Euro", symbol: "€", ratio: 0.0067, is_default: false },
  { id: "3", name: "Dollar US", symbol: "$", ratio: 0.0074, is_default: false }
]

const mockPaymentMethods = [
  { id: "1", name: "Virement bancaire" },
  { id: "2", name: "Carte bancaire" },
  { id: "3", name: "Espèces" },
  { id: "4", name: "Chèque" }
]

export default function TransactionsDemoPage() {
  return (
    <div>
      <ModernTransactionsPage
        session={mockSession}
        transactions={mockTransactions}
        categories={mockCategories}
        lofts={mockLofts}
        currencies={mockCurrencies}
        paymentMethods={mockPaymentMethods}
      />
    </div>
  )
}