import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuditReport } from '../types';

export const generatePDF = (report: AuditReport) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // Colors
  const colors = {
    primary: [37, 99, 235], // Blue 600
    secondary: [15, 23, 42], // Slate 900
    accent: [16, 185, 129], // Emerald 500 (High scores)
    warning: [245, 158, 11], // Amber 500
    danger: [239, 68, 68], // Red 500
    text: [51, 65, 85], // Slate 700
    lightGray: [241, 245, 249] // Slate 100
  };

  // Helper: Add Footer with Page Number
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${i} of ${pageCount} | Web Optimizer Pro Audit: ${new URL(report.targetUrl).hostname}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  };

  // --- PAGE 1: COVER & EXECUTIVE SUMMARY ---

  // Header / Branding
  doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("WEB OPTIMIZER PRO", margin, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("DEEP AUDIT PROTOCOL v2.0", margin, 28);
  
  doc.text(`Scan Date: ${report.scanDate}`, pageWidth - margin, 20, { align: 'right' });
  doc.text(report.targetUrl, pageWidth - margin, 28, { align: 'right' });

  // Score Circle
  const scoreY = 70;
  const scoreColor = report.overallScore >= 80 ? colors.accent : report.overallScore >= 50 ? colors.warning : colors.danger;
  
  doc.setDrawColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setLineWidth(3);
  doc.circle(pageWidth / 2, scoreY, 20);
  
  doc.setFontSize(24);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFont("helvetica", "bold");
  doc.text(report.overallScore.toString(), pageWidth / 2, scoreY + 2, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("OVERALL SCORE", pageWidth / 2, scoreY + 28, { align: 'center' });

  // ROI Estimates
  let yPos = 110;
  doc.setFontSize(14);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text("Projected Impact", margin, yPos);
  
  yPos += 10;
  const metrics = [
    { label: "Traffic Gain", val: report.roiEstimate.trafficGain },
    { label: "Lead Increase", val: report.roiEstimate.leadIncrease },
    { label: "Est. Revenue", val: report.roiEstimate.revenueProjection }
  ];

  const colWidth = (pageWidth - (margin * 2)) / 3;
  metrics.forEach((m, i) => {
    doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.roundedRect(margin + (i * colWidth) + (i > 0 ? 5 : 0), yPos, colWidth - 5, 25, 3, 3, 'F');
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(m.label, margin + (i * colWidth) + 10, yPos + 8);
    
    doc.setFontSize(12);
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFont("helvetica", "bold");
    doc.text(m.val, margin + (i * colWidth) + 10, yPos + 18);
  });

  // Executive Summary
  yPos += 40;
  doc.setFontSize(14);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text("Executive Summary", margin, yPos);
  
  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont("helvetica", "normal");
  const splitSummary = doc.splitTextToSize(report.executiveSummary, pageWidth - (margin * 2));
  doc.text(splitSummary, margin, yPos);

  // Quick Wins
  yPos += (splitSummary.length * 5) + 10;
  doc.setFontSize(14);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Quick Wins", margin, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont("helvetica", "normal");
  report.quickWins.forEach(win => {
    doc.text(`• ${win}`, margin + 5, yPos);
    yPos += 6;
  });

  // --- PAGE 2: KEYWORDS & IMPLEMENTATION ---
  doc.addPage();
  
  // Keywords
  doc.setFontSize(16);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Keyword Strategy", margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
  doc.setFont("helvetica", "italic");
  const strategyText = doc.splitTextToSize(report.keywordStrategy, pageWidth - (margin * 2));
  doc.text(strategyText, margin, 30);

  autoTable(doc, {
    startY: 40 + (strategyText.length * 4),
    head: [['High-Intent Commercial Keywords', 'Content Topics (Blog)']],
    body: report.keywords.map((kw, i) => [
      kw, 
      report.contentStrategy?.blogTitles?.[i] || '-'
    ]),
    theme: 'striped',
    headStyles: { fillColor: colors.secondary },
    styles: { fontSize: 9 }
  });

  // Implementation Plan
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(16);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text("4-Week Implementation Roadmap", margin, finalY);

  const roadmapData = report.implementationPlan.flatMap(step => 
    step.tasks.map((task, i) => [
      i === 0 ? `Week ${step.week}: ${step.focus}` : '', // Only show week on first task
      task
    ])
  );

  autoTable(doc, {
    startY: finalY + 10,
    head: [['Phase', 'Action Items']],
    body: roadmapData,
    theme: 'grid',
    headStyles: { fillColor: colors.primary },
    columnStyles: {
      0: { fontStyle: 'bold', width: 60 }
    }
  });

  // --- PAGES 3+: DETAILED AUDIT SECTIONS ---
  doc.addPage();
  doc.setFontSize(18);
  doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
  doc.text("Detailed Audit Findings", margin, 20);
  
  let sectionY = 30;

  report.sections.forEach((section, index) => {
    // Check if we need a new page
    if (sectionY > pageHeight - 60) {
      doc.addPage();
      sectionY = 20;
    }

    // Section Header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, sectionY, pageWidth - (margin * 2), 12, 'F');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text(`${index + 1}. ${section.title}`, margin + 5, sectionY + 8);
    
    // Score Badge
    const secScoreColor = section.score >= 8 ? colors.accent : section.score >= 5 ? colors.warning : colors.danger;
    doc.setTextColor(secScoreColor[0], secScoreColor[1], secScoreColor[2]);
    doc.text(`Score: ${section.score}/10`, pageWidth - margin - 30, sectionY + 8);

    sectionY += 20;

    // Summary
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    const summary = doc.splitTextToSize(section.summary, pageWidth - (margin * 2));
    doc.text(summary, margin, sectionY);
    sectionY += (summary.length * 5) + 5;

    // Recommendations Table
    autoTable(doc, {
      startY: sectionY,
      head: [['Issue identified', 'Recommended Fix', 'Impact', 'Difficulty']],
      body: section.recommendations.map(rec => [
        rec.issue,
        rec.fix,
        rec.impact,
        rec.difficulty
      ]),
      headStyles: { 
        fillColor: section.score >= 8 ? colors.accent : section.score >= 5 ? colors.warning : colors.danger,
        textColor: 255
      },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { width: 50 },
        1: { width: 80 },
        2: { width: 20, halign: 'center' },
        3: { width: 20, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    sectionY = (doc as any).lastAutoTable.finalY + 15;
  });

  // Finalize
  addFooter();
  doc.save(`Audit_Report_${new URL(report.targetUrl).hostname}.pdf`);
};