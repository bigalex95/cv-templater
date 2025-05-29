let techTagClasses = {}; // Global variable to store tech tag mappings and colors

// Function to fetch tech tag classes and colors from JSON
async function fetchTechTagClasses() {
  try {
    const response = await fetch("techTags.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    techTagClasses = await response.json();
    console.log("Tech tag classes and colors loaded:", techTagClasses);
  } catch (error) {
    console.error("Could not fetch tech tag classes:", error);
    // Fallback if fetching fails
    techTagClasses = {
      python: {
        className: "python",
        backgroundColor: "#3776ab",
        textColor: "white",
        keywords: ["python", "py"],
      },
      javascript: {
        className: "js",
        backgroundColor: "#f7df1e",
        textColor: "black",
        keywords: ["javascript", "js", "ecmascript"],
      },
      opencv: {
        className: "opencv",
        backgroundColor: "#e74c3c",
        textColor: "white",
        keywords: ["opencv"],
      },
      react: {
        className: "react",
        backgroundColor: "#61dafb",
        textColor: "#2c3e50",
        keywords: ["react", "reactjs"],
      },
      node: {
        className: "node",
        backgroundColor: "#68a063",
        textColor: "white",
        keywords: ["node", "nodejs"],
      },
      docker: {
        className: "docker",
        backgroundColor: "#2496ed",
        textColor: "white",
        keywords: ["docker"],
      },
      aws: {
        className: "aws",
        backgroundColor: "#ff9900",
        textColor: "white",
        keywords: ["aws", "amazon web services"],
      },
      angular: {
        className: "angular",
        backgroundColor: "linear-gradient(135deg, #dd0031, #c3002f)",
        textColor: "white",
        keywords: ["angular", "angularjs"],
      },
      default: {
        className: "default",
        backgroundColor: "#95a5a6",
        textColor: "white",
        keywords: ["default"],
      },
    };
  }
}

function parseMarkdown(markdown) {
  const lines = markdown.split("\n");
  const cv = {
    name: "",
    position: "",
    contact: "",
    about: "",
    skills: [],
    experience: [],
    education: [],
    projects: [], // New section
    certifications: [], // New section
  };

  let currentSection = "";
  let currentWork = null;
  let currentProject = null; // New variable for projects

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("# ")) {
      cv.name = line.substring(2);
    } else if (
      line.startsWith("## ") &&
      !line.includes("About") &&
      !line.includes("Skills") &&
      !line.includes("Work") &&
      !line.includes("Education") &&
      !line.includes("Projects") && // Added new section
      !line.includes("Certifications") // Added new section
    ) {
      cv.position = line.substring(3);
    } else if (line.startsWith("### ") && line.includes("@")) {
      cv.contact = line.substring(4);
    } else if (line.startsWith("## About")) {
      currentSection = "about";
    } else if (line.startsWith("## Skills")) {
      currentSection = "skills";
    } else if (line.startsWith("## Work Experience")) {
      currentSection = "experience";
    } else if (line.startsWith("## Education")) {
      currentSection = "education";
    } else if (line.startsWith("## Projects")) {
      // New section header
      currentSection = "projects";
    } else if (line.startsWith("## Certifications")) {
      // New section header
      currentSection = "certifications";
    } else if (line.startsWith("### ") && currentSection === "experience") {
      if (currentWork) {
        cv.experience.push(currentWork);
      }
      currentWork = {
        title: line.substring(4),
        company: "",
        period: "",
        location: "",
        description: "",
        technologies: [],
      };
    } else if (line.startsWith("### ") && currentSection === "projects") {
      // New project entry
      if (currentProject) {
        cv.projects.push(currentProject);
      }
      currentProject = {
        title: line.substring(4),
        link: "",
        description: "",
        technologies: [],
      };
    } else if (line.startsWith("**") && line.includes("|") && currentWork) {
      const parts = line.split("|").map((p) => p.trim());
      currentWork.company = parts[0].replace(/\*\*/g, "");
      if (parts[1]) currentWork.period = parts[1].replace(/\*/g, "");
      if (parts[2]) currentWork.location = parts[2].replace(/\*/g, "");
    } else if (line.startsWith("**Link:**") && currentProject) {
      // Link for projects
      currentProject.link = line.substring(9).trim();
    } else if (
      line.startsWith("**Technologies:**") &&
      (currentWork || currentProject)
    ) {
      const techString = line.substring(17);
      const technologies = techString.split(",").map((t) => t.trim());
      if (currentWork) {
        currentWork.technologies = technologies;
      } else if (currentProject) {
        currentProject.technologies = technologies;
      }
    } else if (
      line &&
      !line.startsWith("#") &&
      !line.startsWith("**Technologies:**") &&
      !line.startsWith("**Link:**") && // Exclude link line from description
      currentSection
    ) {
      if (currentSection === "about") {
        cv.about += line + " ";
      } else if (currentSection === "skills") {
        if (line.startsWith("- ")) {
          cv.skills.push(line.substring(2));
        } else if (line.trim() !== "") {
          // Add non-empty lines that don't start with "- " as they might be category headers
          cv.skills.push(line);
        }
      } else if (
        currentSection === "experience" &&
        currentWork &&
        !line.startsWith("**")
      ) {
        currentWork.description += line + " ";
      } else if (currentSection === "projects" && currentProject) {
        // Project description
        currentProject.description += line + " ";
      } else if (currentSection === "education") {
        if (line.startsWith("### ")) {
          cv.education.push(line.substring(4));
        } else if (line.startsWith("**")) {
          cv.education.push(line.replace(/\*\*/g, ""));
        } else if (line) {
          cv.education.push(line);
        }
      } else if (currentSection === "certifications") {
        // Certifications list
        if (line.startsWith("- ")) {
          cv.certifications.push(line.substring(2));
        }
      }
    }
  }

  if (currentWork) {
    cv.experience.push(currentWork);
  }
  if (currentProject) {
    // Push the last project if it exists
    cv.projects.push(currentProject);
  }

  return cv;
}

