import 'package:flutter/material.dart';
import 'shared_placeholder.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return buildFeaturePlaceholder(
      context,
      "Settings",
      "Account preferences, integration configs, and push notification settings.",
    );
  }
}
