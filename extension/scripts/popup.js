// Popup script for Workday Resume Auto-Fill extension

const uploadSection = document.getElementById('uploadSection');
const fileInput = document.getElementById('resumeFile');
const autofillBtn = document.getElementById('autofillBtn');
const statusDiv = document.getElementById('status');
const aiStatusDiv = document.getElementById('aiStatus');
const uploadPrompt = document.getElementById('uploadPrompt');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');

let resumeData = null;

// Check Chrome AI availability on load
checkAIAvailability();

// Handle file upload
uploadSection.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  showStatus(`Loading ${file.name}...`, 'info');

  try {
    const text = await readFile(file);

    // Store the resume text
    resumeData = {
      fileName: file.name,
      text: text,
      parsedData: null
    };

    // Update UI
    uploadSection.classList.add('has-file');
    uploadPrompt.style.display = 'none';
    fileInfo.style.display = 'block';
    fileName.textContent = file.name;
    autofillBtn.disabled = false;

    showStatus(`✅ Resume loaded successfully!`, 'success');

    // Try to parse resume with AI
    parseResumeWithAI(text);

  } catch (error) {
    showStatus(`❌ Error reading file: ${error.message}`, 'error');
  }
});

// Auto-fill button handler
autofillBtn.addEventListener('click', async () => {
  if (!resumeData) {
    showStatus('❌ Please upload a resume first', 'error');
    return;
  }

  showStatus('🔄 Analyzing Workday form and filling fields...', 'info');
  autofillBtn.disabled = true;

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes('myworkdayjobs.com')) {
      showStatus('❌ Please navigate to a Workday job application page', 'error');
      autofillBtn.disabled = false;
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'autofill',
      resumeData: resumeData
    });

    if (response.success) {
      showStatus(`✅ Auto-filled ${response.fieldsFound} fields!`, 'success');
    } else {
      showStatus(`⚠️ ${response.message}`, 'error');
    }

  } catch (error) {
    showStatus(`❌ Error: ${error.message}`, 'error');
  } finally {
    autofillBtn.disabled = false;
  }
});

