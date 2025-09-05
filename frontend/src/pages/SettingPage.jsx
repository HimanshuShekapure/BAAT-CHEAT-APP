import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const THEME_PALETTES = {
  light:    ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-yellow-400"],
  dark:     ["bg-gray-900", "bg-blue-900", "bg-purple-900", "bg-pink-900"],
  cupcake:  ["bg-pink-200", "bg-blue-200", "bg-yellow-200", "bg-purple-200"],
  retro:    ["bg-yellow-300", "bg-blue-400", "bg-pink-400", "bg-brown-400"],
  synthwave:["bg-purple-700", "bg-pink-500", "bg-yellow-400", "bg-blue-400"],
  cyberpunk:["bg-yellow-400", "bg-pink-500", "bg-blue-500", "bg-black"],
  valentine:["bg-pink-300", "bg-red-300", "bg-white", "bg-gray-200"],
  halloween:["bg-orange-500", "bg-black", "bg-yellow-400", "bg-gray-700"],
  garden:   ["bg-green-400", "bg-pink-200", "bg-white", "bg-brown-200"],
  forest:   ["bg-green-800", "bg-green-500", "bg-brown-500", "bg-yellow-200"],
  aqua:     ["bg-blue-300", "bg-cyan-300", "bg-white", "bg-gray-200"],
  lofi:     ["bg-gray-300", "bg-gray-500", "bg-white", "bg-black"],
  dracula:  ["bg-purple-900", "bg-pink-700", "bg-black", "bg-gray-700"],
  business: ["bg-gray-900", "bg-blue-900", "bg-gray-700", "bg-white"],
  acid:     ["bg-lime-400", "bg-yellow-400", "bg-pink-400", "bg-black"],
  // Add more as needed, fallback to random colors if missing
};

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <h2 className="text-xl font-bold mb-6">Choose a theme for your chat interface</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {THEMES.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all focus:outline-none
              ${theme === t ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent hover:border-gray-300'}`}
            type="button"
          >
            <div className="flex gap-1 mb-2">
              {(THEME_PALETTES[t] || ["bg-gray-300", "bg-gray-400", "bg-gray-500", "bg-gray-600"]).map((color, idx) => (
                <span key={idx} className={`w-6 h-6 rounded ${color} border border-gray-200`}></span>
              ))}
            </div>
            <span className="text-xs font-medium text-center mt-1 capitalize">
              {t}
            </span>
          </button>
        ))}
      </div>
      {/* Preview Section (optional, keep if you want) */}
      <h3 className="text-lg font-semibold mb-3 mt-10">Preview</h3>
      <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg" data-theme={theme}>
        <div className="p-4 bg-base-200">
          <div className="max-w-lg mx-auto">
            {/* Mock Chat UI */}
            <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>
              </div>
              {/* Chat Messages */}
              <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                {PREVIEW_MESSAGES.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
                        message.isSent
                          ? "bg-primary text-primary-content"
                          : "bg-base-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-[10px] mt-1.5 ${
                          message.isSent
                            ? "text-primary-content/70"
                            : "text-base-content/70"
                        }`}
                      >
                        12:00 PM
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Chat Input */}
              <div className="p-4 border-t border-base-300 bg-base-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-0">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
