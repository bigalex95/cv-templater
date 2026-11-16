# cv-templater

Small Python script that converts a Markdown CV to PDF, DOCX or HTML using pypandoc (Pandoc) and WeasyPrint. Personal utility, not maintained.

Landing page (static): https://bigalex95.github.io/cv-templater/ - `index.html`, deployed by `.github/workflows/pages.yml`.

## What's inside

```
convert_cv.py     CLI: convert one file or all files in cv_templates/, create a sample CV
main.py           Thin wrapper that creates cv_templates/ and output/{pdf,docx,html}/ and calls convert_cv
htmltopdf.py      Standalone HTML-to-PDF helper using WeasyPrint (A4, page numbers)
index.html        Static landing page
test_script.sh    Commented-out setup notes, not an automated test
pyproject.toml, requirements.txt, uv.lock   Dependencies (pypandoc, weasyprint)
```

`cv_templates/` and `output/` are not in the repo; the script creates them on first run.

## Run

```bash
pip install -r requirements.txt        # or: uv sync
python convert_cv.py --sample          # writes cv_templates/sample_cv.md
python convert_cv.py cv_templates/sample_cv.md              # PDF (default)
python convert_cv.py cv_templates/sample_cv.md -f docx      # or -f html
python convert_cv.py --all -f html                          # every .md in cv_templates/
python convert_cv.py -o resume.pdf cv_templates/sample_cv.md
```

pypandoc downloads Pandoc on first use. For PDF the script tries `weasyprint`, `wkhtmltopdf`, `prince`, `pdflatex`, `xelatex` in turn. I did not re-run the conversions for this cleanup.

## Status

Small utility from the early days of my GitHub; no tests.

## Credits

Uses [Pandoc](https://pandoc.org/) through [pypandoc](https://github.com/JessicaTegner/pypandoc), and [WeasyPrint](https://weasyprint.org/). MIT license, see `LICENSE`.
