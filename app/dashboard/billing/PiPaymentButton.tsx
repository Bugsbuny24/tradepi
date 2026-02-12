// Pi Browser üzerinden tetiklenecek fonksiyon
const onPiPayment = async (intentId, packageCode, amount) => {
  const payment = await window.Pi.createPayment({
    amount: amount,
    memo: `SnapLogic ${packageCode} Paketi`,
    metadata: { intentId: intentId },
  }, {
    onReadyForServerApproval: async (paymentId) => {
      // Backend'e "Ödeme hazır, onayla" diyoruz
      await fetch('/api/payments/pi/approve', {
        method: 'POST',
        body: JSON.stringify({ paymentId, intentId })
      });
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      // Blokzincir onayı geldi, kotayı tanımla!
      await fetch('/api/payments/pi/complete', {
        method: 'POST',
        body: JSON.stringify({ paymentId, txid, intentId })
      });
      alert("Krediler Hesabına Yüklendi! 🚀");
    },
    onCancel: (paymentId) => { /* İptal */ },
    onError: (error, payment) => { /* Hata */ },
  });
};