// Read file as text
async function readFile(file) {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        let text = e.target.result;

        // For PDF files, extract text using pdf.js
        if (file.name.endsWith('.pdf')) {
          showStatus('📄 Extracting text from PDF...', 'info');

          // Use the extractTextFromPDF function from pdf-extract.js
          if (window.extractTextFromPDF) {
            text = await window.extractTextFromPDF(e.target.result);
            console.log('PDF text extracted, length:', text.length);
          } else {
            throw new Error('PDF extraction library not loaded');
          }
        }

        resolve(text);
      } catch (error) {
        console.error('Error processing file:', error);
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (file.name.endsWith('.pdf')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

// Parse resume using Chrome's built-in AI
async function parseResumeWithAI(resumeText) {
  try {
    // Check if AI is available
    if (!window.ai || !window.ai.languageModel) {
      console.log('Chrome AI not available, skipping AI parsing');
      resumeData.parsedData = extractBasicInfo(resumeText);
      return;
    }

    showStatus('🤖 Parsing resume with Chrome AI...', 'info');

    const session = await window.ai.languageModel.create({
      systemPrompt: `You are a resume parser. Extract structured data from resumes.
Return ONLY valid JSON with this exact structure. Use null for missing fields.

IMPORTANT RULES:
1. Normalize ALL dates to MM/YYYY format (e.g., "June 2020" → "06/2020")
2. Use "Present" for current positions
3. Extract FULL company names (expand abbreviations when clear)
4. Separate first and last names
5. Normalize US phone numbers to (XXX) XXX-XXXX format
6. Use 2-letter state codes for US addresses (CA, NY, TX, etc.)
7. Order work experience from most recent to oldest
8. For degrees, use full names: "Bachelor of Science" not "BS"
9. If information is missing, use null (not empty string)
10. Extract ALL work experience and education entries (not just the first)

{
  "personal": {
    "firstName": "string or null",
    "lastName": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "city": "string or null",
    "state": "string (2-letter US code) or null",
    "zipCode": "string or null",
    "country": "string or null",
    "linkedin": "url or null",
    "github": "url or null",
    "portfolio": "url or null"
  },
  "summary": "string or null",
  "workExperience": [
    {
      "company": "string",
      "title": "string",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "location": "City, State or null",
      "employmentType": "Full-time|Part-time|Contract|Internship or null",
      "description": "string or null"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "Bachelor of Science|Master of Science|PhD|Associate|Bachelor of Arts|Master of Arts|etc",
      "field": "string",
      "graduationDate": "MM/YYYY",
      "gpa": "number or null"
    }
  ],
  "skills": ["array", "of", "strings"] or [],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "MM/YYYY or null",
      "expirationDate": "MM/YYYY or null"
    }
  ] or [],
  "languages": [
    {
      "language": "string",
      "proficiency": "Native|Fluent|Professional|Basic"
    }
  ] or []
}

EXAMPLE INPUT:
John Smith
john.smith@email.com | (555) 123-4567 | San Francisco, CA

EXPERIENCE
Google Inc., Mountain View, CA
Senior Software Engineer, June 2020 - Present
• Led team of 5 engineers
• Improved performance by 40%

EDUCATION
Stanford University, Stanford, CA
M.S. Computer Science, June 2022, GPA: 3.9

EXAMPLE OUTPUT:
{
  "personal": {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "(555) 123-4567",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": null,
    "country": "United States",
    "linkedin": null,
    "github": null,
    "portfolio": null
  },
  "summary": null,
  "workExperience": [
    {
      "company": "Google Inc.",
      "title": "Senior Software Engineer",
      "startDate": "06/2020",
      "endDate": "Present",
      "location": "Mountain View, CA",
      "employmentType": "Full-time",
      "description": "Led team of 5 engineers. Improved performance by 40%."
    }
  ],
  "education": [
    {
      "school": "Stanford University",
      "degree": "Master of Science",
      "field": "Computer Science",
      "graduationDate": "06/2022",
      "gpa": "3.9"
    }
  ],
  "skills": [],
  "certifications": [],
  "languages": []
}`
    });

    const result = await session.prompt(`Parse this resume and return ONLY the JSON object (no markdown, no explanation):\n\n${resumeText}`);

    try {
      // Clean up the result (remove markdown code blocks if present)
      let cleanedResult = result.trim();
      if (cleanedResult.startsWith('```')) {
        cleanedResult = cleanedResult.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }

      const parsed = JSON.parse(cleanedResult);

      // Validate the parsed data
      const validated = validateResumeData(parsed);
      resumeData.parsedData = validated;

      const fieldCount = countExtractedFields(validated);
      showStatus(`✅ Parsed ${fieldCount} fields with AI!`, 'success');

      console.log('Parsed resume data:', validated);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      console.error('AI response was:', result);
      // Fall back to manual extraction
      resumeData.parsedData = extractBasicInfo(resumeText);
      showStatus('⚠️ Using fallback parser', 'info');
    }

  } catch (error) {
    console.error('AI parsing error:', error);
    // Fall back to basic extraction
    resumeData.parsedData = extractBasicInfo(resumeText);
    showStatus('⚠️ Using fallback parser', 'info');
  }
}

// Count extracted fields for user feedback
function countExtractedFields(data) {
  let count = 0;

  if (data.personal) {
    Object.values(data.personal).forEach(v => { if (v) count++; });
  }
  if (data.summary) count++;
  if (data.workExperience) count += data.workExperience.length * 5; // avg fields per job
  if (data.education) count += data.education.length * 4; // avg fields per degree
  if (data.skills && data.skills.length) count += data.skills.length;
  if (data.certifications) count += data.certifications.length * 3;
  if (data.languages) count += data.languages.length * 2;

  return count;
}

// Fallback: Basic regex-based extraction
function extractBasicInfo(text) {
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  // Try to extract name (usually first line)
  const lines = text.split('\n').filter(l => l.trim());
  const potentialName = lines[0] || '';
  const nameParts = potentialName.split(' ');

  // Try to extract skills (common keywords)
  const skillKeywords = ['Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'AWS', 'Docker', 'SQL'];
  const skills = skillKeywords.filter(skill => text.includes(skill));

  return {
    personal: {
      firstName: nameParts[0] || null,
      lastName: nameParts.slice(1).join(' ') || null,
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      city: null,
      state: null,
      zipCode: null,
      country: null,
      linkedin: null,
      github: null,
      portfolio: null
    },
    summary: null,
    workExperience: [],
    education: [],
    skills: skills,
    certifications: [],
    languages: [],
    rawText: text
  };
}

// Validate and sanitize parsed resume data
function validateResumeData(data) {
  const validated = {
    personal: {},
    summary: null,
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  };

  // Validate personal information
  if (data.personal) {
    validated.personal = {
      firstName: validateString(data.personal.firstName),
      lastName: validateString(data.personal.lastName),
      email: validateEmail(data.personal.email),
      phone: validatePhone(data.personal.phone),
      city: validateString(data.personal.city),
      state: validateState(data.personal.state),
      zipCode: validateZipCode(data.personal.zipCode),
      country: validateString(data.personal.country),
      linkedin: validateURL(data.personal.linkedin),
      github: validateURL(data.personal.github),
      portfolio: validateURL(data.personal.portfolio)
    };
  }

  // Validate summary
  validated.summary = validateString(data.summary);

  // Validate work experience
  if (Array.isArray(data.workExperience)) {
    validated.workExperience = data.workExperience.map(job => ({
      company: validateString(job.company),
      title: validateString(job.title),
      startDate: validateDate(job.startDate),
      endDate: validateDate(job.endDate, true), // Allow "Present"
      location: validateString(job.location),
      employmentType: validateEmploymentType(job.employmentType),
      description: validateString(job.description)
    })).filter(job => job.company && job.title); // Must have company and title
  }

  // Validate education
  if (Array.isArray(data.education)) {
    validated.education = data.education.map(edu => ({
      school: validateString(edu.school),
      degree: validateString(edu.degree),
      field: validateString(edu.field),
      graduationDate: validateDate(edu.graduationDate),
      gpa: validateGPA(edu.gpa)
    })).filter(edu => edu.school && edu.degree); // Must have school and degree
  }

  // Validate skills
  if (Array.isArray(data.skills)) {
    validated.skills = data.skills
      .map(skill => validateString(skill))
      .filter(skill => skill !== null);
  }

  // Validate certifications
  if (Array.isArray(data.certifications)) {
    validated.certifications = data.certifications.map(cert => ({
      name: validateString(cert.name),
      issuer: validateString(cert.issuer),
      issueDate: validateDate(cert.issueDate),
      expirationDate: validateDate(cert.expirationDate)
    })).filter(cert => cert.name && cert.issuer);
  }

  // Validate languages
  if (Array.isArray(data.languages)) {
    validated.languages = data.languages.map(lang => ({
      language: validateString(lang.language),
      proficiency: validateProficiency(lang.proficiency)
    })).filter(lang => lang.language);
  }

  return validated;
}

// Validation helper functions
function validateString(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str.length > 0 ? str : null;
}

function validateEmail(email) {
  if (!email) return null;
  const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  return emailRegex.test(email) ? email : null;
}

function validatePhone(phone) {
  if (!phone) return null;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Must have at least 10 digits
  if (digits.length < 10) return null;

  // Format US numbers as (XXX) XXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Return original if international
  return phone;
}

function validateState(state) {
  if (!state) return null;
  const s = state.trim().toUpperCase();

  // Valid US state codes (2 letters)
  const usCodes = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];

  if (s.length === 2 && usCodes.includes(s)) {
    return s;
  }

  // Return full state name if not a code
  return state;
}

function validateZipCode(zip) {
  if (!zip) return null;
  const zipStr = String(zip).trim();

  // US ZIP: 5 or 9 digits
  if (/^\d{5}(-\d{4})?$/.test(zipStr)) {
    return zipStr;
  }

  // Return as-is for international postal codes
  return zipStr.length > 0 ? zipStr : null;
}

function validateURL(url) {
  if (!url) return null;
  const urlStr = String(url).trim();

  // Basic URL validation
  try {
    // Add protocol if missing
    const fullUrl = urlStr.startsWith('http') ? urlStr : `https://${urlStr}`;
    new URL(fullUrl);
    return urlStr;
  } catch (e) {
    return null;
  }
}

function validateDate(date, allowPresent = false) {
  if (!date) return null;

  const dateStr = String(date).trim();

  // Allow "Present" for current positions
  if (allowPresent && dateStr.toLowerCase() === 'present') {
    return 'Present';
  }

  // Check MM/YYYY format
  const dateRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
  if (dateRegex.test(dateStr)) {
    return dateStr;
  }

  // Try to parse other common formats
  // "June 2020" → "06/2020"
  const monthNames = {
    'january': '01', 'jan': '01',
    'february': '02', 'feb': '02',
    'march': '03', 'mar': '03',
    'april': '04', 'apr': '04',
    'may': '05',
    'june': '06', 'jun': '06',
    'july': '07', 'jul': '07',
    'august': '08', 'aug': '08',
    'september': '09', 'sep': '09', 'sept': '09',
    'october': '10', 'oct': '10',
    'november': '11', 'nov': '11',
    'december': '12', 'dec': '12'
  };

  const monthYearMatch = dateStr.match(/([a-z]+)\.?\s*(\d{4})/i);
  if (monthYearMatch) {
    const month = monthNames[monthYearMatch[1].toLowerCase()];
    if (month) {
      return `${month}/${monthYearMatch[2]}`;
    }
  }

  // If we can't parse it, return null
  return null;
}

function validateEmploymentType(type) {
  if (!type) return null;

  const typeStr = String(type).trim().toLowerCase();
  const validTypes = {
    'full-time': 'Full-time',
    'fulltime': 'Full-time',
    'full time': 'Full-time',
    'part-time': 'Part-time',
    'parttime': 'Part-time',
    'part time': 'Part-time',
    'contract': 'Contract',
    'contractor': 'Contract',
    'internship': 'Internship',
    'intern': 'Internship',
    'temporary': 'Temporary',
    'temp': 'Temporary',
    'freelance': 'Freelance'
  };

  return validTypes[typeStr] || null;
}

function validateGPA(gpa) {
  if (gpa === null || gpa === undefined) return null;

  const gpaNum = parseFloat(gpa);

  // GPA should be between 0 and 5 (some schools use 5.0 scale)
  if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5) {
    return null;
  }

  // Round to 2 decimal places
  return Math.round(gpaNum * 100) / 100;
}

function validateProficiency(proficiency) {
  if (!proficiency) return null;

  const profStr = String(proficiency).trim().toLowerCase();
  const validLevels = {
    'native': 'Native',
    'native speaker': 'Native',
    'fluent': 'Fluent',
    'professional': 'Professional',
    'professional working proficiency': 'Professional',
    'working proficiency': 'Professional',
    'intermediate': 'Intermediate',
    'basic': 'Basic',
    'beginner': 'Basic',
    'elementary': 'Basic'
  };

  return validLevels[profStr] || proficiency;
}

// Check if Chrome AI is available
async function checkAIAvailability() {
  try {
    if (window.ai && window.ai.languageModel) {
      const capabilities = await window.ai.languageModel.capabilities();

      if (capabilities.available === 'readily') {
        aiStatusDiv.innerHTML = `✅ <strong>Chrome AI Ready:</strong> Your resume will be parsed locally using Gemini Nano.`;
        aiStatusDiv.className = 'ai-status ready';
      } else if (capabilities.available === 'after-download') {
        aiStatusDiv.innerHTML = `⏳ <strong>AI Model Downloading:</strong> Chrome is downloading Gemini Nano. This may take a few minutes.`;
        aiStatusDiv.className = 'ai-status';
      } else {
        aiStatusDiv.innerHTML = `⚠️ <strong>AI Not Available:</strong> Using fallback parser. For best results, enable Chrome AI in <a href="chrome://flags/#prompt-api-for-gemini-nano" target="_blank">chrome://flags</a>`;
        aiStatusDiv.className = 'ai-status not-ready';
      }
    } else {
      aiStatusDiv.innerHTML = `⚠️ <strong>Chrome AI Not Supported:</strong> Please use Chrome 127+ (Canary/Dev/Beta). <a href="https://developer.chrome.com/docs/ai/get-started" target="_blank">Learn more</a>`;
      aiStatusDiv.className = 'ai-status not-ready';
    }
  } catch (error) {
    aiStatusDiv.innerHTML = `⚠️ <strong>AI Check Failed:</strong> Using fallback parser.`;
    aiStatusDiv.className = 'ai-status not-ready';
  }
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  statusDiv.style.display = 'block';

  if (type === 'success' || type === 'error') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
}
