import 'dart:ui';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:http/http.dart' as http;

// API Configuration
// Using 10.0.2.2 which is localhost alias for Android Emulator
// Change to your machine's local IP if testing on a real device.
const String API_URL = "http://10.0.2.2:3000/api/ai";

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
        scaffoldBackgroundColor: Colors.transparent,
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
      extendBody: true,
      backgroundColor: Colors.transparent,
      body: Stack(
        children: [
          const AnimatedMeshBackground(),
          IndexedStack(index: _currentIndex, children: _screens),
        ],
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
                border: Border.all(
                  color: Colors.white.withOpacity(0.1),
                  width: 1.5,
                ),
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
          color: isSelected
              ? const Color(0xFF009688).withOpacity(0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected
                  ? const Color(0xFF00BCD4)
                  : Colors.grey.shade500,
              size: 26,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: const TextStyle(
                  color: Color(0xFF00BCD4),
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ).animate().fadeIn().slideX(begin: 0.2),
            ],
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
          backgroundColor: Colors.transparent,
          flexibleSpace: FlexibleSpaceBar(
            titlePadding: const EdgeInsets.only(left: 24, bottom: 16),
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF009688), Color(0xFF00BCD4)],
                    ),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    "E",
                    style: TextStyle(
                      fontWeight: FontWeight.w900,
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  "EduAI",
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                    fontSize: 22,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 500.ms),
          actions: [
            IconButton(
              icon: const Icon(
                Icons.notifications_none_rounded,
                color: Colors.white,
              ),
              onPressed: () {},
            ),
            const SizedBox(width: 8),
            const CircleAvatar(
              radius: 16,
              backgroundImage: NetworkImage(
                'https://ui-avatars.com/api/?name=Teacher&background=009688&color=fff',
              ),
            ),
            const SizedBox(width: 24),
          ],
        ),
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 8.0,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Good Morning! 👋",
                  style: GoogleFonts.inter(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ).animate().slideX(begin: -0.1, duration: 400.ms).fadeIn(),
                const SizedBox(height: 8),
                Text(
                      "Here is your classroom intelligence overview.",
                      style: TextStyle(
                        color: Colors.grey.shade400,
                        fontSize: 15,
                      ),
                    )
                    .animate()
                    .slideX(begin: -0.1, duration: 400.ms, delay: 100.ms)
                    .fadeIn(),

                const SizedBox(height: 32),

                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 1.25,
                  children: const [
                    PremiumStatCard(
                      title: "Class Average",
                      value: "72.4%",
                      icon: Icons.insights_rounded,
                      color: Color(0xFF10B981),
                      delay: 0,
                    ),
                    PremiumStatCard(
                      title: "Lesson Plans",
                      value: "24",
                      icon: Icons.menu_book_rounded,
                      color: Color(0xFF00BCD4),
                      delay: 100,
                    ),
                    PremiumStatCard(
                      title: "Tests Created",
                      value: "12",
                      icon: Icons.science_rounded,
                      color: Color(0xFF8B5CF6),
                      delay: 200,
                    ),
                    PremiumStatCard(
                      title: "Total Students",
                      value: "156",
                      icon: Icons.people_alt_rounded,
                      color: Color(0xFFF59E0B),
                      delay: 300,
                    ),
                  ],
                ),

                const SizedBox(height: 36),
                Text(
                  "🔥 Critical Insights",
                  style: GoogleFonts.inter(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ).animate().fadeIn(delay: 400.ms),
                const SizedBox(height: 16),

                const PremiumAlertCard(
                  title: "Action Required",
                  message:
                      "Ravi Kumar scored below 40% in 3 tests. Remedial recommended.",
                  type: "danger",
                ).animate().slideX(begin: 0.1, delay: 500.ms).fadeIn(),

                const PremiumAlertCard(
                  title: "Trend Alert",
                  message: "VII-A class average dropped by 8% in last test.",
                  type: "warning",
                ).animate().slideX(begin: 0.1, delay: 600.ms).fadeIn(),

                const SizedBox(height: 120),
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

  const PremiumStatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.delay,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(icon, color: color, size: 24),
                      ),
                      const Icon(
                        Icons.arrow_outward_rounded,
                        color: Colors.grey,
                        size: 16,
                      ),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    value,
                    style: GoogleFonts.inter(
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 13,
                      color: Colors.grey.shade400,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        )
        .animate()
        .scale(delay: delay.ms, duration: 400.ms, curve: Curves.easeOutBack)
        .fadeIn();
  }
}

class PremiumAlertCard extends StatelessWidget {
  final String title;
  final String message;
  final String type;

