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
        <body data-typography="poppins" data-theme-version="light" data-layout="vertical"
              data-nav-headerbg="color_1" data-headerbg="color_1" data-sibebarbg="color_1"
              data-sidebar-position="fixed" data-header-position="fixed" data-container="wide" data-primary="color_1">
        <AppProvidersWrapper>
            {children} {/* Tous les components clients ici */}
        </AppProvidersWrapper>
        </body>
        </html>
    );
}