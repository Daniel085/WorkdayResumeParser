# Resume Parsing Field Requirements for Workday

This document outlines all fields that need to be extracted from a resume PDF to successfully auto-fill Workday job applications.

---

## 📋 Field Categories

### 1. **Personal Information** (Basic Contact)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **First Name** | ✅ Yes | String | John | Often separate field from last name |
| **Last Name** | ✅ Yes | String | Smith | Required in most forms |
| **Email** | ✅ Yes | String | john.smith@email.com | Primary contact method |
| **Phone** | ✅ Yes | String | (555) 123-4567 | Various formats accepted |
| **Country Code** | Sometimes | String | +1 | For international numbers |
| **LinkedIn** | Optional | URL | linkedin.com/in/johnsmith | Increasingly common |
| **Portfolio/Website** | Optional | URL | johnsmith.dev | For tech/creative roles |
| **GitHub** | Optional | URL | github.com/jsmith | Tech roles |

### 2. **Address Information**

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Street Address** | Sometimes | String | 123 Main Street | Not always required |
| **Address Line 2** | Optional | String | Apt 4B | |
| **City** | ✅ Yes | String | San Francisco | Often required |
| **State/Province** | ✅ Yes | String | California or CA | Both formats needed |
| **Postal/ZIP Code** | ✅ Yes | String | 94102 | US: 5 or 9 digits |
| **Country** | ✅ Yes | String | United States | Full name or code |

### 3. **Work Experience** (Repeating Section - Most Complex!)

**Per Job Entry:**

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Company Name** | ✅ Yes | String | Google Inc. | Exact name important |
| **Job Title** | ✅ Yes | String | Senior Software Engineer | Position held |
| **Start Date** | ✅ Yes | MM/YYYY | 06/2020 | Month and year required |
| **End Date** | ✅ Yes | MM/YYYY or "Present" | 12/2023 or Present | Current job = "Present" |
| **Location** | Sometimes | String | Mountain View, CA | City, State |
| **Employment Type** | Sometimes | Dropdown | Full-time, Part-time, Contract, Internship | Must match options |
| **Description** | Sometimes | Text | Led team of 5 engineers... | Bullet points or paragraph |
| **Key Achievements** | Optional | Text | Increased performance by 40% | Often separate field |
| **Reason for Leaving** | Sometimes | Text | Career growth | Sensitive field |

**Common challenges:**
- Multiple jobs (need to parse 3-5 typically)
- Current vs. past positions
- Overlapping dates (side gigs)
- Company name variations (IBM vs. International Business Machines)

### 4. **Education** (Repeating Section)

**Per Degree Entry:**

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **School Name** | ✅ Yes | String | Stanford University | Full official name |
| **Degree Type** | ✅ Yes | Dropdown | Bachelor's, Master's, PhD, Associate | Must match dropdown |
| **Field of Study** | ✅ Yes | String | Computer Science | Major/concentration |
| **Minor** | Optional | String | Mathematics | If applicable |
| **Start Date** | Sometimes | MM/YYYY | 09/2016 | Not always required |
| **Graduation Date** | ✅ Yes | MM/YYYY | 06/2020 | Month and year |
| **GPA** | Sometimes | Decimal | 3.85 | Format: X.XX (out of 4.0) |
| **Honors** | Optional | String | Magna Cum Laude | Latin honors |
| **Currently Enrolled** | Sometimes | Boolean | Yes/No | For ongoing education |

**Common challenges:**
- Multiple degrees
- Incomplete degrees
- International degree names (BSc vs. BS)
- GPA scales (4.0 vs. 5.0 vs. percentage)

### 5. **Skills** (Variable Format)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Technical Skills** | Sometimes | Array/Tags | Python, JavaScript, AWS | Comma-separated or tags |
| **Soft Skills** | Optional | Array/Tags | Leadership, Communication | Less common in Workday |
| **Proficiency Level** | Rare | Dropdown | Expert, Intermediate, Beginner | Some companies ask |
| **Years of Experience** | Sometimes | Number | 5 | Per skill |

