import React, { useState, useCallback, useMemo } from "react";

interface UseFormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Record<string, string>;
}

export function useForm<T extends Record<string, any>>({ initialValues, validate }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const handleSubmit = useCallback((onSubmit: (values: T) => void) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }
    onSubmit(values);
  }, [values, validate]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    isDirty,
    setValues,
  };
}
