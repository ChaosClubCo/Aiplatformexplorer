/**
 * Export Service
 * Production-grade data export utilities
 * 
 * @module services/exportService
 */

import { APP_CONFIG } from '../config/app.config';
import type { Platform } from '../types';

/**
 * Export format type
 */
export type ExportFormat = 'json' | 'csv' | 'txt';

/**
 * Export options
 */
export interface ExportOptions {
  filename?: string;
  format: ExportFormat;
  includeMetadata?: boolean;
  pretty?: boolean;
}

/**
 * Export metadata
 */
interface ExportMetadata {
  exportDate: string;
  appName: string;
  appVersion: string;
  totalRecords: number;
  format: ExportFormat;
}

/**
 * Base Export Service
 */
abstract class BaseExporter {
  abstract export(data: any, options: ExportOptions): Promise<void>;
  
  protected download(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  protected getMetadata(dataLength: number, format: ExportFormat): ExportMetadata {
    return {
      exportDate: new Date().toISOString(),
      appName: APP_CONFIG.app.name,
      appVersion: APP_CONFIG.app.version,
      totalRecords: dataLength,
      format,
    };
  }
  
  protected getFilename(options: ExportOptions): string {
    const base = options.filename || APP_CONFIG.export.defaultFileName;
    const timestamp = new Date().toISOString().split('T')[0];
    return `${base}-${timestamp}.${options.format}`;
  }
}

/**
 * JSON Exporter
 */
class JSONExporter extends BaseExporter {
  async export(data: any, options: ExportOptions): Promise<void> {
    const dataArray = Array.isArray(data) ? data : [data];
    
    const exportData = {
      ...(options.includeMetadata && {
        metadata: this.getMetadata(dataArray.length, 'json'),
      }),
      data: dataArray,
    };
    
    const content = options.pretty
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);
    
    const filename = this.getFilename(options);
    this.download(content, filename, 'application/json');
  }
}

/**
 * CSV Exporter
 */
class CSVExporter extends BaseExporter {
  async export(data: any[], options: ExportOptions): Promise<void> {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('CSV export requires non-empty array');
    }
    
    const csv = this.toCSV(data, options.includeMetadata);
    const filename = this.getFilename(options);
    this.download(csv, filename, 'text/csv');
  }
  
  private toCSV(data: any[], includeMetadata: boolean = true): string {
    const lines: string[] = [];
    
    // Add metadata as comments
    if (includeMetadata) {
      const metadata = this.getMetadata(data.length, 'csv');
      lines.push(`# Exported from ${metadata.appName} v${metadata.appVersion}`);
      lines.push(`# Export Date: ${metadata.exportDate}`);
      lines.push(`# Total Records: ${metadata.totalRecords}`);
      lines.push('');
    }
    
    // Get all possible keys
    const keys = this.getAllKeys(data);
    
    // Add header row
    lines.push(keys.map(key => this.escapeCSV(key)).join(','));
    
    // Add data rows
    for (const item of data) {
      const row = keys.map(key => {
        const value = this.getNestedValue(item, key);
        return this.escapeCSV(this.formatValue(value));
      });
      lines.push(row.join(','));
    }
    
    return lines.join('\n');
  }
  
  private getAllKeys(data: any[]): string[] {
    const keysSet = new Set<string>();
    
    for (const item of data) {
      this.extractKeys(item, '', keysSet);
    }
    
    return Array.from(keysSet).sort();
  }
  
  private extractKeys(obj: any, prefix: string, keysSet: Set<string>): void {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }
    
    if (Array.isArray(obj)) {
      if (prefix) keysSet.add(prefix);
      return;
    }
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          this.extractKeys(value, fullKey, keysSet);
        } else {
          keysSet.add(fullKey);
        }
      }
    }
  }
  
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value == null) return '';
      value = value[key];
    }
    
    return value;
  }
  
  private formatValue(value: any): string {
    if (value == null) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (Array.isArray(value)) return value.join('; ');
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  
  private escapeCSV(value: string): string {
    const str = String(value);
    
    // If contains comma, quote, or newline, wrap in quotes and escape quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    
    return str;
  }
}

/**
 * Text Exporter
 */
class TXTExporter extends BaseExporter {
  async export(data: any, options: ExportOptions): Promise<void> {
    const content = this.toText(data, options.includeMetadata);
    const filename = this.getFilename(options);
    this.download(content, filename, 'text/plain');
  }
  
  private toText(data: any, includeMetadata: boolean = true): string {
    const lines: string[] = [];
    const dataArray = Array.isArray(data) ? data : [data];
    
    // Add metadata
    if (includeMetadata) {
      const metadata = this.getMetadata(dataArray.length, 'txt');
      lines.push(`Exported from ${metadata.appName} v${metadata.appVersion}`);
      lines.push(`Export Date: ${metadata.exportDate}`);
      lines.push(`Total Records: ${metadata.totalRecords}`);
      lines.push('');
      lines.push('='.repeat(80));
      lines.push('');
    }
    
    // Add data
    for (let i = 0; i < dataArray.length; i++) {
      const item = dataArray[i];
      
      if (i > 0) {
        lines.push('');
        lines.push('-'.repeat(80));
        lines.push('');
      }
      
      lines.push(...this.formatObject(item));
    }
    
    return lines.join('\n');
  }
  