**Common challenges:**
- Different skill categorizations
- Matching to company's predefined skill list
- Proficiency levels (Expert vs. Advanced vs. 5 years)

### 6. **Certifications & Licenses** (Repeating Section)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Certification Name** | ✅ Yes | String | AWS Certified Solutions Architect | Full name |
| **Issuing Organization** | ✅ Yes | String | Amazon Web Services | Official issuer |
| **Issue Date** | Sometimes | MM/YYYY | 03/2022 | |
| **Expiration Date** | Sometimes | MM/YYYY or "No Expiration" | 03/2025 | |
| **Credential ID** | Optional | String | ABC123XYZ | Verification number |
| **Credential URL** | Optional | URL | credly.com/badges/... | Digital badge link |

### 7. **Languages** (Repeating Section)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Language** | Sometimes | String | Spanish | Language name |
| **Proficiency** | Sometimes | Dropdown | Native, Fluent, Professional, Basic | Must match options |
| **Reading Level** | Rare | Dropdown | Advanced, Intermediate, Basic | |
| **Writing Level** | Rare | Dropdown | Advanced, Intermediate, Basic | |
| **Speaking Level** | Rare | Dropdown | Advanced, Intermediate, Basic | |

### 8. **Professional Summary/Objective**

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Summary** | Sometimes | Text (200-500 chars) | Experienced software engineer with 8+ years... | Brief overview |
| **Career Objective** | Rare | Text | Seeking senior engineering role... | Less common now |

### 9. **References** (Repeating Section - Often Separate Form)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Reference Name** | ✅ Yes | String | Jane Doe | Full name |
| **Reference Title** | ✅ Yes | String | Engineering Manager | Their position |
| **Reference Company** | ✅ Yes | String | Google Inc. | Where they work |
| **Relationship** | ✅ Yes | Dropdown | Manager, Colleague, Professor | How you know them |
| **Reference Email** | ✅ Yes | String | jane.doe@google.com | |
| **Reference Phone** | ✅ Yes | String | (555) 987-6543 | |
| **Years Known** | Sometimes | Number | 3 | How long |

**NOTE:** As of Nov 2024, Workday now collects references AFTER initial application, so this may not be in resume.

### 10. **Additional Information** (Company-Specific)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Authorized to Work** | ✅ Yes | Yes/No | Yes | Legal requirement |
| **Require Sponsorship** | ✅ Yes | Yes/No | No | Visa sponsorship |
| **Willing to Relocate** | Sometimes | Yes/No | Yes | |
| **Start Date Availability** | Sometimes | Date or "Immediate" | 2 weeks notice | |
| **Desired Salary** | Sometimes | Number or "Negotiable" | $120,000 or Negotiable | Tricky field |
| **How Did You Hear About Us** | Sometimes | Dropdown | LinkedIn, Referral, Job Board | |
| **Referral Name** | If applicable | String | Bob Jones | If referred by employee |

### 11. **Voluntary Self-Identification** (EEO/Compliance)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Gender** | Voluntary | Dropdown | Male, Female, Non-binary, Prefer not to say | |
| **Race/Ethnicity** | Voluntary | Checkboxes | Multiple selections allowed | US compliance |
| **Veteran Status** | Voluntary | Dropdown | Protected Veteran, Not a Veteran, Decline | US only |
| **Disability Status** | Voluntary | Dropdown | Yes, No, Prefer not to say | ADA compliance |

**NOTE:** These should NOT be parsed from resume - they're legally separate and optional.

### 12. **Projects/Publications** (Less Common)

