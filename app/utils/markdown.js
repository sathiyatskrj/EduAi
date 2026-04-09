export function parseMarkdown(text) {
  if (!text) return "";

  let html = text;

  // 1. Headers
  html = html.replace(/^### (.*$)/gm, '<h3 style="margin-top: 20px; margin-bottom: 10px; color: var(--primary);">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 style="margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px;">$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1 style="margin-top: 28px; margin-bottom: 16px;">$1</h1>');

  // 2. Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // 3. Tables
  // Matches continuous block of lines starting and ending with |
  const tableRegex = /(?:^\|.*?\|(?:\n|$))+/gm;
  html = html.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    let tableHtml = '<div style="overflow-x:auto; margin: 20px 0;"><table style="width:100%; border-collapse: collapse; text-align: left;">';
    
    let isHeader = true;
    rows.forEach((row) => {
      // Ignore separator row like |---|---|
      if (row.replace(/\s/g, '').match(/^\|[-:]+\|/)) {
        isHeader = false;
        return;
      }

      // Split by | but ignore trailing/leading empty strings
      const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
      
      tableHtml += '<tr style="border-bottom: 1px solid var(--border);">';
      cells.forEach(cell => {
        if (isHeader) {
          tableHtml += `<th style="padding: 12px; background: rgba(0, 150, 136, 0.1); color: var(--primary); font-weight: 700;">${cell.trim()}</th>`;
        } else {
          tableHtml += `<td style="padding: 12px; vertical-align: top;">${cell.trim()}</td>`;
        }
      });
      tableHtml += '</tr>';
    });
    
    tableHtml += '</table></div>';
    return tableHtml;
  });

  // 4. Lists
  // Simplified list parsing by replacing the newline properly before converting remaining \n to <br/>
  html = html.replace(/^\* (.*$)/gm, "<li>$1</li>");
  html = html.replace(/^- (.*$)/gm, "<li>$1</li>");

  // 5. Line Breaks (Skip line breaks inside tables, but tables are already converted to HTML without \n)
  // Our tableHtml didn't insert \n, so any remaining \n are regular text.
  // Wait, the lists don't wrap in <ul>. We'll just rely on <li> default styles or add a dot.
  html = html.replace(/<li>(.*?)(?=<\/li>)<\/li>/g, "<div style='display:flex;gap:8px;margin-bottom:6px;'><span style='color:var(--primary)'>•</span><span>$1</span></div>");

  html = html.replace(/\n\n/g, "<br/><br/>");
  html = html.replace(/\n(?!(<br>|<br\/>|<div|<table|<\/div>|<\/table>|<\/?h[1-6]|<tr|<td|<th))/g, "<br/>");

  return html;
}
