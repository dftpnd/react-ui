import { INPUT_DIMENSIONS_VALUES, INPUT_STATUS_VALUES } from '#src/components/input';
import { Modal, ModalButtonPanel, ModalContent, ModalTitle } from '#src/components/Modal';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import type { ChangeEvent } from 'react';
import * as React from 'react';
import { withDesign } from 'storybook-addon-designs';
import { Option, OptionGroup, Select } from '#src/components/input/Select';
import type { IOnCloseProps } from '../types';
import { Button } from '#src/components/Button';
import { useState } from '@storybook/addons';
import { MenuActionsPanel } from '#src/components/Menu/MenuActionsPanel';
import { TextButton } from '#src/components/TextButton';
import { PlusOutline } from '#src/icons/IconComponents-service';
import { CustomOptionWrapper } from '../styled';
import type { RenderOptionProps } from '#src/components/Menu/MenuItem';
import { T } from '#src/components/T';
import { createOptions, formDataToObject, shouldRender, wait } from './utils';
import { OPTIONS, OPTIONS_ASYNC, OPTIONS_SIMPLE } from './data';
import { ExtraText, Form, FormValuesWrapper, Icon, Separator, StyledGroup, TextWrapper } from './styled';
import { ALL_BORDER_RADIUS_VALUES } from '#src/components/themes/borderRadius';
import { cleanUpProps } from '#src/components/common/utils/cleanUpStoriesProps';

export default {
  title: 'Admiral-2.1/Input/Select/режим "searchSelect"',
  component: Select,
  decorators: [withDesign],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/EGEGZsx8WhdxpmFKu8J41G/Admiral-2.1-UI-Kit?node-id=39%3A72429',
    },
  },
  argTypes: {
    dimension: {
      options: INPUT_DIMENSIONS_VALUES,
      control: { type: 'radio' },
    },

    disabled: {
      control: { type: 'boolean' },
    },

    isLoading: {
      control: { type: 'boolean' },
    },

    multiple: {
      control: { type: 'boolean' },
    },

    readOnly: {
      control: { type: 'boolean' },
    },

    disableCopying: {
      control: { type: 'boolean' },
    },

    showCheckbox: {
      control: { type: 'boolean' },
    },

    status: {
      control: { type: 'radio' },
      options: INPUT_STATUS_VALUES,
    },

    displayClearIcon: {
      control: { type: 'boolean' },
    },

    placeholder: {
      type: 'string',
    },

    onChange: {
      action: 'onChange',
    },
    themeBorderKind: {
      control: {
        type: 'radio',
        options: ALL_BORDER_RADIUS_VALUES,
      },
    },
    skeleton: {
      control: { type: 'boolean' },
    },
    alignDropdown: {
      options: [undefined, 'auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
      control: { type: 'select' },
    },
  },
} as ComponentMeta<typeof Select>;

const TemplateSearchSelectWithFilter: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    props.onChange?.(e);
  };

  const renderOptions = () => {
    return OPTIONS_SIMPLE.map(
      (option, ind) =>
        shouldRender(option, searchValue) && (
          <Option key={option} value={option} disabled={ind === 4}>
            {option}
          </Option>
        ),
    ).filter((item) => !!item);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <>
      <T font="Body/Body 2 Long" as="div">
        Фильтрация элементов списка осуществляется вызывающим кодом
        <br />В данном примере показан один из возможных способов
      </T>
      <Separator />
      <Select
        {...cleanProps}
        onInputChange={handleInputChange}
        placeholder="Placeholder"
        mode="searchSelect"
        value={selectValue}
        onChange={onChange}
      >
        {renderOptions()}
      </Select>
    </>
  );
};

const TemplateCustomOption: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState(cleanProps.value ? String(cleanProps.value) : OPTIONS[2].value);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <>
      <Select {...cleanProps} value={selectValue} mode="searchSelect" onChange={onChange}>
        {OPTIONS.map((option) => (
          <Option key={option.value} value={option.value}>
            <Icon />
            <TextWrapper>
              {option.text}
              <ExtraText>{option.extraText}</ExtraText>
            </TextWrapper>
          </Option>
        ))}
      </Select>
    </>
  );
};

interface MyIncredibleOptionProps extends RenderOptionProps {
  shouldAnimate?: boolean;
  text: string;
}

const MyIncredibleOption = ({ text, shouldAnimate, ...props }: MyIncredibleOptionProps) => (
  <CustomOptionWrapper {...props}>
    <Icon shouldAnimate={shouldAnimate} />
    <TextWrapper>{text}</TextWrapper>
  </CustomOptionWrapper>
);

