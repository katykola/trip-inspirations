interface Trip {
    id: string;
    title: string;
    description: string;
    url: string;
    lat: number;
    lng: number;
    images: string[];
    coordinates?: {
        lat: number;
        lng: number;
    };
    userId: string;
    collection: string;
  }

interface Collection {
  id: string;
  title: string;
  trips: string[];
  userId: string;
  images?: string[];	
}

export type { Trip, Collection };