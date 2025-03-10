import * as React from 'react';
import type { HTMLAttributes } from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import type { FileInputDimension } from '#src/components/input/FileInput';
import type { DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';
import styled, { css } from 'styled-components';
import { mediumGroupBorderRadius } from '#src/components/themes/borderRadius';
import { typography } from '#src/components/Typography';
import { formatFileSize, formatFileType, getFileTypeIcon } from '#src/components/input/FileInput/utils';
import { Spinner } from '#src/components/Spinner';
import { ReactComponent as EyeOutline } from '@admiral-ds/icons/build/service/EyeOutline.svg';
import {
  ERROR_BLOCK_HEIGHT_M,
  ERROR_BLOCK_HEIGHT_XL,
  FILE_ITEM_FUNCTIONAL_ICON_SIZE_M,
  FILE_ITEM_FUNCTIONAL_ICON_SIZE_XL,
  FILE_ITEM_PREVIEW_ICON_SIZE_XL,
  FILE_ITEM_WRAPPER_HEIGHT_M,
  FILE_ITEM_WRAPPER_HEIGHT_XL,
  FILE_ITEM_WRAPPER_PADDING_M,
  FILE_ITEM_WRAPPER_PADDING_XL,
} from '#src/components/input/FileInput/style';
import { Tooltip } from '#src/components/Tooltip';
import { checkOverflow } from '#src/components/common/utils/checkOverflow';
import type { IconPlacementDimension } from '#src/components/IconPlacement';
import { CloseIconPlacementButton } from '#src/components/IconPlacement';
import { keyboardKey } from '#src/components/common/keyboardKey';

export type Status = 'Uploaded' | 'Loading' | 'Error' | 'Queue';

const disabledStyles = css`
  pointer-events: none;
`;

const Container = styled.div<{
  dimension?: FileInputDimension;
  filesLayoutCssMixin?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
}>`
  display: flex;
  flex-direction: column;
  margin-top: 16px;
  overflow: hidden;
  ${(p) => p.filesLayoutCssMixin}
`;

const statusMixin = css<{ status?: Status }>`
  border-color: ${(p) => {
    if (p.status === 'Error') return p.theme.color['Error/Error 60 Main'];
    if (p.status === 'Queue') return p.theme.color['Neutral/Neutral 30'];
    return p.theme.color['Neutral/Neutral 40'];
  }};
  color: ${(p) => (p.status === 'Queue' ? p.theme.color['Neutral/Neutral 30'] : p.theme.color['Neutral/Neutral 90'])};
`;

const PreviewWrapper = styled.div<{
  dimension?: FileInputDimension;
  status?: Status;
}>`
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
  border-width: 1px;
  border-style: solid;
  ${typography['Body/Body 2 Long']};
  ${statusMixin};
`;

const sizeMixin = css`
  align-items: center;
  justify-content: space-between;
`;

const hoveredFileTypeIconCss = css`
  &:hover {
    &:not(:disabled) {
      &::before {
        content: '';
        position: absolute;
        border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        opacity: 0.6;
        background-color: ${({ theme }) => theme.color['Special/Dark Static Neutral 00']};
      }
      & svg {
        visibility: visible;
      }
      cursor: pointer;
    }
  }
`;

const getColor = (status?: Status) => {
  if (status === 'Queue') return 'Neutral/Neutral 30';
  return 'Neutral/Neutral 50';
};

const ImagePreview = styled.div`
  min-width: 40px;
  width: 40px;
  height: 40px;
  border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
  margin-right: 8px;
  overflow: hidden;

  > img {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
`;

const IconWrapper = styled.div<{ status?: Status; showHover: boolean }>`
  position: relative;
  margin-right: 8px;
  border-radius: ${(p) => mediumGroupBorderRadius(p.theme.shape)};
  width: ${FILE_ITEM_PREVIEW_ICON_SIZE_XL};
  height: ${FILE_ITEM_PREVIEW_ICON_SIZE_XL};

  & *[fill^='#'] {
    fill: ${(p) => p.theme.color[getColor(p.status)]};
  }

  ${(p) => (p.status === 'Queue' || !p.showHover ? disabledStyles : hoveredFileTypeIconCss)};

  &:focus-visible {
    outline-offset: 2px;
    outline: ${(p) => p.theme.color['Primary/Primary 60 Main']} solid 2px;
  }
`;

const StyledEyeOutline = styled(EyeOutline)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: ${FILE_ITEM_FUNCTIONAL_ICON_SIZE_XL};
  height: ${FILE_ITEM_FUNCTIONAL_ICON_SIZE_XL};
  visibility: hidden;

  & *[fill^='#'] {
    fill: ${(p) => p.theme.color['Special/Static White']};
  }
`;

const Content = styled.div<{ dimension?: FileInputDimension }>`
  ${(p) => p.dimension === 'm' && sizeMixin};
  display: flex;
  flex-direction: ${(p) => (p.dimension === 'm' ? 'row' : 'column')};
  min-width: 0;
  overflow: hidden;
`;

const FileInfoBlock = styled.div<{ dimension?: FileInputDimension }>`
  display: ${(p) => (p.dimension === 'm' ? 'block' : 'flex')};
  box-sizing: border-box;
  align-items: center;
  overflow: hidden;
  height: ${(p) => (p.dimension === 'xl' ? '40px' : '20px')};
  padding: ${(p) => (p.dimension === 'xl' ? FILE_ITEM_WRAPPER_PADDING_XL : FILE_ITEM_WRAPPER_PADDING_M)};
  height: ${(p) => (p.dimension === 'xl' ? FILE_ITEM_WRAPPER_HEIGHT_XL : FILE_ITEM_WRAPPER_HEIGHT_M)};
`;

const FileName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const FileInfo = styled.span<{ dimension?: FileInputDimension; status?: Status }>`
  color: ${(p) => p.theme.color[getColor(p.status)]};
  margin-left: ${(p) => (p.dimension === 'xl' ? '0' : '4px')};
  white-space: nowrap;
`;

const FunctionalBlock = styled.div`
  display: flex;
  flex: 0 0 auto;
  margin-left: 8px;
  align-items: center;
`;

const functionalItemSizeMixin = css<{ dimension?: FileInputDimension }>`
  width: ${(p) => (p.dimension === 'xl' ? FILE_ITEM_FUNCTIONAL_ICON_SIZE_XL : FILE_ITEM_FUNCTIONAL_ICON_SIZE_M)};
  height: ${(p) => (p.dimension === 'xl' ? FILE_ITEM_FUNCTIONAL_ICON_SIZE_XL : FILE_ITEM_FUNCTIONAL_ICON_SIZE_M)};
`;

const StyledSpinner = styled(Spinner)<{ dimension?: FileInputDimension }>`
  margin-right: 8px;
  ${functionalItemSizeMixin}
`;

export const ErrorBlock = styled.div<{ status?: Status; dimension?: FileInputDimension }>`
  margin-top: 8px;
  color: ${(p) => p.theme.color['Error/Error 60 Main']};
  ${typography['Body/Body 2 Short']};
  height: ${(p) => (p.dimension === 'xl' ? ERROR_BLOCK_HEIGHT_XL : ERROR_BLOCK_HEIGHT_M)};
`;

const CloseButton = styled(CloseIconPlacementButton)<{ dimension?: IconPlacementDimension }>`
  margin-right: ${(p) => (p.dimension === 'lSmall' ? '8px' : '16px')};
`;

export interface FileAttributeProps {
  fileId: string;
  /** Имя файла без расширения */
  fileName: string;
  /** Тип файла */
  fileType: string;
  /** Размер файла */
  fileSize: number;
  /** Статус компонента, имеет четыре состояния: Uploaded, Loading, Error, Queue */
  status?: Status;
  /** Текст ошибки при загрузке файла */
  errorMessage?: string;
  /** URL для отображения миниатюры картинки вместо иконки типа документа в формате XL */
  previewImageURL?: string;
  /** Обработчик клика по CloseIcon */
  onCloseIconClick?: (fileId: string) => void;
  /** Обработчик клика по иконке документа */
  onPreviewIconClick?: (fileId: string) => void;
}

export interface FileItemProps extends HTMLAttributes<HTMLDivElement>, FileAttributeProps {
  /** Размер FileItem */
  dimension?: FileInputDimension;
  /** Позволяет добавлять миксин для компоновки загруженных файлов, созданный с помощью styled css */
  filesLayoutCssMixin?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
  /** Позволяет выводить размер файла в требуемом формате */
  formatFileSizeInfo?: (sizeInBytes: number) => string;
  /** Позволяет назначать формат файла */
  formatFileTypeInfo?: (type: string) => string;
  /** Позволяет назначать иконку файла */
  formatFileTypeIcon?: (type: string) => React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  children?: never;
}

export const FileItem = forwardRef<HTMLDivElement, FileItemProps>(
  (
    {
      fileId,
      fileName,
      fileType,
      fileSize,
      status,
      errorMessage,
      previewImageURL,
      onCloseIconClick,
      onPreviewIconClick,
      dimension,
      filesLayoutCssMixin,
      formatFileSizeInfo = formatFileSize,
      formatFileTypeInfo = formatFileType,
      formatFileTypeIcon = getFileTypeIcon,
      ...props
    },
    ref,
  ) => {
    const PreviewIcon = formatFileTypeIcon(fileType);
    const fileFormatInfo = formatFileTypeInfo(fileType);
    const fileSizeInfo = formatFileSizeInfo(fileSize);
    const fileInfo = `${fileFormatInfo}・${fileSizeInfo}`;

    const previewWrapperRef = useRef<HTMLDivElement | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);

    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [fileNameOverflow, setFileNameOverflow] = React.useState(false);

    useEffect(() => {
      const element = titleRef.current;
      if (element && checkOverflow(element) !== fileNameOverflow) {
        setFileNameOverflow(checkOverflow(element));
      }
    }, [tooltipVisible, titleRef.current, setFileNameOverflow]);

    useEffect(() => {
      function show() {
        setTooltipVisible(true);
      }
      function hide() {
        setTooltipVisible(false);
      }
      const title = titleRef.current;
      if (title) {
        title.addEventListener('mouseenter', show);
        title.addEventListener('mouseleave', hide);
        return () => {
          title.removeEventListener('mouseenter', show);
          title.removeEventListener('mouseleave', hide);
        };
      }
    }, [setTooltipVisible, titleRef.current]);

    const handleCloseIconClick = () => {
      onCloseIconClick?.(fileId);
    };
    const handlePreviewIconClick = () => {
      onPreviewIconClick?.(fileId);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const code = keyboardKey.getCode(e);
      if (code === keyboardKey.Enter || code === keyboardKey[' ']) {
        onPreviewIconClick?.(fileId);
      }
    };

    return (
      <Container ref={ref} dimension={dimension} filesLayoutCssMixin={filesLayoutCssMixin}>
        <PreviewWrapper {...props} ref={previewWrapperRef} status={status} dimension={dimension}>
          <FileInfoBlock dimension={dimension}>
            {dimension === 'xl' && (
              <IconWrapper
                status={status}
                showHover={!!onPreviewIconClick}
                onClick={handlePreviewIconClick}
                onKeyDown={handleKeyDown}
                tabIndex={onPreviewIconClick ? 0 : -1}
              >
                {previewImageURL ? (
                  <ImagePreview>
                    <img src={previewImageURL} alt={''} />
                  </ImagePreview>
                ) : (
                  <PreviewIcon />
                )}
                <StyledEyeOutline />
              </IconWrapper>
            )}
            <Content dimension={dimension}>
              <FileName ref={titleRef}>{fileName}</FileName>
              {tooltipVisible && fileNameOverflow && (
                <Tooltip targetRef={previewWrapperRef} renderContent={() => `${fileName}`} />
              )}
              <FileInfo dimension={dimension} status={status}>
                {fileInfo}
              </FileInfo>
            </Content>
          </FileInfoBlock>
          <FunctionalBlock>
            {status === 'Loading' && <StyledSpinner dimension={dimension} />}
            {onCloseIconClick && (
              <CloseButton
                dimension={dimension === 'xl' ? 'lSmall' : 'mSmall'}
                disabled={status === 'Queue'}
                onClick={handleCloseIconClick}
              />
            )}
          </FunctionalBlock>
        </PreviewWrapper>
        {errorMessage && status === 'Error' && <ErrorBlock status={status}>{errorMessage}</ErrorBlock>}
      </Container>
    );
  },
);
