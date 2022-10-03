import { withDesign } from 'storybook-addon-designs';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FileInput } from '#src/components/input/FileInput/index';
import { Theme } from '#src/components/themes';
import { useEffect, useRef, useState } from 'react';
import { acceptFile } from '#src/components/input/FileUploader/utils';

const Separator = styled.div`
  height: 40px;
`;

const Desc = styled.div`
  font-family: 'VTB Group UI';
  font-size: 16px;
  line-height: 24px;
`;

const Description = () => (
  <Desc>
    Компонент позволяет выбирать локальные файлы пользователя для последующей загрузки их на сервер. Выбирать файлы
    можно как через нажатие на компонент, так и через Drag and Drop (в XL-размере) на компонент. Компонент имеет две
    разновидности отображения — размер XL с превью изображения или иконкой формата файла и размер M без превью,
    передается параметром fileDimension.
    <Separator />
    Выбранные пользователем файлы передаются списком через параметр uploadedFiles, где каждый файл это объект с
    обязательным ключом file и двумя необязательными ключами status и error.
    <Separator />
    Примечание: в IE11 нет функционала перетаскивания и удаления файлов по причине отсутствия поддержки Drag and Drop и
    конструктора DataTransfer в данном браузере.
  </Desc>
);

export default {
  title: 'Admiral-2.1/Input/FileInput',
  decorators: [withDesign],
  component: FileInput,
  parameters: {
    design: [
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A27281',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A27389',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A27519',
      },
      {
        type: 'figma',
        url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A27563',
      },
    ],
    componentSubtitle: <Description />,
    layout: 'centered',
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    dimension: {
      options: ['xl', 'm'],
      control: { type: 'radio' },
    },
    title: {
      control: false,
    },
    disabled: {
      control: { type: 'boolean' },
    },
    themeBorderKind: {
      control: {
        type: 'radio',
        options: ['Border radius 0', 'Border radius 2', 'Border radius 4', 'Border radius 8'],
      },
    },
  },
} as ComponentMeta<typeof FileInput>;

const FileInputBaseTemplate: ComponentStory<typeof FileInput> = (props) => {
  function swapBorder(theme: Theme): Theme {
    theme.shape.borderRadiusKind = (props as any).themeBorderKind || theme.shape.borderRadiusKind;
    return theme;
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  /*const handleChange = () => {
    if (inputRef.current) {
      setFiles([...files, inputRef.current]);
    }
  };*/

  React.useEffect(() => {
    function onChangeEventHandler(this: HTMLInputElement) {
      const filesToAdd = Array.from(this.files || [])
        .filter((file) => !props.accept || acceptFile(file, props.accept))
        .map((file) => file);

      const dt = new DataTransfer();
      filesToAdd.forEach((file) => dt.items.add(file));
      this.files = dt.files;
      setFiles(filesToAdd);
    }

    const input = inputRef.current;

    if (input) {
      input.addEventListener('change', onChangeEventHandler, true);
      return () => input.removeEventListener('change', onChangeEventHandler, true);
    }
  }, [inputRef.current, files, props.accept]);

  useEffect(() => console.log(files), [files]);

  return (
    <ThemeProvider theme={swapBorder}>
      <FileInput
        dimension={props.dimension}
        title={`Загрузите не более 3-х файлов типа JPEG до 5 MB каждый`}
        description="Добавьте файлы"
        ref={inputRef}
      />
    </ThemeProvider>
  );
};

export const FileInputBase = FileInputBaseTemplate.bind({});
FileInputBase.storyName = 'File Input. Базовый пример';
