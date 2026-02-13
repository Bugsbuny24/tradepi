const handleTestPayment = async (productId: string, price: number) => {
  try {
    console.log("Test Ödemesi Başlatılıyor: ", productId);
    
    const payment = await (window as any).Pi.createPayment({
      amount: price,
      memo: `Test Satın Alım: ${productId}`,
      metadata: { productId: productId, isTest: true },
    }, {
      onReadyForServerApproval: (paymentId: string) => {
        // Bu aşamada backend'e "Bu ödeme gerçek mi?" diye sorarız
        console.log("Sunucu Onayı Bekleniyor... ID:", paymentId);
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        // Ödeme bitti, izlenim veya kota mühürlerini aç!
        alert(`Test Başarılı! \nİşlem ID: ${txid} \nKota Hesabına Tanımlandı. 🚀`);
      },
      onCancel: (paymentId: string) => console.log("Ödeme İptal"),
      onError: (error: any) => alert("Hata: " + error.message),
    });
  } catch (err) {
    alert("Pi Browser ile test etmen lazım kanka!");
  }
};