  private formatObject(obj: any, indent: number = 0): string[] {
    const lines: string[] = [];
    const prefix = '  '.repeat(indent);
    
    if (typeof obj !== 'object' || obj === null) {
      return [prefix + String(obj)];
    }
    
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        lines.push(`${prefix}[${index}]:`);
        lines.push(...this.formatObject(item, indent + 1));
      });
      return lines;
    }
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null) {
          lines.push(`${prefix}${key}:`);
          lines.push(...this.formatObject(value, indent + 1));
        } else {
          lines.push(`${prefix}${key}: ${value}`);
        }
      }
    }
    
    return lines;
  }
}

/**
 * Export Factory
 */
class ExportFactory {
  private static exporters: Record<ExportFormat, BaseExporter> = {
    json: new JSONExporter(),
    csv: new CSVExporter(),
    txt: new TXTExporter(),
  };
  
  static getExporter(format: ExportFormat): BaseExporter {
    const exporter = this.exporters[format];
    
    if (!exporter) {
      throw new Error(`Unsupported export format: ${format}`);
    }
    
    return exporter;
  }
}

/**
 * Export Service
 */
export class ExportService {
  /**
   * Export data in specified format
   */
  async export(data: any, options: Partial<ExportOptions> = {}): Promise<void> {
    const defaultOptions: ExportOptions = {
      format: 'json',
      includeMetadata: true,
      pretty: true,
      ...options,
    };
    
    try {
      const exporter = ExportFactory.getExporter(defaultOptions.format);
      await exporter.export(data, defaultOptions);
      
      // Track export event
      if (typeof window !== 'undefined' && (window as any).trackEvent) {
        (window as any).trackEvent('export_success', {
          format: defaultOptions.format,
          recordCount: Array.isArray(data) ? data.length : 1,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      
      // Track export error
      if (typeof window !== 'undefined' && (window as any).trackError) {
        (window as any).trackError(error as Error, { context: 'export' });
      }
      
      throw error;
    }
  }
  
  /**
   * Export platforms to JSON
   */
  async exportPlatformsJSON(platforms: Platform[], filename?: string): Promise<void> {
    await this.export(platforms, {
      format: 'json',
      filename: filename || 'ai-platforms',
      pretty: true,
      includeMetadata: true,
    });
  }
  
  /**
   * Export platforms to CSV
   */
  async exportPlatformsCSV(platforms: Platform[], filename?: string): Promise<void> {
    // Flatten platforms for CSV export
    const flatPlatforms = platforms.map(p => ({
      id: p.id,
      name: p.name,
      provider: p.provider,
      category: p.categoryLabel,
      marketShare: p.marketShare,
      pricing: p.pricing,
      contextWindow: p.contextWindow,
      complianceCount: p.complianceCount,
      avgScore: p.avgScore,
      features: p.features.join('; '),
    }));
    
    await this.export(flatPlatforms, {
      format: 'csv',
      filename: filename || 'ai-platforms',
      includeMetadata: true,
    });
  }
  
  /**
   * Export recommendation results
   */
  async exportRecommendations(
    recommendations: any[],
    answers: any,
    filename?: string
  ): Promise<void> {
    const exportData = {
      timestamp: new Date().toISOString(),
      answers,
      recommendations: recommendations.map(r => ({
        platform: r.platform.name,
        totalScore: r.totalScore,
        matchLevel: r.matchLevel,
        confidence: r.confidence,
        strengths: r.reasoning.strengths,
        concerns: r.reasoning.concerns,
        differentiators: r.reasoning.differentiators,
      })),
    };
    
    await this.export(exportData, {
      format: 'json',
      filename: filename || 'ai-platform-recommendations',
      pretty: true,
      includeMetadata: true,
    });
  }
  
  /**
   * Export ROI calculation results
   */
  async exportROI(roiData: any, filename?: string): Promise<void> {
    await this.export(roiData, {
      format: 'json',
      filename: filename || 'roi-calculation',
      pretty: true,
      includeMetadata: true,
    });
  }
  
  /**
   * Validate file size before export
   */
  validateFileSize(data: any, format: ExportFormat): boolean {
    const content = format === 'json'
      ? JSON.stringify(data)
      : JSON.stringify(data); // Approximate size
    
    const size = new Blob([content]).size;
    const maxSize = APP_CONFIG.export.maxFileSize;
    
    if (size > maxSize) {
      console.error(`Export file size (${size} bytes) exceeds maximum (${maxSize} bytes)`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Get export statistics
   */
  getExportStats(data: any): {
    recordCount: number;
    estimatedSize: number;
    formats: ExportFormat[];
  } {
    const dataArray = Array.isArray(data) ? data : [data];
    const content = JSON.stringify(data);
    const size = new Blob([content]).size;
    
    return {
      recordCount: dataArray.length,
      estimatedSize: size,
      formats: ['json', 'csv', 'txt'],
    };
  }
}

// Export singleton instance
export const exportService = new ExportService();

// Export individual functions for direct use
export {
  JSONExporter,
  CSVExporter,
  TXTExporter,
  ExportFactory,
};
