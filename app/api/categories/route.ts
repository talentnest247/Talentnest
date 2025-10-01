import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from('service_categories')
      .select(`
        id,
        name,
        description,
        icon,
        parent_category_id,
        created_at
      `)
      .order('name')

    if (error) throw error

    // Group categories by parent-child relationship
    const parentCategories = categories?.filter(cat => !cat.parent_category_id) || []
    const subcategories = categories?.filter(cat => cat.parent_category_id) || []

    const categoriesWithSubs = parentCategories.map(parent => ({
      ...parent,
      subcategories: subcategories.filter(sub => sub.parent_category_id === parent.id)
    }))

    return NextResponse.json({
      success: true,
      data: categoriesWithSubs
    })

  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This would be admin-only in a real application
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('service_categories')
      .insert([body])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data,
      message: 'Category created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
