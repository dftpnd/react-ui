import styled, { css } from 'styled-components';
import type { CheckboxDimension } from '#src/components/Checkbox/CheckboxDimension';
import { TYPOGRAPHY } from '#src/components/Typography';

export const styleTextMixin = css<{ dimension: CheckboxDimension; disabled?: boolean }>`
  font-size: ${({ dimension }) => (dimension === 'm' ? 16 : 14)}px;
  line-height: ${({ dimension }) => (dimension === 'm' ? 20 : 16)}px;
  font-weight: normal;
  font-family: ${TYPOGRAPHY.fontFamily};
  color: ${({ disabled, theme }) => (disabled ? theme.color['Neutral/Neutral 30'] : theme.color['Neutral/Neutral 90'])};
  user-select: none;
`;

export const Label = styled.label<{ dimension: CheckboxDimension; disabled?: boolean }>`
  display: flex;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  width: fit-content;
  ${styleTextMixin};
`;
