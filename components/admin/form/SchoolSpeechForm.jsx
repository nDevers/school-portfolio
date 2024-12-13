'use client'
import React from 'react'
import InputWrapper from '@/components/ui/input-wrapper'
import Reset from '@/components/button/Reset'
import Submit from '@/components/button/Submit'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { clearField, handleImageChange } from '@/util/formikHelpers'
import { postData, updateData } from '@/util/axios'
import apiConfig from '@/configs/apiConfig'
import { GoX } from 'react-icons/go'
import { Button } from '@/components/ui/button'
import { getChangedValues } from '@/util/getChangedValues'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

export default function SchoolSpeechForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        image: '',
        dataIcon: data?.image || '',
        description: data?.description || '',
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        description: Yup.string().required('Required field'),
        image: Yup.mixed()
            // .required('Image is required')
            .test('fileSize', 'File size too large', value => !value || (value && value.size <= 1000000)) // 1MB limit
            .test('fileType', 'Unsupported file format', value =>
                !value || ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(value.type)
            ),
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
        appendIfPresent("title", Number(changedValues.title));
        appendIfPresent("image", changedValues.image);
        appendIfPresent("description", changedValues.description);

        if (data) {
            await updateData(apiConfig?.UPDATE_SCHOOL_SPEECH + data?.id, formData);
        } else {
            await postData(apiConfig?.CREATE_SCHOOL_SPEECH, formData);
        }
    }

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['GET_SCHOOL_SPEECH'])
    }

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
    })

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div>
                {(formik?.values?.image || formik?.values?.dataIcon) && (
                    <div className="flex items-center justify-end relative">
                        <img
                            src={formik.values.image instanceof File ? URL.createObjectURL(formik.values.image) : formik?.values?.dataIcon}
                            alt="Selected Image"
                            className="w-24 h-24 object-cover border border-dashed rounded-md p-1"
                        />
                        <Button
                            type="button"
                            size='icon'
                            disabled={!formik.values.image}
                            onClick={() => {
                                clearField(formik, 'image');
                                formik.setFieldValue('dataIcon', '')
                            }}
                            className='absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full'
                        >
                            <GoX />
                        </Button>
                    </div>
                )}
                <div className='grid gap-2 w-full'>
                    <InputWrapper label="Name Of the Speaker" error={formik.errors?.title} touched={formik.touched?.title}>
                        <Input
                            name="title"
                            placeholder="Name"
                            value={formik.values?.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper label="Image Of the Speaker" error={formik.errors?.image} touched={formik.touched?.image}>
                        <Input
                            type="file"
                            name="image"
                            accept="image/png, image/gif, image/jpeg, image/jpg"
                            onChange={handleImageChange(formik, 'image')}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper label="Speech" error={formik.errors?.description} touched={formik.touched?.description}>
                        <Textarea
                            rows={10}
                            name="description"
                            placeholder="Description"
                            value={formik.values?.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    )
}
