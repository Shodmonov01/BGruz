import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const columns = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Операция",
    accessorKey: "operation",
  },
  {
    header: "Дата погрузки",
    accessorKey: "date",
  },
  {
    header: "Терминал 1",
    accessorKey: "terminal1",
  },
];

const data = [
  {
    id: "23342",
    operation: "Погрузка",
    date: "21.07.2024",
    terminal1: "Контейнер",
  },
];

export default function BidsTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
        <Table className="border rounded-lg border-gray-300 w-full">
      <TableHeader>
        <TableRow className="border border-gray-300">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="border border-gray-300 p-2">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))
          )}
        </TableRow>
        <TableRow className="border border-gray-300">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <TableHead key={header.id} className="border border-gray-300 p-2">
                {header.column.columnDef.accessorKey ? (
                  <input type="text" placeholder="Поиск" className="border border-gray-300 p-1 text-xs w-full" />
                ) : null}
              </TableHead>
            ))
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} className="border border-gray-300">
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="border border-gray-300 p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
