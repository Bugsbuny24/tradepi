export function runSnapScript(script: string, data: any) {
  try {
    // Kanka burası SnapScript'in kalbi. 
    // Şimdilik basit bir JavaScript context'i sunuyoruz.
    const context = {
      data: data,
      result: {},
      setColor: (color: string) => { context.result.color = color; }
    };

    const run = new Function("ctx", `with(ctx) { ${script} }`);
    run(context);
    
    return context.result;
  } catch (e) {
    console.error("SnapScript Hatası:", e);
    return null;
  }
}
