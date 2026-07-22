// @ts-nocheck
export default function ToggleSwitch({
  label,
  id,
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className = "",
  ...props
}) {
  const labelId = id ? `${id}-label` : undefined;

  return (
    <div className={`toggle-wrapper ${className}`}>
      {label && (
        <span id={labelId} className="toggle-label">
          {label}
        </span>
      )}

      <label className="toggle">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          aria-labelledby={labelId}
          {...props}
        />

        <span className="toggle-track">
          <span className="toggle-text-on">I</span>
          <span className="toggle-thumb" />
          <span className="toggle-text-off">O</span>
        </span>
      </label>
    </div>
  );
}
