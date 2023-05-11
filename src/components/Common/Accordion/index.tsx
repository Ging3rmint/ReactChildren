import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface IAccordionProps {
  children?: ReactNode;
}

const Accordion: FC<IAccordionProps> = () => {
   return (
     <AccordionContainer>
       index
     </AccordionContainer>
   );
};

export default Accordion;

const AccordionContainer = styled.div``;