import React, { FC } from 'react';
import styled from 'styled-components';

import { Accordion } from './components';
import { TodoHeader, TodoListing } from 'feature/Todo';

const accordionData = [
  {
    id: '1',
    header: 'This accordion comes from data',
    content: '<h2>This is markup</h2><hr><p>Please dont fall asleep!</p>'
  },
  {
    id: '2',
    header: 'This accordion comes from data',
    content: '<h2>Just an example</h2><hr><p>Please dont fall asleep!</p>'
  }
];

const { AccordionItem } = Accordion;

const App: FC = () => {
  return (
    <AppContainer>
      <AppTitle>Individual Accordion</AppTitle>
      <FlexWrapper>
        <AccordionItem id="1" header="example header" onClick={(isOpen) => console.log(isOpen)}>
          <div>
            <h2>This is an example title</h2>
            <p>Welcome to the tutorial!</p>
          </div>
        </AccordionItem>
        <StyledAccordionItem1 id="2" header="example styled accordion 1">
          <div>
            <h2>This is an example title</h2>
            <p>this is a styled accordion</p>
          </div>
        </StyledAccordionItem1>
        <StyledAccordionItem2 id="3" header="example styled accordion 2" icon="star">
          <div>
            <h2>This is an example title</h2>
            <p>this is a styled accordion</p>
          </div>
        </StyledAccordionItem2>
      </FlexWrapper>
      <AppTitle>Grouped Accordion</AppTitle>
      <AppAccordion defaultOpenId="2">
        <AppAccordionItem id="1" header="example header 1">
          <div>
            <h2>This is an example title 1</h2>
            <p>Welcome to the tutorial!</p>
          </div>
        </AppAccordionItem>
        <AppAccordionItem id="2" header="example header 2">
          <div>
            <h2>This is an example title 2</h2>
            <p>Welcome to the tutorial!</p>
          </div>
        </AppAccordionItem>
        <AppAccordionItem id="3" header="example header 3">
          <div>
            <h2>This is an example title 3</h2>
            <p>Welcome to the tutorial!</p>
          </div>
        </AppAccordionItem>
      </AppAccordion>
      <AppTitle>Loop from array</AppTitle>
      <AppAccordion2>
        {accordionData.map(({ id, header, content }) => {
          return (
            <AppAccordionItem2 key={id} id={id} header={header}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </AppAccordionItem2>
          );
        })}
      </AppAccordion2>
      <AppTitle>Animated list example</AppTitle>
      <TodoHeader />
      <TodoListing />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 50px 0;
`;

const AppTitle = styled.h1`
  margin-bottom: 20px;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

const StyledAccordionItem1 = styled(AccordionItem)`
  margin-left: 10px;

  .accordion-item-header {
    background: red;
  }
`;

const StyledAccordionItem2 = styled(AccordionItem)`
  margin-left: 10px;

  .accordion-item-header {
    background: purple;
  }

  .accordion-item-icon {
    color: yellow;
  }
`;

const AppAccordionItem = styled(AccordionItem)`
  margin-top: 10px;

  :first-of-type {
    margin-top: 0;

    .accordion-item-header {
      background: red;
    }
  }

  :last-of-type .accordion-item-header {
    background: purple;
  }
`;

const AppAccordionItem2 = styled(AccordionItem)`
  margin-left: 10px;

  :first-of-type {
    margin-left: 0;

    .accordion-item-header {
      background: red;
    }
  }

  :last-of-type .accordion-item-header {
    background: purple;
  }
`;

const AppAccordion = styled(Accordion)`
  width: 300px;
`;

const AppAccordion2 = styled(Accordion)`
  flex-direction: row;
`;
