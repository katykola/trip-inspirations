import { useState } from 'react';

export function useImageSelection(initialSelectedImages: string[] = []) {
  const [selectedImages, setSelectedImages] = useState<string[]>(initialSelectedImages);

  const handleImageCheckboxChange = (image: string) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(image)
        ? prevSelected.filter((img) => img !== image) // Remove if already selected
        : [...prevSelected, image] // Add if not selected
    );
  };

  return { selectedImages, handleImageCheckboxChange };
}
