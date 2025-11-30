// Content script for Workday Resume Auto-Fill extension
// Runs on all *.myworkdayjobs.com pages

console.log('Workday Auto-Fill extension loaded');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofill') {
    handleAutofill(request.resumeData)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, message: error.message }));

    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Main autofill handler
async function handleAutofill(resumeData) {
  console.log('Starting autofill with resume data:', resumeData);

  try {
    // Find all input fields, textareas, and select elements
    const fields = findFormFields();
    console.log(`Found ${fields.length} form fields`);

    if (fields.length === 0) {
      return {
        success: false,
        message: 'No form fields found. Make sure you\'re on a Workday application page.'
      };
    }

    // Get parsed data or use raw text
    const data = resumeData.parsedData || extractBasicInfo(resumeData.text);

    let filledCount = 0;

    // Fill each field based on its label/name/id
    for (const field of fields) {
      const fieldInfo = analyzeField(field);
      const value = mapDataToField(fieldInfo, data);

      if (value && fillField(field, value)) {
        filledCount++;
        console.log(`Filled ${fieldInfo.type} field:`, fieldInfo.label);
      }
    }

    return {
      success: true,
      fieldsFound: filledCount,
      message: `Successfully filled ${filledCount} fields`
    };

  } catch (error) {
    console.error('Autofill error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// Find all form fields on the page
function findFormFields() {
  const fields = [];

  // Find inputs, textareas, and selects
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input:not([type]), textarea');
  const selects = document.querySelectorAll('select');

  fields.push(...inputs, ...selects);

  // Filter out hidden fields
  return fields.filter(field => {
    const style = window.getComputedStyle(field);
    return style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           !field.disabled &&
           !field.readOnly;
  });
}

// Analyze a field to determine what type of data it expects
function analyzeField(field) {
  const label = getFieldLabel(field);
  const name = field.name || '';
  const id = field.id || '';
  const placeholder = field.placeholder || '';
  const type = field.type || '';

  // Combine all identifiers
  const identifiers = `${label} ${name} ${id} ${placeholder}`.toLowerCase();

  // Determine field type based on identifiers
  let fieldType = 'unknown';

  if (identifiers.match(/email|e-mail/)) {
    fieldType = 'email';
  } else if (identifiers.match(/phone|telephone|mobile|cell/)) {
    fieldType = 'phone';
  } else if (identifiers.match(/first.*name|given.*name/)) {
    fieldType = 'firstName';
  } else if (identifiers.match(/last.*name|family.*name|surname/)) {
    fieldType = 'lastName';
  } else if (identifiers.match(/^name$|full.*name|your.*name/)) {
    fieldType = 'fullName';
  } else if (identifiers.match(/address|street/)) {
    fieldType = 'address';
  } else if (identifiers.match(/city/)) {
    fieldType = 'city';
  } else if (identifiers.match(/state|province/)) {
    fieldType = 'state';
  } else if (identifiers.match(/zip|postal/)) {
    fieldType = 'zip';
  } else if (identifiers.match(/country/)) {
    fieldType = 'country';
  } else if (identifiers.match(/linkedin/)) {
    fieldType = 'linkedin';
  } else if (identifiers.match(/website|portfolio|url/)) {
    fieldType = 'website';
  } else if (identifiers.match(/summary|about|objective/)) {
    fieldType = 'summary';
  } else if (identifiers.match(/school|university|college/)) {
    fieldType = 'school';
  } else if (identifiers.match(/degree/)) {
    fieldType = 'degree';
  } else if (identifiers.match(/company|employer/)) {
    fieldType = 'company';
  } else if (identifiers.match(/title|position|role/)) {
    fieldType = 'jobTitle';
  }

  return {
    element: field,
    type: fieldType,
    label: label,
    name: name,
    id: id
  };
}

// Get the label associated with a field
function getFieldLabel(field) {
  // Try to find associated label
  if (field.id) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) return label.textContent.trim();
  }

  // Try parent label
  const parentLabel = field.closest('label');
  if (parentLabel) return parentLabel.textContent.trim();

  // Try aria-label
  if (field.getAttribute('aria-label')) {
    return field.getAttribute('aria-label');
  }

  // Try previous sibling
  let sibling = field.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === 'LABEL' || sibling.classList.contains('label')) {
      return sibling.textContent.trim();
    }
    sibling = sibling.previousElementSibling;
  }

  return '';
}

