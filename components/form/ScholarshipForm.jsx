'use client';
import React from 'react';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import InputWrapper from '@/components/ui/input-wrapper';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { InputNumber } from '@/components/ui/Input-number';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import * as Yup from 'yup';
import {
    clearField,
    handleCheckboxChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { Button } from '@/components/ui/button';
import { GoX } from 'react-icons/go';
import ComboboxFormik from '@/components/ui/ComboboxFormik';

export default function ScholarshipForm() {
    const formInfo = {
        slNo: '100001',
        organizer: {
            name: 'Student Welfare Trust Fulbaria',
            address: 'K. N. B. Bazar, Fulbaria, Gazipur',
            founded: '2006',
        },
        formTitle: 'Scholarship Examination for Class IV',
        formName: 'Admin Card',
        venue: 'Javed Ali Shorkar High School',
        eligibleSchools: [
            {
                id: 100003,
                name: 'DAKSHIN KATHALIA TAZEM ALI SECONDARY SCHOOL',
            },
            {
                id: 100009,
                name: 'LOCHA JUUNIOR HIGH SCHOOL',
            },
            {
                id: 100011,
                name: 'AMTALI A.K. PILOT HIGH SCHOOL',
            },
            {
                id: 100012,
                name: 'CHOTONILGONG HIGH SCHOOL',
            },
        ],
        exam: [
            {
                subject:
                    'Bangla + English + Mathematics + Social + Science + General Knowledge',
                date: '2024-11-13',
                day: 'Friday',
                time: '9:00 AM - 12:00 PM',
            },
        ],
        note: [
            'Must bring admit card to exam hall',
            'Bring a pen, pencil, etc for your examination',
        ],
        contact: ['01987654321', '01123456789', '01876543219'],
        email: 'example@mail.com',
    };

    const currentDate = new Date().toISOString().split('T')[0];

    const initialValues = {
        slNo: formInfo?.slNo || '',
        applicantNameBn: '',
        applicantNameEn: '',
        fatherName: '',
        motherName: '',
        schoolName: '',
        classRollNo: '',
        contact: '',
        image: null,
        permanentAddress: {
            village: 'mnhkjhgk',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
        isCurrentAddressSameAsPermanentAddress: false,
        currentAddress: {
            village: '',
            postOffice: '',
            subdistrict: '',
            district: '',
        },
    };

    const validationSchema = Yup.object().shape({
        applicantNameBn: Yup.string()
            .required('Applicant name (Bangla) is required')
            .matches(
                /^[\u0980-\u09FF\s]+$/,
                'Applicant name must be in Bangla'
            ),
        applicantNameEn: Yup.string().required(
            'Applicant name (English) is required'
        ),
        fatherName: Yup.string().required("Father's name is required"),
        motherName: Yup.string().required("Mother's name is required"),
        schoolName: Yup.string().required('School name is required'),
        classRollNo: Yup.string()
            .required('Class roll number is required')
            .matches(/^\d+$/, 'Class roll number must be a valid number'),
        contact: Yup.string()
            .required('Contact number is required')
            .matches(
                /^(?:\+88|88)?01[3-9]\d{8}$/,
                'Invalid Bangladeshi phone number'
            ),
        image: Yup.mixed()
            .required('Image is required')
            .test('fileType', 'Only image files are allowed', (value) => {
                return (
                    value &&
                    ['image/jpeg', 'image/png', 'image/jpg'].includes(
                        value.type
                    )
                );
            }),
        permanentAddress: Yup.object().shape({
            village: Yup.string().required('Village is required'),
            postOffice: Yup.string().required('Post office is required'),
            subdistrict: Yup.string().required('Subdistrict is required'),
            district: Yup.string().required('District is required'),
        }),
        isCurrentAddressSameAsPermanentAddress: Yup.boolean(),
        currentAddress: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (parent.isCurrentAddressSameAsPermanentAddress) {
                return Yup.object().shape({
                    village: Yup.string().nullable(),
                    postOffice: Yup.string().nullable(),
                    subdistrict: Yup.string().nullable(),
                    district: Yup.string().nullable(),
                });
            } else {
                return Yup.object().shape({
                    village: Yup.string().required('Village is required'),
                    postOffice: Yup.string().required(
                        'Post office is required'
                    ),
                    subdistrict: Yup.string().required(
                        'Subdistrict is required'
                    ),
                    district: Yup.string().required('District is required'),
                });
            }
        }),
    });

    const submit = (data) => {
        toast.success(JSON.stringify(data));
    };

    const reset = () => {
        formik.resetForm();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
    });

    const mutation = useMutation({
        mutationKey: ['scholarship'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='flex flex-col items-center justify-center text-base'>
                <p className='text-xl md:text-2xl text-primary uppercase font-bold'>
                    {formInfo?.organizer?.name}
                </p>
                <p className='font-bold'>{formInfo?.organizer?.address}</p>
                <p className='font-bold'>
                    Since - {formInfo?.organizer?.founded}
                </p>
                <p className='text-lg md:text-xl font-bold'>
                    {formInfo?.eventName}
                </p>
                <p className='text-lg md:text-xl border-4 mt-2 border-double p-2 w-fit'>
                    {formInfo?.formName}
                </p>
            </div>

            <div className='flex items-center justify-between'>
                <div>
                    <p>Date: {currentDate}</p>
                    <p>SL No: {formik?.values?.slNo && formik?.values?.slNo}</p>
                </div>
                <div>
                    {formik?.values?.image && (
                        <div className='flex items-center justify-end relative'>
                            <img
                                src={URL.createObjectURL(formik.values.image)}
                                alt='Selected Image'
                                className='w-24 h-24 object-cover border border-dashed rounded-md p-1'
                            />
                            <Button
                                type='button'
                                size='icon'
                                onClick={() => clearField(formik, 'image')}
                                className='absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full'
                            >
                                <GoX />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className='grid gap-2 md:grid-cols-2 w-full'>
                <InputWrapper
                    label='Applicant Name Bangla'
                    error={formik.errors.applicantNameBn}
                    touched={formik.touched.applicantNameBn}
                >
                    <Input
                        name='applicantNameBn'
                        placeholder='Applicant Name Bangla'
                        value={formik.values.applicantNameBn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Image'
                    error={formik.errors.image}
                    touched={formik.touched.image}
                >
                    <Input
                        name='image'
                        type='file'
                        accept='image/*'
                        onChange={handleImageChange(formik, 'image')}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Applicant Name English'
                    error={formik.errors.applicantNameEn}
                    touched={formik.touched.applicantNameEn}
                >
                    <Input
                        name='applicantNameEn'
                        placeholder='Applicant Name English'
                        value={formik.values.applicantNameEn}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Father / Mother Phone Number'
                    error={formik.errors.contact}
                    touched={formik.touched.contact}
                >
                    <Input
                        name='contact'
                        placeholder='Phone'
                        value={formik.values.contact}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Father's Name"
                    error={formik.errors.fatherName}
                    touched={formik.touched.fatherName}
                >
                    <Input
                        name='fatherName'
                        placeholder="Father's Name"
                        value={formik.values.fatherName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="Mother's Name"
                    error={formik.errors.motherName}
                    touched={formik.touched.motherName}
                >
                    <Input
                        name='motherName'
                        placeholder="Mother's Name"
                        value={formik.values.motherName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='School Name'
                    error={formik.errors?.schoolName}
                    touched={formik.touched?.schoolName}
                >
                    <ComboboxFormik
                        select='id'
                        display='name'
                        name='schoolName'
                        formik={formik}
                        data={formInfo?.eligibleSchools}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Class Roll No'
                    error={formik.errors.classRollNo}
                    touched={formik.touched.classRollNo}
                >
                    <Input
                        name='classRollNo'
                        placeholder='Class Roll No'
                        value={formik.values.classRollNo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* Permanent Address */}
            <h2 className='font-bold text-lg md:text-xl'>Permanent Address</h2>
            <div className='grid gap-2 md:grid-cols-2'>
                {['village', 'postOffice', 'subdistrict', 'district'].map(
                    (field) => (
                        <InputWrapper
                            key={field}
                            label={
                                field.charAt(0).toUpperCase() + field.slice(1)
                            }
                            error={formik.errors?.permanentAddress?.[field]}
                            touched={formik.touched?.permanentAddress?.[field]}
                        >
                            <Input
                                name={`permanentAddress.${field}`}
                                placeholder={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                value={formik.values.permanentAddress[field]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputWrapper>
                    )
                )}
            </div>

            {/* Checkbox for current address */}
            <div className='flex items-center space-x-10'>
                <h2 className='font-bold text-lg md:text-xl'>
                    Current Address
                </h2>
                <label className='flex items-center space-x-2'>
                    <Checkbox
                        checked={
                            formik.values.isCurrentAddressSameAsPermanentAddress
                        }
                        onCheckedChange={handleCheckboxChange(
                            formik,
                            'isCurrentAddressSameAsPermanentAddress'
                        )}
                    />
                    <span>Same as Permanent Address</span>
                </label>
            </div>

            {/* Current Address */}
            {!formik.values.isCurrentAddressSameAsPermanentAddress && (
                <>
                    <div className='grid gap-2 md:grid-cols-2'>
                        {[
                            'village',
                            'postOffice',
                            'subdistrict',
                            'district',
                        ].map((field) => (
                            <InputWrapper
                                key={field}
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                error={formik.errors?.currentAddress?.[field]}
                                touched={
                                    formik.touched?.currentAddress?.[field]
                                }
                            >
                                <Input
                                    name={`currentAddress.${field}`}
                                    placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                    }
                                    value={formik.values.currentAddress[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                        ))}
                    </div>
                </>
            )}

            <div className='flex items-center justify-end space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>

            {/* <div>
                Footer
            </div> */}
        </form>
    );
}
