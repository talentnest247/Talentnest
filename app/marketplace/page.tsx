import { redirect } from 'next/navigation'

export default function MarketplacePage() {
  // Marketplace removed — redirect to services
  redirect('/services')
}
