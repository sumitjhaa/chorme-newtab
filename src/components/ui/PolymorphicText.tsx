import React from 'react'
import { Box, BoxProps } from './Box'

/**
 * Props for the polymorphic PolymorphicText component.
 */
export interface TextProps<As extends React.ElementType = 'span'> extends BoxProps<As> {
  /** Font size preset — `'xs'` through `'3xl'`. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  /** Font weight. */
  weight?: 'normal' | 'medium' | 'bold'
  /** Text color (CSS color value). */
  color?: string
  /** Element or component to render as (default: `'span'`). */
  as?: As
}

const sizes: Record<string, string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem'
}

/**
 * Polymorphic text component with built-in size, weight, and color presets.
 * Renders as `<span>` by default.
 *
 * @example <PolymorphicText size="lg" weight="bold">Hello</PolymorphicText>
 * @example <PolymorphicText as="p" size="sm" color="#888">Subtitle</PolymorphicText>
 */
export function PolymorphicText<As extends React.ElementType = 'span'>({
  size = 'md', weight = 'normal', color, style, ...props
}: TextProps<As>) {
  const computedStyle: React.CSSProperties = {
    fontSize: sizes[size],
    fontWeight: weight,
    color,
    ...style
  }
  return <Box style={computedStyle} {...props} />
}
