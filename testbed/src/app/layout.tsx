import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import ContextProvider from '@/navigation/context-provider';

import '@mahatisystems/mahati-ui-components/styles';

import '../styles/globals.css';
import SideNav from '@/navigation/sidebar/leftsidenavigation/sidenav';
import Header from '../navigation/header/header';
import Footer from '../navigation/footer/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mahati UI Component ',
  description: 'Mahati Systems UI Design Component',
};

const SIDENAV_COOKIE_KEY = 'sidebarExpanded';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ Read cookie on the SERVER so SSR renders correct open/close state
  const cookieStore = await cookies();
  const cookieVal = cookieStore.get(SIDENAV_COOKIE_KEY)?.value;

  // Default open if cookie missing
  const initialExpanded = cookieVal === undefined ? true : cookieVal === '1';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ContextProvider>
          {/* For Header Section */}
          <Header />
          <div className="flex">
            {/* For Side Navigation Section */}
            <SideNav initialExpanded={initialExpanded} />
            {/* For Mid Content Section */}
            <div className="w-full overflow-x-auto">
              <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
                <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                  <div className="w-full md:max-w-6xl">{children}</div>
                </div>
              </div>
            </div>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}