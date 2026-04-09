import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../services/gemini_service.dart';

/// A reusable AI-powered screen with form inputs, a generate button,
/// and a rich Markdown output card. Used by Test, Remedial, and Teaching Aids.
class AiGeneratorScreen extends StatefulWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color accentColor;
  final List<AiFormField> fields;
  final String Function(Map<String, String> values) buildPrompt;
  final String systemPrompt;

  const AiGeneratorScreen({
    Key? key,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.accentColor,
    required this.fields,
    required this.buildPrompt,
    required this.systemPrompt,
  }) : super(key: key);

  @override
  State<AiGeneratorScreen> createState() => _AiGeneratorScreenState();
}

class AiFormField {
  final String key;
  final String label;
  final String hint;
  final bool isDropdown;
  final List<String> options;
  final String defaultValue;

  const AiFormField({
    required this.key,
    required this.label,
    this.hint = '',
    this.isDropdown = false,
    this.options = const [],
    this.defaultValue = '',
  });
}

class _AiGeneratorScreenState extends State<AiGeneratorScreen> {
  final Map<String, String> _values = {};
  bool _isLoading = false;
  String _result = '';

  @override
  void initState() {
    super.initState();
    for (final field in widget.fields) {
      _values[field.key] = field.defaultValue;
    }
  }

  Future<void> _generate() async {
    setState(() {
      _isLoading = true;
      _result = '';
    });

    try {
      final prompt = widget.buildPrompt(_values);
      final result = await GeminiService.generate(
        prompt: prompt,
        systemPrompt: widget.systemPrompt,
      );
      setState(() => _result = result);
    } catch (e) {
      setState(() => _result = '⚠️ Error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(
          widget.title,
          style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.subtitle,
              style: TextStyle(color: Colors.grey.shade400, fontSize: 15),
            ).animate().fadeIn(delay: 100.ms),
            const SizedBox(height: 24),

            // Form Card
            _buildGlassCard(
              child: Column(
                children: [
                  ...widget.fields.map((field) {
                    if (field.isDropdown) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: DropdownButtonFormField<String>(
                          value: _values[field.key]!.isEmpty
                              ? field.options.first
                              : _values[field.key],
                          dropdownColor: const Color(0xFF1E293B),
                          decoration: _inputDecoration(field.label),
                          items: field.options
                              .map((o) => DropdownMenuItem(
                                  value: o, child: Text(o)))
                              .toList(),
                          onChanged: (v) =>
                              setState(() => _values[field.key] = v ?? ''),
                        ),
                      );
                    }
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: TextField(
                        style: const TextStyle(color: Colors.white),
                        decoration: _inputDecoration(field.label,
                            hint: field.hint),
                        onChanged: (v) =>
                            setState(() => _values[field.key] = v),
                      ),
                    );
                  }),
                  const SizedBox(height: 8),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _generate,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        padding: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Ink(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              widget.accentColor,
                              widget.accentColor.withOpacity(0.7)
                            ],
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Container(
                          alignment: Alignment.center,
                          child: _isLoading
                              ? const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(widget.icon,
                                        color: Colors.white, size: 20),
                                    const SizedBox(width: 8),
                                    Text(
                                      '✨ Generate',
                                      style: GoogleFonts.inter(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ).animate().slideY(begin: 0.1, duration: 500.ms).fadeIn(),

            // Result Card
            if (_result.isNotEmpty) ...[
              const SizedBox(height: 24),
              _buildGlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Result",
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: widget.accentColor,
                          ),
                        ),
                        Row(
                          children: [
                            IconButton(
                              icon: const Icon(Icons.copy_rounded,
                                  color: Colors.white54, size: 20),
                              onPressed: () {
                                Clipboard.setData(
                                    ClipboardData(text: _result));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                      content: Text('Copied to clipboard!')),
                                );
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    MarkdownBody(
                      data: _result,
                      styleSheet: MarkdownStyleSheet(
                        p: const TextStyle(
                            color: Colors.white70, fontSize: 14, height: 1.6),
                        h1: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.w800),
                        h2: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w700),
                        h3: GoogleFonts.inter(
                            color: widget.accentColor,
                            fontSize: 16,
                            fontWeight: FontWeight.w700),
                        strong: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                        em: const TextStyle(
                            color: Colors.white70, fontStyle: FontStyle.italic),
                        listBullet: const TextStyle(color: Colors.white70),
                        tableHead: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                        tableBody: const TextStyle(color: Colors.white70),
                        tableBorder: TableBorder.all(
                            color: Colors.white24, width: 0.5),
                        tableHeadAlign: TextAlign.left,
                        tableCellsPadding: const EdgeInsets.all(10),
                        horizontalRuleDecoration: const BoxDecoration(
                          border: Border(
                              top: BorderSide(color: Colors.white24)),
                        ),
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn().slideY(begin: 0.1),
            ],

            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }

  Widget _buildGlassCard({required Widget child}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          child: child,
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, {String hint = ''}) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      labelStyle: TextStyle(color: Colors.grey.shade500),
      hintStyle: TextStyle(color: Colors.grey.shade600),
      filled: true,
      fillColor: const Color(0xFF0F172A),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide:
            BorderSide(color: widget.accentColor, width: 1.5),
      ),
    );
  }
}
