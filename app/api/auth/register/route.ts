import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Validation schemas
const baseRegistrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address').toLowerCase(),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'artisan'], { required_error: 'Role is required' }),
})

const studentRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('student'),
  studentId: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  level: z.string().min(1, 'Academic level is required'),
})

const artisanRegistrationSchema = baseRegistrationSchema.extend({
  role: z.literal('artisan'),
  businessName: z.string().min(1, 'Business name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  experience: z.string().min(1, 'Experience level is required'),
  location: z.string().min(1, 'Service location is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🚀 Registration attempt:', { email: body.email, role: body.role })

    // Create Supabase client with service role for database operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Basic validation
    const baseValidation = baseRegistrationSchema.safeParse(body)
    if (!baseValidation.success) {
      const firstError = baseValidation.error.errors[0]
      return NextResponse.json(
        { 
          message: firstError.message,
          field: firstError.path[0]
        },
        { status: 400 }
      )
    }

    // Role-specific validation
    let validationResult
    if (body.role === 'student') {
      validationResult = studentRegistrationSchema.safeParse(body)
    } else if (body.role === 'artisan') {
      validationResult = artisanRegistrationSchema.safeParse(body)
    }

    if (validationResult && !validationResult.success) {
      const firstError = validationResult.error.errors[0]
      return NextResponse.json(
        { 
          message: firstError.message,
          field: firstError.path[0]
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult?.data || baseValidation.data

    console.log('✅ Validation passed, creating user...')

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: `${validatedData.firstName} ${validatedData.lastName}`,
          role: validatedData.role
        }
      }
    })

    if (authError) {
      console.error('❌ Auth creation error:', authError)
      return NextResponse.json(
        { message: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      console.error('❌ No user data returned')
      return NextResponse.json(
        { message: 'User creation failed' },
        { status: 400 }
      )
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Wait for the database trigger to create the basic profile
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Update the user profile with additional data
    const updateData: Record<string, string | number> = {
      phone: validatedData.phone,
      updated_at: new Date().toISOString()
    }

    if (validatedData.role === 'student') {
      const studentData = validatedData as z.infer<typeof studentRegistrationSchema>
      updateData.matric_number = studentData.studentId
      updateData.department = studentData.department
      updateData.level = studentData.level
    }

    console.log('📝 Updating user profile with additional data...')

    const { error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', authData.user.id)

    if (updateError) {
      console.error('❌ Profile update error:', updateError)
      // Don't fail the registration if profile update fails
      console.log('⚠️ Profile update failed, but user was created successfully')
    } else {
      console.log('✅ Profile updated successfully')
    }

    // If it's an artisan, create the artisan profile
    if (validatedData.role === 'artisan') {
      const artisanData = validatedData as z.infer<typeof artisanRegistrationSchema>
      
      console.log('👔 Creating artisan profile...')
      
      const { error: profileError } = await supabase
        .from('artisan_profiles')
        .insert([{
          user_id: authData.user.id,
          matric_number: '', // Artisans might not have matric numbers
          business_name: artisanData.businessName,
          business_registration_number: '',
          trade_category: artisanData.specialization,
          years_of_experience: artisanData.experience,
          location: artisanData.location,
          description: '',
          verification_status: 'pending'
        }])

      if (profileError) {
        console.error('⚠️ Artisan profile creation error:', profileError)
        // Note: We don't fail the registration if profile creation fails
      } else {
        console.log('✅ Artisan profile created successfully')
      }
    }

    // Log successful registration
    console.log('🎉 Registration completed successfully:', { 
      id: authData.user.id, 
      email: authData.user.email, 
      role: validatedData.role 
    })

    // Return success response
    return NextResponse.json(
      {
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          fullName: `${validatedData.firstName} ${validatedData.lastName}`,
          role: validatedData.role,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('💥 Registration error:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: 'Invalid request data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
