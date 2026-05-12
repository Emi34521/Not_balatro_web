import './Button.css'

/**
 * Componente Button reutilizable.
 *
 * Props:
 *  - variant: 'primary' | 'danger' | 'ghost' | 'outline'
 *             primary → acción principal (Play Hand)
 *             danger  → acción destructiva (Discard)
 *             ghost   → acciones secundarias (Sort, Nueva mano)
 *             outline → opciones de configuración (Dificultad, Deck)
 *  - size: 'sm' | 'md' | 'lg'  (default: 'md')
 *  - icon: node opcional que se renderiza a la izquierda del texto
 *  - iconPosition: 'left' | 'right'  (default: 'left')
 *  - disabled: boolean
 *  - fullWidth: boolean
 *  - onClick: fn
 *  - children: contenido del botón
 *  - className: clases extra
 */
export function Button({
  variant = 'ghost',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    icon && !children ? 'btn--icon-only' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span className="btn__icon">{icon}</span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {icon && iconPosition === 'right' && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  )
}