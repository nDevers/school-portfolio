'use client';

import InputWrapper from '@/components/ui/input-wrapper';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { useFormik } from 'formik';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import apiConfig from '@/configs/apiConfig';
import { postData, updateData } from '@/util/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NoticeForm({ data }) {
    const queryClient = useQueryClient();

    const initialValues = {
        title: data?.title || '',
        publishDate: data?.publishDate || '',
        file: {
            name: data?.file?.name || '',
            file: null,
        },
        link: {
            name: data?.link?.name || '',
            link: data?.link?.link || '',
        },
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        publishDate: Yup.date()
            .required('Date is required')
            .max(new Date(), 'Date cannot be in the future'),
        file: Yup.object({
            name: Yup.string(),
            file: Yup.mixed()
                .nullable()
                .test(
                    'fileType',
                    'Only PDF files are allowed',
                    (value) =>
                        !value || (value && value.type === 'application/pdf')
                ),
        }),
        link: Yup.object({
            name: Yup.string(),
            link: Yup.string().nullable().url('Must be a valid URL'),
        }),
    });

    const submit = async (values) => {
        const formData = new FormData();

        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };

        appendIfPresent('title', values.title);
        appendIfPresent('publishDate', values.publishDate);

        if (values.file.file) {
            formData.append('file', values.file.file);
            formData.append('fileName', values.file.name);
        }

        if (values.link.link) {
            formData.append('link', values.link.link);
            formData.append('linkName', values.link.name);
        }

        if (data) {
            await updateData(apiConfig?.UPDATE_NOTICE + data?._id, formData);
        } else {
            await postData(apiConfig?.CREATE_NOTICE, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['notice']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['create-notice'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                {/* Title Field */}
                <InputWrapper
                    label='Title'
                    error={formik.errors?.title}
                    touched={formik.touched?.title}
                >
                    <Input
                        name='title'
                        placeholder='Title'
                        value={formik.values?.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                {/* Publish Date Field */}
                <InputWrapper
                    label='Publish Date'
                    error={formik.errors?.publishDate}
                    touched={formik.touched?.publishDate}
                >
                    <Input
                        type='date'
                        name='publishDate'
                        value={formik.values?.publishDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* File Upload Section */}
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='File Name'
                    error={formik.errors?.file?.name}
                    touched={formik.touched?.file?.name}
                >
                    <Input
                        name='file.name'
                        placeholder='File Name'
                        accept='file/pdf'
                        value={formik.values?.file?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Upload File'
                    error={formik.errors?.file?.file}
                    touched={formik.touched?.file?.file}
                >
                    <Input
                        type='file'
                        name='file.file'
                        onChange={(event) => {
                            formik.setFieldValue(
                                'file.file',
                                event.currentTarget.files[0]
                            );
                        }}
                    />
                </InputWrapper>
            </div>

            {/* Link Section */}
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Link Name'
                    error={formik.errors?.link?.name}
                    touched={formik.touched?.link?.name}
                >
                    <Input
                        name='link.name'
                        placeholder='Link Name'
                        value={formik.values?.link?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Link URL'
                    error={formik.errors?.link?.link}
                    touched={formik.touched?.link?.link}
                >
                    <Input
                        name='link.link'
                        placeholder='Link URL'
                        value={formik.values?.link?.link}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            {/* Submit and Reset Buttons */}
            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
