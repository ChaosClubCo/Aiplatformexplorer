/**
 * PDF Generation Service
 * 
 * @description Handles PDF generation for exports using jsPDF
 * @module services/pdfService
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Platform } from '../types';

export const pdfService = {
  /**
   * Generate Executive Summary PDF
   * 
   * @param stats - Application statistics
   * @param platforms - List of platforms to include
   */
  generateExecutiveSummary: (stats: any, platforms: Platform[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(22);
    doc.setTextColor(232, 138, 29); // Brand Orange
    doc.text('AI Platform Explorer', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);
    doc.text('Executive Summary', pageWidth / 2, 30, { align: 'center' });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 38, { align: 'center' });
    
    // Market Reality Section
    doc.setFontSize(14);
    doc.setTextColor(35, 28, 25);
    doc.text('Market Reality', 14, 50);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const marketText = [
      '• 88% of organizations are using AI, but only 6% have achieved enterprise-wide impact.',
      '• The gap is methodology, not technology.',
      '• Companies using a governance-first approach see 89% adoption vs 34% for IT-led initiatives.'
    ];
    let yPos = 60;
    marketText.forEach(line => {
      doc.text(line, 14, yPos);
      yPos += 7;
    });
    
    // Platform Overview Section
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(35, 28, 25);
    doc.text('Platform Landscape', 14, yPos);
    
    yPos += 10;
    const tableData = platforms.map(p => [
      p.name,
      p.provider,
      p.categoryLabel,
      p.marketShare,
      p.pricing
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Platform', 'Provider', 'Category', 'Market Share', 'Pricing']],
      body: tableData,
      headStyles: { fillColor: [232, 138, 29] },
      styles: { fontSize: 8 },
      theme: 'grid'
    });
    
    // Recommendations Section
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(35, 28, 25);
    doc.text('Strategic Recommendations', 14, finalY);
    
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const recommendations = [
      '• Establish a "Governance First" methodology to ensure auditability and compliance.',
      '• Focus on "Quick Wins" (6-10 weeks) to demonstrate ROI early.',
      '• Ensure Executive Sponsorship to drive adoption rates above 80%.'
    ];
    
    let recY = finalY + 10;
    recommendations.forEach(line => {
      doc.text(line, 14, recY);
      recY += 7;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('INT Inc. - AI Value Realization Consulting', 14, doc.internal.pageSize.height - 10);
    
    // Save
    doc.save('INT_AI_Executive_Summary.pdf');
  },
  
  /**
   * Generate Technical Specs PDF
   */
  generateTechnicalSpecs: (platforms: Platform[]) => {
    // Implementation for markdown/technical export could go here or remain separate
    // For now, this is a placeholder to show extensibility
    console.log('Generating technical specs for', platforms.length, 'platforms');
  }
};
