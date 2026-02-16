import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Türkçe karakterler için font kaydı (Opsiyonel ama önerilir)
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf' });

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica', color: '#334155' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  brand: { fontSize: 24, fontWeight: 'bold', color: '#1d4ed8' },
  invoiceDetails: { textAlign: 'right' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#0f172a' },
  table: { width: '100%', borderTopWidth: 1, borderColor: '#e2e8f0' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e2e8f0', paddingVertical: 10 },
  tableHeader: { backgroundColor: '#f8fafc', fontWeight: 'bold' },
  col1: { width: '60%' },
  col2: { width: '20%', textAlign: 'right' },
  col3: { width: '20%', textAlign: 'right' },
  totals: { marginTop: 30, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', width: '40%', paddingVertical: 5 },
  grandTotal: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', borderTopWidth: 2, borderColor: '#e2e8f0', paddingTop: 10 },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', color: '#94a3b8', fontSize: 10, borderTopWidth: 1, borderColor: '#e2e8f0', paddingTop: 20 }
});

export const InvoicePdf = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SnapLogic.io</Text>
          <Text style={{ marginTop: 10 }}>Teknoloji Vadisi, No: 1</Text>
          <Text>İstanbul, Türkiye</Text>
        </View>
        <View style={styles.invoiceDetails}>
          <Text style={styles.title}>FATURA</Text>
          <Text>No: {invoice.invoice_number}</Text>
          <Text>Tarih: {new Date(invoice.issued_at).toLocaleDateString('tr-TR')}</Text>
        </View>
      </View>

      {/* Müşteri Bilgisi (Örnek) */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Sayın Müşteri,</Text>
        <Text>Kullanıcı ID: {invoice.user_id}</Text>
      </View>

      {/* Tablo */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.col1}>Açıklama</Text>
          <Text style={styles.col2}>Birim Fiyat</Text>
          <Text style={styles.col3}>Tutar</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.col1}>SnapLogic Kredi Paketi (Dijital Hizmet)</Text>
          <Text style={styles.col2}>{Number(invoice.amount).toFixed(2)} ₺</Text>
          <Text style={styles.col3}>{Number(invoice.amount).toFixed(2)} ₺</Text>
        </View>
      </View>

      {/* Toplamlar */}
      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Text>Ara Toplam:</Text>
          <Text>{Number(invoice.amount).toFixed(2)} ₺</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>KDV (%20):</Text>
          <Text>{Number(invoice.tax).toFixed(2)} ₺</Text>
        </View>
        <View style={[styles.totalRow, styles.grandTotal]}>
          <Text>GENEL TOPLAM:</Text>
          <Text>{Number(invoice.total).toFixed(2)} ₺</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Bu fatura elektronik ortamda düzenlenmiştir. SnapLogic.io bir B2B SaaS platformudur.</Text>
      </View>
    </Page>
  </Document>
);
