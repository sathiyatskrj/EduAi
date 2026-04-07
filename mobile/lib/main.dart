import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';

void main() {
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const EduAIApp());
}

class EduAIApp extends StatelessWidget {
  const EduAIApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'EduAI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF009688),
          secondary: Color(0xFFFF6D00),
          surface: Color(0xFF1E293B),
          background: Color(0xFF0F172A),
        ),
        useMaterial3: true,
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeTab(),
    LessonPlannerTab(),
    StatsTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true, // Needed for transparent/blur bottom nav
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        margin: const EdgeInsets.only(left: 20, right: 20, bottom: 30),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF009688).withOpacity(0.2),
              blurRadius: 30,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(30),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
            child: Container(
              height: 70,
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B).withOpacity(0.7),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.white.withOpacity(0.1), width: 1.5),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildNavItem(0, Icons.grid_view_rounded, "Home"),
                  _buildNavItem(1, Icons.auto_awesome_rounded, "AI Plan"),
                  _buildNavItem(2, Icons.bar_chart_rounded, "Stats"),
                ],
              ),
            ),
          ),
        ),
      ).animate().slideY(begin: 1, duration: 600.ms, curve: Curves.easeOutBack),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    final isSelected = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOutQuint,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF009688).withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? const Color(0xFF00BCD4) : Colors.grey.shade500,
              size: 26,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  color: const Color(0xFF00BCD4),
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ).animate().fadeIn().slideX(begin: 0.2),
            ]
          ],
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// UI: HOME TAB
// -----------------------------------------------------------------------------
class HomeTab extends StatelessWidget {
  const HomeTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 120,
          floating: false,
          pinned: true,
          backgroundColor: const Color(0xFF0F172A),
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.only(left: 24, bottom: 16),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFF009688), Color(0xFF00BCD4)]),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text("E", style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.white)),
                ),
                const SizedBox(width: 10),
                Text(
                  "EduAI",
                  style: GoogleFonts.inter(fontWeight: FontWeight.w800, color: Colors.white, fontSize: 22),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 500.ms),
          actions: [
            IconButton(
              icon: const Icon(Icons.notifications_none_rounded, color: Colors.white),
              onPressed: () {},
            ),
            const SizedBox(width: 8),
            const CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage('https://ui-avatars.com/api/?name=Teacher&background=009688&color=fff'),
            ),
            const SizedBox(width: 24),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Good Morning! 👋",
                  style: GoogleFonts.inter(fontSize: 28, fontWeight: FontWeight.w800, color: Colors.white),
                ).animate().slideX(begin: -0.1, duration: 400.ms).fadeIn(),
                const SizedBox(height: 8),
                Text(
                  "Here is your classroom intelligence overview.",
                  style: TextStyle(color: Colors.grey.shade400, fontSize: 15),
                ).animate().slideX(begin: -0.1, duration: 400.ms, delay: 100.ms).fadeIn(),
                
                const SizedBox(height: 32),
                
                // Stat Grid
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.25,
                  children: const [
                    PremiumStatCard(title: "Class Average", value: "72.4%", icon: Icons.insights_rounded, color: Color(0xFF10B981), delay: 0),
                    PremiumStatCard(title: "Lesson Plans", value: "24", icon: Icons.menu_book_rounded, color: Color(0xFF00BCD4), delay: 100),
                    PremiumStatCard(title: "Tests Created", value: "12", icon: Icons.science_rounded, color: Color(0xFF8B5CF6), delay: 200),
                    PremiumStatCard(title: "Total Students", value: "156", icon: Icons.people_alt_rounded, color: Color(0xFFF59E0B), delay: 300),
                  ],
                ),
                
                const SizedBox(height: 36),
                Text("🔥 Critical Insights", style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.bold))
                    .animate().fadeIn(delay: 400.ms),
                const SizedBox(height: 16),
                
                const PremiumAlertCard(
                  title: "Action Required",
                  message: "Ravi Kumar scored below 40% in 3 tests. Remedial is highly recommended.",
                  type: "danger",
                ).animate().slideX(begin: 0.1, delay: 500.ms).fadeIn(),
                
                const PremiumAlertCard(
                  title: "Trend Alert",
                  message: "VII-A class average dropped by 8% in last test — concept: Algebraic Expressions.",
                  type: "warning",
                ).animate().slideX(begin: 0.1, delay: 600.ms).fadeIn(),
                
                const SizedBox(height: 120), // Bottom padding
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class PremiumStatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final int delay;

  const PremiumStatCard({required this.title, required this.value, required this.icon, required this.color, required this.delay, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          )
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: color.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                child: Icon(icon, color: color, size: 24),
              ),
              const Icon(Icons.arrow_outward_rounded, color: Colors.grey, size: 16)
            ],
          ),
          const Spacer(),
          Text(value, style: GoogleFonts.inter(fontSize: 26, fontWeight: FontWeight.w800, color: Colors.white)),
          const SizedBox(height: 4),
          Text(title, style: TextStyle(fontSize: 13, color: Colors.grey.shade400, fontWeight: FontWeight.w500)),
        ],
      ),
    ).animate().scale(delay: delay.ms, duration: 400.ms, curve: Curves.easeOutBack).fadeIn();
  }
}