const TemplateRenderProps: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState(cleanProps.value ? String(cleanProps.value) : OPTIONS[2].value);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <>
      <Select {...cleanProps} value={selectValue} mode="searchSelect" onChange={onChange}>
        {OPTIONS.map(({ text, value }) => (
          <Option
            key={value}
            value={value}
            renderOption={(options) => (
              <MyIncredibleOption text={text} shouldAnimate={options.hovered && value !== selectValue} {...options} />
            )}
          />
        ))}
      </Select>
    </>
  );
};

const TemplateOptionGroup: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState('Похо Торо Моронго');

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => setSelectValue(e.target.value);

  return (
    <>
      <Select {...cleanProps} value={selectValue} mode="searchSelect" onChange={onChange} dimension="xl">
        <StyledGroup label="Сегодня выступают">
          <Option value="Анигиляторная пушка">Анигиляторная пушка</Option>
          <Option value="Похо Торо Моронго">Похо Торо Моронго</Option>
        </StyledGroup>
        <OptionGroup label="Группа фрукты" disabled>
          <Option value="Саша Даль">Саша Даль</Option>
          <Option value="Алексей Елесин">Алексей Елесин</Option>
          <Option value="Константин Ионочкин">Константин Ионочкин</Option>
          <Option value="Анна Корженко">Анна Корженко</Option>
          <Option value="Фидель">Фидель</Option>
          <Option value="Константин Колешонок">Константин Колешонок</Option>
          <Option value="Алексей Орлов">Алексей Орлов</Option>
        </OptionGroup>
      </Select>
    </>
  );
};

const AsyncTemplate: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState(cleanProps.value ? String(cleanProps.value) : OPTIONS[2].value);
  const [options, setOptions] = React.useState<Array<{ value: string; text: string }>>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    props.onChange?.(e);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  React.useEffect(() => {
    (async () => {
      setIsLoading(true);
      await wait(1500);
      if (searchValue.length === 0) setOptions([...OPTIONS_ASYNC]);
      if (searchValue.length === 1) setOptions([...OPTIONS_ASYNC.slice(0, 2), { value: 'new', text: 'neeeew' }]);
      if (searchValue.length === 2)
        setOptions([
          { value: 'new', text: 'neeeew' },
          ...OPTIONS_ASYNC.slice(2, 3),
          { value: 'new2', text: 'neeeew2' },
          { value: 'new3', text: '33neeeew' },
        ]);
      if (searchValue.length >= 3) setOptions([]);
      setIsLoading(false);
    })();
  }, [searchValue]);

  return (
    <>
      <Select
        {...cleanProps}
        value={selectValue}
        isLoading={isLoading}
        onChange={onChange}
        onInputChange={onInputChange}
        mode="searchSelect"
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.text}
          </Option>
        ))}
      </Select>
    </>
  );
};

const UncontrolledTemplate: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [submitValues, setSubmitValues] = useState<null | Record<string, any>>(null);

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formElem = evt.target as HTMLFormElement;

    if (formElem) {
      setSubmitValues(formDataToObject(new FormData(formElem)));
    }
  };

  return (
    <>
      <Form action="" onSubmit={onSubmit}>
        <Select {...cleanProps} name="myOwesomeField" mode="searchSelect" defaultValue={OPTIONS_SIMPLE[0]}>
          {OPTIONS_SIMPLE.map((option, ind) => (
            <Option key={option} value={option} disabled={ind === 4}>
              {option}
            </Option>
          ))}
        </Select>
        <Button type="submit" dimension="m">
          Cабмить меня, чего ты медлишь?!
        </Button>
        <FormValuesWrapper>
          {submitValues === null
            ? 'Здесь будут выводится значения, которые ты засабмитишь...'
            : JSON.stringify(submitValues)}
        </FormValuesWrapper>
      </Form>
    </>
  );
};

const TemplateMultipleWithAddOption: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState(createOptions(20));

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValues = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectValue(newValues);
    props.onChange?.(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const renderOptions = () => {
    return options
      .map(
        (option, ind) =>
          shouldRender(option.text, searchValue) && (
            <Option key={option.value} value={option.value} disabled={[2, 4].includes(ind)}>
              {option.text}
            </Option>
          ),
      )
      .filter((item) => !!item);
  };

  const handleAddButtonClick = () => {
    if (searchValue && !options.find((item) => item.text === searchValue)) {
      setOptions([...options, { text: searchValue, value: searchValue }]);
      setSelectValue([...selectValue, searchValue]);
      setSearchValue('');
    }
  };

  const addButtonProps = React.useMemo(() => {
    return {
      disabled: !!options.find((item) => item.text === searchValue) || !searchValue,
      text: searchValue ? `Добавить «${searchValue}»` : 'Добавить',
    };
  }, [searchValue, options]);

  const menuPanelContentDimension =
    cleanProps.dimension === undefined || cleanProps.dimension === 'xl' ? 'l' : cleanProps.dimension;

  return (
    <>
      <Select
        {...cleanProps}
        value={selectValue}
        inputValue={searchValue}
        multiple={true}
        onChange={onChange}
        dimension="xl"
        displayClearIcon={true}
        placeholder="Placeholder"
        mode="searchSelect"
        onInputChange={handleInputChange}
        renderDropDownBottomPanel={({ dimension = menuPanelContentDimension }) => {
          return (
            <MenuActionsPanel dimension={dimension}>
              <TextButton {...addButtonProps} icon={<PlusOutline />} onClick={handleAddButtonClick} />
            </MenuActionsPanel>
          );
        }}
      >
        {renderOptions()}
      </Select>
    </>
  );
};

