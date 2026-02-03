/**
 * @file privacy/page.tsx
 * @description The Privacy Policy page. 
 * Designed as a minimalist, text-focused page consistent with the portfolio's aesthetics.
 */

'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
	return (
		<main className="min-h-screen bg-[#050716] text-white py-20 px-4 md:px-8">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{/* Navigation link back to the main 3D scene */}
					<Link
						href="/"
						className="text-[#6366f1] hover:text-[#818cf8] transition-colors duration-300 mb-8 inline-flex items-center gap-2 font-medium"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</Link>

					<h1 className="text-5xl md:text-6xl font-bold mb-12 text-white">Privacy Policy</h1>

					<div className="text-white/80 leading-relaxed font-light space-y-6">
						<p>
							As an HCI (Human-Computer Interaction) researcher, I value digital ethics and data transparency. This policy outlines how information is handled when you interact with this professional portfolio. To understand how visitors interact with my research and 3D demonstrations, I use <strong>PostHog</strong>, an open-source, privacy-focused analytics platform.
						</p>
						<p>
							What is tracked includes page views, session patterns (including anonymous interaction replays), technical performance metrics (Web Vitals), interaction patterns (e.g., clicks on 3D elements), and device metadata. Your approximate location (City/Country) is derived from your IP address. Data is processed exclusively on EU servers (PostHog EU Cloud) to ensure compliance with European data standards.
						</p>
						<p>
							I collect this information strictly for technical research and professional development. It helps me optimize interactive 3D performance, identify high-interest research topics, and monitor the accessibility of the platform across different regions. If you use the contact form, the information you provide (Name, Email, Message) is only used to respond to your inquiry and is never sold or shared with third parties.
						</p>
						<p>
							Under GDPR, you have the right to access, rectify, or request the deletion of your data. For any inquiries regarding your privacy or data removal, please contact me directly at: <a href="mailto:gowtham.sridher5@gmail.com" className="text-[#6366f1] hover:text-[#818cf8] transition-colors underline decoration-[#6366f1]/30 underline-offset-4">gowtham.sridher5@gmail.com</a>.
						</p>

						{/* Manual timestamp for static export accuracy */}
						<div className="pt-10 border-t border-white/5 text-xs text-white/40 font-mono tracking-wider uppercase">
							Last Updated: February 03, 2026
						</div>
					</div>
				</motion.div>
			</div>
		</main>
	);
}
