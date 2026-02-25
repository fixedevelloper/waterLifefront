import "./globals.css";
import { Metadata } from "next";
import './globals.css'
import {AppProvidersWrapper} from "./providers/AppProvidersWrapper";
export const metadata: Metadata = {
  title: {
    template: '%s | achat rapide et securisee',
    default: 'Water life',
  },
  description: 'Plateforme investissement securise .',
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head />
        <body>
        <AppProvidersWrapper>
            {children} {/* Tous les components clients ici */}
        </AppProvidersWrapper>
        </body>
        </html>
    );
}