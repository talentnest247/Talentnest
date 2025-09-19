import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateMatricNumber, validateEmail, validatePhoneNumber } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      fullName,
      phoneNumber,
      whatsappNumber,
      faculty,
      department,
      level,
      matricNumber,
      password,
    } = body

    // Validate required fields
    if (!email || !fullName || !phoneNumber || !faculty || !department || !level || !matricNumber || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate formats
    if (!validateMatricNumber(matricNumber)) {
      return NextResponse.json({ error: 'Invalid matric number format' }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, matric_number, email')
      .or(`matric_number.eq.${matricNumber},email.eq.${email}`)
      .single()

    if (existingUser) {
      if (existingUser.matric_number === matricNumber) {
        return NextResponse.json({ error: 'Matric number already registered' }, { status: 409 })
      }
      if (existingUser.email === email) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
      }
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          matric_number: matricNumber,
        },
      },
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    // Create user profile in users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        matric_number: matricNumber,
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber || phoneNumber,
        faculty: faculty.toLowerCase().replace(/\s+/g, '_'),
        department,
        level,
        bio: '',
        skills: [],
        is_verified: false,
        is_admin: false,
        total_rating: 0.0,
        total_reviews: 0,
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ error: 'Failed to create user profile: ' + profileError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Registration successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName,
        matricNumber,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}