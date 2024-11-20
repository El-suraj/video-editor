import { ScrollArea } from '@/components/ui/scroll-area';
import { VIDEOS } from '@/data/video';
import { ADD_VIDEO, dispatcher } from '@designcombo/core';
import { nanoid } from 'nanoid';
import { useCallback } from 'react';

export const Videos = () => {
    const addItem = useCallback(({ url, id }: { url: string; id: string }) => {
        dispatcher?.dispatch(ADD_VIDEO, {
            payload: {
                id: nanoid(),
                details: {
                    src: url,
                },
                metadata: {
                    resourceId: id,
                },
            },
            options: {},
        });
    }, []);

    return (
        <div className=''>
            <div className="text-md text-[#e4e4e7] font-medium h-11 border-b border-border flex items-center px-4 text-muted-foreground">
                Videos
            </div>
            <ScrollArea>
                <div className="grid grid-cols-2 items-center gap-2 m-2 max-w-ful">
                    {VIDEOS.map((video, index) => (
                        <div
                            onClick={() => addItem({ url: video.src, id: video.resourceId })}
                            key={index}
                            className="relative cursor-pointer overflow-hidden"
                        >
                            <video className="rounded-lg h-[12vh] " src={video.src} />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

// function modifyImageUrl(url: string): string {
//   const uploadIndex = url.indexOf('/upload');
//   if (uploadIndex === -1) {
//     throw new Error('Invalid URL: /upload not found');
//   }

//   const modifiedUrl =
//     url.slice(0, uploadIndex + 7) +
//     '/w_0.05,c_scale' +
//     url.slice(uploadIndex + 7);
//   return modifiedUrl;
// }
