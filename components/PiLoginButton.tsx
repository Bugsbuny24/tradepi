"use client";

export default function PiLoginButton() {
  const handleClick = async () => {
    alert("CLICK OK"); // önce test: buna basınca alert çıkmalı
    // sonra buraya Pi login akışını koyacağız
    // ör: window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "10px 14px",
        border: "1px solid #111",
        borderRadius: 8,
        background: "#fff",
        cursor: "pointer",
      }}
    >
      Pi Network ile Giriş Yap
    </button>
  );
}
