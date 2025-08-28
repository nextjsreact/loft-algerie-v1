import { requireRole } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { PaymentMethodForm } from "@/components/forms/payment-method-form"
import { updatePaymentMethod } from "@/app/actions/payment-methods"
import { EditPaymentMethodHeader } from "@/components/payment-methods/edit-payment-method-header"

export default async function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireRole(["admin"])
  const supabase = await createClient()

  const { data: paymentMethod, error } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching payment method:", error)
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-red-600">Erreur</h1>
          <p className="text-muted-foreground mt-2">Impossible de charger les données de la méthode de paiement.</p>
          <p className="text-sm text-gray-500 mt-1">Erreur: {error.message}</p>
        </div>
      </div>
    )
  }

  if (!paymentMethod) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Méthode de Paiement Introuvable</h1>
          <p className="text-muted-foreground mt-2">Impossible de trouver la méthode de paiement avec l'ID {id}</p>
        </div>
      </div>
    )
  }

  return (
    <PaymentMethodForm 
      paymentMethod={paymentMethod}
      action={updatePaymentMethod.bind(null, id)}
    />
  )
}
