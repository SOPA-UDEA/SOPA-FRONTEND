import { Pagination } from "@heroui/react";

interface PaginationProps {
  total?: number;
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export default function PaginationCustom({
  total = 1,
  initialPage = 1,
  onPageChange,
}: PaginationProps) {
  return (
    <Pagination
      total={total}
      initialPage={initialPage}
      onChange={onPageChange}
      color="primary"
    />
  );
}
