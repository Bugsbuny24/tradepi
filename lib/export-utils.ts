import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { toast } from 'sonner';

/**
 * Belirtilen HTML elementini (örn: grafik konteyneri) PNG olarak indirir.
 */
export async function exportChartAsImage(elementId: string, fileName: string) {
  const node = document.getElementById(elementId);
  if (!node) {
    toast.error('Grafik bulunamadı.');
    return;
  }

  try {
    toast.loading('Görüntü hazırlanıyor...');
    const dataUrl = await toPng(node, { 
      quality: 1.0,
      backgroundColor: '#ffffff', // Saydamlık olmaması için beyaz arka plan
      style: { borderRadius: '0' } // Köşeleri düzleştir
    });
    download(dataUrl, `${fileName}.png`);
    toast.dismiss();
    toast.success('Grafik indirildi.');
  } catch (error) {
    console.error('Export hatası:', error);
    toast.dismiss();
    toast.error('Grafik dışa aktarılırken bir hata oluştu.');
  }
}
