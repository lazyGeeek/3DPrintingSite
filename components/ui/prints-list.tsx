"use client";

import { useMemo, useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PrintCard } from "@/components/ui/print-card"
import { PrintType } from "@/components/ui/print-type"

type Prints = {
    prints: PrintType[];
}

const ITEMS_PER_PAGE = 9;

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis-end", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      "ellipsis-start",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ];
}

export const PrintsList = ({ prints }: Prints) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(prints.length / ITEMS_PER_PAGE);

  const visiblePrints = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return prints.slice(startIndex, endIndex);
  }, [currentPage, prints]);

  const paginationItems = getPaginationItems(currentPage, totalPages);

  function changePage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    setCurrentPage(page);

    // Keep the list visible after changing pages.
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (prints.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No prints found.
      </p>
    );
  }
    return (
    <div className="space-y-8">
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        { visiblePrints.map((print, key)=>{
            return (
            <li key={key}>
                <PrintCard print={print} />
              </li>
            );
          })}
        </ul>
        {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  changePage(currentPage - 1);
                }}
              />
            </PaginationItem>

            {paginationItems.map((item) => {
              if (item === "ellipsis-start") {
                return (
                  <PaginationItem key="ellipsis-start">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              if (item === "ellipsis-end") {
                return (
                  <PaginationItem key="ellipsis-end">
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={item}>
                  <PaginationLink
                    href="#"
                    isActive={item === currentPage}
                    aria-label={`Go to page ${item}`}
                    aria-current={item === currentPage ? "page" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      changePage(item);
                    }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();
                  changePage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};