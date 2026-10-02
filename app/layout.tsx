import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "여의도 파크골프 출석",
  description: "여의도 파크골프 주말·공휴일 참석 체크",
  manifest: "/manifest.webmanifest"
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ko"><body>{children}</body></html>;
}