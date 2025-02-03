"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKeys: string[];
  name: string;
  addNewLink?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys,
  name,
  addNewLink,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    globalFilterFn: (row, _columnIds, filterValue) => {
      return searchKeys.some((key) => {
        const cellValue = row.getValue(key);
        return (
          cellValue &&
          String(cellValue).toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    },
  });

  const t = useTranslations("dataTable");

  return (
    <>
      <div className="flex flex-col items-center gap-4 px-5 py-4 sm:flex-row">
        <div className="flex-none order-1 text-xl font-medium text-start text-default-900 sm:order-none">
          {name}{" "}
          <span className="text-xs">
            ({data.length} {t("row")})
          </span>
        </div>

        <div className="flex flex-col justify-between flex-1 order-2 w-full gap-4 sm:flex-row sm:w-auto sm:order-none">
          <Input
            placeholder={`${t("search")} ...`}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full sm:max-w-sm"
          />

          {addNewLink && (
            <Link
              href={addNewLink}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm rounded-sm bg-primary text-secondary hover:bg-primary/90 sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="px-2">{t("addNew")}</span>
            </Link>
          )}
        </div>
      </div>
      <Separator />

      <div className="max-w-full">
        <Table className="w-full table-auto">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="whitespace-nowrap">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-1 text-xs text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-center">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="h-[75px] px-2 sm:px-4 py-2 sm:py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center"
                >
                  {t("noRecords")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:py-4 sm:px-10">
          <div className="text-sm text-center text-muted-foreground"></div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-20"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("previous")}
            </Button>
            {table.getPageOptions().map((page, pageIndex) => (
              <Button
                key={`basic-data-table-${pageIndex}`}
                onClick={() => table.setPageIndex(pageIndex)}
                size="sm"
                className={`hover:text-primary-foreground ${
                  table.getState().pagination.pageIndex === pageIndex
                    ? "bg-primary"
                    : "bg-secondary text-primary"
                }`}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-20"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
