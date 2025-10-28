// --- Mock Database ---
// This is our fake database.
// When you build your real scraper, you'll replace this with your scraping logic.

// Helper function to create 52 chapters of mock data
function createShutInChapters() {
  const chapters = [];
  for (let i = 1; i <= 52; i++) {
    chapters.push({
      number: i,
      // We use placeholders for the chapter pages
      // In your real scraper, you'd fill this array with actual image URLs
      pages: [
        `https://placehold.co/800x1200/000000/ffffff?text=Page+1+(Chapter+${i})`,
        `https://placehold.co/800x1200/000000/ffffff?text=Page+2+(Chapter+${i})`,
        `https://placehold.co/800x1200/000000/ffffff?text=Page+3+(Chapter+${i})`,
      ],
    });
  }
  return chapters;
}

const allSeriesData = [
  {
    id: 'the-ultimate-shut-in',
    title: 'The Ultimate Shut-In',
    // I'm using the cover you linked
    coverUrl: 'https://asuracomic.net/wp-content/uploads/2024/04/The-Ultimate-Shut-In-Cover-1.png',
    chapters: createShutInChapters(),
  },
  {
    id: 'another-series',
    title: 'Another Cool Manhwa',
    coverUrl: 'https://placehold.co/400x600/222222/888888?text=Sample+Cover',
    chapters: [
      {
        number: 1,
        pages: ['https://placehold.co/800x1200/000000/ffffff?text=Page+1'],
      },
      {
        number: 2,
        pages: ['https://placehold.co/800x1200/000000/ffffff?text=Page+1'],
      },
    ],
  },
];

// --- API Handler ---
// This is the Vercel Serverless Function.
// Vercel automatically runs this code when you visit /api/get-series
export default function handler(request, response) {
  
  // 1. Get the 'id' from the URL (e.g., /api/get-series?id=the-ultimate-shut-in)
  const { id } = request.query;

  if (id) {
    // 2. If an 'id' is provided, find that ONE series
    const series = allSeriesData.find((s) => s.id === id);

    if (series) {
      // Found it! Send it back as JSON
      response.status(200).json({
        series: series,
      });
    } else {
      // Couldn't find it
      response.status(404).json({
        error: 'Series not found',
      });
    }
  } else {
    // 3. If NO 'id' is provided, send ALL series
    // (This is for the Home and Library pages)
    response.status(200).json({
      series: allSeriesData,
    });
  }
}

