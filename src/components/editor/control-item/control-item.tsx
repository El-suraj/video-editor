import React from 'react';
import useLayoutStore from '@/store/use-layout-store';
import { ITrackItem, useEditorState } from '@designcombo/core';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Presets from './presets';
import Animations from './animations';
import Smart from './smart';
import BasicText from './basic-text';
import BasicImage from './basic-image';
import BasicVideo from './basic-video';
import BasicAudio from './basic-audio';
import Zap from './zap';

const Container = ({ children }: { children: React.ReactNode }) => {
  const { activeToolboxItem } = useLayoutStore();
  const { activeIds, trackItemsMap } = useEditorState();
  const [trackItem, setTrackItem] = useState<ITrackItem | null>(null);
  const [displayToolbox, setDisplayToolbox] = useState<boolean>(false);

  useEffect(() => {
    if (activeIds.length === 1) {
      const [id] = activeIds;
      const trackItem = trackItemsMap[id];
      setTrackItem(trackItem);
    } else {
      setTrackItem(null);
      setDisplayToolbox(false);
    }
  }, [activeIds]);

  useEffect(() => {
    if (activeToolboxItem) {
      setDisplayToolbox(true);
    } else {
      setDisplayToolbox(false);
    }
  }, [activeToolboxItem]);

  if (!trackItem) {
    return null;
  }

  return (
    <div
      style={{
        right: activeToolboxItem && displayToolbox ? '0' : '-100%',
        transition: 'right 0.25s ease-in-out',   
        zIndex: 200,
      }}

      className="w-[400px] h-[calc(100%-32px-64px)] mt-6 absolute top-1/2 -translate-y-1/2 rounded-lg shadow-lg flex"
    >
      <div className="flex-1 h-full relative bg-zinc-950">
        <Button
          variant="ghost"
          className="absolute top-2 right-2 w-8 h-8 text-muted-foreground"
          size="icon"
        >
          <X width={16} onClick={() => setDisplayToolbox(false)} />
        </Button>
        {React.cloneElement(children as React.ReactElement<any>, {
          trackItem,
          activeToolboxItem,
        })}
      </div>
      <div className="w-[78px]"></div>
    </div>
  );
};

const ActiveControlItem = ({
  trackItem,
  activeToolboxItem,
}: {
  trackItem?: ITrackItem;
  activeToolboxItem?: string;
}) => {
  if (!trackItem || !activeToolboxItem) {
    return null;
  }
  return (
    <>
      {
        {
          'basic-text': <BasicText />,
          'basic-image': <BasicImage />,
          'basic-video': <BasicVideo />,
          'basic-audio': <BasicAudio />,
          'preset-text': <Presets />,
          'zap': <Zap />,
          animation: <Animations />,
          smart: <Smart />,
        }[activeToolboxItem]
      }
    </>
  );
};

export const ControlItem = () => {
  return (
    <Container>
      <ActiveControlItem />
    </Container>
  );
};
