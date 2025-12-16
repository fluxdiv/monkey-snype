import { useCallback, useMemo } from 'react'
import { ChevronRight, Settings } from 'lucide-react';
import { useGlobalContext } from '../contexts/Global';
import { Switch, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import Colorful from '@uiw/react-color-colorful';

const Toggle = () => {
  const {show_stats, setShowStats} = useGlobalContext();

  return (
    <Switch
      checked={show_stats}
      onChange={setShowStats}
      className="group relative flex h-7 w-14 cursor-pointer rounded-lg 
      bg-white/10 p-1 ease-in-out focus:not-data-focus:outline-none 
      data-checked:bg-lime-500 data-focus:outline data-focus:outline-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 translate-x-0 rounded-md bg-white/70 shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-7 group-data-checked:!bg-black "
      />
    </Switch>
  )
}

export const StatsBar = () => {
  const {
    total_clicks,
    total_clicks_on_target,
    total_targets,
    total_targets_clicked
  } = useGlobalContext();

  const trate = useMemo(() => {
    if (total_targets === 0) return -1;
    return (100 * (total_targets_clicked / total_targets));
  }, [total_targets, total_clicks]);

  const crate = useMemo(() => {
    if (total_clicks === 0) return -1;
    return (100 * (total_clicks_on_target / total_clicks));
  }, [total_clicks]);

  const tdown = `Targets Down: ${trate === -1 ? "N/A" : trate.toFixed(3)}%`;
  const acc = `Click Accuracy: ${crate === -1 ? "N/A" : crate.toFixed(3)}%`;

  let tdowncolor = "text-green-400";
  if (trate < 0) {
    tdowncolor = "text-neutral-400"
  } else if (trate < 50) {
    tdowncolor = "text-red-400";
  } else if (trate < 75) {
    tdowncolor = "text-yellow-400";
  }

  let acccolor = "text-green-400";
  if (crate < 0) {
    acccolor = "text-neutral-400"
  } else if (crate < 50) {
    acccolor = "text-red-400";
  } else if (crate < 75) {
    acccolor = "text-yellow-400";
  }

  return (
    <div
      className="fixed top-2 left-1/2 -translate-x-1/2 w-1/3
      flex items-center justify-center gap-8 text-lg p-1
      rounded-md border border-gray-500"
    >
      <div className={`${tdowncolor}`}>
        {tdown}
      </div>
      <div className={`${acccolor}`}>
        {acc}
      </div>
    </div>
  )
}

export const SideMenu = () => {
  const {
    show_menu,
    setShowMenu,
    target_color,
    setTargetColor,
    bg_color,
    setBgColor
    // total_clicks,
    // setTotalClicks
  } = useGlobalContext();

  const setBgCallback = useCallback(
    (c: string) => setBgColor(c),
    [bg_color],
  )

  const setTargetCallback = useCallback(
    (c: string) => setTargetColor(c),
    [target_color],
  )

  return (
    <div 
      className="relative h-min w-1/4 text-neutral-400 font-mono
      flex flex-row gap-1 p-2 xbg-neutral-800"
    >
      { !show_menu ? 
        (
          <button 
            onClick={() => setShowMenu(true)}
            className=" p-3 ml-auto rounded-sm btn-primary"
          >
            <Settings size={24} />
          </button>
        ) : 
        (
          <>
            <button 
              onClick={() => setShowMenu(false)}
              className="h-1/12 py-4 rounded-sm btn-primary"
            >
              <ChevronRight size={20} />
            </button>
            {/* inner menu box w/ buttons */}
            <div className="w-full h-7/8 
              flex flex-col p-1 rounded-sm bg-neutral-800/70 text-shadow-lg/30 text-neutral-200
              "
            >
              <span className="text-lg self-center">
                Monkey Snype
              </span>
              {/* toggle show stats */}
              <div
                className="w-full h-1/12 p-2
                flex flex-row justify-between items-center 
                border-0"
              >
                <div className="text-md ">
                  Show Stats
                </div>
                <Toggle/>
              </div>
              {/* bg color selector */}
              <div
                className="w-full h-1/12 p-2 pr-4
                flex flex-row justify-between items-center 
                border-0"
              >
                <div className="text-md">
                  Background Color
                </div>
                <ColorModal curr={bg_color} cb={setBgCallback}/>
              </div>
              {/* target color selector */}
              <div
                className="w-full h-1/12 p-2 pr-4
                flex flex-row justify-between items-center 
                border-0"
              >
                <div className="text-md">
                  Target Color
                </div>
                <ColorModal curr={target_color} cb={setTargetCallback}/>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}

const ColorModal = ({
  curr,
  cb,
}:{
  curr?: string,
  cb: (c: string) => void
}) => {

  const btn_bg_color = useMemo(() => {
    if (curr) {
      return curr;
    } else {
      return "#FF0000";
    }
  }, [curr])

  return (
    <>
      <Popover className="relative">
        <PopoverButton 
          className="text-black h-8 w-10 rounded-lg border border-neutral-500"
          style={{
            background: `${btn_bg_color}`
          }}
        >
        </PopoverButton>
        <PopoverPanel anchor="bottom end" 
          className="flex flex-col overflow-clip p-4"
        >
          <ColorPicker curr={curr} cb={cb} />
      </PopoverPanel>
    </Popover>
    </>
  )
}

const ColorPicker = ({
  curr,
  cb,
}:{
  curr?: string,
  cb: (c: string) => void
}) => {
  return (
    <>
      <Colorful
        color={curr ? curr : "#000000"}
        disableAlpha={true}
        onChange={(color) => {
          cb(color.hex);
        }}
      />
    </>
  );
}
