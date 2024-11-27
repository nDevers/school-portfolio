'use client'
import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { HiSearch } from 'react-icons/hi';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { useState } from 'react';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';

const membersData = [
    {
        id: 1,
        name: 'John Doe',
        memberType: 'Trustee',
        memberNumber: 'T001',
        email: 'john.doe@example.com',
        phone: '0123456789',
        dob: '1990-05-15',
        address: '123 Elm Street, Dhaka',
        dateJoined: '2022-01-15',
        membershipStatus: 'Active',
    },
    {
        id: 2,
        name: 'Jane Smith',
        memberType: 'Donate',
        memberNumber: 'D002',
        email: 'jane.smith@example.com',
        phone: '0198765432',
        dob: '1988-08-23',
        address: '456 Maple Avenue, Chittagong',
        dateJoined: '2021-03-20',
        membershipStatus: 'Active',
    },
    {
        id: 3,
        name: 'Michael Johnson',
        memberType: 'Honorable',
        memberNumber: 'H003',
        email: 'michael.j@example.com',
        phone: '0159988776',
        dob: '1995-12-11',
        address: '789 Oak Drive, Sylhet',
        dateJoined: '2023-06-05',
        membershipStatus: 'Active',
    },
    {
        id: 4,
        name: 'Sara Lee',
        memberType: 'General',
        memberNumber: 'G004',
        email: 'sara.lee@example.com',
        phone: '01711223344',
        dob: '1982-02-10',
        address: '101 Pine Road, Dhaka',
        dateJoined: '2019-11-22',
        membershipStatus: 'Active',
    },
    {
        id: 5,
        name: 'David Wong',
        memberType: 'Donate',
        memberNumber: 'D005',
        email: 'david.wong@example.com',
        phone: '01822334455',
        dob: '1993-07-18',
        address: '303 Birch Lane, Khulna',
        dateJoined: '2020-09-17',
        membershipStatus: 'Active',
    },
    {
        id: 6,
        name: 'Emily Zhang',
        memberType: 'Honorable',
        memberNumber: 'H006',
        email: 'emily.zhang@example.com',
        phone: '01456789012',
        dob: '1968-05-12',
        address: '505 Cedar Street, Barishal',
        dateJoined: '2018-04-25',
        membershipStatus: 'Honorary',
    },
    {
        id: 7,
        name: 'Alex Patel',
        memberType: 'Trustee',
        memberNumber: 'T007',
        email: 'alex.patel@example.com',
        phone: '01766778899',
        dob: '1991-03-14',
        address: '907 Willow Road, Gazipur',
        dateJoined: '2022-07-10',
        membershipStatus: 'Active',
    },
    {
        id: 8,
        name: 'Sophia Ahmed',
        memberType: 'General',
        memberNumber: 'G008',
        email: 'sophia.ahmed@example.com',
        phone: '01923456789',
        dob: '1987-11-30',
        address: '801 Palm Avenue, Dhaka',
        dateJoined: '2021-01-04',
        membershipStatus: 'Active',
    },
    {
        id: 9,
        name: 'Henry Wilson',
        memberType: 'Donate',
        memberNumber: 'D009',
        email: 'henry.wilson@example.com',
        phone: '01599887766',
        dob: '1996-09-27',
        address: '402 Walnut Street, Rangpur',
        dateJoined: '2023-03-18',
        membershipStatus: 'Active',
    },
    {
        id: 10,
        name: 'Olivia Carter',
        memberType: 'Trustee',
        memberNumber: 'T010',
        email: 'olivia.carter@example.com',
        phone: '01811223344',
        dob: '1992-12-05',
        address: '209 Ash Lane, Mymensingh',
        dateJoined: '2020-11-09',
        membershipStatus: 'Active',
    },
    {
        id: 11,
        name: 'Noah Brooks',
        memberType: 'General',
        memberNumber: 'G011',
        email: 'noah.brooks@example.com',
        phone: '01744556677',
        dob: '1978-04-25',
        address: '600 Elmwood Drive, Narayanganj',
        dateJoined: '2015-10-30',
        membershipStatus: 'Active',
    },
    {
        id: 12,
        name: 'Ava Kim',
        memberType: 'Honorable',
        memberNumber: 'H012',
        email: 'ava.kim@example.com',
        phone: '01433445566',
        dob: '1955-02-12',
        address: '302 Spruce Circle, Rajshahi',
        dateJoined: '2017-09-15',
        membershipStatus: 'Honorary',
    },
    {
        id: 13,
        name: 'Liam Taylor',
        memberType: 'Donate',
        memberNumber: 'D013',
        email: 'liam.taylor@example.com',
        phone: '01955667788',
        dob: '1990-08-22',
        address: '505 Chestnut Avenue, Sylhet',
        dateJoined: '2022-05-12',
        membershipStatus: 'Active',
    },
    {
        id: 14,
        name: 'Mia Hill',
        memberType: 'Trustee',
        memberNumber: 'T014',
        email: 'mia.hill@example.com',
        phone: '01733445566',
        dob: '1985-06-07',
        address: '403 Redwood Street, Dhaka',
        dateJoined: '2020-02-27',
        membershipStatus: 'Active',
    },
    {
        id: 15,
        name: 'James Khan',
        memberType: 'General',
        memberNumber: 'G015',
        email: 'james.khan@example.com',
        phone: '01644556677',
        dob: '1997-10-13',
        address: '907 Willow Road, Comilla',
        dateJoined: '2023-07-21',
        membershipStatus: 'Active',
    },
    {
        id: 16,
        name: 'Grace Lee',
        memberType: 'Donate',
        memberNumber: 'D016',
        email: 'grace.lee@example.com',
        phone: '01988776655',
        dob: '1993-04-19',
        address: '209 Oakwood Lane, Dhaka',
        dateJoined: '2020-08-14',
        membershipStatus: 'Active',
    },
    {
        id: 17,
        name: 'Elijah Clark',
        memberType: 'Trustee',
        memberNumber: 'T017',
        email: 'elijah.clark@example.com',
        phone: '01677889900',
        dob: '1981-01-22',
        address: '609 Cedar Circle, Khulna',
        dateJoined: '2018-05-20',
        membershipStatus: 'Active',
    },
    {
        id: 18,
        name: 'Zara Watson',
        memberType: 'Honorable',
        memberNumber: 'H018',
        email: 'zara.watson@example.com',
        phone: '01722334455',
        dob: '1970-03-18',
        address: '103 Cypress Lane, Dhaka',
        dateJoined: '2019-12-11',
        membershipStatus: 'Honorary',
    },
    {
        id: 19,
        name: 'Lucas Davis',
        memberType: 'General',
        memberNumber: 'G019',
        email: 'lucas.davis@example.com',
        phone: '01599887722',
        dob: '1992-11-05',
        address: '708 Sycamore Street, Chittagong',
        dateJoined: '2022-04-18',
        membershipStatus: 'Active',
    },
    {
        id: 20,
        name: 'Chloe White',
        memberType: 'Trustee',
        memberNumber: 'T020',
        email: 'chloe.white@example.com',
        phone: '01844556677',
        dob: '1986-09-03',
        address: '304 Birch Avenue, Dhaka',
        dateJoined: '2020-03-19',
        membershipStatus: 'Active',
    }
];

