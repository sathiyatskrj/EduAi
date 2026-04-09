import 'package:flutter/material.dart';
import '../widgets/ai_generator_screen.dart';

class TeachingAidsScreen extends StatelessWidget {
  const TeachingAidsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AiGeneratorScreen(
      title: "Teaching Aids",
      subtitle: "Generate classroom-ready resource packs from a topic.",
      icon: Icons.view_in_ar_rounded,
      accentColor: const Color(0xFFEC4899),
      systemPrompt:
          'You are EduAI Teaching Aid Generator. Generate a complete teaching resource pack including: 1) 8-slide PPT outline 2) 3 no-tech classroom activities 3) 5 real-life examples 4) 6 Q&A flashcard pairs 5) A storytelling hook 6) Blackboard layout plan. Use markdown formatting with tables and headers.',
      fields: const [
        AiFormField(
          key: 'topic',
          label: 'Topic',
          hint: 'e.g., Photosynthesis, Fractions',
        ),
        AiFormField(
          key: 'cls',
          label: 'Class',
          isDropdown: true,
          options: ['VI', 'VII', 'VIII', 'IX', 'X'],
          defaultValue: 'VIII',
        ),
        AiFormField(
          key: 'type',
          label: 'Resource Type',
          isDropdown: true,
          options: [
            'Full Resource Pack',
            'PPT Slides Only',
            'Activities Only',
            'Flashcards Only',
            'Story Hook Only',
          ],
          defaultValue: 'Full Resource Pack',
        ),
      ],
      buildPrompt: (values) =>
          'Generate teaching aids for the topic: "${values['topic']}"\n'
          '- Class: ${values['cls']}\n'
          '- Type: ${values['type']}\n\n'
          'Make it practical for an Indian classroom setting.',
    );
  }
}
