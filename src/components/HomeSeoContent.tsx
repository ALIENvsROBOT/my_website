import EnhancedSEO from '@/components/EnhancedSEO';
import AEOContent from '@/components/AEOContent';

const pageTitle = 'Gowtham Sridhar | HCI Researcher & AI Expert';
const pageDescription = 'Portfolio of Gowtham Sridhar, Junior Scientist at AIT specializing in Human-Computer Interaction, Applied AI Research, XR applications, robotics, and tangible interfaces.';
const pageUrl = 'https://www.gowthamsridhar.com';

export default function HomeSeoContent() {
  return (
    <>
      <EnhancedSEO
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        pageUrl={pageUrl}
        pagePath=""
      />
      <AEOContent />
    </>
  );
}
