// Designer Sayfası - Final Script Modülü
const saveSnapProject = async () => {
  const { data: chart } = await supabase
    .from('charts')
    .insert([{ title, chart_type: 'snapscript', user_id: user.id }])
    .select().single();

  if (chart) {
    // SnapScript v0 kodunu mühürle
    await supabase.from('chart_scripts').insert([{ 
      chart_id: chart.id, 
      script: snapScriptCode // Kullanıcının yazdığı SnapScript kodları
    }]);
    alert("SnapScript v0 Modeli Başarıyla Mühürlendi!");
  }
};
