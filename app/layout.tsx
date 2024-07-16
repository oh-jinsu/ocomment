import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Ocomment",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>
                <header className="py-8">
                    <Link href="/" className="block text-2xl font-bold text-center mb-2">Ocomment</Link>
                    <p className="text-center">웹사이트에 댓글 섹션을 쉽고 빠르게 추가해 보세요.</p>
                </header>
                <div className="max-w-md mx-auto px-4">{children}</div>
                <footer className="py-8">
                    <p className="text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} Jinsu Oh. All rights reserved.
                    </p>
                </footer>
            </body>
        </html>
    );
}