| Field | Required | Format | Example | Notes |
|-------|----------|--------|---------|-------|
| **Project Name** | Optional | String | Open Source Contribution to React | |
| **Project URL** | Optional | URL | github.com/facebook/react/pull/123 | |
| **Description** | Optional | Text | Improved rendering performance... | |
| **Publication Title** | Optional | String | Machine Learning in Production | Academic roles |
| **Publication Date** | Optional | MM/YYYY | 06/2022 | |
| **Publisher** | Optional | String | IEEE | |

---

## 🎯 Priority Fields for MVP

### Must-Have (Phase 1)

```javascript
{
  // Personal
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@email.com",
  "phone": "(555) 123-4567",

  // Address
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "country": "United States",

  // Current/Most Recent Job
  "currentCompany": "Google Inc.",
  "currentTitle": "Senior Software Engineer",
  "currentStartDate": "06/2020",
  "currentEndDate": "Present",

  // Most Recent Education
  "school": "Stanford University",
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "graduationDate": "06/2020",

  // Summary
  "professionalSummary": "Experienced software engineer with 8+ years..."
}
```

### Should-Have (Phase 2)

```javascript
{
  // Multiple Work Experiences (array)
  "workExperience": [
    {
      "company": "Google Inc.",
      "title": "Senior Software Engineer",
      "startDate": "06/2020",
      "endDate": "Present",
      "location": "Mountain View, CA",
      "employmentType": "Full-time",
      "description": "Led team of 5 engineers..."
    },
    {
      "company": "Facebook",
      "title": "Software Engineer",
      "startDate": "01/2018",
      "endDate": "05/2020",
      "location": "Menlo Park, CA",
      "employmentType": "Full-time",
      "description": "Developed features for..."
    }
  ],

  // Multiple Education Entries
  "education": [
    {
      "school": "Stanford University",
      "degree": "Master of Science",
      "field": "Computer Science",
      "graduationDate": "06/2022",
      "gpa": "3.9"
    },
    {
      "school": "UC Berkeley",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "graduationDate": "06/2020",
      "gpa": "3.8"
    }
  ],

  // Skills
  "skills": ["Python", "JavaScript", "AWS", "Docker", "React"],

  // LinkedIn/Social
  "linkedinUrl": "linkedin.com/in/johnsmith",
  "githubUrl": "github.com/jsmith",
  "portfolioUrl": "johnsmith.dev"
}
```

### Nice-to-Have (Phase 3)

```javascript
{
  // Certifications
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issueDate": "03/2022",
      "expirationDate": "03/2025",
      "credentialId": "ABC123"
    }
  ],

  // Languages
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    },
    {
      "language": "Spanish",
      "proficiency": "Professional"
    }
  ],

  // Projects
  "projects": [
    {
      "name": "Open Source Contribution",
      "url": "github.com/facebook/react/pull/123",
      "description": "Improved rendering performance by 40%"
    }
  ]
}
```

---

## 🔍 Parsing Challenges

### 1. **Date Formats**

Resumes use inconsistent date formats:
- `June 2020` → `06/2020`
- `2020 - Present` → `06/2020 - Present`
- `Jan '20` → `01/2020`
- `Summer 2020` → `06/2020` (approximate)

**Solution:** AI can normalize these, but regex struggles.

### 2. **Company Name Variations**

- `IBM` vs. `International Business Machines Corporation`
- `Google` vs. `Google Inc.` vs. `Alphabet Inc.`
- `Meta` vs. `Facebook` (name changes)

**Solution:** Use AI to match canonical names, or accept variations.

### 3. **Degree Name Mapping**

- `BS` → `Bachelor of Science`
- `BSc` → `Bachelor of Science`
- `B.S.` → `Bachelor of Science`
- `Bachelor's degree in Computer Science` → Extract degree type + field

**Solution:** AI parsing or lookup tables.

### 4. **Overlapping Employment**

```
Company A: 01/2018 - Present (Full-time)
Company B: 06/2020 - 12/2022 (Part-time/Contract)
```

Workday expects one "current" job. Need to:
- Detect primary vs. secondary roles
- Handle concurrent positions
- Identify full-time vs. part-time

