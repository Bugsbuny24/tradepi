// route (1).ts içinde login POST fonksiyonun
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  // Önemli: createRouteClient'ın hem supabase hem de response döndürdüğünden emin ol
  const { supabase, response } = createRouteClient(req);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("error", error.message);
    return NextResponse.redirect(url);
  }

  // Session başarılıysa, redirect objesini oluştur ve response içindeki çerezleri ona aktar
  const redirectUrl = new URL(next, req.url);
  const finalResponse = NextResponse.redirect(redirectUrl);

  // createRouteClient içinde güncellenen çerezleri yeni response'a kopyalıyoruz
  response.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c.name, c.value, c);
  });

  return finalResponse;
}
