import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button 
        tabIndex={0} 
        className="btn btn-ghost btn-sm rounded-xl hover:bg-base-200/80 transition-all duration-200"
      >
        <PaletteIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-3 p-2 shadow-xl bg-base-100/95 backdrop-blur-xl rounded-2xl
        w-64 border border-base-300/30 max-h-80 overflow-y-auto"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200
              ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "hover:bg-base-200/50 text-base-content/80 hover:text-base-content"
              }
            `}
              onClick={() => setTheme(themeOption.name)}
            >
              <div className={`p-1.5 rounded-lg ${theme === themeOption.name ? 'bg-primary/20' : 'bg-base-200/50'}`}>
                <PaletteIcon className="size-4" />
              </div>
              <span className="text-sm font-medium">{themeOption.label}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto flex gap-1.5">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-3 rounded-full shadow-sm border border-base-300/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;
