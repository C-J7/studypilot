import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Upload file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(`${Date.now()}-${file.name}`, file)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Store metadata in Supabase database
    const { data: pdfData, error: dbError } = await supabase
      .from('pdfs')
      .insert([
        {
          name: file.name,
          size: file.size,
          storage_path: data.path,
          uploaded_at: new Date().toISOString()
        }
      ])
      .select()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json(pdfData[0])
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 