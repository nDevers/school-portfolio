import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import your form components
const TalentPoolScholarshipForm = dynamic(() => import('@/components/form/TalentPoolScholarshipForm'));
const ScholarshipForm = dynamic(() => import('@/components/form/ScholarshipForm'));

// Map form codes to components
const formComponents = {
    'SFTS24': TalentPoolScholarshipForm,
    'SFS24': ScholarshipForm,
};

export default function ApplicationForm({ params }) {
    const { code } = params;

    // Select the appropriate form component based on the code
    const FormComponent = formComponents[code];

    // Render the selected form component, or a fallback if the code is invalid
    return (
        <section className='max-w-7xl mx-auto my-10 shadow-xl rounded-xl sp spy'>
            <p>{`Form Code: ${code}`}</p>
            {FormComponent ? (
                <FormComponent />
            ) : (
                <p>Invalid form code. Please check the URL.</p>
            )}
        </section>
    );
}
