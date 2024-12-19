interface Trip {
    id: string;
    title: string;
    description: string;
    url: string;
    lat: number;
    lng: number;
    images: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
  }

export type { Trip };