import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { SimpleLandingPage } from "@/components/landing/simple-landing-page"

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return <SimpleLandingPage />
}
