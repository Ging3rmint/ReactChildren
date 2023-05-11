import styled from "styled-components";

import { BREAKPOINTS } from "@variables";

const { LG_TABLET, DESKTOP, LG_DESKTOP, XL_DESKTOP } = BREAKPOINTS;

interface IContainerProps {
  $size?: "xl" | "lg" | "sm";
  className?: string;
}

export const Container = styled.section<IContainerProps>`
  margin: 0 auto;
  max-width: ${({ $size }) =>
    $size === "xl"
      ? `${XL_DESKTOP}px`
      : $size === "lg"
      ? `${LG_DESKTOP}px`
      : $size === "sm"
      ? `${LG_TABLET}px`
      : `${DESKTOP}px`};
  padding: 0 20px;
`;
