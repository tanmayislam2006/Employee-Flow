import { useQuery } from "@tanstack/react-query";
import Loader from "../../../Components/Loader/Loader";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useState } from "react";
import PaginationList from "../../../Components/PaginatedList/PaginationList";

const Contacts = () => {
  const axiosSecure = useAxiosSecure();
  //  Simple local state
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 6,
  });
  const { page, perPageItem } = pageState;
  // Fetch messages
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contactMessages", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/contacts?item=${perPageItem}&page=${page}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const messages = data?.messages || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);
  // Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  if (messages.length === 0) {
    return <p className="text-center text-gray-500">No messages found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">
        Contact Messages
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-base-100 border rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="font-semibold text-primary">{msg.email}</div>
            <div className="text-sm">{msg.message}</div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationList
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Contacts;
