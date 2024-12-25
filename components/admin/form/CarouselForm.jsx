'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { handleImageChange } from '@/util/formikHelpers';

export default function CarouselForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        image: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        image: Yup.mixed()
            .required('Image is required')
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
    });

    const submit = async (values) => {
        const formData = new FormData();
        formData.append('title', values.title);
        if (values.image) {
            formData.append('image', values.image);
        }
        if (data) {
            await updateData(apiConfig?.UPDATE_CAROUSEL + data?._id, formData);
        } else {
            await postData(apiConfig?.CREATE_CAROUSEL, formData);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['carousel']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['createBenefitsOfMembers'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className="w-full space-y-10">
            <div className="grid gap-2 w-full">
                <InputWrapper
                    label="Title"
                    error={formik.errors?.title}
                    touched={formik.touched?.title}
                >
                    <Input
                        name="title"
                        placeholder="Title"
                        value={formik.values?.title}
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
            </div>

            <div className="flex items-center space-x-2">
                <Reset />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
