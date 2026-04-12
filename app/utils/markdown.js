export function parseMarkdown(text) {
  if (!text) return "";

  let html = text;

  // ── 0. Sanitize LaTeX / math notation to plain Unicode ──
  // AI models often output LaTeX math that our renderer can't handle.
  // Convert to readable Unicode before any other processing.
  html = sanitizeLatex(html);

  // ── 1. Escape HTML entities ──
  // (skip — the AI output is trusted in this context)

  // ── 2. Horizontal rules ──
  html = html.replace(/^---+$/gm, '<hr class="ai-hr" />');

  // ── 3. Tables ──
  // Must run before line-break conversion. Matches continuous | rows.
  const tableRegex = /(?:^\|.+\|[ \t]*\n?)+/gm;
  html = html.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    let out = '<div class="ai-table-wrap"><table>';
    let headerDone = false;

    rows.forEach((row) => {
      // Skip separator row  |---|---|
      if (/^\|[\s:|-]+\|$/.test(row.replace(/\s/g, '|').replace(/\|+/g,'|'))) {
        headerDone = true;
        return;
      }
      if (row.trim().replace(/[|\-:\s]/g, '') === '') { headerDone = true; return; }

      const cells = row.split('|').slice(1, -1); // drop leading/trailing empty
      const tag = !headerDone ? 'th' : 'td';
      out += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
    });

    out += '</table></div>';
    return out;
  });

  // ── 4. Headers ──
  // Process in order: h3 → h2 → h1 so ### isn't caught by ##
  html = html.replace(/^#{3}\s+(.+)$/gm, '<h3 class="ai-h3">$1</h3>');
  html = html.replace(/^#{2}\s+(.+)$/gm, '<h2 class="ai-h2">$1</h2>');
  html = html.replace(/^#{1}\s+(.+)$/gm, '<h1 class="ai-h1">$1</h1>');

  // ── 5. Bold & Italic ──
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');

  // ── 6. Ordered lists ──
  // Match consecutive lines starting with  1.  2.  etc.
  html = html.replace(/(?:^\d+\.\s+.+(?:\n|$))+/gm, (block) => {
    const items = block.trim().split('\n');
    let ol = '<ol class="ai-ol">';
    items.forEach(item => {
      const content = item.replace(/^\d+\.\s+/, '');
      ol += `<li>${content}</li>`;
    });
    ol += '</ol>';
    return ol;
  });

  // ── 7. Unordered lists ──
  // Match consecutive lines starting with  *  or  -  (but not ---)
  html = html.replace(/(?:^[ \t]*[*-]\s+.+(?:\n|$))+/gm, (block) => {
    // Avoid matching <hr> we already converted
    if (block.trim().startsWith('<hr')) return block;
    const items = block.trim().split('\n');
    let ul = '<ul class="ai-ul">';
    items.forEach(item => {
      const content = item.replace(/^[ \t]*[*-]\s+/, '');
      // Handle nested indented items (    * sub)
      if (/^[ \t]{2,}/.test(item)) {
        ul += `<li class="ai-li-nested">${content}</li>`;
      } else {
        ul += `<li>${content}</li>`;
      }
    });
    ul += '</ul>';
    return ul;
  });

  // ── 8. Inline code ──
  html = html.replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>');

  // ── 9. Line breaks ──
  // Double newline → paragraph break, single newline → <br> (but not after block elements)
  html = html.replace(/\n\n+/g, '<div class="ai-para-break"></div>');
  html = html.replace(/\n(?!<)/g, '<br/>');

  return html;
}

/**
 * Converts LaTeX math notation to readable Unicode text.
 * Handles both inline ($...$) and display ($$...$$) math,
 * as well as standalone LaTeX commands like \frac, \sqrt, etc.
 */
function sanitizeLatex(text) {
  let result = text;

  // ── Process display math blocks first: $$...$$ ──
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, expr) => {
    return '\n' + convertLatexExpr(expr.trim()) + '\n';
  });

  // ── Process inline math: $...$ ──
  // Be careful not to match currency amounts like $50
  result = result.replace(/\$([^$\n]+?)\$/g, (match, expr) => {
    // Skip if it looks like a currency amount ($ followed by digits only)
    if (/^\d+([.,]\d+)?$/.test(expr.trim())) return match;
    return convertLatexExpr(expr.trim());
  });

  // ── Process standalone LaTeX commands outside of $ delimiters ──
  result = result.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, n, d) => `(${cleanLatex(n)}/${cleanLatex(d)})`);
  result = result.replace(/\\sqrt\{([^}]*)\}/g, (_, x) => `√(${cleanLatex(x)})`);
  result = result.replace(/\\sqrt\[(\d+)\]\{([^}]*)\}/g, (_, n, x) => `${getSuperscript(n)}√(${cleanLatex(x)})`);

  // Clean up any remaining stray LaTeX commands
  result = result.replace(/\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)/gi, (_, letter) => greekLetters[letter.toLowerCase()] || letter);
  result = result.replace(/\\(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega)/g, (_, letter) => greekLettersUpper[letter] || letter);

  // Common operators
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\div/g, '÷');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\\mp/g, '∓');
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\approx/g, '≈');
  result = result.replace(/\\infty/g, '∞');
  result = result.replace(/\\sum/g, '∑');
  result = result.replace(/\\prod/g, '∏');
  result = result.replace(/\\int/g, '∫');
  result = result.replace(/\\partial/g, '∂');
  result = result.replace(/\\nabla/g, '∇');
  result = result.replace(/\\therefore/g, '∴');
  result = result.replace(/\\because/g, '∵');
  result = result.replace(/\\angle/g, '∠');
  result = result.replace(/\\degree/g, '°');
  result = result.replace(/\\triangle/g, '△');
  result = result.replace(/\\perp/g, '⊥');
  result = result.replace(/\\parallel/g, '∥');
  result = result.replace(/\\in/g, '∈');
  result = result.replace(/\\notin/g, '∉');
  result = result.replace(/\\subset/g, '⊂');
  result = result.replace(/\\supset/g, '⊃');
  result = result.replace(/\\cup/g, '∪');
  result = result.replace(/\\cap/g, '∩');
  result = result.replace(/\\forall/g, '∀');
  result = result.replace(/\\exists/g, '∃');
  result = result.replace(/\\rightarrow/g, '→');
  result = result.replace(/\\leftarrow/g, '←');
  result = result.replace(/\\Rightarrow/g, '⇒');
  result = result.replace(/\\Leftarrow/g, '⇐');
  result = result.replace(/\\leftrightarrow/g, '↔');
  result = result.replace(/\\to/g, '→');
  result = result.replace(/\\implies/g, '⇒');
  result = result.replace(/\\iff/g, '⇔');
  result = result.replace(/\\quad/g, '  ');
  result = result.replace(/\\qquad/g, '    ');
  result = result.replace(/\\,/g, ' ');
  result = result.replace(/\\;/g, ' ');
  result = result.replace(/\\!/g, '');
  result = result.replace(/\\text\{([^}]*)\}/g, '$1');
  result = result.replace(/\\textbf\{([^}]*)\}/g, '**$1**');
  result = result.replace(/\\textit\{([^}]*)\}/g, '*$1*');
  result = result.replace(/\\mathrm\{([^}]*)\}/g, '$1');
  result = result.replace(/\\mathbf\{([^}]*)\}/g, '$1');

  // Clean up remaining \left, \right, \big etc. delimiters
  result = result.replace(/\\(left|right|big|Big|bigg|Bigg)\s*/g, '');

  // Clean up stray backslashes before common characters
  result = result.replace(/\\([()[\]{}|])/g, '$1');

  // Remove any remaining unrecognized \commands (but keep the text)
  result = result.replace(/\\([a-zA-Z]+)/g, (_, cmd) => {
    // If we haven't handled this command, just show the name
    return cmd;
  });

  return result;
}

