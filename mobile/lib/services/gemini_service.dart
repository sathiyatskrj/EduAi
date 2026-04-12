import 'dart:convert';
import 'package:http/http.dart' as http;

/// Direct Gemini API service for the mobile app.
/// This bypasses the Next.js backend and calls Google's API directly,
/// so the mobile app works standalone without the web server running.
class GeminiService {
  static const String _apiKey = '';
  static const String _model = 'gemini-2.0-flash';
  static const String _baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/$_model:generateContent';

  /// Generates content from Gemini API.
  /// Returns the text response or throws an error message.
  static Future<String> generate({
    required String prompt,
    String systemPrompt = '',
  }) async {
    final fullPrompt =
        systemPrompt.isNotEmpty ? '$systemPrompt\n\n$prompt' : prompt;

    final uri = Uri.parse('$_baseUrl?key=$_apiKey');

    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'contents': [
          {
            'parts': [
              {'text': fullPrompt}
            ]
          }
        ],
        'generationConfig': {
          'temperature': 0.2,
          'maxOutputTokens': 4096,
        },
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final candidates = data['candidates'] as List?;
      if (candidates != null && candidates.isNotEmpty) {
        final parts = candidates[0]['content']?['parts'] as List?;
        if (parts != null && parts.isNotEmpty) {
          final raw = parts[0]['text'] ?? 'No content generated.';
          return _sanitizeLatex(raw);
        }
      }
      return 'No content generated.';
    } else if (response.statusCode == 429) {
      throw Exception(
          'Rate limit exceeded. Please wait a minute and try again.');
    } else if (response.statusCode == 503) {
      throw Exception('Gemini is temporarily overloaded. Please try again.');
    } else {
      throw Exception('Gemini API error: ${response.statusCode}');
    }
  }

  /// Converts LaTeX math notation to readable Unicode text.
  /// Safety net in case the AI model still outputs LaTeX despite prompt instructions.
  static String _sanitizeLatex(String text) {
    var result = text;

    // Display math blocks: $$...$$ -> plain text
    result = result.replaceAllMapped(
      RegExp(r'\$\$([\s\S]*?)\$\$'),
      (m) => '\n${_convertLatexExpr(m.group(1)!.trim())}\n',
    );

    // Inline math: $...$ -> plain text (but skip currency like $50)
    result = result.replaceAllMapped(
      RegExp(r'\$([^$\n]+?)\$'),
      (m) {
        final expr = m.group(1)!.trim();
        if (RegExp(r'^\d+([.,]\d+)?$').hasMatch(expr)) return m.group(0)!;
        return _convertLatexExpr(expr);
      },
    );

    // Standalone LaTeX commands
    result = result.replaceAllMapped(
      RegExp(r'\\frac\{([^}]*)\}\{([^}]*)\}'),
      (m) => '(${_cleanLatex(m.group(1)!)}/${_cleanLatex(m.group(2)!)})',
    );
    result = result.replaceAllMapped(
      RegExp(r'\\sqrt\{([^}]*)\}'),
      (m) => '\u221A(${_cleanLatex(m.group(1)!)})',
    );
    result = result.replaceAllMapped(
      RegExp(r'\\sqrt\[(\d+)\]\{([^}]*)\}'),
      (m) =>
          '${_toSuperscript(m.group(1)!)}\u221A(${_cleanLatex(m.group(2)!)})',
    );

    // Greek letters
    const greekMap = {
      'alpha': '\u03B1',
      'beta': '\u03B2',
      'gamma': '\u03B3',
      'delta': '\u03B4',
      'epsilon': '\u03B5',
      'zeta': '\u03B6',
      'eta': '\u03B7',
      'theta': '\u03B8',
      'iota': '\u03B9',
      'kappa': '\u03BA',
      'lambda': '\u03BB',
      'mu': '\u03BC',
      'nu': '\u03BD',
      'xi': '\u03BE',
      'pi': '\u03C0',
      'rho': '\u03C1',
      'sigma': '\u03C3',
      'tau': '\u03C4',
      'upsilon': '\u03C5',
      'phi': '\u03C6',
      'chi': '\u03C7',
      'psi': '\u03C8',
      'omega': '\u03C9',
    };
    for (final entry in greekMap.entries) {
      result = result.replaceAll('\\${entry.key}', entry.value);
    }

    // Common operators
    final ops = {
      '\\times': '\u00D7',
      '\\div': '\u00F7',
      '\\pm': '\u00B1',
      '\\mp': '\u2213',
      '\\cdot': '\u00B7',
      '\\leq': '\u2264',
      '\\geq': '\u2265',
      '\\neq': '\u2260',
      '\\le': '\u2264',
      '\\ge': '\u2265',
      '\\ne': '\u2260',
      '\\approx': '\u2248',
      '\\infty': '\u221E',
      '\\sum': '\u2211',
      '\\prod': '\u220F',
      '\\int': '\u222B',
      '\\partial': '\u2202',
      '\\nabla': '\u2207',
      '\\therefore': '\u2234',
      '\\because': '\u2235',
      '\\angle': '\u2220',
      '\\degree': '\u00B0',
      '\\triangle': '\u25B3',
      '\\perp': '\u22A5',
      '\\parallel': '\u2225',
      '\\in': '\u2208',
      '\\notin': '\u2209',
      '\\subset': '\u2282',
      '\\supset': '\u2283',
      '\\cup': '\u222A',
      '\\cap': '\u2229',
      '\\forall': '\u2200',
      '\\exists': '\u2203',
      '\\rightarrow': '\u2192',
      '\\leftarrow': '\u2190',
      '\\Rightarrow': '\u21D2',
      '\\Leftarrow': '\u21D0',
      '\\to': '\u2192',
      '\\implies': '\u21D2',
      '\\iff': '\u21D4',
      '\\quad': '  ',
      '\\qquad': '    ',
    };
    for (final entry in ops.entries) {
      result = result.replaceAll(entry.key, entry.value);
    }

    // Text/mathrm commands
    result = result.replaceAllMapped(
        RegExp(r'\\text\{([^}]*)\}'), (m) => m.group(1)!);
    result = result.replaceAllMapped(
        RegExp(r'\\mathrm\{([^}]*)\}'), (m) => m.group(1)!);
    result = result.replaceAllMapped(
        RegExp(r'\\mathbf\{([^}]*)\}'), (m) => '**${m.group(1)!}**');

    // Clean up \left, \right, \big
    result =
        result.replaceAll(RegExp(r'\\(left|right|big|Big|bigg|Bigg)\s*'), '');
    // Clean up stray backslashes before brackets
    result = result.replaceAllMapped(
        RegExp(r'\\([()[\]{}|])'), (m) => m.group(1)!);
    // Remove remaining unhandled \commands
    result = result.replaceAllMapped(
        RegExp(r'\\([a-zA-Z]+)'), (m) => m.group(1)!);

    return result;
  }

  /// Convert a LaTeX expression (inside $ delimiters) to Unicode.
  static String _convertLatexExpr(String expr) {
    var result = expr;

    // Fractions
    result = result.replaceAllMapped(
      RegExp(r'\\frac\{([^}]*)\}\{([^}]*)\}'),
      (m) => '(${_cleanLatex(m.group(1)!)}/${_cleanLatex(m.group(2)!)})',
    );

    // Square roots
    result = result.replaceAllMapped(
      RegExp(r'\\sqrt\[(\d+)\]\{([^}]*)\}'),
      (m) =>
          '${_toSuperscript(m.group(1)!)}\u221A(${_cleanLatex(m.group(2)!)})',
    );
    result = result.replaceAllMapped(
      RegExp(r'\\sqrt\{([^}]*)\}'),
      (m) => '\u221A(${_cleanLatex(m.group(1)!)})',
    );

    // Superscripts: ^{2} or ^2
    result = result.replaceAllMapped(
        RegExp(r'\^\{([^}]*)\}'), (m) => _toSuperscript(m.group(1)!));
    result = result.replaceAllMapped(
        RegExp(r'\^(\d)'), (m) => _toSuperscript(m.group(1)!));

    // Subscripts: _{i} or _i
    result = result.replaceAllMapped(
        RegExp(r'_\{([^}]*)\}'), (m) => _toSubscript(m.group(1)!));
    result = result.replaceAllMapped(
        RegExp(r'_(\d)'), (m) => _toSubscript(m.group(1)!));

    // Greek letters
    const greekMap = {
      'alpha': '\u03B1',
      'beta': '\u03B2',
      'gamma': '\u03B3',
      'delta': '\u03B4',
      'epsilon': '\u03B5',
      'theta': '\u03B8',
      'pi': '\u03C0',
      'sigma': '\u03C3',
      'phi': '\u03C6',
      'omega': '\u03C9',
      'lambda': '\u03BB',
      'mu': '\u03BC',
    };
    for (final entry in greekMap.entries) {
      result = result.replaceAll('\\${entry.key}', entry.value);
    }

    // Common operators
    result = result.replaceAll('\\times', '\u00D7');
    result = result.replaceAll('\\div', '\u00F7');
    result = result.replaceAll('\\pm', '\u00B1');
    result = result.replaceAll('\\cdot', '\u00B7');
    result = result.replaceAll('\\leq', '\u2264');
    result = result.replaceAll('\\geq', '\u2265');
    result = result.replaceAll('\\neq', '\u2260');
    result = result.replaceAll('\\approx', '\u2248');
    result = result.replaceAll('\\infty', '\u221E');
    result = result.replaceAll('\\therefore', '\u2234');
    result = result.replaceAll('\\angle', '\u2220');
    result = result.replaceAll('\\triangle', '\u25B3');
    result = result.replaceAll('\\perp', '\u22A5');
    result = result.replaceAll('\\rightarrow', '\u2192');
    result = result.replaceAll('\\Rightarrow', '\u21D2');
    result = result.replaceAll('\\to', '\u2192');

    // Clean up text commands
    result = result.replaceAllMapped(
        RegExp(r'\\text\{([^}]*)\}'), (m) => m.group(1)!);
    result = result.replaceAllMapped(
        RegExp(r'\\mathrm\{([^}]*)\}'), (m) => m.group(1)!);

    // Cleanup
    result =
        result.replaceAll(RegExp(r'\\(left|right|big|Big)\s*'), '');
    result = result.replaceAllMapped(
        RegExp(r'\\([()[\]{}|])'), (m) => m.group(1)!);
    result = result.replaceAll(RegExp(r'[{}]'), '');
    result = result.replaceAllMapped(
        RegExp(r'\\([a-zA-Z]+)'), (m) => m.group(1)!);

    return result;
  }

  /// Light cleanup for LaTeX sub-expressions (inside \frac, \sqrt, etc.)
  static String _cleanLatex(String expr) {
    var result = expr.replaceAll(RegExp(r'[{}]'), '');
    result = result.replaceAll('\\times', '\u00D7');
    result = result.replaceAll('\\cdot', '\u00B7');
    result = result.replaceAll('\\div', '\u00F7');
    result = result.replaceAll('\\pm', '\u00B1');
    result = result.replaceAllMapped(
        RegExp(r'\^(\d)'), (m) => _toSuperscript(m.group(1)!));
    result = result.replaceAllMapped(
        RegExp(r'_(\d)'), (m) => _toSubscript(m.group(1)!));
    return result.trim();
  }

  static const _superMap = {
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
    '+': '\u207A',
    '-': '\u207B',
    'n': '\u207F',
    'i': '\u2071',
    'x': '\u02E3',
    'y': '\u02B8',
    'a': '\u1D43',
    'b': '\u1D47',
    'c': '\u1D9C',
    'd': '\u1D48',
    'e': '\u1D49',
  };

  static const _subMap = {
    '0': '\u2080',
    '1': '\u2081',
    '2': '\u2082',
    '3': '\u2083',
    '4': '\u2084',
    '5': '\u2085',
    '6': '\u2086',
    '7': '\u2087',
    '8': '\u2088',
    '9': '\u2089',
    '+': '\u208A',
    '-': '\u208B',
    'a': '\u2090',
    'e': '\u2091',
    'i': '\u1D62',
    'n': '\u2099',
    'o': '\u2092',
    'x': '\u2093',
  };

  static String _toSuperscript(String s) =>
      s.split('').map((c) => _superMap[c] ?? c).join('');

  static String _toSubscript(String s) =>
      s.split('').map((c) => _subMap[c] ?? c).join('');
}
