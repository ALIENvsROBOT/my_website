/**
 * @file PrivacyNotice.tsx
 * @description Consent control for optional, privacy-preserving analytics.
 */

'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getAnalyticsConsent, setAnalyticsConsent } from '@/lib/analytics-consent';

/**
 * PrivacyNotice Component
 * Renders a small floating banner in the bottom-left corner after a short delay.
 */
const PrivacyNotice = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (!getAnalyticsConsent()) {
			// Delay appearance by 2 seconds to not interrupt the initial 3D load experience
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, []);

	/**
	 * Records the visitor's explicit analytics preference before enabling collection.
	 */
	const handleChoice = (choice: 'granted' | 'denied') => {
		setAnalyticsConsent(choice);
		setIsVisible(false);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.aside
					role="complementary"
					aria-label="Privacy notice"
					aria-live="polite"
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.9 }}
					className="fixed bottom-4 left-4 right-4 z-[100] md:right-auto md:bottom-6 md:left-6 max-w-[290px]"
				>
					{/* Using the project's 'glass-effect-dark' for visual consistency with 3D elements */}
					<div className="glass-effect-dark p-3 rounded-xl border border-secondary/25 shadow-xl flex flex-col gap-2">
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<p className="text-[11px] text-lightText/90 leading-tight">
									May I use optional analytics to understand page visits, link clicks, and performance? I do not record form contents or session replays. View my
									<Link href="/privacy" className="text-secondary hover:underline mx-1">Privacy Policy</Link>
									for details.
								</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<button
								onClick={() => handleChoice('denied')}
								className="py-1.5 rounded-lg border border-lightText/20 text-lightText text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300 hover:bg-white/10"
							>
								Reject
							</button>
							<button
								onClick={() => handleChoice('granted')}
								className="py-1.5 rounded-lg bg-secondary/85 hover:bg-secondary text-white text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
							>
								Accept analytics
							</button>
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
};

export default PrivacyNotice;
