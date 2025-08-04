import "./globals.css";


export const metadata = {
  title: "Fractalize",
  description: "SEO para a era das LLMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
