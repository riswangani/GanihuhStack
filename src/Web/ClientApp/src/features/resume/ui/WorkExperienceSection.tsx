import RowItem from './RowItem'

export default function WorkExperienceSection() {
  return (
    <div className="flex flex-col gap-1">
      <RowItem date="Jun 2025 — Present" title="RADSoft System" meta="Software Engineer">
        <ul className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 list-disc pl-4 flex flex-col gap-1 text-justify">
          <li>Developed and maintained full-stack for financial web applications (including the "Atlas" project) using ASP.NET Core (C#), SQL Server, and JavaScript/TypeScript (focusing daily on Svelte, alongside Vue, jQuery, and Bootstrap).</li>
          <li>Engineered complex SQL queries (CTEs, Window Functions) to calculate financial metrics like Unrealized Valuation and Fair Value, translating complex business requirements into high-performance stored procedures.</li>
          <li>Implemented Excel export features using Syncfusion XlsIO, replicating complex grid layouts and financial attribution reports.</li>
          <li>Built and debugged REST APIs with authentication and data access layers (Dapper ORM).</li>
        </ul>
      </RowItem>

      <RowItem date="Sep 2022 — Oct 2022" title="AKOSTA" meta="Front End">
        <ul className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 list-disc pl-4 flex flex-col gap-1 text-justify">
          <li>Improved website performance and accessibility following best practices.</li>
          <li>Developed and optimized responsive UI components using React.js and Bootstrap.</li>
          <li>Collaborated with designers and back-end developers to enhance web functionality and user experience.</li>
        </ul>
      </RowItem>

      <RowItem date="Aug 2021 — Jan 2022" title="Kampus Merdeka x Dicoding" meta="Front End & Back End Developer">
        <ul className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 list-disc pl-4 flex flex-col gap-1 text-justify">
          <li>Finished Front-End Web & Back-End Web Development Learning Path (SIB) Dicoding Indonesia.</li>
          <li>Worked on case study projects, learned how to efficiently fetch, manage, and display data from RESTful APIs.</li>
          <li>Implemented API error handling, authentication, and state management in front-end projects.</li>
        </ul>
      </RowItem>

      <RowItem date="Feb 2022 — Aug 2022" title="Kampus Merdeka x Binar Academy" meta="React Native Developer">
        <ul className="font-sans text-xs text-ink-muted leading-relaxed mt-1 mb-0 list-disc pl-4 flex flex-col gap-1 text-justify">
          <li>Finished React Native Bootcamp. Focused on mobile application development using React Native.</li>
          <li>Implemented state management and integrated RESTful APIs for dynamic content.</li>
          <li>Learned and applied CI/CD pipelines to automate app deployment and updates.</li>
          <li>Gained experience in writing unit tests and end-to-end testing to ensure app reliability.</li>
        </ul>
      </RowItem>
    </div>
  )
}
