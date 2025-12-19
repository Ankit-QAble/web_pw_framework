export const DHLCareersPageLocators = {
  acceptAll: '//button[@id="accept-recommended-btn-handler"]',
  titleText: '//strong[contains(text(),"DHL 职位")]',
  heroHeading: 'h2', // Likely the main heading in the hero section
  heroSubheading: '.hero-intro', // Assuming a class or using a generic paragraph near the hero
  sectionOurLocations: 'h2:has-text("我们的地点")', // Using text to locate the specific section header
  sectionOurLocationsDescription: 'section:has-text("我们的地点") p', // Paragraph within that section
  browseJobsLabel: 'a:has-text("浏览工作")', // Button or link with this text
  // For categories, we might need to iterate or check specific ones. 
  // We can use a container selector for the list of jobs.
  jobCategoriesList: '.job-categories-list', // Placeholder
  footerCopyright: 'footer', // Checking footer text presence
  footerLinks: 'footer .links' // Placeholder
};
