import React from 'react'

/**
 * Polymorphic box component. Renders any HTML element via `as` prop.
 * Foundation for all other polymorphic components.
 *
 * @example <Box as="section" className="widget">Content</Box>
 * @example <Box as="button" onClick={fn}>Click</Box>
 */
export interface BoxProps<As extends React.ElementType = 'div'> {
  as?: As
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  [key: string]: any
}

/**
 * Renders any HTML element or component via the `as` prop.
 * Serves as the primitive building block for all polymorphic UI components.
 *
 * @param props.as - Element or component to render as (default: `'div'`)
 * @param props.className - CSS class name
 * @param props.style - Inline styles
 * @param props.children - Child content
 * @returns A polymorphic element
 */
export function Box<As extends React.ElementType = 'div'>({ as, children, className, style, ...props }: BoxProps<As>) {
  const Component = as || 'div'
  return <Component className={className} style={style} {...props}>{children}</Component>
}
