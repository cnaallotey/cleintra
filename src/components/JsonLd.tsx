import React from "react";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://simplecrm.app/#software",
        "name": "Simple CRM",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, Mobile, Desktop",
        "description":
          "Lightweight sales lead tracker and spreadsheet alternative for small business owners, traders, and entrepreneurs.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "featureList": [
          "Instant CSV Contact List Upload with Auto Header Cleaning",
          "One-Tap Call & WhatsApp Activity Logging",
          "Customizable Sales Pipeline Stages",
          "Contact Grouping and Segmentation",
          "Automated Phone Number Validation (Ghana & International Formats)",
          "Real-Time Cloud Firestore Sync"
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://simplecrm.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is Simple CRM different from Microsoft Excel or Google Sheets?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Spreadsheets do not remind you to follow up, validate messy phone numbers, or let you log calls and WhatsApp conversations in one tap. Simple CRM provides a purpose-built customer pipeline that prevents lost sales without formula errors."
            }
          },
          {
            "@type": "Question",
            "name": "How long does it take to import my existing customer list?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Under 30 seconds. Download your contacts as a CSV from Excel or Google Sheets and drop it into Simple CRM. Our smart importer auto-maps columns and validates phone numbers instantly."
            }
          },
          {
            "@type": "Question",
            "name": "Does Simple CRM support international and Ghana phone number formats?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Whether contacts use local Ghana formats (024, 055, 020) or international prefixes (+233, +1, +44), Simple CRM automatically cleans and standardizes them for one-tap WhatsApp and calling."
            }
          },
          {
            "@type": "Question",
            "name": "Can I customize my sales pipeline stages?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. You can customize your pipeline stages to match your exact business workflow (e.g., New Lead, Contacted, Follow-up Needed, Won, Closed)."
            }
          },
          {
            "@type": "Question",
            "name": "Is my customer data private and secure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Your data is encrypted at rest and in transit using enterprise-grade Google Cloud Firestore security. Each business has isolated tenant data access."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a credit card to get started?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No credit card is required. You can sign up with your email or Google account, upload your list, and start managing leads immediately."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
