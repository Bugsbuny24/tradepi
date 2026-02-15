'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'
import { FileUp, Loader2, CheckCircle2 } from 'lucide-react'
import { bulkUploadData } from '@/app/actions/data-actions'

export default function CSVUploader({ chartId }: { chartId: string }) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // CSV'den gelen veriyi label ve value formatına sokuyoruz
        const formattedData = results.data.map((row: any) => ({
          label: row.label || row.Label || Object.values(row)[0],
          value: Number(row.value || row.Value || Object.values(row)[1])
        })).filter(item => !isNaN(item.value))

        const result = await bulkUploadData(chartId, formattedData)
        
        if (result?.success) {
          alert('Veriler başarıyla mühürlendi kanka!')
        } else {
          alert('Hata: ' + result?.error)
        }
        setUploading(false)
      }
    })
  }

  return (
    <div className="relative">
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
        className="hidden" 
        id={`csv-upload-${chartId}`}
        disabled={uploading}
      />
      <label 
        htmlFor={`csv-upload-${chartId}`}
        className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm cursor-pointer hover:bg-emerald-100 transition-all"
      >
        {uploading ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
        {uploading ? 'Yükleniyor...' : 'CSV Yükle'}
      </label>
    </div>
  )
}
