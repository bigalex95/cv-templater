#!/usr/bin/env python3
"""
CV Templater - Main entry point
A simple tool to create and convert CV templates from Markdown to PDF, DOCX, or HTML formats
"""

import sys
from pathlib import Path

# Try to import the convert_cv module
try:
    from convert_cv import main as convert_main
except ImportError:
    print("Error: convert_cv.py module not found.")
    sys.exit(1)


def main():
    """Main entry point for the CV Templater application"""
    print("Welcome to CV Templater!")
    print("A simple tool to create and convert CV templates using Pandoc")
    print("-----------------------------------------------------------")

    # Check if cv_templates directory exists, create if not
    templates_dir = Path("cv_templates")
    if not templates_dir.exists():
        templates_dir.mkdir()
        print(f"Created directory: {templates_dir}")

    # Check if output directory exists, create if not
    output_dir = Path("output")
    if not output_dir.exists():
        output_dir.mkdir()
        for subdir in ["pdf", "docx", "html"]:
            (output_dir / subdir).mkdir(exist_ok=True)
        print(f"Created directory: {output_dir} with subdirectories")

    # Pass control to the convert_cv module
    convert_main()


if __name__ == "__main__":
    main()
