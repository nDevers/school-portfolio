import PageTitle from "@/components/admin/common/PageTitle";
import AcademicProfileCard from "@/components/card/AcademicProfileCard";
import PaginationController from "@/components/common/PaginationController";
import constConfig from "@/configs/constConfig";

// Dummy Data
const profiles = [
  {
    image: "/carousel/carousel (3).jpg",
    name: "ড. মো. সাদিকুল ইসলাম",
    designation: "প্রাক্তন প্রধান শিক্ষক, গণিত বিভাগ",
    address: "ঢাকা, বাংলাদেশ",
    contact: "+৮৮০ ১৭১১ ১২৩ ৪৫৬",
    profession: "অবসরপ্রাপ্ত প্রধান শিক্ষক",
  },
  {
    image: "/carousel/carousel (1).jpg",
    name: "সাবিনা আক্তার",
    designation: "প্রাক্তন প্রধান শিক্ষক, ইংরেজি বিভাগ",
    address: "চট্টগ্রাম, বাংলাদেশ",
    contact: "+৮৮০ ১৭২২ ১২৩ ৭৮৯",
    profession: "অবসরপ্রাপ্ত প্রধান শিক্ষক",
  },
  {
    image: "/carousel/carousel (3).jpg",
    name: "অধ্যাপক মোহাম্মদ আলী",
    designation: "প্রাক্তন প্রধান শিক্ষক, ইতিহাস বিভাগ",
    address: "খুলনা, বাংলাদেশ",
    contact: "+৮৮০ ১৯১৩ ৪৫৬ ৭৮৯",
    profession: "অবসরপ্রাপ্ত প্রধান শিক্ষক",
  },
  {
    image: "/carousel/carousel (4).jpg",
    name: "এনামুল হক",
    designation: "প্রাক্তন প্রধান শিক্ষক, কম্পিউটার বিজ্ঞান বিভাগ",
    address: "রাজশাহী, বাংলাদেশ",
    contact: "+৮৮০ ১৭৩৩ ১২৩ ৫৬৭",
    profession: "অবসরপ্রাপ্ত প্রধান শিক্ষক",
  },
  {
    image: "/carousel/carousel (1).jpg",
    name: "রেহেনা আক্তার",
    designation: "প্রাক্তন প্রধান শিক্ষক, পদার্থবিদ্যা বিভাগ",
    address: "বরিশাল, বাংলাদেশ",
    contact: "+৮৮০ ১৭৬৬ ১২৩ ৮৯০",
    profession: "অবসরপ্রাপ্ত প্রধান শিক্ষক",
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

export default async function TeacherExPage({ searchParams }) {
  const currentPage = Number(searchParams['page'] ?? '1');
  const itemsPerPage = Number(searchParams['items'] ?? constConfig?.ItemsPerPage);

  const { data, total } = await getData(currentPage, itemsPerPage);
  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
      <PageTitle title="প্রাক্তন প্রধান শিক্ষক" />
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
