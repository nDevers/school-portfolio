import CoverAbout from "@/components/common/CoverAbout";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AboutMembership() {
    const data = {
        title: 'Membership Fee',
        cover: '/carousel/carousel (4).jpg',
    };

    const membershipFeeTable = [
        { category: 'Graduate', years: [1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600] },
        { category: 'Associate', years: [1800, 2200, 2600, 3000, 3400, 3800, 4200, 4600] },
        { category: 'Member', years: [2100, 2600, 3100, 3600, 4100, 4600, 5100, 5600] },
        { category: 'Fellow', years: [2400, 3000, 3600, 4200, 4800, 5400, 6000, 6600] },
    ];

    const descriptionOfFees = [
        { description: 'Application Form', amount: 100 },
        { description: 'Registration', amount: 200 },
        { description: 'Subscription (based on category)', amount: '' },
        { description: 'Certificate', amount: 100 },
        { description: 'Identity Card', amount: 200 },
        { description: 'Emergency Fee', amount: 300 },
    ];

    const exampleLifetime = [
        { description: 'Application Form', amount: 100 },
        { description: 'Registration', amount: 200 },
        { description: 'Subscription (400 * 10 years)', amount: 4000 },
        { description: 'Certificate', amount: 100 },
        { description: 'Identity Card', amount: 200 },
        { description: 'Emergency Fee', amount: 300 },
        { description: 'Total', amount: 4900 },
    ];

    return (
        <div className='space-y-10 w-full'>
            <CoverAbout data={data} />

            {/* Membership Fee Table */}
            <Table>
                <TableCaption>Membership Fee Structure</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>For 3 Years</TableHead>
                        <TableHead>For 4 Years</TableHead>
                        <TableHead>For 5 Years</TableHead>
                        <TableHead>For 6 Years</TableHead>
                        <TableHead>For 7 Years</TableHead>
                        <TableHead>For 8 Years</TableHead>
                        <TableHead>For Life Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {membershipFeeTable.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.category}</TableCell>
                            {item.years.map((fee, yearIdx) => (
                                <TableCell key={yearIdx}>{fee}/-</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Description of Fees */}
            <Table>
                <TableCaption>Description of Fees</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {descriptionOfFees.map((fee, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{fee.description}</TableCell>
                            <TableCell>{fee.amount ? `${fee.amount}/-` : 'As per category'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Example for Life Time Associate Member */}
            <Table>
                <TableCaption>Example for a Life Time Associate Member</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {exampleLifetime.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.amount}/-</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
