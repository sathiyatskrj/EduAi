import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToJSON = (filename, data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = filename.endsWith(".json") ? filename : `${filename}.json`;
  link.click();
};

export const exportToCSV = (filename, data) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(",")).join("\n");
  const csvString = `data:text/csv;charset=utf-8,${encodeURIComponent(`${headers}\n${rows}`)}`;
  
  const link = document.createElement("a");
  link.href = csvString;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
};

// Converts simple markdown text to a structured PDF for lesson plans and tests
export const exportToPDF = (filename, title, markdownContent) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(0, 150, 136); // Teal
  doc.text(title, 14, 22);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 25, 196, 25);

  // Content Parsing
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);

  const lines = markdownContent.split('\n');
  let y = 35;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;

  lines.forEach(line => {
    let text = line.trim();
    if (!text) {
      y += 5; 
      return;
    }

    if (y > pageHeight - marginBottom) {
      doc.addPage();
      y = 20;
    }

    if (text.startsWith("### ")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      text = text.replace("### ", "");
      doc.text(text, 14, y);
      y += 8;
    } else if (text.startsWith("## ")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 150, 136);
      text = text.replace("## ", "");
      doc.text(text, 14, y);
      y += 10;
    } else if (text.startsWith("# ")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      text = text.replace("# ", "");
      doc.text(text, 14, y);
      y += 12;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);

      // Handle bolding markers
      text = text.replace(/\*\*/g, ""); 
      
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 14, y);
      y += (splitText.length * 6);
    }
  });

  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
};
