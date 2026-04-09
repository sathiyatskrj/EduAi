import 'package:flutter/material.dart';
import 'shared_placeholder.dart';

class RemedialScreen extends StatelessWidget {
  const RemedialScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return buildFeaturePlaceholder(
      context,
      "Remedial Planning",
      "AI will chart learning modules for students requiring extra assistance.",
    );
  }
}
