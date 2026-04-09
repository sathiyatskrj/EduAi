import 'package:flutter/material.dart';
import 'shared_placeholder.dart';

class TestScreen extends StatelessWidget {
  const TestScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return buildFeaturePlaceholder(
      context,
      "Test Builder",
      "Automatically generate tests tailored to class weaknesses.",
    );
  }
}
