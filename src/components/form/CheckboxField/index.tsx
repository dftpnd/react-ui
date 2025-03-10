import * as React from 'react';
import styled, { css } from 'styled-components';
import { typography } from '#src/components/Typography';
import type { CheckBoxProps } from '#src/components/Checkbox';
import { Checkbox } from '#src/components/Checkbox';
import type { CheckboxDimension } from '#src/components/Checkbox/CheckboxDimension';
import { passFormFieldContainerDataAttributes } from '#src/components/common/utils/splitDataAttributes';

export interface CheckboxFieldProps extends Omit<CheckBoxProps, 'children'> {
  /** Текст будет виден ниже компонента */
  extraText?: React.ReactNode;

  /** Текст или компонент для рендеринга лейбла */
  children?: React.ReactNode;
}

export const width = css<{ dimension: CheckboxDimension }>`
  width: ${({ dimension }) => {
    switch (dimension) {
      case 'm':
        return '20px';
      case 's':
        return '16px';
      default:
        return '20px';
    }
  }};

  fieldset[data-dimension='s'] & {
    width: 16px;
  }
`;

export const height = css<{ dimension: CheckboxDimension }>`
  height: ${({ dimension }) => {
    switch (dimension) {
      case 'm':
        return '20px';
      case 's':
        return '16px';
      default:
        return '20px';
    }
  }};

  fieldset[data-dimension='s'] & {
    height: 16px;
  }
`;

const PositionedCheckbox = styled(Checkbox)`
  position: absolute;
  top: 2px;
  left: 2px;
`;

const Label = styled.label<{
  dimension: CheckboxDimension;
  disabled?: boolean;
}>`
  display: inline-block;
  position: relative;
  padding-top: 2px;
  padding-bottom: 2px;

  padding-left: ${(props) => (props.dimension === 's' ? 28 : 32)}px;

  ${(props) => (props.dimension === 's' ? typography['Body/Body 2 Short'] : typography['Body/Body 1 Short'])}
  fieldset[data-dimension='s'] & {
    padding-left: 28px;
    ${typography['Body/Body 2 Short']}
  }

  color: ${(props) =>
    props.disabled ? props.theme.color['Neutral/Neutral 30'] : props.theme.color['Neutral/Neutral 90']};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  fieldset:disabled & {
    color: ${(props) => props.theme.color['Neutral/Neutral 30']};
    cursor: default;
  }
`;

const ExtrasContainer = styled.div<{
  dimension: CheckboxDimension;
}>`
  padding-top: 4px;

  ${(props) => (props.dimension === 's' ? typography['Caption/Caption 1'] : typography['Body/Body 2 Short'])}
  fieldset[data-dimension='s'] & {
    ${typography['Caption/Caption 1']}
  }

  color: ${(props) => props.theme.color['Neutral/Neutral 50']};

  [disabled] & {
    color: ${(props) => props.theme.color['Neutral/Neutral 30']};
  }
`;

export const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ extraText, className, children, dimension = 'm', ...props }, ref) => {
    const fieldContainerProps = {} as Record<string, any>;
    passFormFieldContainerDataAttributes(props, fieldContainerProps);

    return (
      <Label className={className} dimension={dimension} disabled={props.disabled} {...fieldContainerProps}>
        <PositionedCheckbox dimension={dimension} ref={ref} {...props} />
        {children}
        {extraText && <ExtrasContainer dimension={dimension} children={extraText} />}
      </Label>
    );
  },
);

CheckboxField.displayName = 'CheckboxField';
