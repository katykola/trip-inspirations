import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  description: string;
  images: string[];
}

// Function to fetch and parse HTML content
async function fetchAndParse(url: string): Promise<ScrapedData | undefined> {
  try {
    // Fetch the HTML content
    const { data } = await axios.get(`http://localhost:3001/fetch?url=${encodeURIComponent(url)}`);

    // Load the HTML content into Cheerio
    const $ = cheerio.load(data);

    // Extract the title of the webpage
    const title = $('title').text();

    // Extract the description of the webpage
    const description = $('meta[name="description"]').attr('content') || '';

    // Extract all image URLs
    const images: string[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        // Ensure the URL is absolute
        const absoluteSrc = new URL(src, url).href;
        images.push(absoluteSrc);
      }
    });

    // Log the extracted images for debugging
    console.log('Extracted Images:', images);

    // Return the extracted data
    return { title, description, images };
  } catch (error) {
    console.error('Error fetching and parsing HTML:', error);
  }
}

export { fetchAndParse };