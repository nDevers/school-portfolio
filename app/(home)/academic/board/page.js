import PageTitle from "@/components/admin/common/PageTitle";
import AcademicProfileCard from "@/components/card/AcademicProfileCard";
import React from "react";

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

export default function BoardPage() {
  return (
    <div className="w-full h-full max-w-7xl mx-auto sp my-6 space-y-6">
      <PageTitle title="পরিচালনা পরিষদ" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {profiles.map((profile, index) => (
          <AcademicProfileCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}
