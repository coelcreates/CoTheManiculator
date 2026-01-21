import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if customer record exists, if not create it
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (customerError || !customer) {
        // Create customer record
        const { error: insertError } = await supabase
          .from('customers')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
            google_id: data.user.user_metadata?.sub,
          })

        if (insertError) {
          console.error('Error creating customer:', insertError)
        }
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If there's an error, redirect back to login
  return NextResponse.redirect(`${origin}/auth/login?error=Could not authenticate`)
}