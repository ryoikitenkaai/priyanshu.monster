import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Imposter | Find the Spy Among You",
  description:
    "A party word game where one player gets a similar but different word. Can you find the imposter?",
  keywords: "word game, party game, imposter, word spy, friends game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
