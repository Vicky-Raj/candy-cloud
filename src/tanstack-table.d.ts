import type { RowData, FilterFn } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Re-define ColumnMeta with your custom props
  // Ensure TData and TValue are used if you want to maintain some level of generic specificity globally,
  // though often for global augmentations, keeping it simple is also fine if local types are strong.
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "number-range" | "date-range";
    rangeMin?: number;
    rangeMax?: number;
    rangeStep?: number;
  }

  // Define custom filter function names
  // Using 'any' here for the generic type in the global declaration to ensure compatibility
  // across different specific table item types (Order, ReturnItem, CollectionItem).
  // The actual filter function implementations in each .tsx file will still be strongly typed.
  interface FilterFns {
    inDateRange: FilterFn<any>;
    inNumberRange: FilterFn<any>;
  }
}
