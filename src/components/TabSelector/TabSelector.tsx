import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../Styled';
import { COLORS } from '@/variables';

interface ITabSelectorButton {
  text: string;
  value: string;
}

interface ITabSelectorProps {
  selections: ITabSelectorButton[];
  onClick: (value: string) => void;
  currentActiveValue?: string;
  className?: string;
  numberIndicators?: Record<string, number>;
}

const TabSelector: FC<ITabSelectorProps> = ({
  selections,
  onClick,
  numberIndicators = {},
  currentActiveValue = '',
  className
}) => {
  return (
    <TabSelectorContainer className={className}>
      {selections.map(({ text, value }) => (
        <TabButton key={value} $isActive={currentActiveValue === value} onClick={() => onClick(value)}>
          {text}
          {!!numberIndicators[value] && <span>{numberIndicators[value]}</span>}
        </TabButton>
      ))}
    </TabSelectorContainer>
  );
};

export default TabSelector;

const TabSelectorContainer = styled.div`
  text-align: center;

  * {
    margin: 0 8px;
  }
`;

const TabButton = styled(Button)`
  position: relative;
  transition: all 0.3s ease-in-out;
  width: 100px;

  span {
    pointer-events: none;
    position: absolute;
    right: -15px;
    bottom: -5px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 20px;
    border-radius: 30px;
    background-color: ${COLORS.lightGray};
    color: ${COLORS.darkGray};
    font-size: 10px;
  }
`;
