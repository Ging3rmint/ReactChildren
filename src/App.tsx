import React, { FC } from 'react';
import styled from 'styled-components';

import { Accordion } from './components';
import { TodoHeader, TodoListing } from 'feature/Todo';
import { BadAccordion } from 'components/BadAccordion';

const BAD_ACCORDION_DATA = [
  {
    id: '1',
    header: 'props only accordion',
    content: '<h2>this works too</h2><p>but it is extremely coupled</p>'
  },
  {
    id: '2',
    header: 'props only accordion',
    content: 'dangerously set inner html can also be a normal string'
  },
  {
    id: '3',
    header: 'props only accordion',
    content: '<div style="padding:20px"> Use inline style</div>'
  }
];

const ACCORDION_DATA = [
  {
    id: '1',
    header: 'This accordion comes from data',
    icon: 'home',
    content: '<h2>This is markup</h2><hr><p>Please dont fall asleep!</p>'
  },
  {
    id: '2',
    header: 'Little catto!',
    icon: 'bookmark',
    content:
      '<h2>Just an example</h2><hr><p>My dad taught me a trick. He said, if you dont know what to do, find the least trustworthy person you know and do the exact opposite</p><img width=100 src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" />'
  },
  {
    id: '3',
    header: 'Are we learning or are we sleeping?',
    content: '<h2>Just an example</h2><hr><p>Please dont fall asleep!</p>'
  }
];

const { AccordionWrapper } = Accordion;

const App: FC = () => {
  return (
    <AppContainer>
      <AppTitle>Example: Noob accordion using props</AppTitle>
      <ol>
        <li>Accordion comes with a parent layer even though it is not required if use as individual</li>
        <li>Accordion content is less versatile and outside of react lifecycle</li>
        <li>All siblings under 1 roof, hidden inside the parent</li>
      </ol>
      <AppBadAccordion data={BAD_ACCORDION_DATA} isGroup />
      <AppTitle>Example: Pro accordion using Children</AppTitle>
      <ol>
        <li>Each accordion is its own element</li>
        <li>Use JSX in content</li>
        <li>Not forced to use dangerouslySetInnerHtml</li>
        <li>Have access to each individual element, easier styling</li>
        <li>Usage very similar to antd</li>
      </ol>
      <FlexWrapper>
        <Accordion id="1" header="example header" onClick={(isOpen) => console.log(isOpen)}>
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </Accordion>
        <StyledAccordion1 id="2" header="example styled accordion 1">
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </StyledAccordion1>
        <StyledAccordion2 id="3" header="example styled accordion 2" icon="star">
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </StyledAccordion2>
      </FlexWrapper>
      <AppTitle as="h3">You can add a wrapper to group them</AppTitle>
      <p>By adding a container, each accordion automatically behave as a group</p>
      <AppAccordionWrapper defaultOpenId="2">
        <AppAccordion id="1" header="example header 1">
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </AppAccordion>
        <AppAccordion id="2" header="example header 2">
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </AppAccordion>
        <AppAccordion id="3" header="example header 3">
          <h2>This is an example title</h2>
          <p>Welcome to the tutorial!</p>
        </AppAccordion>
      </AppAccordionWrapper>
      <AppTitle as="h3">Render with data and choose to dangerouslySetInnerHTML</AppTitle>
      <AppAccordionWrapper2>
        {ACCORDION_DATA.map(({ id, header, content, icon }) => {
          return (
            <AppAccordion2 key={id} id={id} header={header} icon={icon}>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </AppAccordion2>
          );
        })}
      </AppAccordionWrapper2>
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
  text-decoration: underline;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: flex-start;

  > * {
    flex: 1 1 100%;
  }
`;

const AppBadAccordion = styled(BadAccordion)`
  display: flex;

  > * {
    flex: 1 1 100%;
  }

  .accordion-item {
    margin-left: 10px;

    :first-of-type {
      margin-left: 0;
    }
  }
`;

const StyledAccordion1 = styled(Accordion)`
  margin-left: 10px;

  .accordion-item-header {
    background: red;
  }
`;

const StyledAccordion2 = styled(Accordion)`
  margin-left: 10px;

  .accordion-item-header {
    background: purple;
  }

  .accordion-item-icon {
    color: yellow;
  }
`;

const AppAccordion = styled(Accordion)`
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

const AppAccordion2 = styled(Accordion)`
  margin-left: 10px;

  .accordion-item-icon {
    color: yellow;
  }

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

const AppAccordionWrapper = styled(AccordionWrapper)`
  width: 300px;
`;

const AppAccordionWrapper2 = styled(AccordionWrapper)`
  flex-direction: row;

  > * {
    flex: 1 1 100%;
  }
`;
