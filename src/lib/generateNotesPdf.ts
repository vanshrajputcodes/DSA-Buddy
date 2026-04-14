import jsPDF from "jspdf";

interface NotesSection {
  title: string;
  content: string[];
  color: string;
}

const COLORS: Record<string, [number, number, number]> = {
  primary: [99, 102, 241],    // Indigo
  secondary: [16, 185, 129],  // Green
  accent: [249, 115, 22],     // Orange
  pink: [236, 72, 153],       // Pink
  purple: [168, 85, 247],     // Purple
  blue: [59, 130, 246],       // Blue
  teal: [20, 184, 166],       // Teal
  red: [239, 68, 68],         // Red
};

const COLOR_CYCLE: (keyof typeof COLORS)[] = ["primary", "secondary", "accent", "pink", "purple", "blue", "teal", "red"];

export const generateNotesPdf = (topic: string, notesContent: string): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Decorative header with gradient effect
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 50, "F");
  doc.setFillColor(168, 85, 247);
  doc.rect(0, 45, pageWidth, 10, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text(`📚 ${topic}`, margin, 25);

  // Subtitle
  doc.setFontSize(11);
  doc.setTextColor(220, 220, 255);
  doc.text("DSA Dost Premium Notes | With Diagrams & Examples", margin, 35);
  
  // FREE badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 50, 15, 35, 12, 3, 3, "F");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("100% FREE!", pageWidth - 48, 23);

  yPos = 65;

  // Parse content into sections
  const sections = parseNotesContent(notesContent);

  sections.forEach((section, sectionIndex) => {
    const colorKey = COLOR_CYCLE[sectionIndex % COLOR_CYCLE.length];
    const color = COLORS[colorKey];

    // Check for page break
    if (yPos > pageHeight - 50) {
      doc.addPage();
      yPos = margin + 10;
      
      // Add header to new page
      doc.setFillColor(245, 243, 255);
      doc.rect(0, 0, pageWidth, 20, "F");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(`${topic} - Continued`, margin, 12);
      yPos = 30;
    }

    // Section header with colored background
    doc.setFillColor(color[0], color[1], color[2]);
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.roundedRect(margin - 2, yPos - 5, contentWidth + 4, 10, 2, 2, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin + 2, yPos + 2);

    yPos += 15;

    // Section content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    section.content.forEach((line) => {
      if (yPos > pageHeight - 25) {
        doc.addPage();
        yPos = margin + 10;
      }

      const trimmedLine = line.trim();
      
      // ASCII diagram detection (box characters or multiple special chars)
      if (/[┌┐└┘│─┬┴├┤┼═║╔╗╚╝╠╣╬]/.test(trimmedLine) || 
          (trimmedLine.includes("─") || trimmedLine.includes("│") || 
           trimmedLine.match(/\[.+\]/g)?.length! >= 3)) {
        // Code/diagram block
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(220, 220, 220);
        
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(trimmedLine, margin + 4, yPos);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        yPos += 5;
      }
      // Bullet point
      else if (trimmedLine.startsWith("→") || trimmedLine.startsWith("•") || trimmedLine.startsWith("-")) {
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text("●", margin, yPos);
        doc.setTextColor(50, 50, 50);
        
        const textLine = trimmedLine.replace(/^[→•\-]\s*/, "");
        const splitText = doc.splitTextToSize(textLine, contentWidth - 8);
        doc.text(splitText, margin + 6, yPos);
        yPos += splitText.length * 5 + 2;
      }
      // Code block
      else if (trimmedLine.startsWith("```") || 
               (trimmedLine.includes("=") && (trimmedLine.includes("[") || trimmedLine.includes("(")))) {
        doc.setFillColor(250, 250, 250);
        doc.setDrawColor(200, 200, 200);
        
        const codeText = trimmedLine.replace(/```/g, "").trim();
        if (codeText) {
          const codeLines = doc.splitTextToSize(codeText, contentWidth - 10);
          const boxHeight = codeLines.length * 5 + 6;
          
          doc.roundedRect(margin, yPos - 4, contentWidth, boxHeight, 2, 2, "FD");
          doc.setFont("courier", "normal");
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(codeLines, margin + 4, yPos);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          yPos += boxHeight + 2;
        }
      }
      // Emoji header line
      else if (/^[📚📘⏱️💡🔥✅🎯🧠💻📝🚀⚡📊📐🔄]/u.test(trimmedLine)) {
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont("helvetica", "bold");
        doc.text(trimmedLine, margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        yPos += 7;
      }
      // Regular text
      else if (trimmedLine) {
        doc.setTextColor(50, 50, 50);
        const splitText = doc.splitTextToSize(trimmedLine, contentWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 5 + 2;
      }
    });

    yPos += 8;
  });

  // Footer on last page
  const footerY = pageHeight - 12;
  doc.setFillColor(99, 102, 241);
  doc.rect(0, pageHeight - 18, pageWidth, 18, "F");
  
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("Made with 💙 by DSA Dost AI | 100% FREE Forever!", pageWidth / 2, footerY, { align: "center" });
  doc.text(`Generated: ${new Date().toLocaleDateString()} | dsa-dost.lovable.app`, pageWidth / 2, footerY + 5, { align: "center" });

  // Download
  const fileName = `DSA-Dost-Premium-Notes-${topic.replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
};

const parseNotesContent = (content: string): NotesSection[] => {
  const lines = content.split("\n");
  const sections: NotesSection[] = [];
  let currentSection: NotesSection | null = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    // Check if line is a section heading
    const isHeading = /^[📚📘⏱️💡🔥✅🎯🧠💻📝🚀⚡📊📐🔄]/u.test(trimmedLine) && 
                      !trimmedLine.startsWith("→") && 
                      !trimmedLine.startsWith("•") &&
                      trimmedLine.length < 60;

    if (isHeading) {
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        title: trimmedLine,
        content: [],
        color: "",
      };
    } else if (currentSection) {
      currentSection.content.push(line);
    } else {
      // First content without header
      currentSection = {
        title: "📘 Notes",
        content: [line],
        color: "",
      };
    }
  });

  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection);
  }

  // If no sections found, create one with all content
  if (sections.length === 0) {
    sections.push({
      title: "📘 Notes",
      content: content.split("\n").filter((l) => l.trim()),
      color: "",
    });
  }

  return sections;
};

export default generateNotesPdf;
