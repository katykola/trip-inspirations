import { useState } from 'react';

export const useImageSelection = () => {

    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const handleImageCheckboxChange = (image: string) => {
        setSelectedImages((prevSelectedImages) =>
          prevSelectedImages.includes(image)
            ? prevSelectedImages.filter((img) => img !== image)
            : [...prevSelectedImages, image]
        );
      };

    return {
        selectedImages,
        handleImageCheckboxChange
    };

}