import React from 'react';
import styled, { css } from 'styled-components';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { ReactComponent as InfoSolid } from '@admiral-ds/icons/build/service/InfoSolid.svg';
import { ReactComponent as CheckOutline } from '@admiral-ds/icons/build/service/CheckOutline.svg';
import { ReactComponent as ErrorSolid } from '@admiral-ds/icons/build/service/ErrorSolid.svg';
import { StatusIndicator } from '#src/components/StatusIndicator';
import { T } from '#src/components/T';

const Desc = styled.div`
  font-family: 'VTB Group UI', serif;
  font-size: 16px;
  line-height: 24px;
`;

const StyledText = styled(T)`
  margin: 10px 0;
`;

const OrangeColor = css`
  color: ${(p) => p.theme.color['Warning/Warning 50 Main']};
  > div {
    svg {
      path {
        fill: ${(p) => p.theme.color['Warning/Warning 50 Main']};
      }
    }
  }
`;

const Description = () => (
  <Desc>Компонент Status Indicator используется для отображения состояния объекта или действия.</Desc>
);

export default {
  title: 'Admiral-2.1/StatusIndicator',
  decorators: [withDesign],
  component: StatusIndicator,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
    componentSubtitle: <Description />,
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/CC0WL5u9TPtZpyLbbAGFGt/Admiral-2.0-UI-Kit?node-id=37%3A18744',
    },
  },
} as ComponentMeta<typeof StatusIndicator>;

const StatusIndicatorDemoDefaultStory: ComponentStory<typeof StatusIndicator> = () => {
  return (
    <>
      <StyledText font="Body/Body 1 Long" as="div">
        Dimension - M
      </StyledText>
      <StatusIndicator dimension="m" text="P 16px/24 book" icon={<CheckOutline />} />
      <StyledText font="Body/Body 1 Long" as="div">
        Dimension - S
      </StyledText>
      <StatusIndicator dimension="s" text="P 14px/20 book" icon={<InfoSolid />} />
    </>
  );
};

export const StatusIndicatorDemoDefault = StatusIndicatorDemoDefaultStory.bind({});
StatusIndicatorDemoDefault.args = {};
StatusIndicatorDemoDefault.storyName = 'Status Indicator';
StatusIndicatorDemoDefault.parameters = {
  docs: {
    description: {
      story: `Компонент регулируется только по высоте и представлен в размерах M (24px) и S (20px), ширина подстраивается под контент. Через параметр cssMixin можно переключать цветовое решение статуса`,
    },
  },
};

const StatusIndicatorDemoStoryPosition: ComponentStory<typeof StatusIndicator> = () => {
  return (
    <>
      <StyledText font="Body/Body 1 Long" as="div">
        Кастомное цветовое отображение статуса
      </StyledText>
      <StatusIndicator cssMixin={OrangeColor} dimension="m" text="P 16px/24 book" icon={<InfoSolid />} />
      <StyledText font="Body/Body 1 Long" as="div">
        Позиционирование иконки индикатора справа
      </StyledText>
      <StatusIndicator dimension="m" text="P 16px/24 book" displayRight={false} icon={<ErrorSolid />} />
      <StyledText font="Body/Body 1 Long" as="div">
        Без иконки
      </StyledText>
      <StatusIndicator dimension="m" text="P 16px/24 book" />
    </>
  );
};

export const StatusIndicatorDemoPosition = StatusIndicatorDemoStoryPosition.bind({});
StatusIndicatorDemoPosition.args = {};
StatusIndicatorDemoPosition.storyName = 'Status Indicator. Альтернативные варианты отображения';
