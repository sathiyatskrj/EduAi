import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String _selectedModel = 'Gemini 2.0 Flash';
  String _teacherName = 'Teacher';
  String _board = 'CBSE';
  String _language = 'English';

  final List<Map<String, dynamic>> _models = [
    {
      'name': 'Gemini 2.0 Flash',
      'subtitle': 'Fast & stable (Cloud)',
      'icon': Icons.flash_on_rounded,
      'color': const Color(0xFF009688),
    },
    {
      'name': 'Gemini 3.1 Flash Lite',
      'subtitle': '500 RPD free tier (Cloud)',
      'icon': Icons.auto_awesome_rounded,
      'color': const Color(0xFF8B5CF6),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(
          "Settings",
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
            // Profile Section
            _sectionTitle("Teacher Profile"),
            const SizedBox(height: 12),
            _buildGlassCard(
              child: Column(
                children: [
                  _buildTextField("Name", _teacherName, (v) => setState(() => _teacherName = v)),
                  const SizedBox(height: 16),
                  _buildDropdown("Board", _board, ['CBSE', 'ICSE', 'State Board'], (v) => setState(() => _board = v)),
                  const SizedBox(height: 16),
                  _buildDropdown("Language", _language, ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi'], (v) => setState(() => _language = v)),
                ],
              ),
            ).animate().slideY(begin: 0.1, duration: 500.ms).fadeIn(),

            const SizedBox(height: 32),

            // AI Engine Section
            _sectionTitle("AI Engine"),
            const SizedBox(height: 12),
            ...List.generate(_models.length, (i) {
              final model = _models[i];
              final isSelected = _selectedModel == model['name'];
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: GestureDetector(
                  onTap: () => setState(() => _selectedModel = model['name']),
                  child: _buildGlassCard(
                    borderColor: isSelected
                        ? (model['color'] as Color)
                        : Colors.white.withOpacity(0.12),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: (model['color'] as Color).withOpacity(0.15),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(model['icon'] as IconData,
                              color: model['color'] as Color, size: 24),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                model['name'] as String,
                                style: GoogleFonts.inter(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 15,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                model['subtitle'] as String,
                                style: TextStyle(
                                    color: Colors.grey.shade400, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                        if (isSelected)
                          Icon(Icons.check_circle_rounded,
                              color: model['color'] as Color, size: 24),
                      ],
                    ),
                  ),
                ).animate().slideX(begin: 0.1, delay: (200 + i * 100).ms).fadeIn(),
              );
            }),

            const SizedBox(height: 32),

            // About Section
            _sectionTitle("About"),
            const SizedBox(height: 12),
            _buildGlassCard(
              child: Column(
                children: [
                  _aboutRow("Version", "2.0.0"),
                  const Divider(color: Colors.white12, height: 24),
                  _aboutRow("API Engine", "Gemini 3.1 Flash Lite"),
                  const Divider(color: Colors.white12, height: 24),
                  _aboutRow("Platform", "Flutter + Next.js"),
                ],
              ),
            ).animate().slideY(begin: 0.1, delay: 400.ms).fadeIn(),

            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: Colors.white,
      ),
    );
  }

  Widget _buildGlassCard({required Widget child, Color? borderColor}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.04),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
                color: borderColor ?? Colors.white.withOpacity(0.12),
                width: borderColor != null ? 2 : 1),
          ),
          child: child,
        ),
      ),
    );
  }

  Widget _buildTextField(String label, String value, Function(String) onChanged) {
    return TextField(
      controller: TextEditingController(text: value),
      style: const TextStyle(color: Colors.white),
      onChanged: onChanged,
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey.shade500),
        filled: true,
        fillColor: const Color(0xFF0F172A),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget _buildDropdown(String label, String value, List<String> options, Function(String) onChanged) {
    return DropdownButtonFormField<String>(
      value: value,
      dropdownColor: const Color(0xFF1E293B),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.grey.shade500),
        filled: true,
        fillColor: const Color(0xFF0F172A),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
      items: options.map((o) => DropdownMenuItem(value: o, child: Text(o, style: const TextStyle(color: Colors.white)))).toList(),
      onChanged: (v) => onChanged(v ?? ''),
    );
  }

  Widget _aboutRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(color: Colors.grey.shade400, fontSize: 14)),
        Text(value,
            style: GoogleFonts.inter(
                color: const Color(0xFF00BCD4),
                fontWeight: FontWeight.w600,
                fontSize: 14)),
      ],
    );
  }
}
