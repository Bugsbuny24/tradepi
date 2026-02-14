import { createClient } from '@/lib/supabase'
import { ShoppingCart, Zap, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function MarketPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('price_try', { ascending: true })

  async function handlePurchase(packageCode: string) {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: pkg } = await supabase
      .from('packages')
      .select('*')
      .eq('code', packageCode)
      .single()

    if (!pkg) return

    // Create checkout intent
    await supabase.from('checkout_intents').insert({
      user_id: user.id,
      package_code: pkg.code,
      amount: pkg.price_try,
      currency: 'TRY',
      provider: 'shopier',
      provider_ref: `pending_${Date.now()}`,
      status: 'pending'
    })

    // Redirect to Shopier
    const paymentLink = pkg.grants?.payment_link
    if (paymentLink) {
      const url = `${paymentLink}?custom_field_1=${user.id}&custom_field_2=${pkg.code}`
      redirect(url)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={16} />
            Dashboard'a Dön
          </Link>
          
          <h1 className="text-4xl font-black text-slate-900 mb-2">Paketler</h1>
          <p className="text-slate-600">İhtiyacına göre kredi satın al</p>
        </div>

        {/* User Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {user.email?.[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm text-slate-600">Giriş yapıldı:</div>
              <div className="font-semibold text-slate-900">{user.email}</div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {!packages || packages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-600">Şu anda paket bulunmuyor</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {packages.map((pkg: any) => {
              const grants = pkg.grants || {}
              const isPopular = pkg.code === 'pk_300' || pkg.code === 'pk_350'

              return (
                <div 
                  key={pkg.id} 
                  className={`bg-white border-2 rounded-2xl p-6 transition-all hover:shadow-xl flex flex-col ${
                    isPopular 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {isPopular && (
                    <div className="mb-4 -mt-2">
                      <span className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-blue-500 text-white rounded-full font-bold">
                        <Zap size={12} />
                        POPÜLER
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-black text-slate-900 mb-2">
                      {pkg.title}
                    </h3>
                    <div className="text-4xl font-black text-blue-600 mb-1">
                      ₺{pkg.price_try}
                    </div>
                    <div className="text-xs text-slate-500 uppercase">Tek Seferlik</div>
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {grants.credits && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span><strong>{grants.credits.toLocaleString()}</strong> Kredi</span>
                      </li>
                    )}
                    {grants.views && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span><strong>{grants.views.toLocaleString()}</strong> Görüntüleme</span>
                      </li>
                    )}
                    {grants.snapscript && grants.snapscript !== 'none' && (
                      <li className="flex items-center gap-2 text-sm text-slate-700">
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        <span>SnapScript: <strong>{grants.snapscript}</strong></span>
                      </li>
                    )}
                  </ul>

                  <form action={handlePurchase.bind(null, pkg.code)}>
                    <button 
                      type="submit"
                      className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        isPopular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      Satın Al
                    </button>
                  </form>

                  <div className="mt-3 text-center text-xs text-slate-500">
                    Shopier ile güvenli ödeme
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-600 mb-2">
            💳 Tüm ödemeler Shopier üzerinden güvenle yapılır
          </p>
          <p className="text-xs text-slate-500">
            Krediler ödeme sonrası otomatik hesabına eklenir
          </p>
        </div>
      </div>
    </div>
  )
}
