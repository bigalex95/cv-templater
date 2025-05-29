from weasyprint import HTML, CSS

# Define CSS as string or separate file
css = CSS(
    string="""
    @page {
        margin: 0.4cm;  /* Reduced from 0.6cm */
        size: A4;
        @bottom-center {
            content: "Page " counter(page);
            font-size: 9pt;
        }
    }
    
    /* Global font size adjustments */
    body {
        font-size: 10pt;
        margin: 0;
        padding: 0;
    }
    
    .cv-header {
        padding: 20px;  /* Reduced from 25px */
    }
    
    .cv-header h1 {
        font-size: 20pt;
        margin-bottom: 3px;  /* Reduced from 4px */
    }
    
    .cv-header .position {
        font-size: 12pt;
        margin-bottom: 6px;  /* Reduced from 8px */
    }
    
    .cv-header .contact {
        font-size: 9pt;
    }
    
    .cv-section-header {
        font-size: 11pt;
        padding: 6px 12px;  /* Reduced from 8px 15px */
        margin: 8px 0px 0px;  /* Reduced from 12px */
        page-break-before: auto;
        page-break-after: avoid;
    }
    
    .cv-section-content {
        font-size: 10pt;
        padding: 8px 12px;  /* Reduced from 12px 15px */
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    /* Work experience section specific controls */
    .cv-multi-item {
        padding: 6px 10px;  /* Further reduced padding */
        margin-bottom: 4px;  /* Further reduced margin */
        page-break-inside: avoid;
        break-inside: avoid;
    }
    
    /* Target the work experience section specifically */
    .cv-section-header:has(+ .cv-multi-section) + .cv-multi-section .cv-multi-item:nth-child(2) {
        page-break-before: always;
        break-before: page;
    }
    
    /* Alternative selector if :has() is not supported */
    div[class*="work-experience"] .cv-multi-item:nth-child(2),
    #work-experience .cv-multi-item:nth-child(2) {
        page-break-before: always;
        break-before: page;
    }
    
    /* Adjustments for tech tags */
    .tech-tag {
        font-size: 8pt;
        padding: 1px 4px;  /* Reduced from 2px 6px */
        margin: 1px;  /* Reduced from 2px */
    }
"""
)

# Apply CSS when converting
HTML("cv.html").write_pdf("cv.pdf", stylesheets=[css])
