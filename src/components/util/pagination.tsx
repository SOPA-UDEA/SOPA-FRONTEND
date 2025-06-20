import { Pagination } from "@heroui/react";

interface Props{
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function PaginationCustom ({totalPages, currentPage, onPageChange}: Props){

    return(
        <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
        />
    );
}