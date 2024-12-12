'use client'
import React from 'react'
import InputWrapper from '@/components/ui/input-wrapper'
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor'
import Submit from '@/components/button/Submit'
import Reset from '@/components/button/Reset'
import { Field, Form, Formik } from 'formik'
import { Input } from '@/components/ui/input'
import * as Yup from 'yup'
import { postData, updateData } from '@/util/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RiSendPlaneLine } from 'react-icons/ri'
import apiConfig from '@/configs/apiConfig'
import Spinner from '@/components/common/Spinner'
import { useRouter } from 'next/navigation'
import { handleArrayFieldChangeForForm, handleImageChangeForForm } from '@/util/formikHelpers'
import Add from '@/components/button/Add'
import Remove from '@/components/button/Remove'

export default function MoreAboutUsForm({ data }) {
    const route = useRouter()
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        description: data?.description || '',
        files: data?.files || [''],
        images: data?.images || [''],
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
    })

    const submit = async (values) => {
        const formData = new FormData();

        // Append title and description
        formData.append('title', values.title);
        formData.append('description', values.description);

        // Append files to FormData
        values.files.forEach(file => {
            if (file instanceof File) {
                formData.append(`files`, file); // The API expects files as an array
            }
        });

        // Append images to FormData
        values.images.forEach(image => {
            if (image instanceof File) {
                formData.append(`images`, image); // The API expects images as an array
            }
        });

        if (data) {
            await updateData(apiConfig?.UPDATE_MORE_ABOUT_US, formData);
        } else {
            await postData(apiConfig?.CREATE_MORE_ABOUT_US, formData);
        }
    };

    const onSuccess = () => {
        route.back()
        queryClient.invalidateQueries(['GET_FAQ'])
    }

    const mutation = useMutation({
        mutationFn: data => submit(data),
        onSuccess,
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className="space-y-4">
                    <InputWrapper label="Title" error={errors.title} touched={touched.title}>
                        <Field as={Input} name="title" placeholder="Title of the topic" />
                    </InputWrapper>

                    <div className='space-y-2'>
                        <InputWrapper label="Files" error={errors?.files} touched={touched?.files}>
                            {values.files.map((_, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleImageChangeForForm(setFieldValue, `files[${index}]`)(e)}
                                        className="file-input"
                                    />
                                    <Remove
                                        disabled={values?.files?.length === 1}
                                        onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'remove', 'files', index)}
                                    />
                                </div>
                            ))}
                        </InputWrapper>
                        <Add label='Add File' onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'add', 'files')} />
                    </div>

                    <div className='space-y-2'>
                        <InputWrapper label="Images" error={errors?.images} touched={touched?.images}>
                            {values.images.map((_, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChangeForForm(setFieldValue, `images[${index}]`)(e)}
                                        className="file-input"
                                    />
                                    <Remove
                                        disabled={values?.images?.length === 1}
                                        onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'remove', 'images', index)}
                                    />
                                </div>
                            ))}
                        </InputWrapper>
                        <Add label='Add Image' onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'add', 'images')} />
                    </div>

                    <InputWrapper label="Description" error={errors.description} touched={touched.description}>
                        <FormikSunEditor name="description" />
                    </InputWrapper>

                    <div className="flex items-center space-x-2">
                        <Reset onClick={resetForm} />
                        <Submit
                            disabled={mutation.isPending || mutation.isSuccess}
                            label={mutation.isPending ? 'Submitting...' : 'Submit'} // Dynamic label
                            icon={mutation.isPending ? <Spinner size="4" /> : <RiSendPlaneLine />} // Dynamic icon
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}
