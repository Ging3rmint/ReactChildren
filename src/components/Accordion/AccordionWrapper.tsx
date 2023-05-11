import { cloneElement, isValidElement, useEffect, useState, Children, FC, ReactElement } from 'react';
import styled from 'styled-components';

import { IAccordionProps, IAccordionWrapperProps } from './type';

const AccordionWrapper: FC<IAccordionWrapperProps> = ({ defaultOpenId = '1', children, className, onClick }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [accordions, setAccordions] = useState<Record<string, boolean>>({});

  // Convert children into array of child
  const arrayChildren = Children.toArray(children);

  const onAccordionClick = (isOpen: boolean, id: string) => {
    const newAccordions = Object.keys(accordions).reduce<Record<string, boolean>>((acc, key) => {
      return {
        ...acc,
        [key]: key !== id ? false : !isOpen
      };
    }, {});

    setAccordions(newAccordions);
    onClick && onClick(isOpen, id);
  };

  useEffect(() => {
    if (!isMounted) {
      arrayChildren.forEach((child) => {
        // Typescript is dumb here, even if you filter at the start ts will still throw error.
        if (isValidElement(child)) {
          const {
            props: { id }
          } = child;

          if (id) {
            // Setup accordion default values
            setAccordions((prev) => ({
              ...prev,
              [id]: id === defaultOpenId
            }));
          }
        }
      });

      // We only want to setup default value before mount
      setIsMounted(true);
    }
  }, [isMounted]);

  return (
    <AccordionWrapperContainer className={className}>
      {Children.map(arrayChildren, (child) => {
        if (isValidElement(child)) {
          const {
            props: { id }
          } = child;

          if (!id) {
            return null;
          }

          return cloneElement(child as ReactElement<IAccordionProps>, {
            onClick: onAccordionClick,
            open: !isMounted ? id === defaultOpenId : accordions[id],
            isGroup: true
          });
        }

        return null;
      })}
    </AccordionWrapperContainer>
  );
};

export default AccordionWrapper;

const AccordionWrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
