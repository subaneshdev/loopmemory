import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Loopmemory",
    description: "Universal memory for your AI assistants",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
