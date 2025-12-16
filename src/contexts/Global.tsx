import {
  createContext,
  useContext,
  useRef,
  useState
} from "react";

interface GlobalContextType {
  show_menu: boolean,
  show_stats: boolean,
  game_active: boolean,
  // -------------------
  bg_color?: string,
  target_color?: string,
  //--------------------
  total_clicks: number,
  total_clicks_on_target: number,
  // total targets seen
  total_targets: number,
  total_targets_clicked: number,

  // setters (reactive)
  setShowMenu: (v: boolean) => void;
  setShowStats: (v: boolean) => void;
  setGameActive: (v: boolean) => void;
  setBgColor: (v?: string) => void;
  setTargetColor: (v?: string) => void;
  setTotalClicks: (v: number) => void;
  setTotalClicksOnTarget: (v: number) => void;
  setTotalTargets: (v: number) => void;
  setTotalTargetsClicked: (v: number) => void;

  // getters (non-reactive manual question/answer)
  getShowMenu: () => boolean;
  getShowStats: () => boolean;
  getGameActive: () => boolean;
  getBgColor: () => string | undefined;
  getTargetColor: () => string | undefined;
  getTotalClicks: () => number;
  getTotalClicksOnTarget: () => number;
  getTotalTargets: () => number;
  getTotalTargetsClicked: () => number;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ------------------------
  // Reactive state (causes re-render)
  // ------------------------
  const [show_menu, setShowMenu] = useState(false);
  const [show_stats, setShowStats] = useState(false);
  const [game_active, setGameActive] = useState(false);

  const [bg_color, setBgColor] = useState<string | undefined>("#171717");
  const [target_color, setTargetColor] = useState<string | undefined>("#9ae600");

  const [total_clicks, setTotalClicks] = useState(0);
  const [total_clicks_on_target, setTotalClicksOnTarget] = useState(0);
  const [total_targets, setTotalTargets] = useState(0);
  const [total_targets_clicked, setTotalTargetsClicked] = useState(0);

  // ------------------------
  // Non-reactive refs for manual reads
  // ------------------------
  const ref = useRef({
    show_menu,
    show_stats,
    game_active,
    bg_color,
    target_color,
    total_clicks,
    total_clicks_on_target,
    total_targets,
    total_targets_clicked,
  });

  // Keep ref in sync but without triggering re-renders
  ref.current = {
    show_menu,
    show_stats,
    game_active,
    bg_color,
    target_color,
    total_clicks,
    total_clicks_on_target,
    total_targets,
    total_targets_clicked,
  };

  // ------------------------
  // Non-reactive getter methods
  // ------------------------
  const getShowMenu = () => ref.current.show_menu;
  const getShowStats = () => ref.current.show_stats;
  const getGameActive = () => ref.current.game_active;
  const getBgColor = () => ref.current.bg_color;
  const getTargetColor = () => ref.current.target_color;
  const getTotalClicks = () => ref.current.total_clicks;
  const getTotalClicksOnTarget = () => ref.current.total_clicks_on_target;
  const getTotalTargets = () => ref.current.total_targets;
  const getTotalTargetsClicked = () => ref.current.total_targets_clicked;

  return (
    <GlobalContext.Provider
      value={{
        // reactive values
        show_menu,
        show_stats,
        game_active,
        bg_color,
        target_color,
        total_clicks,
        total_clicks_on_target,
        total_targets,
        total_targets_clicked,

        // reactive setters
        setShowMenu,
        setShowStats,
        setGameActive,
        setBgColor,
        setTargetColor,
        setTotalClicks,
        setTotalClicksOnTarget,
        setTotalTargets,
        setTotalTargetsClicked,

        // non-reactive getters
        getShowMenu,
        getShowStats,
        getGameActive,
        getBgColor,
        getTargetColor,
        getTotalClicks,
        getTotalClicksOnTarget,
        getTotalTargets,
        getTotalTargetsClicked,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );

}

export function useGlobalContext(): GlobalContextType {
  const ctx = useContext(GlobalContext);
  if (!ctx) {
    throw new Error("cannot access context outside provider");
  }
  return ctx;
}


