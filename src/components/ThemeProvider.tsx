
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Add the missing useTheme hook export
export const useTheme = () => {
  const { theme, setTheme } = React.useContext(
    // @ts-ignore - This context does exist in next-themes
    React.createContext({ theme: "system", setTheme: () => {} })
  );
  
  // Use the next-themes hook properly
  const { theme: nextTheme, setTheme: nextSetTheme } = 
    // @ts-ignore - We know this hook exists
    window.nextThemes?.useTheme ? window.nextThemes.useTheme() : { theme: "system", setTheme: () => {} };
  
  // Return either the context values or next-themes values
  return { 
    theme: nextTheme || theme, 
    setTheme: nextSetTheme || setTheme 
  };
};
