import 'dart:convert';
import 'package:http/http.dart' as http;

/// Direct Gemini API service for the mobile app.
/// This bypasses the Next.js backend and calls Google's API directly,
/// so the mobile app works standalone without the web server running.
class GeminiService {
  static const String _apiKey = 'AIzaSyBZC2qMCubB-xjMaFZp6KW3G3NMYNhlYMs';
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
          return parts[0]['text'] ?? 'No content generated.';
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
}
