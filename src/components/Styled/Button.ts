import { COLORS } from '@/variables';
import styled from 'styled-components';

export const Button = styled.button<{ $isActive: boolean }>`
  cursor: pointer;
  padding: 10px 16px;
  border-radius: 4px;
  border: 1px solid ${COLORS.lightGray};

  ${({ $isActive }) => ({
    backgroundColor: $isActive ? COLORS.green : COLORS.white,
    border: `1px solid ${$isActive ? COLORS.green : COLORS.lightGray}`,
    color: $isActive ? COLORS.white : COLORS.darkGray
  })}
`;