  const PremiumAlertCard({
    required this.title,
    required this.message,
    required this.type,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final color = type == 'danger'
        ? const Color(0xFFEF4444)
        : const Color(0xFFF59E0B);
    final icon = type == 'danger'
        ? Icons.error_outline_rounded
        : Icons.warning_amber_rounded;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: color.withOpacity(0.08),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: color.withOpacity(0.2)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: color,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        message,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey.shade300,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// UI: LESSON PLANNER TAB (WITH AI API INTEGRATION)
// -----------------------------------------------------------------------------
class LessonPlannerTab extends StatefulWidget {
  const LessonPlannerTab({Key? key}) : super(key: key);

  @override
  State<LessonPlannerTab> createState() => _LessonPlannerTabState();
}

class _LessonPlannerTabState extends State<LessonPlannerTab> {
  final _classController = TextEditingController();
  final _subjectController = TextEditingController();
  final _topicController = TextEditingController();

  bool _isLoading = false;
  String _generatedContent = "";

  Future<void> _generatePlan() async {
    if (_classController.text.isEmpty || _topicController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill in Class and Topic")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
      _generatedContent = "";
    });

    try {
      final prompt =
          "Generate a complete lesson plan:\n- Class: ${_classController.text}\n- Subject: ${_subjectController.text}\n- Topic: ${_topicController.text}\n\nProvide a comprehensive, detailed lesson plan in the exact B.Ed notebook format.";
      final systemPrompt =
          "You are EduAI, an expert Indian school teacher assistant. Generate detailed lesson plans in structured format.";

      final response = await http.post(
        Uri.parse(API_URL),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"prompt": prompt, "systemPrompt": systemPrompt}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _generatedContent = data['result'] ?? "No result generated.";
        });
      } else {
        setState(() {
          _generatedContent =
              "API Error (${response.statusCode}): Make sure your Next.js server is running and .env.local is configured.";
        });
      }
    } catch (e) {
      setState(() {
        _generatedContent =
            "Network Error: Could not reach the API.\nDetailed info: $e\n\nPlease ensure the Next.js app is running on port 3000.";
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(
          "AI Lesson Planner",
          style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Generate NCERT-aligned plans in seconds.",
              style: TextStyle(color: Colors.grey.shade400, fontSize: 15),
            ).animate().fadeIn(delay: 100.ms),
            const SizedBox(height: 32),

            ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      _buildInput("Class (e.g., VII)", _classController),
                      const SizedBox(height: 20),
                      _buildInput("Subject", _subjectController),
                      const SizedBox(height: 20),
                      _buildInput("Topic", _topicController),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _generatePlan,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.transparent,
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: Ink(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF009688), Color(0xFF00BCD4)],
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Container(
                              alignment: Alignment.center,
                              child: _isLoading
                                  ? const SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      '✨ Generate Magic Plan',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ).animate().slideY(begin: 0.1, duration: 500.ms).fadeIn(),

            if (_generatedContent.isNotEmpty) ...[
              const SizedBox(height: 32),
              ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withOpacity(0.12)),
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Result",
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF00BCD4),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          _generatedContent,
                          style: const TextStyle(
                            fontSize: 15,
                            color: Colors.white70,
                            height: 1.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ).animate().fadeIn().slideY(begin: 0.1),
              const SizedBox(height: 120),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInput(String hint, TextEditingController controller) {
    return TextField(
      controller: controller,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: hint,
        labelStyle: TextStyle(color: Colors.grey.shade500),
        filled: true,
        fillColor: const Color(0xFF0F172A),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: Color(0xFF00BCD4), width: 1.5),
        ),
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// UI: STATS TAB (WITH DYNAMIC CALCULATION)
// -----------------------------------------------------------------------------
class StatsTab extends StatefulWidget {
  const StatsTab({Key? key}) : super(key: key);

  @override
  State<StatsTab> createState() => _StatsTabState();
}

class _StatsTabState extends State<StatsTab> {
  List<double> marks = [42, 38, 45, 29, 31, 48, 12, 35, 33, 40];
  final _scoreController = TextEditingController();

  Map<String, String> get calculations {
    if (marks.isEmpty) return {"mean": "0", "sd": "0", "max": "0", "cv": "0%"};

    // Mean
    double sum = marks.reduce((a, b) => a + b);
    double mean = sum / marks.length;

    // Max
    double maxScore = marks.reduce(max);

    // Standard Deviation
    double variance =
        marks.map((m) => pow(m - mean, 2)).reduce((a, b) => a + b) /
        marks.length;
    double sd = sqrt(variance);

    // Coeff of Variation
    double cv = (sd / mean) * 100;

    return {
      "mean": mean.toStringAsFixed(1),
      "sd": sd.toStringAsFixed(1),
      "max": maxScore.toStringAsFixed(0),
      "cv": cv.toStringAsFixed(1) + "%",
    };
  }

  void _addScore() {
    if (_scoreController.text.isNotEmpty) {
      double? val = double.tryParse(_scoreController.text);
      if (val != null) {
        setState(() {
          marks.add(val);
          _scoreController.clear();
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final stats = calculations;

    return Scaffold(
      backgroundColor: Colors.transparent,
      appBar: AppBar(
        title: Text(
          "Dynamic Statistics",
          style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 22),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  child: Column(
                    children: [
                      _buildStatRow("Mean (x̄)", stats["mean"]!, "Σx/N"),
                      const Divider(color: Colors.white12, height: 32),
                      _buildStatRow(
                        "Standard Deviation (σ)",
                        stats["sd"]!,
                        "√(Σ(x-x̄)²/N)",
                      ),
                      const Divider(color: Colors.white12, height: 32),
                      _buildStatRow("Highest Score", stats["max"]!, "Max"),
                      const Divider(color: Colors.white12, height: 32),
                      _buildStatRow(
                        "Coeff. of Variation",
                        stats["cv"]!,
                        "(σ/x̄)×100",
                      ),
                    ],
                  ),
                ),
              ),
            ).animate().slideX(begin: 0.1, duration: 500.ms).fadeIn(),

            const SizedBox(height: 32),

            ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Scores List (n=${marks.length})",
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _scoreController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                hintText: "Enter score...",
                                filled: true,
                                fillColor: const Color(0xFF0F172A),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  borderSide: BorderSide.none,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFF009688), Color(0xFF00BCD4)],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: IconButton(
                              icon: const Icon(Icons.add, color: Colors.white),
                              onPressed: _addScore,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: marks
                            .map(
                              (m) => Chip(
                                label: Text(m.toStringAsFixed(0)),
                                backgroundColor: const Color(0xFF0F172A),
                                deleteIcon: const Icon(Icons.close, size: 16),
                                onDeleted: () =>
                                    setState(() => marks.remove(m)),
                              ),
                            )
                            .toList(),
                      ),
                    ],
                  ),
                ),
              ),
            ).animate().slideX(begin: -0.1, duration: 600.ms).fadeIn(),

            const SizedBox(height: 100),
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
            Text(
              label,
              style: const TextStyle(
                fontSize: 16,
                color: Colors.white70,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 12,
                color: Colors.white30,
                fontStyle: FontStyle.italic,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF00BCD4),
          ),
        ),
      ],
    );
  }
}

