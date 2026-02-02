export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                function init(){
                  if(window.Pi){
                    window.Pi.init({ version: "2.0", sandbox: false });
                  }
                }
                if(document.readyState==="complete") init();
                else window.addEventListener("load", init);
              })();
            `,
          }}
        />
      </head>
      <body style={{ fontFamily: "system-ui", margin: 0, background: "#fafafa" }}>
        {children}
      </body>
    </html>
  );
}
