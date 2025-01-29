import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  title: string;
  description: string;
  images: string[];
}

async function fetchAndParse(url: string): Promise<ScrapedData | undefined> {
  try {
    const { data } = await axios.get(`https://api-n2q564hnra-uc.a.run.app/fetch?url=${encodeURIComponent(url)}`);
    const $ = cheerio.load(data);
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';

    const images: string[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        const absoluteSrc = new URL(src, url).href;
        images.push(absoluteSrc);
      }
    });

    return { title, description, images };
  } catch (error) {
    console.error('Error fetching and parsing HTML:', error);
    throw new Error('Error fetching and parsing HTML. Try again.');
  }
}

export { fetchAndParse };