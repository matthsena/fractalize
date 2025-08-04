import "./globals.css";
import { AuthProvider } from "./hooks/useAuth";

export const metadata = {
  title: "Fractalize",
  description: "SEO para a era das LLMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
