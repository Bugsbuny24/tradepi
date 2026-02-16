import { FileText, Download, CheckCircle2 } from 'lucide-react'

export default function InvoiceList({ invoices }: { invoices: any[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FileText size={18} className="text-blue-600" /> Fatura Geçmişi
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
              <th className="p-5">Fatura No</th>
              <th className="p-5">Tarih</th>
              <th className="p-5">Tutar</th>
              <th className="p-5">Durum</th>
              <th className="p-5">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-5 text-sm font-bold text-slate-700">{inv.invoice_number}</td>
                <td className="p-5 text-sm text-slate-500">
                  {new Date(inv.issued_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-5 text-sm font-black text-slate-900">
                  ₺{inv.total.toLocaleString()}
                </td>
                <td className="p-5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                    <CheckCircle2 size={12} /> ÖDENDİ
                  </span>
                </td>
                <td className="p-5">
                  <button className="text-slate-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 rounded-lg">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {invoices.length === 0 && (
        <div className="p-12 text-center text-slate-400 font-medium italic">
          Henüz bir fatura kaydı bulunmuyor.
        </div>
      )}
    </div>
  )
}