const MultipleWithApplyOptions = createOptions(10);

const TemplateMultipleWithApply: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [forcedOpen, setForcedOpen] = React.useState(false);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValues = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectValue(newValues);
    props.onChange?.(e);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const renderOptions = () => {
    return MultipleWithApplyOptions.map(
      (option, ind) =>
        shouldRender(option.text, searchValue) && (
          <Option key={option.value} value={option.value} disabled={[2, 4].includes(ind)}>
            {option.text}
          </Option>
        ),
    ).filter((item) => !!item);
  };

  const handleApplyButtonClick = () => {
    setForcedOpen(false);
    console.log('selected', selectValue.toString());
  };

  const menuPanelContentDimension =
    cleanProps.dimension === undefined || cleanProps.dimension === 'xl' ? 'l' : cleanProps.dimension;

  return (
    <>
      <Select
        {...cleanProps}
        forcedOpen={forcedOpen}
        value={selectValue}
        inputValue={searchValue}
        multiple={true}
        onChange={onChange}
        displayClearIcon={true}
        placeholder="Placeholder"
        mode="searchSelect"
        onInputChange={handleInputChange}
        onChangeDropDownState={setForcedOpen}
        renderDropDownBottomPanel={({ dimension = menuPanelContentDimension }) => {
          return (
            <MenuActionsPanel dimension={dimension}>
              <Button dimension={'m'} disabled={selectValue.length === 0} onClick={handleApplyButtonClick}>
                Применить
              </Button>
            </MenuActionsPanel>
          );
        }}
      >
        {renderOptions()}
      </Select>
    </>
  );
};

const TemplateNotFixedMultiSelect: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState<string[]>(
    Array.from({ length: 20 }).map((_, ind) => String(ind)),
  );

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValues = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectValue(newValues);
    props.onChange?.(e);
  };

  return (
    <>
      <Select
        {...cleanProps}
        value={selectValue}
        mode="searchSelect"
        multiple={true}
        onChange={onChange}
        maxRowCount={3}
      >
        {Array.from({ length: 20 }).map((_option, ind) => (
          <Option key={ind} value={String(ind)}>
            {`${ind}0000`}
          </Option>
        ))}
      </Select>
    </>
  );
};

const TemplateMultiSelectCustomOption: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState<string[]>(
    Array.from({ length: 15 }).map((_, ind) => String(ind)),
  );

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(Array.from(e.target.selectedOptions).map((option) => option.value));
  };

  return (
    <>
      <Select {...cleanProps} value={selectValue} multiple={true} onChange={onChange} mode="searchSelect">
        {Array.from({ length: 20 }).map((_option, ind) => (
          <Option key={ind} value={String(ind)} renderChip={() => String(ind)}>
            <TextWrapper>
              {`${ind}0000`}
              <ExtraText>{`Доп ${ind}`}</ExtraText>
            </TextWrapper>
          </Option>
        ))}
      </Select>
    </>
  );
};

const TemplateMultiSelectCustomChip: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState<string[]>(
    Array.from({ length: 5 }).map((_, ind) => String(ind)),
  );
  const [modalOpened, setModalOpened] = React.useState(false);
  const [valueToDelete, setValueToDelete] = React.useState<string | null>(null);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(Array.from(e.target.selectedOptions).map((option) => option.value));
  };
  const deleteValue = (value: string) => setSelectValue((prev) => prev.filter((prevValue) => prevValue !== value));

  const onCloseModal = () => {
    setValueToDelete(null);
    setModalOpened(false);
  };
  const onOpenModal = () => setModalOpened(true);

  const onChipClose = ({ value }: IOnCloseProps) => {
    setValueToDelete(value);
    onOpenModal();
  };
  const renderChip = (ind: number) => () => ({ children: `${ind} $`, onClose: onChipClose });

  const onYes = () => {
    if (valueToDelete) deleteValue(valueToDelete);
    onCloseModal();
  };

  return (
    <>
      <Select {...cleanProps} value={selectValue} multiple={true} onChange={onChange} mode="searchSelect">
        {Array.from({ length: 20 }).map((_option, ind) => (
          <Option key={ind} value={String(ind)} renderChip={renderChip(ind)} disabled={[0, 2].includes(ind)}>
            {ind}
          </Option>
        ))}
      </Select>
      {modalOpened && (
        <Modal onClose={onCloseModal}>
          <ModalTitle>Попап неуверенности</ModalTitle>
          <ModalContent>Уверены, что хотите удалить опцию?</ModalContent>
          <ModalButtonPanel>
            <Button appearance="primary" dimension="m" onClick={onYes}>
              О да
            </Button>
            <Button appearance="secondary" dimension="m" onClick={onCloseModal}>
              Нет, был не прав
            </Button>
          </ModalButtonPanel>
        </Modal>
      )}
    </>
  );
};

