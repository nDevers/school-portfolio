'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Field, Form, Formik, useFormik } from 'formik';
import {
    clearField,
    handleImageChange,
    handleImageChangeForForm,
} from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { GoX } from 'react-icons/go';
import { Button } from '@/components/ui/button';
import { getChangedValues } from '@/util/getChangedValues';
import { toast } from 'sonner';
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor';
import Spinner from '@/components/common/Spinner';
import { RiSendPlaneLine } from 'react-icons/ri';

export default function AcademicForm({ data, category }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        description: data?.description || '',
        file: '',
        dataFile: data?.file || '',
        publishDate: data?.publishDate || '',
        badge: data?.badge || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        description: Yup.string().required('Required field'),
        file: Yup.mixed()
            // .required('Image is required')
            .test(
                'fileSize',
                'File size too large',
                (value) => !value || (value && value.size <= 5000000)
            ) // 5MB limit
            .test(
                'fileType',
                'Unsupported file format',
                (value) =>
                    !value ||
                    [
                        'application/pdf',
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/gif',
                    ].includes(value.type)
            ),
        publishDate: Yup.string(),
        badge: Yup.string(),
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
        appendIfPresent('title', changedValues.title);
        appendIfPresent('description', changedValues.description);
        appendIfPresent('file', changedValues.file);
        appendIfPresent('publishDate', changedValues.publishDate);
        appendIfPresent('badge', changedValues.badge);

        if (data) {
            await updateData(
                `${apiConfig?.UPDATE_ACADEMIC_BY_CATEGORY}${category}/${data?.id}`,
                formData
            );
        } else {
            await postData(
                apiConfig?.CREATE_ACADEMIC_BY_CATEGORY + category,
                formData
            );
        }
    };

    const reset = () => {
        queryClient.invalidateQueries(['GET_ACADEMIC_BY_CATEGORY']);
    };

    const mutation = useMutation({
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className='grid md:grid-cols-2 gap-4'>
                    <InputWrapper
                        label='Title'
                        error={errors.title}
                        touched={touched.title}
                    >
                        <Field
                            as={Input}
                            name='title'
                            placeholder={`Title of the ${category}`}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Badge'
                        error={errors.badge}
                        touched={touched.badge}
                    >
                        <Field
                            as={Input}
                            name='badge'
                            placeholder={`Badge of the ${category}`}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Publish Date'
                        error={errors.publishDate}
                        touched={touched.publishDate}
                    >
                        <Field as={Input} name='publishDate' type='date' />
                    </InputWrapper>

                    <InputWrapper
                        label='Attachment'
                        error={errors.file}
                        touched={touched.file}
                    >
                        <Field
                            as={Input}
                            type='file'
                            name='image'
                            accept='application/pdf, image/png, image/gif, image/jpeg, image/jpg'
                            onChange={(e) =>
                                handleImageChangeForForm(
                                    setFieldValue,
                                    'file'
                                )(e)
                            }
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Description'
                        error={errors.description}
                        touched={touched.description}
                        className={'md:col-span-2'}
                    >
                        <FormikSunEditor name='description' />
                    </InputWrapper>

                    <div className='flex items-center space-x-2 md:col-span-2'>
                        <Reset onClick={resetForm} />
                        <Submit
                            disabled={mutation.isPending}
                            label={
                                mutation.isPending ? 'Submitting...' : 'Submit'
                            } // Dynamic label
                            icon={
                                mutation.isPending ? (
                                    <Spinner size='4' />
                                ) : (
                                    <RiSendPlaneLine />
                                )
                            } // Dynamic icon
                        />
                    </div>
                </Form>
            )}
        </Formik>
    );
}
