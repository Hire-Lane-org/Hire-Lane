export interface ExtractedJobData {
  companyName?: string;
  role?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  jobPostingLink?: string;
  applicationSource?: string;
}

export function extractJobDetails(text: string): ExtractedJobData {
  if (!text || text.trim().length === 0) {
    return {};
  }

  const result: ExtractedJobData = {};
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // 1. Extract URL / Job Posting Link
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const urlMatches = text.match(urlRegex);
  if (urlMatches && urlMatches.length > 0) {
    result.jobPostingLink = urlMatches[0].replace(/[),.]+$/, '');
  }

  // 2. Identify Application Source from URL or text
  if (result.jobPostingLink) {
    const urlLower = result.jobPostingLink.toLowerCase();
    if (urlLower.includes("linkedin.com")) result.applicationSource = "LinkedIn";
    else if (urlLower.includes("indeed.com")) result.applicationSource = "Indeed";
    else if (urlLower.includes("glassdoor.com")) result.applicationSource = "Glassdoor";
    else if (urlLower.includes("wellfound.com") || urlLower.includes("angel.co")) result.applicationSource = "Wellfound";
    else if (urlLower.includes("internshala.com")) result.applicationSource = "Internshala";
    else if (urlLower.includes("careers") || urlLower.includes("greenhouse") || urlLower.includes("lever.co")) result.applicationSource = "Company Career Portal";
  }

  // 3. Extract Job Type
  const textLower = text.toLowerCase();
  if (textLower.includes("internship") || textLower.includes("intern")) {
    result.jobType = "Internship";
  } else if (textLower.includes("full-time") || textLower.includes("full time") || textLower.includes("fulltime")) {
    result.jobType = "Full-time";
  } else if (textLower.includes("part-time") || textLower.includes("part time")) {
    result.jobType = "Part-time";
  } else if (textLower.includes("contract") || textLower.includes("contractor")) {
    result.jobType = "Contract";
  } else if (textLower.includes("co-op")) {
    result.jobType = "Co-op";
  }

  // 4. Extract Experience Level
  const expMatch = text.match(/(\d+\s*[-–to]\s*\d+|\d+\+?)\s*(?:years?|yrs?)(?:\s+of)?\s*(?:experience|exp)?/i);
  if (expMatch) {
    const rawExp = expMatch[1].toLowerCase().replace(/\s+/g, '');
    if (rawExp.includes("0-1") || rawExp.includes("0-2") || rawExp === "0" || rawExp === "1") {
      result.experienceLevel = "0-1 years";
    } else if (rawExp.includes("1-3") || rawExp.includes("2-3") || rawExp === "2" || rawExp === "3") {
      result.experienceLevel = "1-3 years";
    } else if (rawExp.includes("3-5") || rawExp.includes("4-5") || rawExp === "4" || rawExp === "5") {
      result.experienceLevel = "3-5 years";
    } else {
      result.experienceLevel = "5+ years";
    }
  } else if (textLower.includes("fresher") || textLower.includes("new grad") || textLower.includes("recent graduate") || textLower.includes("entry level")) {
    result.experienceLevel = "Fresher";
  }

  // 5. Extract Location
  const commonIndianCities = ["Bangalore", "Bengaluru", "Hyderabad", "Noida", "Gurgaon", "Gurugram", "Mumbai", "Pune", "Delhi", "Chennai", "Kolkata"];
  for (const city of commonIndianCities) {
    if (new RegExp(`\\b${city}\\b`, "i").test(text)) {
      result.location = `${city}, India`;
      break;
    }
  }
  if (!result.location) {
    if (textLower.includes("remote") || textLower.includes("work from home")) {
      result.location = "Remote";
    } else {
      const locMatch = text.match(/(?:location|job location|work location|base location)[:\s]+([^\n,\r]+(?:,\s*[^\n\r]+)?)/i);
      if (locMatch && locMatch[1]) {
        result.location = locMatch[1].trim();
      }
    }
  }

  // 6. Extract Role / Position
  const commonRolePatterns = [
    /(?:software\s+development\s+engineer|software\s+engineer|sde|frontend\s+developer|frontend\s+engineer|backend\s+developer|backend\s+engineer|full\s+stack\s+developer|full\s+stack\s+engineer|web\s+developer|research\s+intern|data\s+scientist|machine\s+learning\s+engineer|product\s+manager)(?:\s+(?:intern|internship|i{1,3}|senior|lead|associate))?/i,
  ];
  for (const pattern of commonRolePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.role = match[0].split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
      break;
    }
  }

  // 7. Extract Company Name
  const companyPrefixMatch = text.match(/(?:company|organization|employer|at\s+company)[:\s]+([A-Z][A-Za-z0-9\s&.]+)/i);
  if (companyPrefixMatch && companyPrefixMatch[1]) {
    result.companyName = companyPrefixMatch[1].trim();
  } else {
    // Check known tech companies
    const knownCompanies = [
      "Google", "Amazon", "Microsoft", "Adobe", "Netflix", "Flipkart", "Meta", "Apple", "Uber", "Swiggy", "Zomato",
      "Paytm", "PhonePe", "Razorpay", "Samsung", "Cisco", "Oracle", "Salesforce", "Atlassian", "Stripe", "JPMorgan", "JP Morgan", "Goldman Sachs"
    ];
    for (const comp of knownCompanies) {
      if (new RegExp(`\\b${comp}\\b`, "i").test(text)) {
        result.companyName = comp;
        break;
      }
    }
  }

  // Fallback: Check first few lines for Role and Company if still missing
  if (lines.length >= 1) {
    if (!result.role && lines[0].length < 60 && !lines[0].includes("http")) {
      result.role = lines[0];
    }
    if (!result.companyName && lines.length >= 2 && lines[1].length < 40 && !lines[1].includes("http")) {
      result.companyName = lines[1];
    }
  }

  return result;
}
