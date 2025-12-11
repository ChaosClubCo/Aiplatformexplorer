/**
 * Validation Service
 * Centralized validation logic for the application
 */

import { APP_CONFIG } from '../config/app.config';
import { PATTERNS } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  /**
   * Validate email address
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!PATTERNS.EMAIL.test(email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate URL
   */
  validateURL(url: string): ValidationResult {
    const errors: string[] = [];

    if (!url) {
      errors.push('URL is required');
    } else if (!PATTERNS.URL.test(url)) {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate search query
   */
  validateSearch(query: string): ValidationResult {
    const errors: string[] = [];
    const { minLength, maxLength } = APP_CONFIG.validation.search;

    if (query.length < minLength) {
      errors.push(`Search query must be at least ${minLength} character${minLength > 1 ? 's' : ''}`);
    }

    if (query.length > maxLength) {
      errors.push(`Search query must not exceed ${maxLength} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate team size
   */
  validateTeamSize(size: number): ValidationResult {
    const errors: string[] = [];
    const { min, max } = APP_CONFIG.validation.teamSize;

    if (size < min) {
      errors.push(`Team size must be at least ${min}`);
    }

    if (size > max) {
      errors.push(`Team size must not exceed ${max}`);
    }

    if (!Number.isInteger(size)) {
      errors.push('Team size must be a whole number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate budget
   */
  validateBudget(budget: number): ValidationResult {
    const errors: string[] = [];
    const { min, max } = APP_CONFIG.validation.budget;

    if (budget < min) {
      errors.push(`Budget must be at least $${min}`);
    }

    if (budget > max) {
      errors.push(`Budget must not exceed $${max}`);
    }

    if (budget < 0) {
      errors.push('Budget cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate required field
   */
  validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (value === null || value === undefined || value === '') {
      errors.push(`${fieldName} is required`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate array is not empty
   */
  validateArrayNotEmpty(arr: any[], fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (!Array.isArray(arr) || arr.length === 0) {
      errors.push(`${fieldName} must have at least one item`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate number range
   */
  validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];

    if (value < min) {
      errors.push(`${fieldName} must be at least ${min}`);
    }

    if (value > max) {
      errors.push(`${fieldName} must not exceed ${max}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate string length
   */
  validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];

    if (value.length < min) {
      errors.push(`${fieldName} must be at least ${min} characters`);
    }

    if (value.length > max) {
      errors.push(`${fieldName} must not exceed ${max} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate multiple fields at once
   */
  validateMultiple(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(result => result.errors);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }

  /**
   * Sanitize input string
   */
  sanitize(input: string): string {
    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '');
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number, maxSize: number, fileName: string): ValidationResult {
    const errors: string[] = [];

    if (size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      errors.push(`${fileName} exceeds maximum size of ${maxSizeMB}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate file type
   */
  validateFileType(
    fileName: string,
    allowedTypes: string[]
  ): ValidationResult {
    const errors: string[] = [];
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (!extension || !allowedTypes.includes(extension)) {
      errors.push(
        `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const validation = new ValidationService();
