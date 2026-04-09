import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'students_screen.dart';
import 'marks_screen.dart';
import 'diagnosis_screen.dart';
import 'remedial_screen.dart';
import 'test_screen.dart';
import 'teaching_aids_screen.dart';
import 'settings_screen.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(
          "All Features",
          style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Dashboard Tools",
              style: TextStyle(color: Colors.grey.shade400, fontSize: 15),
            ).animate().fadeIn(delay: 100.ms),
            const SizedBox(height: 24),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.1,
              children: [
                _buildMenuCard(
                  context,
                  "Students",
                  Icons.group_rounded,
                  const Color(0xFF3B82F6),
                  const StudentsScreen(),
                  0,
                ),
                _buildMenuCard(
                  context,
                  "Marks",
                  Icons.grading_rounded,
                  const Color(0xFF10B981),
                  const MarksScreen(),
                  100,
                ),
                _buildMenuCard(
                  context,
                  "Tests",
                  Icons.quiz_rounded,
                  const Color(0xFF8B5CF6),
                  const TestScreen(),
                  200,
                ),
                _buildMenuCard(
                  context,
                  "Diagnosis",
                  Icons.troubleshoot_rounded,
                  const Color(0xFFEF4444),
                  const DiagnosisScreen(),
                  300,
                ),
                _buildMenuCard(
                  context,
                  "Remedial",
                  Icons.healing_rounded,
                  const Color(0xFFF59E0B),
                  const RemedialScreen(),
                  400,
                ),
                _buildMenuCard(
                  context,
                  "Teaching Aids",
                  Icons.view_in_ar_rounded,
                  const Color(0xFFEC4899),
                  const TeachingAidsScreen(),
                  500,
                ),
                _buildMenuCard(
                  context,
                  "Settings",
                  Icons.settings_rounded,
                  const Color(0xFF6B7280),
                  const SettingsScreen(),
                  600,
                ),
              ],
            ),
            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    Widget destination,
    int delay,
  ) {
    return GestureDetector(
          onTap: () {
            Navigator.of(context).push(
              PageRouteBuilder(
                opaque: false, // Keeps animated background visible
                pageBuilder: (context, animation, secondaryAnimation) =>
                    destination,
                transitionsBuilder:
                    (context, animation, secondaryAnimation, child) {
                      const begin = Offset(1.0, 0.0);
                      const end = Offset.zero;
                      const curve = Curves.easeOutQuart;
                      var tween = Tween(
                        begin: begin,
                        end: end,
                      ).chain(CurveTween(curve: curve));
                      return SlideTransition(
                        position: animation.drive(tween),
                        child: child,
                      );
                    },
              ),
            );
          },
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.04),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.12)),
                  boxShadow: [
                    BoxShadow(
                      color: color.withOpacity(0.05),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.15),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(icon, color: color, size: 28),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
        .animate()
        .scale(delay: delay.ms, duration: 400.ms, curve: Curves.easeOutBack)
        .fadeIn();
  }
}