class AnimatedMeshBackground extends StatefulWidget {
  const AnimatedMeshBackground({Key? key}) : super(key: key);

  @override
  State<AnimatedMeshBackground> createState() => _AnimatedMeshBackgroundState();
}

class _AnimatedMeshBackgroundState extends State<AnimatedMeshBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 15),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          color: const Color(0xFF090D14), // Deep dark blue base
          child: Stack(
            children: [
              // Using glowing containers instead of heavy global BackdropFilter
              Positioned(
                top:
                    MediaQuery.of(context).size.height * 0.2 +
                    (_controller.value * 100),
                left:
                    MediaQuery.of(context).size.width * 0.1 +
                    (sin(_controller.value * pi) * 100),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.8,
                  height: MediaQuery.of(context).size.width * 0.8,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF009688).withOpacity(0.5),
                        blurRadius: 100,
                        spreadRadius: 50,
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom:
                    MediaQuery.of(context).size.height * 0.1 -
                    (_controller.value * 150),
                right:
                    MediaQuery.of(context).size.width * 0.1 -
                    (cos(_controller.value * pi) * 150),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.9,
                  height: MediaQuery.of(context).size.width * 0.9,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF8B5CF6).withOpacity(0.5),
                        blurRadius: 100,
                        spreadRadius: 50,
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                top:
                    MediaQuery.of(context).size.height * 0.5 -
                    (_controller.value * 80),
                right:
                    MediaQuery.of(context).size.width * 0.4 +
                    (sin(_controller.value * pi * 2) * 80),
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.7,
                  height: MediaQuery.of(context).size.width * 0.7,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF00BCD4).withOpacity(0.5),
                        blurRadius: 100,
                        spreadRadius: 50,
                      ),
                    ],
                  ),
                ),
              ),
              // A slight dark overlay to keep text readable
              Positioned.fill(
                child: Container(color: Colors.black.withOpacity(0.3)),
              ),
            ],
          ),
        );
      },
    );
  }
}