class PremiumAlertCard extends StatelessWidget {
  final String title;
  final String message;
  final String type;

  const PremiumAlertCard({required this.title, required this.message, required this.type, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final color = type == 'danger' ? const Color(0xFFEF4444) : const Color(0xFFF59E0B);
    final icon = type == 'danger' ? Icons.error_outline_rounded : Icons.warning_amber_rounded;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 5),
          )
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: color.withOpacity(0.15), shape: BoxShape.circle),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: color)),
                const SizedBox(height: 6),
                Text(message, style: TextStyle(fontSize: 13, color: Colors.grey.shade300, height: 1.5)),
              ],
            ),
          )
        ],
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// UI: LESSON PLANNER TAB
// -----------------------------------------------------------------------------
class LessonPlannerTab extends StatelessWidget {
  const LessonPlannerTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text("AI Lesson Planner", style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Generate NCERT-aligned plans in seconds.", style: TextStyle(color: Colors.grey.shade400, fontSize: 15))
                .animate().fadeIn(delay: 100.ms),
            const SizedBox(height: 32),
            Container(
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  _buildInput("Class (e.g., VII)"),
                  const SizedBox(height: 20),
                  _buildInput("Subject"),
                  const SizedBox(height: 20),
                  _buildInput("Topic"),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.transparent,
                        padding: EdgeInsets.zero,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Ink(
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(colors: [Color(0xFF009688), Color(0xFF00BCD4)]),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Container(
                          alignment: Alignment.center,
                          child: const Text('✨ Generate Magic Plan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white)),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ).animate().slideY(begin: 0.1, duration: 500.ms).fadeIn(),
          ],
        ),
      ),
    );
  }

  Widget _buildInput(String hint) {
    return TextField(
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: hint,
        labelStyle: TextStyle(color: Colors.grey.shade500),
        filled: true,
        fillColor: const Color(0xFF0F172A),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF00BCD4), width: 1.5)),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// UI: STATS TAB
// -----------------------------------------------------------------------------
class StatsTab extends StatelessWidget {
  const StatsTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text("Class Statistics", style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22)),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF334155), Color(0xFF1E293B)]),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                children: [
                  _buildStatRow("Mean (x̄)", "34.2", "Σx/N"),
                  const Divider(color: Colors.white12, height: 32),
                  _buildStatRow("Standard Deviation (σ)", "8.4", "√(Σ(x-x̄)²/N)"),
                  const Divider(color: Colors.white12, height: 32),
                  _buildStatRow("Highest Score", "48", "Max"),
                  const Divider(color: Colors.white12, height: 32),
                  _buildStatRow("Coeff. of Variation", "24.5%", "(σ/x̄)×100"),
                ],
              ),
            ).animate().slideX(begin: 0.1, duration: 500.ms).fadeIn(),
            const SizedBox(height: 32),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.05)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Export Options", style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.picture_as_pdf_rounded, color: Colors.white),
                    label: const Text("Export B.Ed Report"),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFEF4444),
                      foregroundColor: Colors.white,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  )
                ],
              ),
            ).animate().slideX(begin: -0.1, duration: 600.ms).fadeIn(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value, String subtitle) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 16, color: Colors.white70, fontWeight: FontWeight.w500)),
            const SizedBox(height: 4),
            Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.white30, fontStyle: FontStyle.italic)),
          ],
        ),
        Text(value, style: GoogleFonts.inter(fontSize: 22, fontWeight: FontWeight.w800, color: const Color(0xFF00BCD4))),
      ],
    );
  }
}
