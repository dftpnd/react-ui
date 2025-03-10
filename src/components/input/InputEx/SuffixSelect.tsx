import React from 'react';
import type { DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import styled, { css } from 'styled-components';
import { OpenStatusButton } from '#src/components/OpenStatusButton';
import { StyledDropdownContainer } from '#src/components/DropdownContainer';
import { Menu } from '#src/components/input/InputEx/Menu';
import type { ValueType } from '#src/components/input/InputEx/ValueType';

const StyledMenu = styled(Menu)<{ width?: string }>`
  width: ${({ width }) => (width ? width : 'auto')};
`;

const disableEventMixin = css`
  pointer-events: none;
  cursor: default;
`;
const preventDefault = (e: React.MouseEvent) => e.preventDefault();
const Container = styled.div<{ iconSizeValue?: string; disabled?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;

  [data-read-only] {
    cursor: default;
  }

  & > svg {
    display: block;
    width: ${(p) => p.iconSizeValue || '24px'};

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline-offset: 2px;
      outline: ${(p) => p.theme.color['Primary/Primary 60 Main']} solid 2px;
    }
  }

  ${(p) => (p.disabled ? disableEventMixin : '')}
`;
const ValueContainer = styled.div`
  margin-right: 4px;
`;
export type RenderPropsType<T> = {
  value: T;
};

export type SuffixSelectProps<T> = {
  /** ref элемента относительно которого будет выравниваться дроп контейнер */
  alignRef?: React.RefObject<HTMLElement>;

  /** задает выравнивание дроп контейнера относительно компонента */
  dropAlign?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';

  /** Задает максимальную высоту дроп контейнера */
  dropMaxHeight?: string | number;

  /** выбранное на данный момент значение */
  value: T;

  /** список значений для выбора */
  options: T[];

  /** обработчик события на выбор элемента */
  onChange: (value: ValueType) => void;

  /** состояние видимости контейнера с опциями */
  isOpen?: boolean;

  /** обработчик события на изменение видимости контейнера с опциями */
  onOpenChange?: (isOpen: boolean) => void;

  renderValue?: (props: RenderPropsType<T>) => React.ReactNode;
  renderOption?: (props: RenderPropsType<T>) => React.ReactNode;

  disabled?: boolean;

  readOnly?: boolean;

  /** Позволяет добавлять миксин для выпадающих меню, созданный с помощью styled css  */
  dropContainerCssMixin?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
};

export const SuffixSelect = <T extends ValueType>({
  dropAlign,
  dropMaxHeight,
  onChange,
  options,
  value,
  disabled,
  dropContainerCssMixin,
  ...props
}: React.PropsWithChildren<SuffixSelectProps<T>>) => {
  const [isOpenState, setIsOpenState] = React.useState<boolean>(false);
  const isOpen = props.isOpen === undefined ? isOpenState : props.isOpen;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const alignContainerRef = props.alignRef === undefined ? containerRef : props.alignRef;

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent focus stealing from input
    const newOpenStatus = !isOpen;
    props.onOpenChange?.(newOpenStatus);
    setIsOpenState(newOpenStatus);
  };

  const handleOnSelect = (value: ValueType) => {
    onChange(value);
    setIsOpenState(false);
  };

  const clickOutside = (e: Event) => {
    if (e.target && containerRef.current?.contains(e.target as Node)) {
      return;
    }
    setIsOpenState(false);
  };

  return (
    <>
      <Container
        ref={containerRef}
        disabled={disabled}
        data-read-only={props.readOnly ? true : undefined}
        onMouseDown={props.readOnly || disabled ? preventDefault : handleContainerClick}
      >
        <ValueContainer>{value}</ValueContainer>
        {!props.readOnly && <OpenStatusButton $isOpen={isOpen} aria-hidden data-disabled={disabled} />}
      </Container>
      {isOpen && (
        <StyledDropdownContainer
          role="listbox"
          alignSelf={dropAlign}
          targetRef={alignContainerRef}
          onClickOutside={clickOutside}
          dropContainerCssMixin={dropContainerCssMixin}
        >
          <StyledMenu maxHeight={dropMaxHeight} options={options} selected={value} onSelect={handleOnSelect} />
        </StyledDropdownContainer>
      )}
    </>
  );
};
