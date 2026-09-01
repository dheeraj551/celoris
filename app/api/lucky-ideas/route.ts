export async function GET() {
    const ideas = [
      "A real-time voice translator app for travelers that auto-detects language and speaks translated responses",
      "An automated meeting summarizer that syncs action items to Google Calendar and tasks to Google Sheets",
      "A smart Android habit tracker with animated streak rings, widgets, and local notification reminders",
      "An intelligent Gmail triage assistant that drafts replies and categorizes customer feedback",
      "A Google Drive document analyzer that indexes PDFs and answers questions with citation links",
      "A real-time collaborative canvas with interactive diagramming and AI wireframe generation",
      "A personal fitness companion app that generates dynamic workout routines and tracks progressive overload",
      "A smart budgeting and expense tracker that scans receipts from Google Drive and updates Google Sheets"
    ];
    const randomIndex = Math.floor(Math.random() * ideas.length);
    return Response.json({ idea: ideas[randomIndex] });
}
