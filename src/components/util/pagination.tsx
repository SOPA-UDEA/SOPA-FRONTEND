import { Pagination } from "@heroui/react";

interface Props{
    
}

export default function PaginationCustom (){

    return(
        <Pagination
            total={totalPages}
            initialPage={1}
            page={currentPage}
            onChange={}
            color="primary"
        />
    )
}