import { css } from 'styled-components';

export const ICON_SIZE_XL = '40px';
export const ICON_SIZE_M = '24px';
export const ICON_MARGIN = '14px';
export const MIN_WIDTH_M = '288px';
export const MIN_WIDTH_XL = '320px';

export const disabledStyles = css`
  border: ${(p) => `1px dashed ${p.theme.color['Neutral/Neutral 30']}`};
  color: ${(p) => p.theme.color['Neutral/Neutral 30']};
  pointer-events: none;

  & svg {
    > * {
      fill: ${(p) => p.theme.color['Neutral/Neutral 30']};
    }
  }
`;

export const hoverStyles = css`
  &:hover {
    cursor: pointer;
    background: ${(p) => p.theme.color['Opacity/Hover']};
  }
  &:active {
    cursor: pointer;
    background: ${(p) => p.theme.color['Opacity/Press']};
  }
`;

export const dimensionMStyles = css`
  flex-direction: row;
  padding: 8px 0;
  justify-content: center;
`;

export const dimensionXLStyles = css`
  box-sizing: border-box;
  flex-direction: column;
  padding: 24px 0;
`;
