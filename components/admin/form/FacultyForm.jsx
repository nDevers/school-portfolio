'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { clearField, handleImageChange } from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { GoX } from 'react-icons/go';
import { Button } from '@/components/ui/button';
import { getChangedValues } from '@/util/getChangedValues';
import { toast } from 'sonner';

export default function FacultyForm({ data, category }) {
    const queryClient = useQueryClient();
    const initialValues = {
        name: data?.name || '',
        image: '',
        dataImage: data?.image || '',
        designation: data?.designation || '',
        email: data?.email || '',
        mobile: data?.mobile || '',
        portfolio: data?.portfolio || '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        image: Yup.mixed()
            // .required('Image is required')
            .test(
                'fileSize',
                'File size too large',
                (value) => !value || (value && value.size <= 2000000)
            ) // 2MB limit
            .test(
                'fileType',
                'Unsupported file format',
                (value) =>
                    !value ||
                    [
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/gif',
                    ].includes(value.type)
            ),
        email: Yup.string().email('Invalid email address'),
        mobile: Yup.string()
            .required('Mobile is required')
            .matches(
                /^(?:\+88|88)?01[3-9]\d{8}$/,
                'Invalid Bangladeshi phone number'
            ),
        designation: Yup.string().required('Required field'),
        portfolio: Yup.string().url('Must be a valid URL'),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            toast.info('No changes detected.');
            return;
        }
        const formData = new FormData();

        // Helper function to append only non-empty values
        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };
        // Append simple fields
        appendIfPresent('name', changedValues.name);
        appendIfPresent('image', changedValues.image);
        appendIfPresent('email', changedValues.email);
        appendIfPresent('mobile', changedValues.mobile);
        appendIfPresent('portfolio', changedValues.portfolio);
        appendIfPresent('designation', changedValues.designation);

        if (data) {
            await updateData(
                `${apiConfig?.UPDATE_FACULTY_BY_CATEGORY}${category}/${data?.id}`,
                formData
            );
        } else {
            await postData(
                apiConfig?.CREATE_FACULTY_BY_CATEGORY + category,
                formData
            );
        }
        formik?.resetForm();
    };

    const reset = () => {
        queryClient.invalidateQueries(['GET_FACULTY_BY_CATEGORY']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className="w-full space-y-10">
            <div>
                {(formik?.values?.image || formik?.values?.dataImage) && (
                    <div className="flex items-center justify-end relative">
                        <img
                            src={
                                formik.values.image instanceof File
                                    ? URL.createObjectURL(formik.values.image)
                                    : formik?.values?.dataImage
                            }
                            alt="Selected Image"
                            className="w-24 h-24 object-cover border border-dashed rounded-md p-1"
                        />
                        <Button
                            type="button"
                            size="icon"
                            disabled={!formik.values.image}
                            onClick={() => {
                                clearField(formik, 'image');
                                formik.setFieldValue('dataImage', '');
                            }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full"
                        >
                            <GoX />
                        </Button>
                    </div>
                )}
                <div className="grid md:grid-cols-2 gap-2 w-full">
                    <InputWrapper
                        label="Name"
                        error={formik.errors?.name}
                        touched={formik.touched?.name}
                    >
                        <Input
                            name="name"
                            placeholder="Name"
                            value={formik.values?.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Profile Image"
                        error={formik.errors?.image}
                        touched={formik.touched?.image}
                    >
                        <Input
                            type="file"
                            name="image"
                            accept="image/png, image/gif, image/jpeg, image/jpg"
                            onChange={handleImageChange(formik, 'image')}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Designation"
                        error={formik.errors?.designation}
                        touched={formik.touched?.designation}
                    >
                        <Input
                            name="designation"
                            placeholder="Designation"
                            value={formik.values?.designation}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Mobile"
                        error={formik.errors?.mobile}
                        touched={formik.touched?.mobile}
                    >
                        <Input
                            name="mobile"
                            placeholder="Mobile"
                            value={formik.values?.mobile}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Email"
                        error={formik.errors?.email}
                        touched={formik.touched?.email}
                    >
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formik.values?.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Portfolio"
                        error={formik.errors?.portfolio}
                        touched={formik.touched?.portfolio}
                    >
                        <Input
                            type="url"
                            name="portfolio"
                            placeholder="Portfolio"
                            value={formik.values?.portfolio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
