import  { createContext, ReactNode, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});


const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme}`}> {children} </div>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