// Updated getTechTagData to use keywords for matching
function getTechTagData(tech) {
  const techLower = tech.toLowerCase();

  // Iterate through the techTagClasses object
  for (const key in techTagClasses) {
    const techData = techTagClasses[key];
    // Check if the tech name matches any of the keywords
    if (
      techData.keywords &&
      techData.keywords.some((keyword) =>
        techLower.includes(keyword.toLowerCase())
      )
    ) {
      return techData;
    }
  }
  return techTagClasses["default"]; // Fallback to default if no specific data is found
}

async function generateCV() {
  // Ensure tech tags are loaded before generating CV
  if (Object.keys(techTagClasses).length === 0) {
    await fetchTechTagClasses();
  }

  const markdown = document.getElementById("markdownInput").value;
  const cv = parseMarkdown(markdown);
  console.log("Parsed CV:", cv);

  // Get profile photo from localStorage if available
  const profilePhoto = localStorage.getItem("profilePhoto");
  const profilePictureStyle = profilePhoto
    ? `style="background-image: url('${profilePhoto}'); background-size: cover; background-position: center;"`
    : "";
  const profilePictureContent = profilePhoto ? "" : "profile<br>picture";

  let html = `
        <div class="cv-header">
            <div class="cv-header-info">
                <h1>${cv.name || "Name Surname"}</h1>
                <div class="position">${cv.position || "position title"}</div>
                <div class="contact">${
                  cv.contact ||
                  "contact info and links to github email and linkedin"
                }</div>
            </div>
            <div class="profile-picture" ${profilePictureStyle}>${profilePictureContent}</div>
        </div>
    `;

  // Conditionally render About section
  if (cv.about && cv.about.trim().length > 0) {
    html += `
        <div class="cv-section-header">about</div>
        <div class="cv-section-content">
            ${cv.about}
        </div>
    `;
  }

  // Conditionally render Skills section
  if (cv.skills && cv.skills.length > 0) {
    html += `
        <div class="cv-section-header">skills</div>
        <div class="cv-section-content">
            ${cv.skills
              .map((skill) => {
                // Check if skill contains category marker (**)
                if (skill.includes("**")) {
                  const [category, items] = skill.split(":**");
                  return `<div class="skill-category"><strong>${category.replace(
                    /\*\*/g,
                    ""
                  )}:</strong> ${items.trim()}</div>`;
                }
                return `<div>${skill}</div>`;
              })
              .join("")}
        </div>
    `;
  }

  // Conditionally render Work Experience section
  if (cv.experience && cv.experience.length > 0) {
    html += `
        <div class="cv-multi-section">
            <div class="cv-section-header">work experience</div>
            ${cv.experience
              .map((work) => {
                const techTagsHtml = work.technologies
                  .map((tech) => {
                    const techData = getTechTagData(tech);
                    return `<span class="tech-tag ${techData.className}" style="background: ${techData.backgroundColor}; color: ${techData.textColor};">${tech}</span>`;
                  })
                  .join("");
                return `
                      <div class="cv-multi-item">
                          <div class="cv-item-title">${work.title}</div>
                          <div class="cv-item-meta">${work.company} | ${work.period} | ${work.location}</div>
                          <div class="cv-item-description">${work.description}</div>
                          <div class="tech-tags">
                              ${techTagsHtml}
                          </div>
                      </div>
                  `;
              })
              .join("")}
        </div>
    `;
  }

  // Conditionally render Projects section
  if (cv.projects && cv.projects.length > 0) {
    html += `
        <div class="cv-multi-section">
            <div class="cv-section-header">projects</div>
            ${cv.projects
              .map((project) => {
                const techTagsHtml = project.technologies
                  .map((tech) => {
                    const techData = getTechTagData(tech);
                    return `<span class="tech-tag ${techData.className}" style="background: ${techData.backgroundColor}; color: ${techData.textColor};">${tech}</span>`;
                  })
                  .join("");
                const projectLink = project.link
                  ? `<div class="project-link"><a href="${project.link}" target="_blank">View Project</a></div>`
                  : "";
                return `
                      <div class="cv-multi-item">
                          <div class="cv-item-title">${project.title}</div>
                          ${projectLink}
                          <div class="cv-item-description">${project.description}</div>
                          <div class="tech-tags">
                              ${techTagsHtml}
                          </div>
                      </div>
                  `;
              })
              .join("")}
        </div>
    `;
  }

  // Conditionally render Education section
  if (cv.education && cv.education.length > 0) {
    html += `
        <div class="cv-section-header">education</div>
        <div class="cv-section-content">
            ${cv.education.map((edu) => `<div>${edu}</div>`).join("")}
        </div>
    `;
  }

  // Conditionally render Certifications section
  if (cv.certifications && cv.certifications.length > 0) {
    html += `
        <div class="cv-section-header">certifications</div>
        <div class="cv-section-content">
            <ul>
                ${cv.certifications.map((cert) => `<li>${cert}</li>`).join("")}
            </ul>
        </div>
    `;
  }

  document.getElementById("cvOutput").innerHTML = html;
}

