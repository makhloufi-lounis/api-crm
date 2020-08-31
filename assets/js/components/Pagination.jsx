import React from "react";

const Pagination = ({ currentPage, itemsPerPage, length, onPageChange }) => {
  // { currentPage, itemsPerPage, length, onPageChange } = props

  const pageCount = Math.ceil(length / itemsPerPage);
  const pages = [];
  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  return (
    <>
      <div>
        <ul className="pagination pagination-sm">
          <li className={"page-item" + (currentPage === 1 && " disabled")}>
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>
          {pages.map((page) => (
            <li
              className={"page-item" + (currentPage === page && " active")}
              key={page}
            >
              <button className="page-link" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li
            className={"page-item" + (currentPage === pageCount && " disabled")}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};

Pagination.getData = (items, currentPage, itemsPerPage) => {
  // d'ou on part (start) pendant combien (itemsPerPage)
  const start = currentPage * itemsPerPage - itemsPerPage;
  //     20   =      3      *       10     -       10
  return items.slice(start, start + itemsPerPage);
};

export default Pagination;
