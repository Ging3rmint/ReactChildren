import React, { FC } from "react";
import styled from "styled-components";

import { useExampleService, useExample2Service } from "services";
import NestedComp from "components/Common/organisms/NestedComp";

const App: FC = () => {
  const { isDarkMode, toggleDarkMode } = useExampleService();
  const { counter } = useExample2Service();

  return (
    <AppContainer $isDarkMode={isDarkMode}>
      <p>Hello World!</p>
      <p>{counter}</p>
      <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
      <NestedComp />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div<{ $isDarkMode?: boolean }>`
  ${({ $isDarkMode }) => {
    return {
      backgroundColor: $isDarkMode ? "black" : "white",
      color: $isDarkMode ? "white" : "black",
    };
  }}
`;
