import type { Metadata } from "next";
import "./globals.css";
import { Baloo_2, Nunito, Caveat } from 'next/font/google'
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db";

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
})

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "CaribbeOne — ain't nothin' like caribbean life !",
  description: "La plateforme de billetterie événementielle inter-îles Caraïbes.",
  keywords: "billetterie, événements, Guadeloupe, Martinique, Caraïbes, festival, concert",
  openGraph: {
    title: "CaribbeOne",
    description: "ain't nothin' like caribbean life !",
    siteName: "CaribbeOne",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | undefined;
  if (user) {
    try {
      const profile = await getProfile(user.id);
      role = profile?.role;
      if (!profile) {
        const { upsertProfile } = await import("@/lib/db");
        await upsertProfile({
          id: user.id,
          email: user.email,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          role: 'client',
        });
      }
    } catch {
      // DB pas dispo en build
    }
  }

  const headerUser = user ? { email: user.email, role } : null;

  return (
    <html lang="fr" className={`${baloo.variable} ${nunito.variable} ${caveat.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header user={headerUser} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
