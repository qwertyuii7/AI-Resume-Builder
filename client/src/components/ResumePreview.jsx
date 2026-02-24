import React from 'react'
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import MinimalImageTemplate from './templates/MinimalImageTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ProfessionalAcademicTemplate from './templates/ProfessionalAcademicTemplate';
import TechnicalDetailedTemplate from './templates/TechnicalDetailedTemplate';
import JakesTemplate from './templates/JakesTemplate';
import PatrickTemplate from './templates/PatrickTemplate';
import SukumarTemplate from './templates/SukumarTemplate';
import ModernIconsTemplate from './templates/ModernIconsTemplate';
import JaneTemplate from './templates/JaneTemplate';
import DanetteTemplate from './templates/DanetteTemplate';
import SebastianTemplate from './templates/SebastianTemplate';
import AlexanderTemplate from './templates/AlexanderTemplate';
import IsabelleTemplate from './templates/IsabelleTemplate';
import TwoColumnTemplate from './templates/TwoColumnTemplate';
import ModernTealTemplate from './templates/ModernTealTemplate';
import SerifClassicTemplate from './templates/SerifClassicTemplate';
import CleanBlueTemplate from './templates/CleanBlueTemplate';
import DetailedProfessionalTemplate from './templates/DetailedProfessionalTemplate';


const ResumePreview = ({ data, template, accentColor }) => {

  const renderTemplate = () => {
    switch (template) {
      case "modern": return <ModernTemplate data={data} accentColor={accentColor} />;
      case "minimal": return <MinimalTemplate data={data} accentColor={accentColor} />;
      case "minimal-image": return <MinimalImageTemplate data={data} accentColor={accentColor} />;
      case "professional-academic": return <ProfessionalAcademicTemplate data={data} accentColor={accentColor} />;
      case "technical-detailed": return <TechnicalDetailedTemplate data={data} accentColor={accentColor} />;
      case "jakes-style": return <JakesTemplate data={data} accentColor={accentColor} />;
      case "patrick-style": return <PatrickTemplate data={data} accentColor={accentColor} />;
      case "sukumar-style": return <SukumarTemplate data={data} />;
      case "modern-icons": return <ModernIconsTemplate data={data} accentColor={accentColor} />;
      case "jane-style": return <JaneTemplate data={data} accentColor={accentColor} />;
      case "danette-style": return <DanetteTemplate data={data} accentColor={accentColor} />;
      case "sebastian-style": return <SebastianTemplate data={data} accentColor={accentColor} />;
      case "alexander-style": return <AlexanderTemplate data={data} accentColor={accentColor} />;
      case "isabelle-style": return <IsabelleTemplate data={data} accentColor={accentColor} />;
      case "two-column-purple": return <TwoColumnTemplate data={data} accentColor={accentColor} />;
      case "modern-teal": return <ModernTealTemplate data={data} accentColor={accentColor} />;
      case "serif-classic": return <SerifClassicTemplate data={data} accentColor={accentColor} />;
      case "clean-blue": return <CleanBlueTemplate data={data} accentColor={accentColor} />;
      case "detailed-professional": return <DetailedProfessionalTemplate data={data} accentColor={accentColor} />;
      default: return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
  };

  return (
    <div className="relative">
      {/* Screen Preview Wrapper */}
      <div
        id="resume-preview"
        className="w-[210mm] min-h-[297mm] bg-white origin-top shadow-sm print:shadow-none"
        style={{
          // Simulating A4 Dimensions visually
          width: '210mm',
          minHeight: '297mm',
        }}
      >
        {renderTemplate()}
      </div>

      {/* Print Specific Styles */}
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
            padding: 0;
          }

          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }

            html,
            body,
            #root {
              width: 100%;
              height: auto;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }

            body * {
              visibility: hidden !important;
            }

            #resume-preview,
            #resume-preview * {
              visibility: visible !important;
            }

            #resume-preview {
              width: 210mm !important;
              min-height: auto !important;
              height: auto !important;
              margin: 0 auto !important;
              padding: 0 !important;
              background: white !important;
              box-shadow: none !important;
              position: static !important;
              transform: none !important;
              -webkit-transform: none !important;
              display: block !important;
              page-break-inside: auto !important;
              page-break-after: auto !important;
              page-break-before: auto !important;
            }

            #resume-preview .shadow-lg,
            #resume-preview .shadow-xl,
            #resume-preview .shadow-2xl {
              box-shadow: none !important;
            }

            #resume-preview a {
              color: inherit !important;
              text-decoration: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ResumePreview;