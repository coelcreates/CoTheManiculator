import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AppointmentBooking from '@/components/appointment-booking'

export default async function BookPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all service data
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  const { data: lengthOptions, error: lengthError } = await supabase
    .from('service_length_options')
    .select('*')
    .order('display_order')

  const { data: nailArtTiers, error: artError } = await supabase
    .from('nail_art_tiers')
    .select('*')
    .order('display_order')

  if (servicesError || lengthError || artError) {
    console.error('Error fetching service data:', { servicesError, lengthError, artError })
    return <div>Error loading services. Please try again.</div>
  }

  return (
    <AppointmentBooking 
      services={services || []}
      lengthOptions={lengthOptions || []}
      nailArtTiers={nailArtTiers || []}
    />
  )
}