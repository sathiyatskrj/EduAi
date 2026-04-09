import 'package:flutter/material.dart';
import '../widgets/ai_generator_screen.dart';

class RemedialScreen extends StatelessWidget {
  const RemedialScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AiGeneratorScreen(
      title: "Remedial Plan",
      subtitle: "AI-generated simplified content for weak students.",
      icon: Icons.healing_rounded,
      accentColor: const Color(0xFFF59E0B),
      systemPrompt:
          'You are EduAI Remedial Engine. Generate remedial content for students who failed to grasp specific concepts. For each topic provide: 1) A simplified real-world analogy 2) Step-by-step breakdown 3) 3 very simple practice questions with answers 4) Blackboard visual description. Use markdown formatting with tables where appropriate.',
      fields: const [
        AiFormField(
          key: 'cls',
          label: 'Class',
          isDropdown: true,
          options: ['VI', 'VII', 'VIII', 'IX', 'X'],
          defaultValue: 'VII',
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
          label: 'Weak Topics',
          hint: 'e.g., Multiplying Fractions, Algebraic Identities',
        ),
      ],
      buildPrompt: (values) =>
          'Generate remedial teaching content for weak students:\n'
          '- Class: ${values['cls']}\n'
          '- Subject: ${values['subject']}\n'
          '- Topics: ${values['topics']}\n\n'
          'Focus on breaking each concept into the simplest form. Target students scoring below 40%.',
    );
  }
}
