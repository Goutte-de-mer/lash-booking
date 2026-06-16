import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ServicesProvider } from "@/contexts/ServicesContext";

export const metadata = {
  title: "Lash booking",
  description:
    "Réservez votre rendez-vous pour des extensions de cils de qualité supérieure dans notre salon de beauté spécialisé. Offrez-vous un regard irrésistible avec nos services professionnels d'extension de cils, adaptés à vos besoins et à votre style. Réservez dès maintenant pour une expérience de beauté inoubliable.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Gabriela&family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="bg-background flex min-h-screen flex-col">
        <ServicesProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
        </ServicesProvider>
      </body>
    </html>
  );
}