function downloadHTML() {
  const cvContent = document.getElementById("cvOutput").innerHTML;

  // Get the actual CSS from the stylesheet
  let cssContent = "";
  const styleSheets = document.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    const sheet = styleSheets[i];
    if (sheet.href && sheet.href.includes("styles.css")) {
      try {
        const rules = sheet.cssRules || sheet.rules;
        for (let j = 0; j < rules.length; j++) {
          // Only include CV-related styles
          if (
            rules[j].selectorText &&
            (rules[j].selectorText.includes(".cv-") ||
              rules[j].selectorText.includes(".work-") ||
              rules[j].selectorText.includes(".tech-") ||
              rules[j].selectorText.includes(".profile-picture"))
          ) {
            cssContent += rules[j].cssText + "\n";
          }
        }
      } catch (e) {
        console.error("Error accessing CSS rules:", e);
      }
    }
  }

  // Add basic styles and print media query
  cssContent += `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            min-height: 100vh;
            padding: 20px;
        }

        .cv-output {
            max-width: 800px;
            margin: 0 auto;
        }

        @media print {
            body { background: white !important; }
            .cv-output { box-shadow: none !important; border: none !important; }
        }
    `;

  // Add profile photo data to the HTML if available
  const profilePhoto = localStorage.getItem("profilePhoto");
  let profilePhotoScript = "";

  if (profilePhoto) {
    profilePhotoScript = `
    <script>
      // Set profile photo from data
      window.addEventListener('DOMContentLoaded', function() {
        const profilePicture = document.querySelector('.profile-picture');
        if (profilePicture) {
          profilePicture.style.backgroundImage = 'url("${profilePhoto}")';
          profilePicture.style.backgroundSize = 'cover';
          profilePicture.style.backgroundPosition = 'center';
        }
      });
    </script>`;
  }

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My CV</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    <div class="cv-output">
        ${cvContent}
    </div>
    ${profilePhotoScript}
</body>
</html>`;

  const blob = new Blob([fullHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cv.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Add this function to handle profile photo upload
function handleProfilePhotoUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.match("image.*")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Store the image data in localStorage
      localStorage.setItem("profilePhoto", e.target.result);
      // Update the profile picture in the CV
      updateProfilePicture(e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// Function to update profile picture in the CV
function updateProfilePicture(imageData) {
  const profilePicture = document.querySelector(".profile-picture");
  if (profilePicture) {
    profilePicture.innerHTML = "";
    profilePicture.style.backgroundImage = `url(${imageData})`;
    profilePicture.style.backgroundSize = "contain";
    profilePicture.style.backgroundPosition = "center";
    profilePicture.style.backgroundRepeat = "no-repeat";
    profilePicture.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  }
}

// Generate initial CV when page loads
document.addEventListener("DOMContentLoaded", async function () {
  await generateCV();
});
