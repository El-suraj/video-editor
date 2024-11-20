import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EDIT_OBJECT, dispatcher, useEditorState } from "@designcombo/core";
import * as ReactAnimations from "react-animations";
import { Button } from "@/components/ui/button";
import styled, { keyframes } from "styled-components";

const animationList = Object.entries(ReactAnimations);


const Animations = () => {
    interface IAnimationProps {
      name: string;
      keyframes: Record<string, any>;
      duration: string;
      timingFunction: string;
      delay: string;
      direction: string;
      fillMode: string;
      iterationCount: string;
    }
    
    const defaultAnimationProps: IAnimationProps = {
      name: "pulse",
      keyframes: {
        from: {},
        '50%': {},
        to: {}
      },
      duration: '2s',
      timingFunction: 'ease',
      delay: '0s',
      direction: 'normal',
      fillMode: 'forwards',
      iterationCount: 'infinite'
    };
    const [props, setProps] = useState<IAnimationProps>(defaultAnimationProps);
    const { activeIds, trackItemsMap } = useEditorState();


    const handleAnimationClick = (animationName: string, keyframe: any) => {
        const animation = keyframes `${keyframe}`
        console.log(keyframes)
        const [id] = activeIds;
        const trackItem = trackItemsMap[id];
        console.log(trackItem)
        if (trackItem) {
            const updatedDetails = {
                ...trackItem.details,
                animation: {
                    name: animationName,
                    keyframes: keyframe,
                    duration: '2s',
                    timingFunction: 'ease',
                    delay: '0s',
                    iterationCount: 'infinite',
                    direction: 'normal',
                    fillMode: 'forwards',
                },
            };

            dispatcher.dispatch(EDIT_OBJECT, {
        payload: {
          id: trackItem.id,
          details: updatedDetails.animation,
        },
      });
      setProps({
        ...props,
        name: animationName,
        keyframes: animation,
      });
        console.log(props)
            console.log(updatedDetails)
        }
    };

    useEffect(() => {
        const [id] = activeIds;
        const trackItem = trackItemsMap[id];
        if (trackItem) {
        setProps({ ...defaultAnimationProps, ...(trackItem.details as IAnimationProps) });
        console.log(props)
            const { animation } = trackItem.details;
            console.log(animation)
            if (animation) {
                setProps({ ...defaultAnimationProps, ...animation });
            }
        }
    }, [activeIds, trackItemsMap]);

    return (
        <div className="flex- flex flex-col h-full">
            <div className="text-md flex-none text-text-primary font-medium h-12 flex items-center px-4">
                Animations
            </div>


            <ScrollArea className="flex-grow">
                <div className="grid grid-cols-2 gap-4 p-4">
                    {animationList.map(([animationName, keyframes]) => (
                        <Button
                            key={animationName}
                            variant="outline"
                            onClick={() => handleAnimationClick(animationName, keyframes)}
                        >
                            {animationName}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};


export default Animations;

