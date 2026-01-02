import {
  useMemo,
  useEffect,
  useState,
} from 'react'
import { useGlobalContext } from '../contexts/Global';

const TARGET_DIAMETER = 100;

interface Margins {
  top: number,
  left: number
}

// Pass in window.innerHeight/Width, returns values
// for top-[${}px] / left-[${}px]
function get_margins(window_margins: Margins): Margins {
  const max_top = window_margins.top - TARGET_DIAMETER;
  const max_left = window_margins.left - TARGET_DIAMETER;
  return {
    // top: ((Math.random() + 1) * max_top) % max_top,
    // left: ((Math.random() + 1) * max_left) % max_left,
    top: Math.random() * max_top,
    left: Math.random() * max_left
  } as Margins;
}

export const TargetSpawner = () => {

  const window_height = window.innerHeight;
  const window_width = window.innerWidth;
  const {
    total_clicks,
    setTotalClicks,
    setTotalTargets,
    getTotalTargets
  } = useGlobalContext();

  // 50 is sensible default start
  const [pos, setPos] = useState<Margins>({ top: 50, left: 50 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Manually set 1 for first target since interval doesn't
    // get called immediately on start
    setTotalTargets(1);
    const interval = setInterval(() => {
      const m = get_margins({top: window_height, left: window_width});
      setPos(m);
      setTick(t => t + 1);
      setTotalTargets(getTotalTargets() + 1);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = (_e: React.MouseEvent<HTMLDivElement>) => {
    console.log("CLICK OUTER");
    setTotalClicks(total_clicks + 1);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-screen h-screen overflow-clip bg-transparent"
    >
    <ShrinkingTarget
      // Key to force re-mount & reset CSS animation
      key={tick}
      top={pos.top}
      left={pos.left}
    />
    </div>
  );
};

const ShrinkingTarget = ({ top, left }: Margins) => {

  const [downed, setDowned] = useState(false);
  const [clickedX, setClickedX] = useState<number | undefined>(undefined);
  const [clickedY, setClickedY] = useState<number | undefined>(undefined);

  const {
    target_color,
    setTotalClicksOnTarget,
    getTotalClicksOnTarget,
    setTotalTargetsClicked,
    getTotalTargetsClicked
  } = useGlobalContext();

  const handleClick = useMemo(() => (e: React.MouseEvent<HTMLDivElement>) => {
    // setClickedX(e.pageX);
    // setClickedY(e.pageY);
    setClickedX(e.clientX);
    setClickedY(e.clientY);
    console.log("CLICK TARGET");
    if (!downed) {
      setTotalClicksOnTarget(getTotalClicksOnTarget() + 1);
      setTotalTargetsClicked(getTotalTargetsClicked() + 1);
    }
    setDowned(true);
  }, [downed, clickedX, clickedY]);

  return (
    <>
      {downed && clickedX && clickedY ? (
        <div 
          className="absolute animate-fade-up pointer-events-none"
          style={{
            color: `${target_color ?? "#00FFD0"}`,
            top: `${clickedY - 30}px`,
            left: `${clickedX - 10}px`,
            // transform: "translate(-50%, -50%)",
          }}
        >
          +1
        </div>
      ):(
        <div
          onClick={handleClick}
          className="absolute h-20 w-20 rounded-full animate-shrink-1.5"
          style={{
            background: `${downed ? "transparent" : (target_color ?? "#00FFD0") }`,
            top: `${top}px`,
            left: `${left}px`,
            transformOrigin: "center",
          }}
        />
      )}
    </>
  );
};

