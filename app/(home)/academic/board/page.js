import PageTitle from "@/components/admin/common/PageTitle";
import AcademicProfileCard from "@/components/card/AcademicProfileCard";
import PaginationController from "@/components/common/PaginationController";
import constConfig from "@/configs/constConfig";

// Dummy Data
const profiles = [
  {
    image: "/carousel/carousel (1).jpg",
    name: "মোহাম্মদ আরিফুল ইসলাম",
    designation: "সভাপতি",
    address: "ঢাকা, বাংলাদেশ",
    contact: "+৮৮০ ১৭১১ ১২৩ ৪৫৬",
    profession: "ব্যবসায়ী",
  },
  {
    image: "/carousel/carousel (2).jpg",
    name: "সাবিনা আক্তার",
    designation: "সহ-সভাপতি",
    address: "চট্টগ্রাম, বাংলাদেশ",
    contact: "+৮৮০ ১৭২২ ১২৩ ৭৮৯",
    profession: "অধ্যাপক",
  },
  {
    image: "/carousel/carousel (3).jpg",
    name: "জহিরুল ইসলাম",
    designation: "সাধারণ সম্পাদক",
    address: "খুলনা, বাংলাদেশ",
    contact: "+৮৮০ ১৯১৩ ৪৫৬ ৭৮৯",
    profession: "সরকারি কর্মকর্তা",
  },
];

async function getData(page, pageSize) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedProfiles = profiles.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: paginatedProfiles, total: profiles.length });
    }, 1000); // Simulate a delay
  });
}

export default async function BoardPage({ searchParams }) {
  const currentPage = Number(searchParams['page'] ?? '1');
  const itemsPerPage = Number(searchParams['items'] ?? constConfig?.ItemsPerPage);

  const { data, total } = await getData(currentPage, itemsPerPage);
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
      <PageTitle title="পরিচালনা পরিষদ" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((profile, index) => (
          <div key={index} src={profile?.image}>
            <AcademicProfileCard profile={profile} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <PaginationController
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}
