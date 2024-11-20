import { useCallback, useEffect, useState } from "react";
import { ADD_IMAGE, dispatcher } from "@designcombo/core";
import { nanoid } from "nanoid";
// import { IMAGES } from "@/data/images";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Images = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("all");
  const [page, setPage] = useState(1);
  const API_KEY = "44164876-2e90ba5276656db742f663eb9";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&page=${page}&per_page=20`
        );
        setImages(response.data.hits);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, [query, page]);

  const addItem = useCallback((src: string) => {
    dispatcher?.dispatch(ADD_IMAGE, {
      payload: {
        id: nanoid(),
        details: {
          src: src,
        },
      },
      options: {},
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="text-md text-[#e4e4e7] font-medium h-14 border-b border-border flex items-center py-2 px-4 text-muted-foreground">
        Photos
      </div>
      <ScrollArea>
        <div className="grid grid-cols-2 items-center gap-2 m-2 ">
          {images.map((image, index) => (
            <div
              onClick={() => addItem(image.webformatURL)}
              key={index}
              className="relative h-auto cursor-pointer overflow-hidden"
            >
              <img className="w-full max-h-[15vh] rounded-lg object-fill " src={image.previewURL} alt="image" />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};