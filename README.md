# CV Templater

A simple tool to create and convert CV templates from Markdown to PDF, DOCX, or HTML formats using Pandoc.

## GitHub Pages

This project is available online at: [https://bigalex95.github.io/cv-templater/](https://bigalex95.github.io/cv-templater/)

The GitHub Pages site demonstrates the capabilities of CV Templater and provides:

- Interactive documentation
- Sample CV templates
- Quick start guide
- Feature overview

### Setting Up GitHub Pages for Your Fork

If you fork this repository, you can set up your own GitHub Pages site:

1. Go to your repository's Settings
2. Navigate to the "Pages" section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The workflow will automatically deploy your site

The GitHub Actions workflow in `.github/workflows/pages.yml` handles:

- Building the site
- Generating sample CVs
- Converting them to HTML
- Deploying everything to GitHub Pages

## Project Structure

```
cv-templater/
├── cv_templates/          # Your CV markdown files
│   ├── software_dev_cv.md
│   ├── marketing_cv.md
│   └── general_cv.md
├── output/               # Generated CV files
│   ├── pdf/
│   ├── docx/
│   └── html/
├── templates/            # Optional reference templates
│   └── reference.docx    # Word template for styling
├── convert_cv.py        # Main conversion script
├── requirements.txt     # Python dependencies (minimal)
└── README.md
```

## Setup with uv

### 1. Install uv (if not already installed)

**Linux/macOS:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows:**

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. System Dependencies

While pypandoc handles the Pandoc installation automatically, you'll need a PDF engine for PDF conversion. The project includes WeasyPrint by default, but you can also use these alternatives:

**PDF engines (in order of preference):**

- **WeasyPrint** (included by default):

  - No additional installation needed - installed automatically with the project

- **wkhtmltopdf** (alternative):

  - Ubuntu/Debian: `sudo apt-get install wkhtmltopdf`
  - macOS: `brew install wkhtmltopdf`
  - Windows: Download from [wkhtmltopdf.org](https://wkhtmltopdf.org/downloads.html)

- **XeLaTeX/pdfLaTeX** (better typography):
  - Ubuntu/Debian: `sudo apt-get install texlive-xetex`
  - macOS: Install MacTeX from [tug.org/mactex](https://tug.org/mactex/)
  - Windows: Install MiKTeX from [miktex.org](https://miktex.org/download)

**Note:** If no PDF engine is available, the script will automatically fall back to HTML output.

### 3. Project Setup

```bash
# Clone the repository
git clone https://github.com/bigalex95/cv-templater
cd cv-templater

# Initialize the project with uv
uv init

# Add dependencies to pyproject.toml
uv add pypandoc weasyprint

# Run the converter directly with uv
uv run python convert_cv.py --sample

# Convert a CV to PDF
uv run python convert_cv.py cv_templates/sample_cv.md
```

This modern approach uses uv's project management features:

- `uv init` creates/updates the pyproject.toml file
- `uv add` manages dependencies in pyproject.toml
- `uv run` automatically creates a virtual environment and runs commands in it

For more traditional virtual environment management:

```bash
# Using standard venv (without uv)
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

## Usage

### Quick Start

```bash
# Using uv
# Create sample CV template
uv run python convert_cv.py --sample

# Convert to PDF (default)
uv run python convert_cv.py cv_templates/sample_cv.md

# Convert all CVs to DOCX
uv run python convert_cv.py --all -f docx

# Using standard venv
# (After activating your virtual environment)
# Create sample CV template
python convert_cv.py --sample

# Convert to PDF (default)
python convert_cv.py cv_templates/sample_cv.md

# Convert all CVs to DOCX
python convert_cv.py --all -f docx
```

### Convert Single CV

```bash
# Using uv
# Create a sample CV to get started
uv run python convert_cv.py --sample

# Convert to PDF (default)
uv run python convert_cv.py cv_templates/my_cv.md

# Convert to DOCX
uv run python convert_cv.py cv_templates/my_cv.md -f docx

# Convert to HTML
uv run python convert_cv.py cv_templates/my_cv.md -f html

# Specify output file
uv run python convert_cv.py cv_templates/my_cv.md -o output/my_resume.pdf

# Using standard venv
# (After activating your virtual environment)
# Create a sample CV to get started
python convert_cv.py --sample

# Convert to PDF (default)
python convert_cv.py cv_templates/my_cv.md

# Convert to DOCX
python convert_cv.py cv_templates/my_cv.md -f docx

# Convert to HTML
python convert_cv.py cv_templates/my_cv.md -f html

# Specify output file
python convert_cv.py cv_templates/my_cv.md -o output/my_resume.pdf
```

### Convert All CVs

```bash
# Using uv
# Convert all CVs to PDF
uv run python convert_cv.py --all

# Convert all CVs to DOCX
uv run python convert_cv.py --all -f docx

# Convert all CVs to HTML
uv run python convert_cv.py --all -f html

# Using standard venv
# (After activating your virtual environment)
# Convert all CVs to PDF
python convert_cv.py --all

# Convert all CVs to DOCX
python convert_cv.py --all -f docx

# Convert all CVs to HTML
python convert_cv.py --all -f html
```

## CV Markdown Template

Create your CV files in `cv_templates/` directory. Here's a basic template:

```markdown
# John Doe

**Software Developer**

📧 john.doe@email.com | 📱 +1-234-567-8900 | 🌐 linkedin.com/in/johndoe

---

## Professional Summary

Experienced software developer with 5+ years in full-stack development...

## Technical Skills

- **Languages:** Python, JavaScript, Java
- **Frameworks:** React, Django, Spring Boot
- **Databases:** PostgreSQL, MongoDB
- **Tools:** Git, Docker, AWS

## Experience

### Senior Developer | Tech Company (2022 - Present)

- Developed and maintained web applications serving 10k+ users
- Led team of 3 junior developers
- Improved system performance by 40%

### Developer | StartupCo (2020 - 2022)

- Built REST APIs using Python and Django
- Implemented CI/CD pipelines
- Collaborated with cross-functional teams

## Education

**Bachelor of Computer Science**  
University Name, 2020

## Projects

### E-commerce Platform

- Built full-stack application using React and Node.js
- Integrated payment processing and inventory management
- **GitHub:** github.com/johndoe/ecommerce

---

_References available upon request_
```

## Commands Reference

```bash
# Using uv
# Basic conversion
uv run python convert_cv.py cv_templates/my_cv.md

# Specify format and output
uv run python convert_cv.py cv_templates/my_cv.md -f docx -o resume.docx

# Convert all files
uv run python convert_cv.py --all -f pdf

# Help
uv run python convert_cv.py -h

# Using standard venv
# (After activating your virtual environment)
# Basic conversion
python convert_cv.py cv_templates/my_cv.md

# Specify format and output
python convert_cv.py cv_templates/my_cv.md -f docx -o resume.docx

# Convert all files
python convert_cv.py --all -f pdf

# Help
python convert_cv.py -h
```

## Tips for Better CVs

1. **Use consistent formatting** in your markdown
2. **Keep sections organized** with clear headers
3. **Use bullet points** for better readability
4. **Include contact information** at the top
5. **Quantify achievements** with numbers when possible

## Customizing Output

### PDF Styling

The script uses XeLaTeX for better Unicode support and sets:

- Margin: 2cm
- Font size: 11pt

### DOCX Styling

Place a `reference.docx` file in the `templates/` directory to use as a style template.

### HTML Styling

HTML output uses Pandoc's default styling, which is clean and professional.

## File Organization

```
cv_templates/
├── software_developer_cv.md    # For tech positions
├── project_manager_cv.md       # For PM roles
├── marketing_specialist_cv.md  # For marketing roles
└── general_cv.md              # General purpose

output/
├── pdf/
│   ├── software_developer_cv.pdf
│   └── project_manager_cv.pdf
├── docx/
│   └── marketing_specialist_cv.docx
└── html/
    └── general_cv.html
```

## Troubleshooting

### First Run Setup

```bash
# Using uv
# pypandoc will automatically download Pandoc on first use
uv run python convert_cv.py --sample
# This creates a sample CV and sets up pypandoc

# If download fails, you can manually trigger it:
uv run python -c "import pypandoc; pypandoc.download_pandoc()"

# Using standard venv
# (After activating your virtual environment)
# pypandoc will automatically download Pandoc on first use
python convert_cv.py --sample
# This creates a sample CV and sets up pypandoc

# If download fails, you can manually trigger it:
python -c "import pypandoc; pypandoc.download_pandoc()"
```

### Common Issues

- **Permission errors:** Make sure you have write access to the output directory
- **Font issues:** The script uses system fonts; PDFs will use available fonts
- **Large files:** First-time setup downloads Pandoc (~50MB)

## Why uv?

- **Fast:** Much faster than pip for package management
- **Reliable:** Better dependency resolution
- **Simple:** Easy virtual environment management
- **Modern:** Built with Rust for performance

## Development Workflow

```bash
# Using uv
# Add new dependencies (if needed)
uv add package-name

# Run conversion
uv run python convert_cv.py --all

# Using standard venv
# Activate environment
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate   # Windows

# Add new dependencies (if needed)
pip install package-name

# Update requirements
pip freeze > requirements.txt

# Run conversion
python convert_cv.py --all
```

This setup gives you a clean, professional way to maintain multiple CV versions and quickly convert them to any format HR departments might request.