// Map parsed resume data to a field
function mapDataToField(fieldInfo, data) {
  const type = fieldInfo.type;

  // Handle new comprehensive data structure
  if (data.personal) {
    switch (type) {
      // Personal information
      case 'email':
        return data.personal.email;
      case 'phone':
        return data.personal.phone;
      case 'firstName':
        return data.personal.firstName;
      case 'lastName':
        return data.personal.lastName;
      case 'fullName':
        const first = data.personal.firstName || '';
        const last = data.personal.lastName || '';
        return first && last ? `${first} ${last}` : (first || last || null);
      case 'city':
        return data.personal.city;
      case 'state':
        return data.personal.state;
      case 'zip':
        return data.personal.zipCode;
      case 'country':
        return data.personal.country;
      case 'linkedin':
        return data.personal.linkedin;
      case 'website':
        return data.personal.portfolio;
      case 'github':
        return data.personal.github;

      // Summary
      case 'summary':
        return data.summary;

      // Education (most recent)
      case 'school':
        return data.education?.[0]?.school;
      case 'degree':
        return data.education?.[0]?.degree;
      case 'field':
      case 'major':
        return data.education?.[0]?.field;
      case 'graduationDate':
        return data.education?.[0]?.graduationDate;
      case 'gpa':
        return data.education?.[0]?.gpa;

      // Work experience (most recent)
      case 'company':
        return data.workExperience?.[0]?.company;
      case 'jobTitle':
        return data.workExperience?.[0]?.title;
      case 'startDate':
        return data.workExperience?.[0]?.startDate;
      case 'endDate':
        return data.workExperience?.[0]?.endDate;
      case 'jobLocation':
        return data.workExperience?.[0]?.location;

      // Skills (join array)
      case 'skills':
        return data.skills?.length ? data.skills.join(', ') : null;

      default:
        return null;
    }
  }

  // Fallback: handle old data structure (backward compatibility)
  if (data.name || data.email || data.phone) {
    switch (type) {
      case 'email':
        return data.email;
      case 'phone':
        return data.phone;
      case 'fullName':
        return data.name;
      case 'firstName':
        return data.name ? data.name.split(' ')[0] : null;
      case 'lastName':
        return data.name ? data.name.split(' ').slice(1).join(' ') : null;
      case 'city':
        return data.location ? data.location.split(',')[0].trim() : null;
      case 'state':
        return data.location ? data.location.split(',')[1]?.trim() : null;
      case 'summary':
        return data.summary || null;
      case 'linkedin':
        return data.linkedin || null;
      case 'website':
        return data.website || null;
      case 'school':
        return data.education?.[0]?.school || null;
      case 'degree':
        return data.education?.[0]?.degree || null;
      case 'company':
        return data.experience?.[0]?.company || null;
      case 'jobTitle':
        return data.experience?.[0]?.title || null;
      default:
        return null;
    }
  }

  // Fallback: extract from raw text
  if (data.rawText) {
    const text = data.rawText;

    switch (type) {
      case 'email':
        const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
        return emailMatch ? emailMatch[0] : null;
      case 'phone':
        const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
        return phoneMatch ? phoneMatch[0] : null;
      default:
        return null;
    }
  }

  return null;
}

// Fill a field with a value
function fillField(field, value) {
  if (!value || field.value) {
    // Skip if no value or field already has content
    return false;
  }

  // Set the value
  field.value = value;

  // Trigger events to notify Workday's JavaScript
  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new Event('blur', { bubbles: true }));

  // Focus and blur to trigger validation
  field.focus();
  setTimeout(() => field.blur(), 50);

  return true;
}

// Extract basic info from raw text (fallback)
function extractBasicInfo(text) {
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  // Try to extract name (usually first line)
  const lines = text.split('\n').filter(l => l.trim());
  const potentialName = lines[0] || '';
  const nameParts = potentialName.split(' ');

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
    skills: [],
    certifications: [],
    languages: [],
    rawText: text
  };
}