/**
 * Converts a LaTeX math expression (content between $ or $$) to Unicode.
 */
function convertLatexExpr(expr) {
  let result = expr;

  // Fractions: \frac{a}{b} → (a/b)
  result = result.replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, n, d) => `(${cleanLatex(n)}/${cleanLatex(d)})`);

  // Square roots: \sqrt{x} → √(x),  \sqrt[n]{x} → ⁿ√(x)
  result = result.replace(/\\sqrt\[(\d+)\]\{([^}]*)\}/g, (_, n, x) => `${getSuperscript(n)}√(${cleanLatex(x)})`);
  result = result.replace(/\\sqrt\{([^}]*)\}/g, (_, x) => `√(${cleanLatex(x)})`);

  // Superscripts: x^{2} → x², x^2 → x²
  result = result.replace(/\^{([^}]*)}/g, (_, s) => toSuperscript(s));
  result = result.replace(/\^(\d)/g, (_, d) => toSuperscript(d));
  result = result.replace(/\^([a-zA-Z])/g, (_, c) => toSuperscript(c));

  // Subscripts: x_{i} → xᵢ, x_i → xᵢ
  result = result.replace(/_{([^}]*)}/g, (_, s) => toSubscript(s));
  result = result.replace(/_(\d)/g, (_, d) => toSubscript(d));
  result = result.replace(/_([a-zA-Z])/g, (_, c) => toSubscript(c));

  // Greek letters
  result = result.replace(/\\(alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)/gi, (_, letter) => greekLetters[letter.toLowerCase()] || letter);

  // Operators
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\div/g, '÷');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\\mp/g, '∓');
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\le/g, '≤');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\ge/g, '≥');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\ne/g, '≠');
  result = result.replace(/\\approx/g, '≈');
  result = result.replace(/\\infty/g, '∞');
  result = result.replace(/\\sum/g, '∑');
  result = result.replace(/\\prod/g, '∏');
  result = result.replace(/\\int/g, '∫');
  result = result.replace(/\\partial/g, '∂');
  result = result.replace(/\\nabla/g, '∇');
  result = result.replace(/\\therefore/g, '∴');
  result = result.replace(/\\because/g, '∵');
  result = result.replace(/\\angle/g, '∠');
  result = result.replace(/\\degree/g, '°');
  result = result.replace(/\\triangle/g, '△');
  result = result.replace(/\\perp/g, '⊥');
  result = result.replace(/\\parallel/g, '∥');
  result = result.replace(/\\in(?![a-z])/g, '∈');
  result = result.replace(/\\notin/g, '∉');
  result = result.replace(/\\subset/g, '⊂');
  result = result.replace(/\\supset/g, '⊃');
  result = result.replace(/\\cup/g, '∪');
  result = result.replace(/\\cap/g, '∩');
  result = result.replace(/\\forall/g, '∀');
  result = result.replace(/\\exists/g, '∃');
  result = result.replace(/\\rightarrow/g, '→');
  result = result.replace(/\\leftarrow/g, '←');
  result = result.replace(/\\Rightarrow/g, '⇒');
  result = result.replace(/\\Leftarrow/g, '⇐');
  result = result.replace(/\\to/g, '→');
  result = result.replace(/\\implies/g, '⇒');
  result = result.replace(/\\iff/g, '⇔');

  // Spacing
  result = result.replace(/\\quad/g, '  ');
  result = result.replace(/\\qquad/g, '    ');
  result = result.replace(/\\,/g, ' ');
  result = result.replace(/\\;/g, ' ');
  result = result.replace(/\\!/g, '');

  // Text inside math
  result = result.replace(/\\text\{([^}]*)\}/g, '$1');
  result = result.replace(/\\mathrm\{([^}]*)\}/g, '$1');
  result = result.replace(/\\mathbf\{([^}]*)\}/g, '$1');

  // Clean up \left, \right
  result = result.replace(/\\(left|right|big|Big|bigg|Bigg)\s*/g, '');

  // Clean up stray backslashes and braces
  result = result.replace(/\\([()[\]{}|])/g, '$1');
  result = result.replace(/[{}]/g, '');

  // Remove remaining unhandled commands
  result = result.replace(/\\([a-zA-Z]+)/g, (_, cmd) => cmd);

  return result;
}

