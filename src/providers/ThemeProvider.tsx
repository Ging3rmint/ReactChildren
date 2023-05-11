import React, {
  FC,
  useState,
  useContext,
  createContext,
  ReactNode,
} from "react";

type Theme = "light" | "dark";

interface IThemeContext {
  theme: Theme;
  changeTheme: (theme: Theme) => void;
}

interface IThemeProviderProps {
  children?: ReactNode;
}

const initialContext: IThemeContext = {
  theme: "light",
  changeTheme: () => {},
};

const ThemeContext = createContext(initialContext);

export const useTheme = () => {
  return useContext(ThemeContext);
};

const ThemeProvider: FC<IThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext.Provider value={{ theme: theme, changeTheme: setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
