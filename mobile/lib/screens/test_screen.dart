import 'package:flutter/material.dart';
import '../widgets/ai_generator_screen.dart';

class TestScreen extends StatelessWidget {
  const TestScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AiGeneratorScreen(
      title: "AI Test Generator",
      subtitle: "Create blueprint-based test papers with answer keys.",
      icon: Icons.quiz_rounded,
      accentColor: const Color(0xFF8B5CF6),
      systemPrompt:
          'You are EduAI, an expert question paper generator for Indian CBSE/State Board exams. Generate complete, print-ready question papers with: school header, general instructions, sections (A/B/C), question numbers with marks in brackets, answer key with solutions, marking scheme, and a blueprint table showing topic vs Bloom\'s taxonomy distribution. Use markdown tables for blueprints and answer keys.\n\nIMPORTANT: Do NOT use LaTeX or dollar-sign math notation (\$, \$\$, \\frac, \\sqrt, etc.). Write all mathematical expressions in plain readable text using standard symbols: × for multiplication, ÷ for division, ² ³ for exponents (e.g., x² + 3x + 5 = 0), √ for square root, π for pi, ≤ ≥ ≠ for comparisons, fractions as (a/b), and so on.',
      fields: const [
        AiFormField(
          key: 'cls',
          label: 'Class',
          isDropdown: true,
          options: ['VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
          defaultValue: 'VIII',
        ),
        AiFormField(
          key: 'subject',
          label: 'Subject',
          isDropdown: true,
          options: [
            'Mathematics',
            'Science',
            'Social Studies',
            'English',
            'Hindi'
          ],
          defaultValue: 'Mathematics',
        ),
        AiFormField(
          key: 'topics',
          label: 'Topics',
          hint: 'e.g., Algebraic Expressions',
        ),
        AiFormField(
          key: 'totalMarks',
          label: 'Total Marks',
          hint: '50',
          defaultValue: '50',
        ),
      ],
      buildPrompt: (values) =>
          'Generate a complete question paper:\n'
          '- Class: ${values['cls']}\n'
          '- Subject: ${values['subject']}\n'
          '- Topics: ${values['topics']}\n'
          '- Total Marks: ${values['totalMarks']}\n'
          '- Difficulty: Easy 30%, Medium 50%, Hard 20%\n'
          '- Include Bloom\'s Taxonomy mapping: Yes\n\n'
          'Generate: (1) Complete Question Paper (2) Blueprint Table (3) Answer Key with solutions (4) Marking Scheme',
    );
  }
}
