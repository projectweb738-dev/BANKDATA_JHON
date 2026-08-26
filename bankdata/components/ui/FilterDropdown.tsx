'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  paramName: string;
  options?: Option[];
  defaultValue: string;
  type?: 'select' | 'date' | 'number' | 'text';
  className?: string;
  placeholder?: string;
}

export default function FilterDropdown({
  paramName,
  options = [],
  defaultValue,
  type = 'select',
  className = 'form-input w-auto',
  placeholder = 'Semua',
}: FilterDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const applyFilter = (val: string) => {
    const url = new URL(window.location.href);
    if (val) {
      url.searchParams.set(paramName, val);
    } else {
      url.searchParams.delete(paramName);
    }
    url.searchParams.delete('page');
    router.push(`${pathname}?${url.searchParams.toString()}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);

    // Untuk select, langsung apply. Untuk input text/number/date, debounce
    if (type === 'select') {
      applyFilter(val);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => applyFilter(val), 400);
    }
  };

  if (type === 'date' || type === 'number' || type === 'text') {
    return (
      <input
        type={type}
        value={value}
        className={className}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  }

  return (
    <select value={value} className={className} onChange={handleChange}>
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
