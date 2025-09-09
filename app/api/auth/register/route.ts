import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'
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
    console.log('Registration attempt:', { email: body.email, role: body.role })

    // Create Supabase client
    const supabase = await createClient()

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

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', validatedData.email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { 
          message: 'An account with this email already exists',
          field: 'email'
        },
        { status: 409 }
      )
    }

    // Check if student ID already exists (for students)
    if (validatedData.role === 'student') {
      const studentData = validatedData as z.infer<typeof studentRegistrationSchema>
      const { data: existingStudent } = await supabase
        .from('users')
        .select('id, student_id')
        .eq('student_id', studentData.studentId)
        .single()

      if (existingStudent) {
        return NextResponse.json(
          { 
            message: 'This student ID is already registered',
            field: 'studentId'
          },
          { status: 409 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Prepare user data based on role
    const baseUserData = {
      email: validatedData.email,
      full_name: `${validatedData.firstName} ${validatedData.lastName}`,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      phone: validatedData.phone,
      password_hash: hashedPassword,
      role: validatedData.role,
      email_verified: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    let userData
    if (validatedData.role === 'student') {
      const studentData = validatedData as z.infer<typeof studentRegistrationSchema>
      userData = {
        ...baseUserData,
        student_id: studentData.studentId,
        department: studentData.department,
        academic_level: studentData.level,
      }
    } else {
      const artisanData = validatedData as z.infer<typeof artisanRegistrationSchema>
      userData = {
        ...baseUserData,
        business_name: artisanData.businessName,
        specialization: artisanData.specialization,
        experience_level: artisanData.experience,
        service_location: artisanData.location,
      }
    }

    // Insert user into database
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select('id, email, full_name, role')
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      
      // Handle specific database constraints
      if (insertError.code === '23505') {
        if (insertError.message.includes('email')) {
          return NextResponse.json(
            { 
              message: 'Email already registered',
              field: 'email'
            },
            { status: 409 }
          )
        }
        if (insertError.message.includes('student_id')) {
          return NextResponse.json(
            { 
              message: 'Student ID already registered',
              field: 'studentId'
            },
            { status: 409 }
          )
        }
      }

      return NextResponse.json(
        { message: 'Registration failed. Please try again.' },
        { status: 500 }
      )
    }

    // Log successful registration
    console.log('User registered successfully:', { id: newUser.id, email: newUser.email, role: newUser.role })

    // Return success response
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.full_name,
          role: newUser.role,
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    
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
