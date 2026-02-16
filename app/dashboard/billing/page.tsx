import { Check, CreditCard, Shield } from 'lucide-react'

export default function BillingPage() {
  const plans = [
    { name: 'Başlangıç', price: '499', credits: '1.000', features: ['Standart Destek', 'Temel Analiz Paneli'] },
    { name: 'Profesyonel', price: '1.299', credits: '5.000', features: ['Öncelikli Destek', 'Gelişmiş API Erişimi', 'Özel Tema'] },
    { name: 'Kurumsal', price: '4.999', credits: '25.000', features: ['7/24 Teknik Destek', 'Sınırsız Widget Gösterimi', 'SLA Garantisi'] }
  ]

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Abonelik ve Kredi Yönetimi</h1>
        <p className="text-slate-500 max-w-2xl mx-auto italic">
          Operasyonel ihtiyaçlarınıza uygun paketi seçerek sistem kapasitenizi anında artırabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div key={plan.name} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm relative flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">₺{plan.price}</span>
              <span className="text-slate-400 text-sm">/aylık</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Check size={16} /> {plan.credits} İşlem Kredisi
              </div>
              {plan.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-500">
                  <Check size={16} className="text-slate-300" /> {f}
                </div>
              ))}
            </div>

            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
              Paketi Seç
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 p-6 bg-blue-50 rounded-2xl flex items-start gap-4 border border-blue-100">
        <Shield className="text-blue-700 shrink-0" size={24} />
        <p className="text-sm text-blue-900 leading-relaxed">
          Tüm ödeme işlemleri **256-bit SSL** sertifikası ile korunmaktadır. Faturalarınız ödeme işleminin ardından kayıtlı e-posta adresinize otomatik olarak iletilir.
        </p>
      </div>
    </div>
  )
}