/**
 * Light cleanup for LaTeX sub-expressions (inside \frac, \sqrt, etc.)
 */
function cleanLatex(expr) {
  let result = expr;
  result = result.replace(/[{}]/g, '');
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\div/g, '÷');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\^(\d)/g, (_, d) => toSuperscript(d));
  result = result.replace(/_(\d)/g, (_, d) => toSubscript(d));
  return result.trim();
}

// ── Superscript / subscript maps ──

const superscriptMap = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  'n': 'ⁿ', 'i': 'ⁱ', 'x': 'ˣ', 'y': 'ʸ',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
  'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'j': 'ʲ', 'k': 'ᵏ',
  'l': 'ˡ', 'm': 'ᵐ', 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ',
  's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ',
  'z': 'ᶻ',
};

const subscriptMap = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
  'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
  'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
  'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
  'v': 'ᵥ', 'x': 'ₓ',
};

function toSuperscript(str) {
  return str.split('').map(c => superscriptMap[c] || c).join('');
}

function toSubscript(str) {
  return str.split('').map(c => subscriptMap[c] || c).join('');
}

function getSuperscript(n) {
  return toSuperscript(String(n));
}

// ── Greek letter maps ──
const greekLetters = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
  zeta: 'ζ', eta: 'η', theta: 'θ', iota: 'ι', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π',
  rho: 'ρ', sigma: 'σ', tau: 'τ', upsilon: 'υ', phi: 'φ',
  chi: 'χ', psi: 'ψ', omega: 'ω',
};

const greekLettersUpper = {
  Alpha: 'Α', Beta: 'Β', Gamma: 'Γ', Delta: 'Δ', Epsilon: 'Ε',
  Zeta: 'Ζ', Eta: 'Η', Theta: 'Θ', Iota: 'Ι', Kappa: 'Κ',
  Lambda: 'Λ', Mu: 'Μ', Nu: 'Ν', Xi: 'Ξ', Pi: 'Π',
  Rho: 'Ρ', Sigma: 'Σ', Tau: 'Τ', Upsilon: 'Υ', Phi: 'Φ',
  Chi: 'Χ', Psi: 'Ψ', Omega: 'Ω',
};
