import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to booking page
  if (user) {
    redirect('/book')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Nail Scheduler
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Book your nail appointment in minutes
        </p>
        <p className="text-gray-500 mb-12">
          Hard gel overlays • Extensions • Polygel • Nail art • Removals
        </p>
        
        <Link
          href="/auth/login"
          className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  )
}