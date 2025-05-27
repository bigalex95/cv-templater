#!/usr/bin/env python3
"""
Simple CV Converter using pypandoc
Convert CV Markdown files to PDF, DOCX, or HTML formats
"""

import pypandoc
import sys
from pathlib import Path
import argparse


def check_pypandoc():
    """Check if pypandoc is working and download pandoc if needed"""
    try:
        # This will automatically download pandoc if not found
        pypandoc.get_pandoc_version()
        return True
    except OSError:
        print("Downloading Pandoc... This may take a moment.")
        try:
            pypandoc.download_pandoc()
            return True
        except Exception as e:
            print(f"Error setting up pypandoc: {e}")
            return False


def convert_cv(input_file, output_format="pdf", output_file=None):
    """Convert CV markdown to specified format using pypandoc"""

    input_path = Path(input_file)
    if not input_path.exists():
        print(f"Error: Input file '{input_file}' not found")
        return False

    # Generate output filename if not provided
    if not output_file:
        # Create output in the appropriate subdirectory
        output_dir = Path("output") / output_format
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{input_path.stem}.{output_format}"

    output_path = Path(output_file)

    # Ensure output directory exists
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        # Extra arguments for better formatting
        extra_args = []

        if output_format == "pdf":
            # Try different PDF engines in order of preference
            pdf_engines = ["weasyprint", "wkhtmltopdf", "prince", "pdflatex", "xelatex"]

            # Try to find an available PDF engine
            engine_found = False
            for engine in pdf_engines:
                try:
                    # Check if the engine is in PATH
                    from shutil import which

                    engine_path = which(engine)
                    if engine_path:
                        print(f"Found {engine} at: {engine_path}")
                    else:
                        print(f"Engine {engine} not found in PATH")
                        continue

                    # Create a temporary file for testing
                    import tempfile

                    with tempfile.NamedTemporaryFile(
                        suffix=".pdf", delete=False
                    ) as tmp:
                        test_output = tmp.name

                    # Test if the engine is available
                    pypandoc.convert_text(
                        "Test",
                        "pdf",
                        format="markdown",
                        outputfile=test_output,
                        extra_args=[f"--pdf-engine={engine}"],
                    )

                    # If we get here, the engine works
                    print(f"Using PDF engine: {engine}")
                    extra_args = [
                        f"--pdf-engine={engine}",
                        "-V",
                        "geometry:margin=2cm",
                        "-V",
                        "fontsize=11pt",
                    ]
                    if engine in ["pdflatex", "xelatex"]:
                        extra_args.extend(["-V", "mainfont=DejaVu Sans"])
                    extra_args.append("--highlight-style=tango")
                    engine_found = True

                    # Clean up the temporary file
                    try:
                        os.unlink(test_output)
                    except:
                        pass

                    break
                except Exception as e:
                    print(f"Engine {engine} failed: {str(e)}")
                    continue

            if not engine_found:
                # Fall back to HTML and inform the user
                print("No PDF engine found. Converting to HTML instead.")
                output_format = "html"
                output_path = output_path.with_suffix(".html")
                extra_args = ["--standalone"]
        elif output_format == "docx":
            # Check if reference template exists
            ref_doc = Path("templates/reference.docx")
            if ref_doc.exists():
                extra_args = [f"--reference-doc={ref_doc}"]
        elif output_format == "html":
            extra_args = [
                "--standalone",
                (
                    "--css=templates/cv_style.css"
                    if Path("templates/cv_style.css").exists()
                    else None
                ),
            ]
            extra_args = [arg for arg in extra_args if arg]  # Remove None values

        # Convert the file
        pypandoc.convert_file(
            str(input_path),
            output_format,
            outputfile=str(output_path),
            extra_args=extra_args,
        )

        print(f"✅ Successfully converted to: {output_path}")
        return True

    except Exception as e:
        print(f"❌ Conversion failed: {e}")
        return False


def convert_all_cvs(source_dir="cv_templates", output_format="pdf"):
    """Convert all CV markdown files in the source directory"""

    source_path = Path(source_dir)
    if not source_path.exists():
        print(f"Error: Source directory '{source_dir}' not found")
        print("Creating cv_templates directory...")
        source_path.mkdir(parents=True, exist_ok=True)
        print("Please add your CV markdown files to cv_templates/")
        return

    # Create output directory
    output_dir = Path("output") / output_format
    output_dir.mkdir(parents=True, exist_ok=True)

    # Find all markdown files
    md_files = list(source_path.glob("*.md"))

    if not md_files:
        print(f"No markdown files found in '{source_dir}'")
        print("Add your CV files as .md files in the cv_templates/ directory")
        return

    print(f"Found {len(md_files)} CV files to convert to {output_format.upper()}")

    success_count = 0
    for md_file in md_files:
        output_file = output_dir / f"{md_file.stem}.{output_format}"
        print(f"Converting: {md_file.name}")
        if convert_cv(md_file, output_format, output_file):
            success_count += 1

    print(f"\n🎉 Successfully converted {success_count}/{len(md_files)} files")