const TemplateWithAddButton: ComponentStory<typeof Select> = (props) => {
  const cleanProps = cleanUpProps(props);

  const [selectValue, setSelectValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState(OPTIONS_SIMPLE);

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectValue(e.target.value);
    props.onChange?.(e);
  };

  const renderOptions = () => {
    return options
      .map(
        (option, ind) =>
          shouldRender(option, searchValue) && (
            <Option key={option} value={option} disabled={ind === 4}>
              {option}
            </Option>
          ),
      )
      .filter((item) => !!item);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleAddButtonClick = () => {
    if (searchValue && !options.includes(searchValue)) {
      setOptions([...options, searchValue]);
    }
  };

  const addButtonProps = React.useMemo(() => {
    return {
      disabled: options.includes(searchValue) || !searchValue,
      text: searchValue ? `Добавить «${searchValue}»` : 'Добавить',
    };
  }, [searchValue, options]);

  const menuPanelContentDimension = props.dimension === undefined || props.dimension === 'xl' ? 'l' : props.dimension;

  return (
    <>
      <Select
        {...cleanProps}
        onInputChange={handleInputChange}
        placeholder="Placeholder"
        mode="searchSelect"
        value={selectValue}
        onChange={onChange}
        renderDropDownBottomPanel={({ dimension = menuPanelContentDimension }) => {
          return (
            <MenuActionsPanel dimension={dimension}>
              <TextButton {...addButtonProps} icon={<PlusOutline />} onClick={handleAddButtonClick} />
            </MenuActionsPanel>
          );
        }}
      >
        {renderOptions()}
      </Select>
    </>
  );
};

export const SearchSelectWithFilter = TemplateSearchSelectWithFilter.bind({});
SearchSelectWithFilter.args = {
  placeholder: 'Начните ввод для поиска',
};
SearchSelectWithFilter.storyName = 'Фильтрация опций';
SearchSelectWithFilter.parameters = {
  docs: {
    description: {
      story: `Фильтрация списка опций осуществляется вызывающим кодом.\n\n В данном примере показан один из возможных способов`,
    },
  },
};

export const CustomOption = TemplateCustomOption.bind({});
CustomOption.storyName = 'Кастомные опции';

export const RenderProps = TemplateRenderProps.bind({});
RenderProps.storyName = 'Кастомные опции через renderProps';

export const WithAddButton = TemplateWithAddButton.bind({});
WithAddButton.storyName = 'Нижняя панель с кнопкой "Добавить"';

export const OptionGroupStory = TemplateOptionGroup.bind({});
OptionGroupStory.storyName = 'Использование групп';

export const AsyncSearchSelectStory = AsyncTemplate.bind({});
AsyncSearchSelectStory.storyName = 'SearchSelect. Асинхронный';

export const UncontrolledSearchSelectStory = UncontrolledTemplate.bind({});
UncontrolledSearchSelectStory.storyName = 'SearchSelect. Некотролируемый';

export const MultipleWithAddOption = TemplateMultipleWithAddOption.bind({});
MultipleWithAddOption.storyName = 'Multiple с добавлением опций';

export const MultipleWithApply = TemplateMultipleWithApply.bind({});
MultipleWithApply.storyName = 'Multiple с кнопкой "Применить"';

export const ExpandedHeightMultiSearchSelectStory = TemplateNotFixedMultiSelect.bind({});
ExpandedHeightMultiSearchSelectStory.storyName = 'Multiple с увеличенной по умолчанию высотой';

export const CustomOptionMultiSearchSelectStory = TemplateMultiSelectCustomOption.bind({});
CustomOptionMultiSearchSelectStory.storyName = 'Multiple с кастомными опциями';

export const CustomChipMultiSearchSelectStory = TemplateMultiSelectCustomChip.bind({});
CustomChipMultiSearchSelectStory.storyName = 'Multiple с кастомным обработчиком удаления чипса';
