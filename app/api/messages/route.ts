import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: Request) {
  try {
    // Get user from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch messages from messages table
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        from_user:from_user_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq('to_user_id', user.id)
      .order('created_at', { ascending: false })

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
    }

    // Format messages data
    const formattedMessages = (messages || []).map(msg => ({
      id: msg.id,
      from_user_id: msg.from_user_id,
      from_name: msg.from_user?.full_name || msg.from_user?.email || 'Unknown',
      from_avatar: msg.from_user?.avatar_url,
      subject: msg.subject || 'No subject',
      message: msg.message,
      read: msg.read,
      created_at: msg.created_at
    }))

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