def create_sample_cv():
    """Create a sample CV template if none exists"""
    cv_dir = Path("cv_templates")
    cv_dir.mkdir(exist_ok=True)

    sample_file = cv_dir / "sample_cv.md"
    if sample_file.exists():
        return

    sample_content = """# John Doe
**Software Developer**

📧 john.doe@email.com | 📱 +1-234-567-8900 | 🌐 linkedin.com/in/johndoe

---

## Professional Summary

Experienced software developer with 5+ years in full-stack development, specializing in Python and JavaScript technologies. Proven track record of delivering high-quality applications and leading development teams.

## Technical Skills

- **Languages:** Python, JavaScript, TypeScript, Java
- **Frameworks:** React, Django, FastAPI, Node.js
- **Databases:** PostgreSQL, MongoDB, Redis
- **Tools:** Git, Docker, AWS, Jenkins
- **Testing:** Jest, Pytest, Selenium

## Professional Experience

### Senior Software Developer | TechCorp Inc. (2022 - Present)
- Developed and maintained web applications serving 50,000+ active users
- Led a team of 4 junior developers, providing mentorship and code reviews
- Improved system performance by 40% through optimization and caching strategies
- Implemented CI/CD pipelines reducing deployment time by 60%

### Software Developer | StartupXYZ (2020 - 2022)
- Built RESTful APIs using Python Django serving 1M+ requests daily
- Collaborated with cross-functional teams to deliver features on tight deadlines
- Implemented automated testing increasing code coverage from 60% to 95%
- Migrated legacy systems to modern cloud infrastructure

### Junior Developer | DevStudio (2019 - 2020)
- Developed responsive web interfaces using React and modern CSS
- Participated in agile development process and daily standups
- Fixed bugs and implemented minor features in existing applications

## Education

**Bachelor of Science in Computer Science**  
State University, 2019  
*Relevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering*

## Projects

### E-commerce Platform
- Full-stack application built with React frontend and Django backend
- Integrated Stripe payment processing and inventory management
- Deployed on AWS with Docker containers
- **Tech Stack:** React, Django, PostgreSQL, Redis, AWS
- **GitHub:** github.com/johndoe/ecommerce-platform

### Task Management API
- RESTful API for team task management with real-time updates
- Implemented JWT authentication and role-based permissions
- **Tech Stack:** FastAPI, SQLAlchemy, WebSocket, PostgreSQL
- **GitHub:** github.com/johndoe/task-api

## Certifications

- **AWS Certified Developer Associate** (2023)
- **Python Institute PCAP** (2022)

---

*References available upon request*
"""

    sample_file.write_text(sample_content)
    print(f"📝 Created sample CV: {sample_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Convert CV Markdown files using pypandoc"
    )
    parser.add_argument("input", nargs="?", help="Input markdown file (optional)")
    parser.add_argument(
        "-f",
        "--format",
        choices=["pdf", "docx", "html"],
        default="pdf",
        help="Output format (default: pdf)",
    )
    parser.add_argument("-o", "--output", help="Output file path")
    parser.add_argument(
        "--all", action="store_true", help="Convert all CVs in cv_templates/"
    )
    parser.add_argument(
        "--sample", action="store_true", help="Create a sample CV template"
    )

    args = parser.parse_args()

    # Check if pypandoc is available and setup
    if not check_pypandoc():
        print("Failed to setup pypandoc. Please check your installation.")
        sys.exit(1)

    if args.sample:
        create_sample_cv()
        return

    if args.all:
        convert_all_cvs(output_format=args.format)
    elif args.input:
        convert_cv(args.input, args.format, args.output)
    else:
        print("🔧 CV Converter - Usage Examples:")
        print("")
        print("  Create sample CV:")
        print("    python convert_cv.py --sample")
        print("")
        print("  Convert single CV:")
        print("    python convert_cv.py cv_templates/my_cv.md")
        print("")
        print("  Convert all CVs to PDF:")
        print("    python convert_cv.py --all")
        print("")
        print("  Convert all CVs to DOCX:")
        print("    python convert_cv.py --all -f docx")
        print("")
        print("  Convert with custom output:")
        print("    python convert_cv.py cv_templates/my_cv.md -o resume.pdf")


if __name__ == "__main__":
    main()
