import "./globals.css";

export const metadata = {
  title: "EduAI — AI-Powered Teacher Training & Classroom Intelligence",
  description: "Automate lesson planning, test generation, statistical analysis, diagnosis and remedial teaching with AI. Built for B.Ed interns and teachers.",
  keywords: "EduAI, teacher AI, lesson plan generator, test generator, B.Ed, NCERT, classroom intelligence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
