"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const FindDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ search, sort, page, limit: 9 });
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/doctors?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.doctors);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [search, sort, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Find Doctors</h1>

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          className="input input-bordered"
          placeholder="Search by name"
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
        <select
          className="select select-bordered"
          value={sort}
          onChange={(e) => { setPage(1); setSort(e.target.value); }}
        >
          <option value="">Sort by</option>
          <option value="fee-asc">Fee: Low to High</option>
          <option value="fee-desc">Fee: High to Low</option>
          <option value="experience-desc">Experience: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
     {doctors.map((doctor) => (
  <div key={doctor._id} className="card bg-base-100 shadow-md">
    <div className="card-body">
      <h2 className="card-title">{doctor.doctorName || doctor.name}</h2>
      <p className="text-sm text-gray-500">{doctor.specialization}</p>
      <p>Experience: {doctor.experienceYears ?? doctor.experience} yrs</p>
      <p>Fee: ${doctor.appointmentFee ?? doctor.fee}</p>
      <p>Rating: {doctor.rating} ⭐</p>
      <Link href={`/doctors/${doctor._id}`} className="btn btn-sm btn-primary mt-2">
        View Details
      </Link>
    </div>
  </div>
))}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-10">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline"}`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FindDoctorsPage;