### 5. **International Formats**

- Phone: `+44 20 1234 5678` vs. `(555) 123-4567`
- Address: `London, UK` vs. `London, England, United Kingdom`
- Dates: `DD/MM/YYYY` vs. `MM/DD/YYYY`

---

## 📊 Field Frequency in Workday

Based on research, here's how often each category appears:

| Category | Frequency | Difficulty |
|----------|-----------|------------|
| Personal Info | 100% | Easy ⭐ |
| Address | 95% | Easy ⭐ |
| Work Experience | 100% | Hard ⭐⭐⭐⭐⭐ |
| Education | 100% | Medium ⭐⭐⭐ |
| Skills | 60% | Medium ⭐⭐⭐ |
| Summary | 40% | Easy ⭐⭐ |
| Certifications | 30% | Medium ⭐⭐⭐ |
| Languages | 20% | Easy ⭐⭐ |
| References | 50% (later) | N/A (not in resume) |
| EEO/Compliance | 100% | N/A (shouldn't parse) |

---

## 🤖 AI Prompt for Chrome AI

Here's the optimized prompt for Gemini Nano:

```javascript
const systemPrompt = `You are a resume parser. Extract structured data from resumes.
Return ONLY valid JSON with this exact structure. Use null for missing fields.

{
  "personal": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "city": "string",
    "state": "string (2-letter code if US)",
    "zipCode": "string",
    "country": "string",
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
      "location": "City, State",
      "employmentType": "Full-time|Part-time|Contract|Internship",
      "description": "string"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "Bachelor of Science|Master of Science|PhD|Associate|etc",
      "field": "string",
      "graduationDate": "MM/YYYY",
      "gpa": "number or null"
    }
  ],
  "skills": ["array", "of", "strings"],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "MM/YYYY or null",
      "expirationDate": "MM/YYYY or null"
    }
  ],
  "languages": [
    {
      "language": "string",
      "proficiency": "Native|Fluent|Professional|Basic"
    }
  ]
}

Rules:
1. Normalize all dates to MM/YYYY format
2. Use "Present" for current positions
3. Extract full company names (not abbreviations when possible)
4. Separate first and last names
5. Normalize phone numbers to (XXX) XXX-XXXX for US
6. Use 2-letter state codes (CA, NY, TX)
7. Order work experience from most recent to oldest
8. If information is missing, use null (not empty string)`;
```

---

## ✅ Validation Rules

After parsing, validate:

1. **Email:** Must match regex `/^[\w\.-]+@[\w\.-]+\.\w+$/`
2. **Phone:** Must have 10+ digits
3. **Dates:** Must be valid MM/YYYY format
4. **Required Fields:** firstName, lastName, email, phone must exist
5. **Date Logic:** startDate < endDate (unless endDate is "Present")
6. **Work Experience:** At least one entry
7. **Education:** At least one entry

---

## 🎯 Implementation Priority

### Week 1: MVP Fields
- ✅ Personal info (name, email, phone)
- ✅ Address (city, state, zip)
- ✅ Most recent job
- ✅ Most recent education

### Week 2: Full Parsing
- Work experience array (all jobs)
- Education array (all degrees)
- Skills list
- Professional summary

### Week 3: Advanced Features
- Certifications
- Languages
- Projects
- Better date normalization

---

**Sources:**
- [Workday Job Applications Made Simple](https://www.jobwizard.ai/post/workday-job-applications-made-simple)
- [Step by step Workday External Applicant Instructions](https://teex.org/wp-content/uploads/Step-by-step-Workday-External-Applicant-Instructions.pdf)
- [Workday Application Instructions - WLU](https://www.wlu.edu/employment-opportunities/staff-positions/application-instructions-for-new-external-applicants)
- [10+ Best Practice Tips For Job Applications Using the Workday ATS](https://www.linkedin.com/pulse/10-best-practice-tips-job-applications-using-workday-lisa)
