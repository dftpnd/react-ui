import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { InputEx } from './index';
import { withDesign } from 'storybook-addon-designs';
import { INPUT_DIMENSIONS_VALUES } from '#src/components/input/types';
import type { Theme } from '#src/components/themes';
import { ThemeProvider } from 'styled-components';
import type { ValueType } from './ValueType';
import { ALL_BORDER_RADIUS_VALUES } from '#src/components/themes/borderRadius';

export default {
  title: 'Admiral-2.1/Input/InputEx',
  component: InputEx,
  decorators: [withDesign],
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
    design: [
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A60376',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A60982',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A61046',
      },
    ],
  },
  argTypes: {
    dimension: {
      options: INPUT_DIMENSIONS_VALUES,
      control: { type: 'radio' },
    },

    disabled: {
      control: { type: 'boolean' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    disableCopying: {
      control: { type: 'boolean' },
    },
    displayStatusIcon: {
      control: { type: 'boolean' },
    },
    displayClearIcon: {
      control: { type: 'boolean' },
    },
    placeholder: {
      type: 'string',
    },
    prefixValue: {
      type: 'string',
    },
    suffixValue: {
      type: 'string',
    },
    onChange: {
      action: 'onChange',
    },
    icons: {
      control: false,
    },
    containerRef: {
      control: false,
    },
    handleInput: {
      control: false,
    },
    themeBorderKind: {
      options: ALL_BORDER_RADIUS_VALUES,
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof InputEx>;

const Template: ComponentStory<typeof InputEx> = (props) => {
  const cleanProps = (Object.keys(props) as Array<keyof typeof props>).reduce((acc, key) => {
    if (props[key] !== undefined) acc[key] = props[key];

    return acc;
  }, {} as Record<any, any>);

  const [localValue, setValue] = useState<string>(String(props.value) ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setValue(inputValue);
    props.onChange?.(e);
  };

  function swapBorder(theme: Theme): Theme {
    theme.shape.borderRadiusKind = (props as any).themeBorderKind || theme.shape.borderRadiusKind;
    return theme;
  }

  return (
    <ThemeProvider theme={swapBorder}>
      <InputEx {...cleanProps} value={localValue} onChange={handleChange} />
    </ThemeProvider>
  );
};

const PREFIX_OPTIONS = ['prefix One', 'prefix Two', 'prefix Three'];
const SUFFIX_OPTIONS = ['One', 'Two', 'Three'];

const Template2: ComponentStory<typeof InputEx> = (props) => {
  const cleanProps = (Object.keys(props) as Array<keyof typeof props>).reduce((acc, key) => {
    if (props[key] !== undefined) acc[key] = props[key];

    return acc;
  }, {} as Record<any, any>);

  const [localValue, setValue] = useState<string>(String(props.value) ?? '');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    setValue(inputValue);
    props.onChange?.(e);
  };

  function swapBorder(theme: Theme): Theme {
    theme.shape.borderRadiusKind = (props as any).themeBorderKind || theme.shape.borderRadiusKind;
    return theme;
  }

  const [prefixValue, setPrefixValue] = React.useState<ValueType>('prefix One');
  const [suffixValue, setSuffixValue] = React.useState<ValueType>('One');

  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <ThemeProvider theme={swapBorder}>
      <InputEx
        {...cleanProps}
        containerRef={inputRef}
        value={localValue}
        onChange={handleChange}
        prefixValue={prefixValue}
        prefixValueList={PREFIX_OPTIONS}
        onPrefixValueChange={setPrefixValue}
        suffixValue={suffixValue}
        suffixValueList={SUFFIX_OPTIONS}
        onSuffixValueChange={setSuffixValue}
      />
    </ThemeProvider>
  );
};

export const InputExStory = Template.bind({});
InputExStory.args = {
  value: 'Привет!',
  placeholder: 'Placeholder',
};
InputExStory.storyName = 'Базовый input компонент';

export const InputExStory2 = Template2.bind({});
InputExStory2.args = {
  value: 'Привет!',
  placeholder: 'Placeholder',
};
InputExStory2.storyName = 'input компонент с выбором суффикса';
