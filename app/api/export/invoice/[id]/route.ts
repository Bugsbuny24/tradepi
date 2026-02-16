import { createClient } from '@/lib/supabase/server'
import { InvoicePdf } from '@/lib/pdf/templates/InvoicePdf'
import { renderToStream } from '@react-pdf/renderer'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()

  // 1. Güvenlik: Kullanıcı giriş yapmış mı ve fatura onun mu?
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !invoice) return new NextResponse('Not Found', { status: 404 })

  // 2. PDF Oluşturma (Stream olarak)
  const stream = await renderToStream(<InvoicePdf invoice={invoice} />)
  
  // 3. Tarayıcıya Yanıt Verme (Dosya olarak)
  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="fatura-${invoice.invoice_number}.pdf"`,
    },
  })
}
