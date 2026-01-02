import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useGlobalContext, GameState } from './contexts/Global';
import { SideMenu, StatsBar } from './components/menu';
import { TargetSpawner } from './components/targets';
import john_wick from "../src/assets/john_wick.jpg";
import star_trooper from "../src/assets/star_trooper.jpg";

const endScore = (gs?: GameState): number => {
  if (!gs) {
    return 50;
  }

  const tt = gs.total_targets;
  const tt_c = gs.total_targets_clicked;
  const tc = gs.total_clicks;
  const tc_ont = gs.total_clicks_on_target;

  let trate = 0;
  if (tt != 0) {
    trate = Number((100 * (tt_c / tt)).toFixed(2));
  }
  let crate = 0;
  if (tc != 0) {
    crate = Number((100 * (tc_ont / tc)).toFixed(2));
  }

  const score = Number(((trate + crate) / 2).toFixed(2));
  return score;
}

const between = (n: number, min: number, max: number): boolean => {
  return (n >= min) && (n < max);
}

const App = () => {
  const {
    show_stats,
    // total_clicks,
    game_active,
    bg_color,
    setGameActive,
    setTotalClicks,
    setTotalClicksOnTarget,
    setTotalTargets,
    setTotalTargetsClicked,

    getTotalClicks,
    getTotalClicksOnTarget,
    getTotalTargets,
    getTotalTargetsClicked,
  } = useGlobalContext();

  const [endGameOpen, setEndGameOpen] = useState(false);
  const [endGameRes, setEndGameRes] = useState<GameState | undefined>(undefined);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        if (game_active) {
          setEndGameOpen(true);
          setEndGameRes({
            total_clicks: getTotalClicks(),
            total_clicks_on_target: getTotalClicksOnTarget(),
            total_targets: getTotalTargets(),
            total_targets_clicked: getTotalTargetsClicked()
          } as GameState);
        }
        setGameActive(false);
        setTotalClicks(0);
        setTotalClicksOnTarget(0);
        setTotalTargets(0);
        setTotalTargetsClicked(0);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [endGameOpen, game_active]);

  return (
    <div 
      className="relative w-screen h-screen overflow-clip flex flex-row-reverse
      cursor-crosshair"
      style={{
        background: `${bg_color ?? "#171717"}`
      }}
    >
      { show_stats && (<StatsBar/>)}

      {!game_active ? (
        <>
          <SideMenu/>
          {endGameOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setEndGameOpen(false)}
              />

              {/* Modal content */}
              <div className="relative z-10 w-full max-w-md rounded-lg 
                flex flex-col gap-2
                text-neutral-200 font-mono bg-[#171717]
                pb-6 px-6 pt-4 shadow-xl">
                <h2 className=" pb-2 text-xl flex flex-row justify-between items-center border-b border-neutral-700/40">
                  <span>
                    End Game Stats
                  </span>
                  <button
                    onClick={() => setEndGameOpen(false)}
                    className="p-1 rounded-sm btn-primary"
                  >
                    <X size={16}/>
                  </button>
                </h2>

                <div className="flex flex-row w-full">
                  <div className="w-1/2">
                    {`Clicks:`}
                  </div>
                  <div className="w-1/2">
                    {`${endGameRes?.total_clicks ?? "N/A"}`}
                  </div>
                </div>
                <div className="flex flex-row w-full pb-2 border-b border-neutral-700/40">
                  <div className="w-1/2">
                    {`Clicks on Target:`}
                  </div>
                  <div className="w-1/2">
                    {`${endGameRes?.total_clicks_on_target ?? "N/A"}`}
                  </div>
                </div>

                <div className="flex flex-row w-full">
                  <div className="w-1/2">
                    {`Targets Spawned:`}
                  </div>
                  <div className="w-1/2">
                    {`${endGameRes?.total_targets ?? "N/A"}`}
                  </div>
                </div>
                <div className="flex flex-row w-full pb-2 border-b border-neutral-700/40">
                  <div className="w-1/2">
                    {`Targets Downed:`}
                  </div>
                  <div className="w-1/2">
                    {`${endGameRes?.total_targets_clicked ?? "N/A"}`}
                  </div>
                </div>

                <div className="flex flex-row w-full pb-2 border-b border-neutral-700/40">
                  <div className="w-1/2">
                    {`Score (0-100):`}
                  </div>
                  <div className="w-1/2">
                    {`${endScore(endGameRes)}`}
                  </div>
                </div>

                <div className="mt-4 w-full flex flex-row items-center gap-2">
                  <img
                    src={star_trooper}
                    alt="Star Trooper"
                    className="max-w-1/8 h-auto rounded-lg shadow-lg"
                  />
                  <div className="relative w-6/8 h-0.5 rounded-full bg-neutral-700">
                    <div
                      className="absolute top-1/2 text-2xl"
                      style={{
                        left: `${endScore(endGameRes)}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {between(endScore(endGameRes), 0, 40) && "💩"}
                      {between(endScore(endGameRes), 40, 60) && "🟡"}
                      {endScore(endGameRes) >= 60 && "🔥"}
                    </div>
                  </div>
                  <img
                    src={john_wick}
                    alt="John Wick"
                    className="max-w-1/8 h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="fixed top-1/2 left-1/2 
            -translate-x-1/2 -translate-y-1/2
            flex flex-col gap-1.5 items-center"
          >
            <button 
              onClick={() => setGameActive(true)}
              className="font-mono w-full rounded-lg px-8 py-2 text-xl btn-primary"
            >
              Start Game
            </button>
            <div className="flex gap-1.5 justify-center">
              <span className="font-mono text-sm text-neutral-400">
                {"Hit "}
              </span>
              <span className="font-mono px-2 text-sm bg-neutral-800 text-neutral-400 rounded-sm">
                esc
              </span>
              <span className="font-mono text-sm text-neutral-400">
                {" to end game"}
              </span>
            </div>
          </div>
        </>
      ):(
          <>
            <div className="absolute bottom-2 left-2 flex gap-1.5 justify-center">
              <span className="font-mono text-sm text-neutral-400">
                {"Hit "}
              </span>
              <span className="font-mono px-2 text-sm bg-neutral-800 text-neutral-400 rounded-sm">
                esc
              </span>
              <span className="font-mono text-sm text-neutral-400">
                {" to end game"}
              </span>
            </div>

          <TargetSpawner/>
          </>
        )}
    </div>
  );
}

export default App;

