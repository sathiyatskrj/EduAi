import 'package:flutter/material.dart';
import 'shared_placeholder.dart';

class TeachingAidsScreen extends StatelessWidget {
  const TeachingAidsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return buildFeaturePlaceholder(
      context,
      "Teaching Aids",
      "Digital resources and multimedia elements based on curriculum algorithms.",
    );
  }
}
