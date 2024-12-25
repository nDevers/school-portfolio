'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { Field, Form, Formik } from 'formik';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import { postData, updateData } from '@/util/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RiSendPlaneLine } from 'react-icons/ri';
import apiConfig from '@/configs/apiConfig';
import Spinner from '@/components/common/Spinner';
import { useRouter } from 'next/navigation';
import {
    handleArrayFieldChangeForForm,
    handleImageChangeForForm,
} from '@/util/formikHelpers';
import Add from '@/components/button/Add';
import Remove from '@/components/button/Remove';
import { getChangedValues } from '@/util/getChangedValues';
import { toast } from 'sonner';

export default function CareerForm({ data }) {
    const route = useRouter();
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        subTitle: data?.subTitle || '',
        description: data?.description || '',
        files: data?.files || [''],
        deleteFiles: [],
        date: data?.date.split('T')[0] || '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            toast.info('No changes detected.');
            return;
        }

        const formData = new FormData();

        // Helper function to append non-empty values
        const appendIfPresent = (key, value) => {
            if (value !== undefined && value !== null && value !== '') {
                formData.append(key, value);
            }
        };

        // Append simple fields
        appendIfPresent('title', changedValues.title);
        appendIfPresent('subTitle', changedValues.subTitle);
        appendIfPresent('description', changedValues.description);
        appendIfPresent('date', changedValues.date);

        // Append files if they exist and are valid
        if (Array.isArray(changedValues.files)) {
            changedValues.files.forEach((file, index) => {
                if (file instanceof File) {
                    formData.append(`files[${index}]`, file);
                }
            });
        }

        // API call
        if (data) {
            await updateData(apiConfig?.UPDATE_CAREER + data?.id, formData);
        } else {
            await postData(apiConfig?.CREATE_CAREER, formData);
        }

        route.back();
    };

    const onSuccess = () => {
        queryClient.invalidateQueries(['GET_CAREER']);
    };

    const mutation = useMutation({
        mutationFn: (data) => submit(data),
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
                    <InputWrapper
                        label="Title"
                        error={errors.title}
                        touched={touched.title}
                    >
                        <Field
                            as={Input}
                            name="title"
                            placeholder="Title of the circular"
                        />
                    </InputWrapper>
                    <InputWrapper
                        label="Sub Title"
                        error={errors.subTitle}
                        touched={touched.subTitle}
                    >
                        <Field
                            as={Input}
                            name="subTitle"
                            placeholder="Sub Title of the circular"
                        />
                    </InputWrapper>
                    <InputWrapper
                        label="Submission Last Date"
                        error={errors.date}
                        touched={touched.date}
                    >
                        <Field as={Input} type="date" name="date" />
                    </InputWrapper>

                    <div className="space-y-2">
                        <InputWrapper
                            label="Files"
                            error={errors?.files}
                            touched={touched?.files}
                        >
                            {values?.files?.length > 0 &&
                                values?.files?.map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center"
                                    >
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) =>
                                                handleImageChangeForForm(
                                                    setFieldValue,
                                                    `files[${index}]`
                                                )(e)
                                            }
                                            className="file-input"
                                        />
                                        <Remove
                                            disabled={
                                                values?.files?.length === 1
                                            }
                                            onClick={() =>
                                                handleArrayFieldChangeForForm(
                                                    { values, setFieldValue },
                                                    'remove',
                                                    'files',
                                                    index,
                                                    'deleteFiles'
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                        </InputWrapper>
                        <Add
                            label="Add File"
                            onClick={() =>
                                handleArrayFieldChangeForForm(
                                    { values, setFieldValue },
                                    'add',
                                    'files'
                                )
                            }
                        />
                    </div>

                    <InputWrapper
                        label="Description"
                        error={errors.description}
                        touched={touched.description}
                    >
                        <FormikSunEditor name="description" />
                    </InputWrapper>

                    <div className="flex items-center space-x-2">
                        <Reset onClick={resetForm} />
                        <Submit
                            disabled={mutation.isPending}
                            label={
                                mutation.isPending ? 'Submitting...' : 'Submit'
                            } // Dynamic label
                            icon={
                                mutation.isPending ? (
                                    <Spinner size="4" />
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
