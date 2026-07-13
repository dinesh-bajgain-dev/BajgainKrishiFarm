"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApiFetch } from "@/lib/api";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { useAdminLocale } from "@/lib/use-admin-locale";
import type { EntityConfig } from "@/components/admin/field-config/types";

function formatCellValue(value: unknown, yes: string, no: string): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? yes : no;
  const str = String(value);
  return str.length > 60 ? `${str.slice(0, 60)}…` : str;
}

export function AdminDataTable<T extends { id: string }>({
  config,
  allowCreate = true,
  allowDelete = true,
}: {
  config: EntityConfig<T>;
  allowCreate?: boolean;
  allowDelete?: boolean;
}) {
  const locale = useAdminLocale();
  const t = getAdminDictionary(locale);
  const [items, setItems] = useState<T[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await adminApiFetch<T[]>(config.apiPath);
      setItems(data);
    } catch {
      toast.error(t.dataTable.loadFailedToast(config.pluralName));
      setItems([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- state is set after an awaited fetch, not synchronously
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.apiPath]);

  async function handleDelete(id: string) {
    if (!confirm(t.dataTable.confirmDelete(config.name))) return;
    setDeletingId(id);
    try {
      await adminApiFetch(`${config.apiPath}${id}`, { method: "DELETE" });
      toast.success(t.dataTable.deletedToast(config.name));
      setItems((prev) => prev?.filter((item) => item.id !== id) ?? null);
    } catch {
      toast.error(t.dataTable.deleteFailedToast(config.name));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">{config.pluralName}</h1>
        {allowCreate && (
          <LinkButton href={`${config.adminPath}/new`} size="sm">
            <Plus className="size-4" /> {t.dataTable.newItem(config.name)}
          </LinkButton>
        )}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((col) => (
                <TableHead key={col}>
                  {config.fields.find((f) => f.key === col)?.label ?? col}
                </TableHead>
              ))}
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items === null &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {config.columns.map((col) => (
                    <TableCell key={col}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                  <TableCell />
                </TableRow>
              ))}
            {items !== null && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={config.columns.length + 1} className="py-10 text-center text-muted-foreground">
                  {t.dataTable.noItemsYet(config.pluralName)}
                </TableCell>
              </TableRow>
            )}
            {items?.map((item) => (
              <TableRow key={item.id}>
                {config.columns.map((col) => (
                  <TableCell key={col}>{formatCellValue(item[col], t.common.yes, t.common.no)}</TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={t.dataTable.actionsFor(config.getTitle(item))}
                        />
                      }
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem render={<Link href={`${config.adminPath}/${item.id}`} />}>
                        <Pencil className="size-4" /> {t.dataTable.edit}
                      </DropdownMenuItem>
                      {allowDelete && (
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="size-4" /> {t.dataTable.delete}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