const memberType = [
    {
        id: 1,
        type: 'Trustee'
    },
    {
        id: 2,
        type: 'Donate'
    },
    {
        id: 3,
        type: 'Honorable'
    },
    {
        id: 4,
        type: 'General'
    }
];

export default function MemberList() {

    const [foundMember, setFoundMember] = useState(null); // To hold the search result
    const [noMemberFound, setNoMemberFound] = useState(false); // To handle the "no result" case

    const initialValues = {
        memberType: '',
        memberNumber: '',
    }

    const validationSchema = Yup.object({
        memberType: Yup.string().required('Required field'),
        memberNumber: Yup.string().required('Required field'),
    });
    
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => search(values),
    });
    
    const search = (params) => {
        const { memberType, memberNumber } = params;

        // Simulating API call by filtering through membersData
        const filteredMember = membersData.find(
            (member) => member.memberType === memberType && member.memberNumber === memberNumber
        );

        if (filteredMember) {
            setFoundMember(filteredMember); // Store the found member's details
            setNoMemberFound(false); // Reset the "no member found" flag
            toast.success(`Member Found: ${filteredMember.name}`);
        } else {
            setFoundMember(null); // Clear the previous result
            setNoMemberFound(true); // Set the "no member found" flag
            toast.error('No member found with the given details');
        }
    };

    const reset = () => {
        formik?.resetForm();
        setFoundMember(null); // Clear the result when reset
        setNoMemberFound(false); // Reset the "no member found" flag
    };
    
    return (
        <div className='w-full space-y-4'>
            <div className="flex items-end justify-end">
                <div className='flex items-center space-x-2'>
                    <Switch id="advanceSearch" />
                    <Label htmlFor="advanceSearch">Advance Search</Label>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit} className='w-full'>
                <div className='grid md:grid-cols-4 gap-2 w-full'>
                    <InputWrapper
                        label="Member Type"
                        error={formik.errors?.memberType}
                        touched={formik.touched?.memberType}
                    >
                        <ComboboxFormik
                            select="type"
                            display="type"
                            name="memberType"
                            formik={formik}
                            data={memberType}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Member Number"
                        error={formik.errors?.memberNumber}
                        touched={formik.touched?.memberNumber}
                    >
                        <Input
                            name="memberNumber"
                            placeholder="e.g., A-0001"
                            value={formik.values?.memberNumber}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>

                <div className='flex items-center space-x-2'>
                    <Reset onClick={reset}/>
                    <Submit label='Find' icon={<HiSearch/>}/>
                </div>
            </form>

            <div className='min-h-96'>
                {/* Render member details if found */}
                {foundMember && (
                    <div className="mt-4 p-4 border rounded bg-green-50 dark:bg-green-950">
                        <h2 className="font-semibold">Member Details</h2>
                        <p><strong>Name:</strong> {foundMember.name}</p>
                        <p><strong>Email:</strong> {foundMember.email}</p>
                        <p><strong>Phone:</strong> {foundMember.phone}</p>
                        <p><strong>Address:</strong> {foundMember.address}</p>
                        <p><strong>Date Joined:</strong> {foundMember.dateJoined}</p>
                        <p><strong>Status:</strong> {foundMember.membershipStatus}</p>
                    </div>
                )}

                {/* Show "No member found" message */}
                {noMemberFound && (
                    <div className="mt-4 p-4 border rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
                        No member found with the given details.
                    </div>
                )}
            </div>
        </div>
    )
}
