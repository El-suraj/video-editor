import { Button } from "@/components/ui/button";
import {
  ACTIVE_SPLIT,
  LAYER_DELETE,
  PLAYER_PAUSE,
  PLAYER_PLAY,
  TIMELINE_SCALE_CHANGED,
  dispatch,
  ADD_MASK,
} from "@designcombo/events";
import { frameToTimeString, getCurrentTime, timeToString } from "@/utils/time";
import useStore from "@/store/store";
import { SquareSplitHorizontal, Trash, ZoomIn, ZoomOut } from "lucide-react";
import { getNextZoomLevel, getPreviousZoomLevel } from "@/utils/timeline";
import { useCurrentPlayerFrame } from "@/hooks/use-current-frame";
import {

  IconBadge4kFilled,
  IconKeyframes,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBack,
  IconPlayerSkipForward
} from "@tabler/icons-react";
import { Slider } from "@/components/ui/slider";
import { useEffect,useRef, useState } from "react";
import fabric,{ /*FabricImage */}  from 'fabric';


const Header = () => {
  const [playing, setPlaying] = useState(false);
  const { duration, fps, scale, playerRef, activeIds } = useStore();
  const currentFrame = useCurrentPlayerFrame(playerRef!);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [isMaskMenuOpen, setIsMaskMenuOpen] = useState(false);
  

  const onZoomOutClick = () => {
    const previousZoom = getPreviousZoomLevel(scale);
    dispatch(TIMELINE_SCALE_CHANGED, {
      payload: {
        scale: previousZoom
      }
    });
  };

  // const handleDeselect = () => {
  //   dispatch(LAYER_SELECT, { payload: { trackItemIds: [] } });
  // };

  const onZoomInClick = () => {
    const nextZoom = getNextZoomLevel(scale);

    dispatch(TIMELINE_SCALE_CHANGED, {
      payload: {
        scale: nextZoom
      }
    });
  };

  // const handleFitTimeline = () => {
  //   dispatch(TIMELINE_FIT);
  // };

  const doActiveDelete = () => {
    dispatch(LAYER_DELETE);
  };

  const doActiveSplit = () => {
    dispatch(ACTIVE_SPLIT, {
      payload: {},
      options: {
        time: getCurrentTime()
      }
    });
  };

  // const doActiveClone = () => {
  //   dispatch(ACTIVE_CLONE);
  // };

  const handlePlay = () => {
    dispatch(PLAYER_PLAY);
  };

  const handlePause = () => {
    dispatch(PLAYER_PAUSE);
  };

  // const handlePaste = () => {
  //   dispatch(ACTIVE_PASTE);
  // };

  // check if the player is playing
  useEffect(() => {
    playerRef?.current?.addEventListener("play", () => {
      setPlaying(true);
    });
    playerRef?.current?.addEventListener("pause", () => {
      setPlaying(false);
    });
    return () => {
      playerRef?.current?.removeEventListener("play", () => {
        setPlaying(true);
      });
      playerRef?.current?.removeEventListener("pause", () => {
        setPlaying(false);
      });
    };
  }, [playerRef]);
// /adding mask menu and mask feature
  const toggleMaskMenu = () => {
    setIsMaskMenuOpen(!isMaskMenuOpen);
  };

  const applyMask = (shape: string) =>{
    dispatch(ADD_MASK)
    if (!canvas) return; // Ensure canvas is initialized
    let mask;
    switch (shape){
      case 'rectangle':
        mask = new fabric.Rect({
          left:200,
          top:200,
          width: 300,
          height:300,
          fill: 'rgba(0,0,0,0.5)',
        });
        break;
        case 'circle':
          mask = new fabric.Circle({
            left:300,
            top:300,
            radius:150,
            fill:'rgba(0,0,0,0.5)',
          });
          break;
          case 'polygon':
            mask = new fabric.Polygon(
              [
                {x: 200, y:200},
                {x: 400, y:200},
                {x: 300, y:400},
              ],
              {
                fill: 'rgba(0,0,0,0.5)',
              }
            );
            break;
            default:
              return;
    }
    
    canvas.clipPath = mask;
    canvas.renderAll();
    // setIsMaskMenuOpen(false); //close the menu after applying a mask
  };

  // add overlay
  // const addOverlay = () => {
  //   if (!canvas) return;
  
  //   fabric.Image.fromURL(
  //     "https://via.placeholder.com/200",
  //     (img: FabricImage) => {
  //       img.set({
  //         left: 100, 
  //         top: 50,
  //         opacity: 0.8,
  //       });
  //       canvas.add(img);
  //     },
  //     {
  //       // Optional options for loading the image, like crossOrigin
  //       crossOrigin: 'anonymous',
  //     }
  //   );
  // };

  // Add keyframe animation

   const addKeyframe = () => {
    const circle = new fabric.Circle({
      left:50,
      top:50,
      radius:30,
      fill:'red',
    });
    canvas!.add(circle);

    const newKeyframes = [
      { left: 50, top:50},
      { left:400, top:300 },
    ];
    let frameIndex = 0;
    const animate = () =>{
      if(frameIndex < newKeyframes.length - 1){
        circle.animate(newKeyframes[frameIndex + 1],
          {
            duration: 1000,
            onChange: canvas!.renderAll.bind(canvas),
            onComplete: () => {
              frameIndex += 1;
              animate();
            },
          }
        );
      }
    };
    animate();
  };
// /addded mask effect
  useEffect(() => {
    const initCanvas = new fabric.Canvas('video-editor-canvas', {
      width: 800,
      height: 600,
      backgroundColor: '#ccc',
    });
    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, [] );

  return (
    <div
      style={{
        position: "relative",
        height: "50px",
        boxShadow: "inset 0 1px 0 0 #27272a",
        flex: "none"
      }}
      className="bg-background"
    >
      <div
        style={{
          position: "absolute",
          height: 50,
          width: "100%",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div
          style={{
            height: 36,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 260px 1fr",
            alignItems: "center"
          }}
        >
          <div className="px-2 flex">
            <Button
              disabled={!activeIds.length}
              onClick={doActiveDelete}
              variant={"ghost"}
              size={"sm"}
              className="flex items-center gap-1 px-2"
            >
              <Trash size={14} /> Delete
            </Button>

            <Button
              disabled={!activeIds.length}
              onClick={doActiveSplit}
              variant={"ghost"}
              size={"sm"}
              className="flex items-center gap-1 px-2"
            >
              <SquareSplitHorizontal size={15} /> Split
            </Button>
            <Button 
            disabled={!activeIds.length}
            // onClick={addKeyframe}
            variant={"ghost"} 
            size={"sm"} 
            className="flex items-center gap-1 px-2">
            <IconKeyframes size={24}/> Keyframe
            </Button>
            <Button variant={"ghost"} size={"sm"}>Add Overlay</Button>
            <Button 
            disabled={!activeIds.length}
            onClick={toggleMaskMenu}
            variant={"ghost"} 
            size={"sm"} 
            className="flex items-center gap-1 px-2">
            <IconBadge4kFilled stroke={2} size={24} /> Mask
            </Button>
            {isMaskMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  zIndex:10,
                }}>
                  <button onClick={() => applyMask('rectangle')}> Rectangle mask</button>
                  <button onClick={() => applyMask('circle')}> Circle mask</button>
                  <button onClick={() => applyMask('polygon')}> Polygon mask</button>
              </div>
            )}  
          </div>
          
          <div className="flex items-center justify-center">
            <div>
              <Button onClick={doActiveDelete} variant={"ghost"} size={"icon"}>
                <IconPlayerSkipBack size={14} />
              </Button>
              
              <Button
                onClick={() => {
                  if (playing) {
                    return handlePause();
                  }
                  handlePlay();
                }}
                variant={"ghost"}
                size={"icon"}
              >
                {playing ? (
                  <IconPlayerPauseFilled size={14} />
                ) : (
                  <IconPlayerPlayFilled size={14} />
                )}
              </Button>
              <Button onClick={doActiveSplit} variant={"ghost"} size={"icon"}>
                <IconPlayerSkipForward size={14} />
              </Button>
            </div>
            <div
              className="text-xs font-light"
              style={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "54px 4px 54px",
                paddingTop: "2px",
                justifyContent: "center"
              }}
            >
              <div
                className="text-zinc-200 font-medium"
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
                data-current-time={currentFrame / fps}
                id="video-current-time"
              >
                {frameToTimeString({ frame: currentFrame }, { fps })}
              </div>
              <span>/</span>
              <div
                className="text-muted-foreground"
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {timeToString({ time: duration })}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center ">
            <div className="flex  border-l border-border pl-4 pr-2">
              <Button size={"icon"} variant={"ghost"} onClick={onZoomOutClick}>
                <ZoomOut size={16} />
              </Button>
              <Slider className="w-28" defaultValue={[10]} />
              <Button size={"icon"} variant={"ghost"} onClick={onZoomInClick}>
                <ZoomIn size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <canvas id="video-editor-canvas" ref={canvasRef}></canvas>
    </div>
    
  );
};

export default Header;
