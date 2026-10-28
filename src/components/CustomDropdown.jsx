import { useState, useRef, useEffect } from 'react';
import styles from '@/styles/CustomDropdown.module.css';

const CustomDropdown = ({ options, value, onChange, placeholder = 'Select...', label, filterKey = null }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => {
    const label = filterKey ? opt[filterKey] : opt;
    if (typeof label !== 'string') return false;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={styles.dropdown} ref={ref}>
      {label && <label className={styles.label}>{label}</label>}
      {/* Open-only: focus already opens it, so toggling here closed it again on the same click */}
      <div className={styles.inputBox} onClick={() => setOpen(true)}>
        <input
          className={styles.input}
          value={search || value || ''}
          onChange={e => {
            setSearch(e.target.value);
            setOpen(true);
            onChange('');
          }}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
        />
        <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className={styles.options}>
          {filteredOptions.length === 0 ? (
            <div className={styles.option}>No results</div>
          ) : (
            filteredOptions.map((opt, idx) => {
              const labelVal = filterKey ? opt[filterKey] : opt;
              return (
                <div
                  key={idx}
                  className={styles.option}
                  onClick={() => {
                    onChange(labelVal);
                    setSearch(labelVal);
                    setOpen(false);
                  }}
                >
                  {labelVal}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
