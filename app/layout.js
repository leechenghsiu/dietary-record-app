import { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google';

import { Providers } from './provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: 'My Dietary Record',
	description: 'Generated by create next app, using Geist UI & Vercel KV',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	// Also supported by less commonly used
	// interactiveWidget: 'resizes-visual',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Suspense>
					<Providers>{children}</Providers>
				</Suspense>
				<SpeedInsights />
			</body>
		</html>
	);
}
