import fs from "node:fs/promises";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PrintsList } from "@/components/ui/prints-list";

const PRINTS_PER_PAGE = 9;

type PageItem = number | "ellipsis";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];

  const leftSibling = Math.max(currentPage - 1, 2);
  const rightSibling = Math.min(currentPage + 1, totalPages - 1);

  if (leftSibling > 2) {
    items.push("ellipsis");
  }

  for (let page = leftSibling; page <= rightSibling; page++) {
    items.push(page);
  }

  if (rightSibling < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);

  return items;
}

type PrintsPageProps = {
  searchParams: {
    page?: string;
  };
};

export default async function PrintsPage({
  searchParams,
}: PrintsPageProps) {
  const file = await fs.readFile(
    process.cwd() + "/public/content.json",
    "utf-8",
  );

  const data = JSON.parse(file);

  const totalPages = Math.max(
    1,
    Math.ceil(data.length / PRINTS_PER_PAGE),
  );

  const page = searchParams;
  const parsedPage = Number(page);

  const currentPage =
    Number.isInteger(parsedPage) &&
    parsedPage >= 1 &&
    parsedPage <= totalPages
      ? parsedPage
      : 1;

  const startIndex = (currentPage - 1) * PRINTS_PER_PAGE;
  const paginatedPrints = data.slice(
    startIndex,
    startIndex + PRINTS_PER_PAGE,
  );

  const paginationItems = getPaginationItems(
    currentPage,
    totalPages,
  );

  const getPageHref = (page: number) =>
    page === 1 ? "?" : `?page=${page}`;

  return (
    <div className="pb-8">
      <h1 className="mb-8 text-center text-3xl font-bold leading-none tracking-tight text-foreground">
        All prints
      </h1>

      <PrintsList prints={paginatedPrints} />

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={getPageHref(Math.max(1, currentPage - 1))}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>

            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={getPageHref(item)}
                    isActive={item === currentPage}
                    aria-label={`Go to page ${item}`}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={getPageHref(
                  Math.min(totalPages, currentPage + 1),
                )}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
