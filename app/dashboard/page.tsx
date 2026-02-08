"use client";
import { saveChart } from "./actions"; // Yukarıdaki action'ı çağır
import { toast } from "sonner"; // Bildirim için (opsiyonel)

// ... mevcut state'lerin yanına ekle
const [isSaving, setIsSaving] = useState(false);
const [title, setTitle] = useState("Yeni Analiz");

const handleSave = async () => {
  setIsSaving(true);
  try {
    const result = await saveChart({
      title: title,
      content: { raw: dataInput }, // Veriyi JSON yapıyoruz
      script: "// SnapScript v0 logic\n" + scriptInput
    });
    
    if (result.success) {
      alert(`Mühürlendi! Embed Token: ${result.token}`);
    }
  } catch (err) {
    alert("Hata oluştu kanka!");
  } finally {
    setIsSaving(false);
  }
};

// ... Render kısmındaki butona onClick={handleSave} ekle
<button 
  disabled={isSaving}
  onClick={handleSave}
  className="..."
>
  {isSaving ? "MÜHÜRLENİYOR..." : "PROJEYİ MÜHÜRLE"}
</button>
