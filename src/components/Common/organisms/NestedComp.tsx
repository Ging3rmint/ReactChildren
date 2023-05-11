import React from "react";
import styled from "styled-components";
import { useExample2Service } from "services";

const NestedComp = () => {
  const { increaseCounter } = useExample2Service();

  return (
    <NestedCompContainer>
      <button onClick={increaseCounter}>Increase Counter</button>
    </NestedCompContainer>
  );
};

export default NestedComp;

const NestedCompContainer = styled.div``;
