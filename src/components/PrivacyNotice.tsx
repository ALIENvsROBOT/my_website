/**
 * @file PrivacyNotice.tsx
 * @description A subtle, non-intrusive UI component to inform users about data usage.
 * It uses localStorage to ensure it only appears once per visitor.
 */

'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * PrivacyNotice Component
 * Renders a small floating banner in the bottom-left corner after a short delay.
 */
const PRIVACY_CONSENT_KEY = 'privacy-consent:v2';

const PrivacyNotice = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		let hasConsented = false;

		try {
			hasConsented = localStorage.getItem(PRIVACY_CONSENT_KEY) === 'true';
		} catch {
			hasConsented = false;
		}

		if (!hasConsented) {
			// Delay appearance by 2 seconds to not interrupt the initial 3D load experience
			const timer = setTimeout(() => {
				setIsVisible(true);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, []);

	/**
	 * Saves the acknowledgement to localStorage and hides the notice.
	 */
	const handleAccept = () => {
		try {
			localStorage.setItem(PRIVACY_CONSENT_KEY, 'true');
		} catch {}

		setIsVisible(false);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: 20, scale: 0.9 }}
					className="fixed bottom-4 left-4 right-4 z-[100] md:right-auto md:bottom-6 md:left-6 max-w-xs"
				>
					{/* Using the project's 'glass-effect-dark' for visual consistency with 3D elements */}
					<div className="glass-effect-dark p-4 rounded-xl border border-secondary/30 shadow-2xl flex flex-col gap-3">
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<p className="text-xs text-lightText/90 leading-tight">
									I use anonymized analytics to improve these HCI experiments. View my
									<Link href="/privacy" className="text-secondary hover:underline mx-1">Privacy Policy</Link>
									for details.
								</p>
							</div>
						</div>
						<button
							onClick={handleAccept}
							className="w-full py-1.5 rounded-lg bg-secondary/80 hover:bg-secondary text-white text-[10px] font-bold uppercase tracking-wider transition-colors duration-300"
						>
							Acknowledged
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default PrivacyNotice;
