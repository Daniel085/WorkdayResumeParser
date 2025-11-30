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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      let text = e.target.result;

      // For PDF files, we'll extract text (basic extraction)
      if (file.name.endsWith('.pdf')) {
        // Note: For production, use a library like pdf.js
        // For now, we'll just use the raw text
        text = extractTextFromPDF(text);
      }

      resolve(text);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));

    if (file.name.endsWith('.pdf')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
}

// Basic PDF text extraction (placeholder - needs pdf.js for production)
function extractTextFromPDF(arrayBuffer) {
  // TODO: Implement proper PDF parsing with pdf.js
  // For now, return a message
  return "PDF_CONTENT_PLACEHOLDER - In production, we'll use pdf.js to extract text";
}

// Parse resume using Chrome's built-in AI
async function parseResumeWithAI(resumeText) {
  try {
    // Check if AI is available
    if (!window.ai || !window.ai.languageModel) {
      console.log('Chrome AI not available, skipping AI parsing');
      return;
    }

    showStatus('🤖 Parsing resume with Chrome AI...', 'info');

    const session = await window.ai.languageModel.create({
      systemPrompt: `You are a resume parser. Extract structured information from resumes.
Return ONLY valid JSON with this structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "City, State",
  "summary": "brief professional summary",
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY or Present",
      "description": "What you did"
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "graduationDate": "MM/YYYY"
    }
  ],
  "skills": ["skill1", "skill2"]
}`
    });

    const result = await session.prompt(`Parse this resume and return JSON:\n\n${resumeText}`);

    try {
      const parsed = JSON.parse(result);
      resumeData.parsedData = parsed;
      showStatus('✅ Resume parsed with AI!', 'success');
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      // Fall back to manual extraction
      resumeData.parsedData = extractBasicInfo(resumeText);
    }

  } catch (error) {
    console.error('AI parsing error:', error);
    // Fall back to basic extraction
    resumeData.parsedData = extractBasicInfo(resumeText);
  }
}

// Fallback: Basic regex-based extraction
function extractBasicInfo(text) {
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  return {
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    rawText: text
  };
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
