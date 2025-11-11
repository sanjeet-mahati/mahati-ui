import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import ContextProvider from '@/components/context-provider';
import ContextProvider from '@/navigation/context-provider';
import '../styles/global.css';
import SideNav from '@/navigation/sidebar/leftsidenavigation/sidenav';  
import Header from '../navigation/header/header';
import Footer from '../navigation/footer/footer';
const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
  title: 'Mahai UI Component ',
  description: 'Mahati Systems UI Design Component',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          {/* For Header Section */}
          <Header />
          <div className="flex">
            {/* For Side Navigation Section */}
            <SideNav />
            {/* For Mid Content Section */}
            <div className="w-full overflow-x-auto">
              <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
                <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                  <div className="w-full md:max-w-6xl">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}