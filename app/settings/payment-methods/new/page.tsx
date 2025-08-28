import { PaymentMethodForm } from "@/components/forms/payment-method-form"
import { createPaymentMethod } from "@/app/actions/payment-methods"

export default function NewPaymentMethodPage() {
  return <PaymentMethodForm action={createPaymentMethod} />
}
