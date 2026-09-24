import { createContext, useContext } from "react";

// El contexto y el hook van en un archivo aparte del Provider para que
// Fast Refresh de Vite siga funcionando (un .jsx solo debe exportar componentes)
export const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
}
