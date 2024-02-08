'use client';
import { GeistProvider, CssBaseline } from '@geist-ui/core';

export function Providers({ children }) {
	return (
		<GeistProvider>
			<CssBaseline />
			{children}
		</GeistProvider>
	);
}
