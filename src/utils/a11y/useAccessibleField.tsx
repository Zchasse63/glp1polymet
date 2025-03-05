
/**
 * Hook to provide form field accessibility attributes
 */
export function useAccessibleField(id: string, required: boolean = false) {
  return {
    inputProps: {
      id,
      'aria-required': required,
    },
    labelProps: {
      htmlFor: id,
      className: 'block text-sm font-medium mb-1'
    },
    getErrorProps: (error?: string) => ({
      id: `${id}-error`,
      role: 'alert',
      className: 'text-sm text-red-500 mt-1'
    }),
    getDescriptionProps: () => ({
      id: `${id}-description`,
      className: 'text-sm text-muted-foreground mt-1'
    })
  };
}
