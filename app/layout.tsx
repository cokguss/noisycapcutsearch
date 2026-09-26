import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/components/LanguageProvider";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noisy - CapCut template search",
  description:
    "Search CapCut video and image templates by keyword, preview the edit before you commit, and jump straight to the template you want.",
};

const themeInit = `
(function () {
  try {
    var stored = localStorage.getItem("noisy-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${archivo.variable} ${jetbrains.variable} font-sans`}>
        <LanguageProvider>
          {children}
          <div className="grain" aria-hidden="true" />
        </LanguageProvider>
      </body>
    </html>
  );
}
