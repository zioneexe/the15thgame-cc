// src/utils/csvParser.ts
import { Risk } from '../types/types';

export const parseCSV = (csvText: string): Risk[] => {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  // Розбиваємо на рядки з урахуванням лапок
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
      if (char === '\r' && csvText[i + 1] === '\n') {
        i++;
      }
    } else {
      currentLine += char;
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine);
  }
  
  if (lines.length === 0) {
    return [];
  }
  
  const headers = parseCSVLine(lines[0]);
  const risks: Risk[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === 0 || values.every(v => !v.trim())) {
      continue;
    }
    
    const risk: Partial<Risk> = {};
    
    headers.forEach((header, index) => {
      const value = (values[index] || '').trim();
      const cleanHeader = header.trim();
      
      switch (cleanHeader) {
        case 'Category':
          risk.category = value;
          break;
        case 'Risk':
          risk.risk = value;
          break;
        case 'Probability (1-5)':
          risk.probability = parseInt(value) || 0;
          break;
        case 'Impact (1-5)':
          risk.impact = parseInt(value) || 0;
          break;
        case 'Total Risk Score (=P x l)':
          const scoreValue = parseInt(value);
          risk.totalRiskScore = !isNaN(scoreValue) ? scoreValue : 0;
          break;
        case 'Mitigation Strategy':
          risk.mitigationStrategy = value;
          break;
        case 'Status':
          risk.status = value;
          break;
        case 'Comments':
          risk.comments = value;
          break;
        case 'projectId':
          risk.projectId = value;
          break;
      }
    });
    
    if (!risk.totalRiskScore && risk.probability && risk.impact) {
      risk.totalRiskScore = risk.probability * risk.impact;
    }
    
    if (risk.category && risk.risk && risk.probability && risk.impact) {
      risks.push(risk as Risk);
    }
  }
  
  return risks;
};

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export const loadRisksFromFile = async (filePath: string): Promise<Risk[]> => {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
};