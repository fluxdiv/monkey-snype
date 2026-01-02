import { useEffect } from 'react'
import { useGlobalContext } from './contexts/Global';
import { SideMenu, StatsBar } from './components/menu';
import { TargetSpawner } from './components/targets';

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
    setTotalTargetsClicked
  } = useGlobalContext();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
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
  }, []);

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

