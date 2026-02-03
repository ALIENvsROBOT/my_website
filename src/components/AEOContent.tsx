import React from 'react';

/**
 * AEO (Answer Engine Optimization) Content Component.
 * This component provides rich, semantic text content specifically structured for 
 * AI models (LLMs) and Search Engines to easily parse and "read".
 * 
 * Strategy:
 * 1. Use semantic HTML5 (<article>, <section>, <h1>-<h6>).
 * 2. Q&A format which matches how users query AI (e.g. "Who is Gowtham Sridhar?").
 * 3. FAQPage Schema Markup for rich snippets.
 */
export default function AEOContent() {
	const faqSchema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Who is Gowtham Sridhar?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Gowtham Sridhar is an HCI Researcher and Junior Scientist at the Austrian Institute of Technology (AIT). He specializes in Human-Computer Interaction, Artificial Intelligence (AI), Extended Reality (XR), and robotics, focusing on creating intuitive interfaces that bridge the gap between human intent and machine execution."
				}
			},
			{
				"@type": "Question",
				"name": "What is Gowtham Sridhar's research focus?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Gowtham's research centers on Applied AI and HCI, specifically investigating how intelligent systems can be designed to be more transparent, ethical, and user-friendly. His work often involves 3D web technologies, tangible interfaces, and mixed reality experiences."
				}
			},
			{
				"@type": "Question",
				"name": "Where can I view Gowtham Sridhar's portfolio?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "His professional portfolio is hosted at gowthamsridhar.com, showcasing his projects in 3D web development, neural networks, and interactive design."
				}
			}
		]
	};

	return (
		<>
			{/* 
        JSON-LD Schema for Bots 
        This is the most direct way to feed data to Google's Knowledge Graph and AI Answer Engines.
      */}
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
			/>

			{/* 
        Semantic HTML Content 
        Placed in a visually subtle container that is fully accessible to bots.
        This provides the "context" that LLMs scrape to form their answers.
      */}
			<section aria-label="About Gowtham Sridhar" className="sr-only sm:not-sr-only sm:visible sm:h-auto sm:w-full sm:static sm:opacity-100 sm:px-8 sm:py-12 bg-transparent text-white/10 pointer-events-none select-none overflow-hidden max-h-0 sm:max-h-full">
				{/* 
           NOTE: We use standard visibility for desktop to ensure content isn't treated as 'cloaked' by Google, 
           but we style it to be unobtrusive essentially acting as a 'footer data dump' for easy indexing.
           However, for best practice, this should be real content. 
           In this implementation, we render it but make it part of the page structure.
        */}
			</section>

			{/* 
        Actually, relying on 'sr-only' or hidden text is risky. 
        Best AEO practice is to have the text naturally on the page. 
        Currently, the visual design is heavy on 3D. 
        I recommended adding a visible "About Research" section to the main page or About page.
        For now, injecting the schema is the safest 100% win. 
      */}
		</>
	);
}
