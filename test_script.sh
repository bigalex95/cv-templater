# # Create a clean test directory
# mkdir -p test_cv_templater
# cd test_cv_templater

# # Clone the repository (if needed)
# git clone https://github.com/bigalex95/cv-templater .

# # Setup with uv
# uv init
# uv add pypandoc weasyprint

# 1. Create a sample CV
echo "Creating sample CV..."
uv run python convert_cv.py --sample
ls -la cv_templates/

# 2. Convert sample CV to PDF (default)
echo -e "\nConverting to PDF..."
uv run python convert_cv.py cv_templates/sample_cv.md
ls -la output/pdf/

# 3. Convert sample CV to DOCX
echo -e "\nConverting to DOCX..."
uv run python convert_cv.py cv_templates/sample_cv.md -f docx
ls -la output/docx/

# 4. Convert sample CV to HTML
echo -e "\nConverting to HTML..."
uv run python convert_cv.py cv_templates/sample_cv.md -f html
ls -la output/html/

# 5. Convert with custom output filename
echo -e "\nConverting with custom output..."
uv run python convert_cv.py cv_templates/sample_cv.md -o custom_output.pdf
ls -la custom_output.pdf

# 6. Create a second CV for testing batch conversion
echo -e "\nCreating second CV..."
cp cv_templates/sample_cv.md cv_templates/second_cv.md
sed -i 's/John Doe/Jane Smith/g' cv_templates/second_cv.md

# 7. Convert all CVs to PDF
echo -e "\nConverting all CVs to PDF..."
uv run python convert_cv.py --all
ls -la output/pdf/

# 8. Convert all CVs to DOCX
echo -e "\nConverting all CVs to DOCX..."
uv run python convert_cv.py --all -f docx
ls -la output/docx/

# 9. Convert all CVs to HTML
echo -e "\nConverting all CVs to HTML..."
uv run python convert_cv.py --all -f html
ls -la output/html/

# 10. Show help
echo -e "\nShowing help..."
uv run python convert_cv.py -h

echo -e "\nAll tests completed!"u