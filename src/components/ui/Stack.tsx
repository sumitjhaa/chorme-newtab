import React from 'react'
import { Box, BoxProps } from './Box'

/**
 * Props for the polymorphic Stack component.
 */
export interface StackProps<As extends React.ElementType = 'div'> extends BoxProps<As> {
  /** Flex direction — `'row'` or `'column'` (default: `'column'`). */
  direction?: 'row' | 'column'
  /** Gap between items (number in px or CSS string). */
  gap?: number | string
  /** Alignment along the cross axis. */
  align?: React.CSSProperties['alignItems']
  /** Alignment along the main axis. */
  justify?: React.CSSProperties['justifyContent']
  /** Whether items should wrap onto multiple lines. */
  wrap?: boolean
}

/**
 * Polymorphic flex container. Wraps `Box` with convenient flex layout props.
 *
 * @example <Stack direction="row" gap={8} align="center">Items</Stack>
 * @example <Stack as="nav" direction="column" gap={4}>Links</Stack>
 */
export function Stack<As extends React.ElementType = 'div'>({
  direction = 'column', gap, align, justify, wrap, style, ...props
}: StackProps<As>) {
  const computedStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? 'wrap' : undefined,
    ...style
  }
  return <Box style={computedStyle} {...props} />
}
