// PaginationList.jsx
const PaginationList = ({
  page,
  totalPages,
  handlePageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        className="btn btn-sm btn-outline btn-primary"
        disabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>

      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>

      <button
        className="btn btn-sm btn-outline btn-primary"
        disabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationList;
