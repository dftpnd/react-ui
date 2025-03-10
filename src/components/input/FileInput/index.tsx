import * as React from 'react';
import styled from 'styled-components';
import { ReactComponent as AttachFileOutline } from '@admiral-ds/icons/build/system/AttachFileOutline.svg';
import { mediumGroupBorderRadius } from '#src/components/themes/borderRadius';
import { typography } from '#src/components/Typography';
import { refSetter } from '#src/components/common/utils/refSetter';
import {
  FILE_INPUT_ICON_MARGIN,
  FILE_INPUT_ICON_SIZE_M,
  FILE_INPUT_ICON_SIZE_XL,
  FILE_INPUT_MIN_WIDTH_M,
  FILE_INPUT_MIN_WIDTH_XL,
  dimensionMStyles,
  dimensionXLStyles,
  disabledStyles,
  hoverStyles,
  titleXL,
} from '#src/components/input/FileInput/style';
import type { InputStatus } from '#src/components/input/types';
import { ExtraTextContainer } from '#src/components/Field';
import { Label } from '#src/components/Label';

/** TODO:
 * переключение по файлам списка (клик на иконку документа, удаление документа из списка)
 * */

export type FileInputDimension = 'xl' | 'm';

const ExtraText = styled(ExtraTextContainer)`
  padding-top: 20px;
`;

const Icon = styled(AttachFileOutline)<{ dimension?: FileInputDimension }>`
  height: ${(p) => (p.dimension === 'xl' ? FILE_INPUT_ICON_SIZE_XL : FILE_INPUT_ICON_SIZE_M)};
  width: ${(p) => (p.dimension === 'xl' ? FILE_INPUT_ICON_SIZE_XL : FILE_INPUT_ICON_SIZE_M)};
  margin-right: ${(p) => (p.dimension === 'm' ? FILE_INPUT_ICON_MARGIN : '')};
  margin-bottom: ${(p) => (p.dimension === 'xl' ? FILE_INPUT_ICON_MARGIN : '')};
  flex-shrink: 0;

  > * {
    fill: ${(p) => p.theme.color['Primary/Primary 60 Main']};
  }
`;

// TODO: удалить LabelM, Description при поднятии версии до новой мажорной
const LabelM = styled(Label)`
  display: flex;
`;
const Description = styled.div<{ disabled?: boolean }>`
  color: ${(p) => (p.disabled ? p.theme.color['Neutral/Neutral 30'] : p.theme.color['Neutral/Neutral 90'])};
  ${typography['Body/Body 1 Long']};
`;

const TitleText = styled.div<{ dimension?: FileInputDimension; disabled?: boolean }>`
  color: ${(p) => (p.disabled ? p.theme.color['Neutral/Neutral 30'] : p.theme.color['Neutral/Neutral 90'])};
  ${(p) => (p.dimension === 'xl' ? typography['Body/Body 2 Long'] : typography['Body/Body 1 Long'])}
  ${(p) => p.dimension === 'xl' && titleXL}
`;

const FocusBorder = styled.div`
  position: absolute;
  top: -3px;
  bottom: -3px;
  left: -3px;
  right: -3px;
  pointer-events: none;
  overflow: visible;
  border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
  &:focus:focus-visible ~ ${FocusBorder} {
    outline: ${(p) => `2px solid ${p.theme.color['Primary/Primary 60 Main']}`};
  }
`;

const CustomInput = styled.input`
  display: block;
  width: 0;
  height: 0;
  opacity: 0;
`;

const InputWrapper = styled.div<{ disabled?: boolean; dimension: FileInputDimension }>`
  position: relative;
  display: flex;
  align-items: center;
  border: ${(p) => `1px dashed ${p.theme.color['Neutral/Neutral 40']}`};
  border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
  pointer-events: all;
  ${(p) => (p.disabled ? disabledStyles : hoverStyles)};
  ${(p) => (p.dimension === 'm' ? dimensionMStyles : dimensionXLStyles)};
  box-sizing: border-box;
  overflow: visible;
`;

const Wrapper = styled.div<{ dimension: FileInputDimension; width?: string | number }>`
  min-width: ${(p) => (p.dimension === 'm' ? FILE_INPUT_MIN_WIDTH_M : FILE_INPUT_MIN_WIDTH_XL)};
  ${(p) => (p.width ? `width: ${typeof p.width === 'number' ? p.width + 'px' : p.width};` : '')}
  box-sizing: border-box;
  ${typography['Body/Body 2 Long']};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const FileInputWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: visible;
`;

export interface RenderFileInputProps {
  onQueryUpload: () => void;
}

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'title'> {
  /** Размер компонента */
  dimension: FileInputDimension;
  /** Задает ширину */
  width?: string | number;
  /** Текстовое описание компонента (текст внутри области загрузки файлов).
   * Если к компоненту также нужно добавить label, используйте компонент FileInputField и его проп label*/
  title?: React.ReactNode;
  /** @deprecated Используйте взамен проп title
   * Текст для кнопки при dimension M */
  description?: React.ReactNode;
  /** Функция, возвращающая компонент, на который нужно "повесить" файловый инпут */
  renderCustomFileInput?: (option: RenderFileInputProps) => React.ReactNode;
  /** Список файлов для синхронизации с нативным инпутом */
  files?: Array<File>;
  /** @deprecated Используйте взамен компонент FileInputField и его проп extraText
   * Текст будет виден ниже компонента */
  extraText?: React.ReactNode;
  /** Установка статуса поля */
  status?: InputStatus;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      dimension = 'xl',
      width,
      title,
      description,
      renderCustomFileInput,
      disabled,
      multiple = true,
      children,
      files,
      extraText,
      status,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const titleWithDescription = dimension === 'm' && title && description;
    const titleWithoutDescription = (title && !description) || (title && description && dimension === 'xl');

    // TODO: удалить description, renderLabel, renderDescription, extraText при поднятии версии до новой мажорной
    const renderLabel = () => <LabelM disabled={disabled} children={title} />;
    const renderDescription = () => <Description disabled={disabled}>{description}</Description>;

    const renderTitleText = () => (
      <TitleText dimension={dimension} disabled={disabled}>
        {title}
      </TitleText>
    );

    const handleQueryUpload = () => {
      inputRef.current?.click();
    };

    React.useEffect(() => {
      const inputNode = inputRef.current;
      if (inputNode && files) {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        inputNode.files = dt.files;
      }
    }, [files]);

    return (
      <Wrapper dimension={dimension} width={width} data-status={status}>
        <FileInputWrapper>
          {renderCustomFileInput ? (
            <>
              {renderCustomFileInput({ onQueryUpload: handleQueryUpload })}
              <CustomInput
                {...props}
                ref={refSetter(ref, inputRef)}
                type="file"
                multiple={multiple}
                disabled={disabled}
                tabIndex={-1}
              />
              <FocusBorder className="focus-block" />
            </>
          ) : (
            <>
              {titleWithDescription && renderLabel()}
              <InputWrapper dimension={dimension} disabled={disabled}>
                <Icon dimension={dimension} />
                {titleWithoutDescription && renderTitleText()}
                {dimension === 'm' && description && renderDescription()}
                <StyledInput
                  {...props}
                  ref={refSetter(ref, inputRef)}
                  type="file"
                  disabled={disabled}
                  multiple={multiple}
                />
                <FocusBorder className="focus-block" />
              </InputWrapper>
            </>
          )}
        </FileInputWrapper>
        {children}
        {extraText && status === 'error' && <ExtraText>{extraText}</ExtraText>}
      </Wrapper>
    );
  },
);

FileInput.displayName = 'FileInput';
