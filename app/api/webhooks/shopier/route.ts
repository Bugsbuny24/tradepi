import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Değişkenler yoksa build'in çökmesini engellemek için basit bir kontrol
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  // Eğer key'ler yoksa hemen hata dön, client oluşturmaya çalışma
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase ayarları eksik!");
    return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await req.json();
    // ... geri kalan Shopier webhook kodların ...
