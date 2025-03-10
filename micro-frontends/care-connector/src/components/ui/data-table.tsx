import React from 'react';
import { cn } from '@/lib/utils';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: string;
    cell?: (item: T) => React.ReactNode;
  }[];
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  className,
  emptyMessage = 'No data available'
}: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-auto', className)}>
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-800/50">
            {columns.map((column, index) => (
              <th
                key={index}
                className="h-12 px-4 text-left align-middle font-medium text-gray-500 dark:text-gray-400 [&:has([role=checkbox])]:pr-0"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-800/50"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                >
                  {column.cell
                    ? column.cell(row)
                    : (row as any)[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 