"use client";

import { useState } from "react";
import { ColumnDef, useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";


interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  pageSize?: number;
}

export default function DataTable<TData>({ columns, data, pageSize=10 }: DataTableProps<TData>) {
  // const [deleteId, setDeleteId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  });
  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(data.length / pageSize),
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto relative">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-white">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="p-2 text-center border-x-2 border-t-2 text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-white hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="p-2 text-center border-x-2 align-middle"
                    >
                      <div className="break-words">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="text-center p-4"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
        <Button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-full sm:w-auto bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]"
        >
          Trang trước
        </Button>
        <span className="text-sm">
          Trang {table.getState().pagination.pageIndex + 1} của {table.getPageCount()}
        </span>
        <Button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-full sm:w-auto bg-[#ff025b] p-2 rounded-lg hover:bg-[#d8064b]"
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
