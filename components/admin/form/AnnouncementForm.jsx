'use client'
import React from 'react'
import InputWrapper from '@/components/ui/input-wrapper'
import Reset from '@/components/button/Reset'
import Submit from '@/components/button/Submit'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Field, Form, Formik, useFormik } from 'formik'
import { clearField, handleArrayFieldChangeForForm, handleImageChange, handleImageChangeForForm } from '@/util/formikHelpers'
import { postData, updateData } from '@/util/axios'
import apiConfig from '@/configs/apiConfig'
import { GoX } from 'react-icons/go'
import { Button } from '@/components/ui/button'
import { getChangedValues } from '@/util/getChangedValues'
import { toast } from 'sonner'
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor'
import Spinner from '@/components/common/Spinner'
import { RiSendPlaneLine } from 'react-icons/ri'
import Add from '@/components/button/Add'
import Remove from '@/components/button/Remove'
import { Checkbox } from '@/components/ui/checkbox'

export default function AnnouncementForm({ data, category }) {
    const queryClient = useQueryClient();
    const initialValues = {
        title: data?.title || '',
        description: data?.description || '',
        date: data?.date.split("T")[0] || '',
        files: data?.files || [''],
        delateFiles: [],
        isHeadline: data?.isHeadline ? data?.isHeadline : false,
        isAdvertise: data?.isAdvertise ? data?.isAdvertise : false,
        advertiseMailTime: data?.advertiseMailTime.split("T")[0] || '',
    }

    const validationSchema = Yup.object({
        title: Yup.string().required('Required field'),
        description: Yup.string().required('Required field'),
        file: Yup.mixed()
            // .required('Image is required')
            .test('fileSize', 'File size too large', value => !value || (value && value.size <= 5000000)) // 5MB limit
            .test('fileType', 'Unsupported file format', value =>
                !value || ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(value.type)
            ),
        date: Yup.string(),
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
        appendIfPresent("title", changedValues.title);
        appendIfPresent("description", changedValues.description);
        // Append files to FormData
        changedValues.files.forEach(file => {
            if (file instanceof File) {
                appendIfPresent(`files`, file);
            }
        });
        // appendIfPresent("isHeadline", changedValues.isHeadline);
        // appendIfPresent("isAdvertise", changedValues.isAdvertise);
        formData.append(`isHeadline`, values?.isHeadline)
        formData.append(`isAdvertise`, values?.isAdvertise)
        appendIfPresent("date", changedValues.date);
        if (changedValues.isAdvertise) {
            appendIfPresent("advertiseMailTime", changedValues.advertiseMailTime);
        } else {
            appendIfPresent("advertiseMailTime", '');
        }

        if (data) {
            await updateData(`${apiConfig?.UPDATE_ANNOUNCEMENT_BY_CATEGORY}${category}/${data?.id}`, formData);
        } else {
            await postData(apiConfig?.CREATE_ANNOUNCEMENT_BY_CATEGORY + category, formData);
        }
    }

    const reset = () => {
        queryClient.invalidateQueries(['GET_ANNOUNCEMENT_BY_CATEGORY'])
    }

    const mutation = useMutation({
        mutationFn: submit,
        onSuccess: () => reset(),
    })

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className="grid gap-4">
                    <InputWrapper label="Title" error={errors.title} touched={touched.title}>
                        <Field as={Input} name="title" placeholder={`Title of the ${category}`} />
                    </InputWrapper>

                    <div className='grid md:grid-cols-2 gap-4'>
                        <InputWrapper label="Is this Headline ?" error={errors.isHeadline} touched={touched.isHeadline} className={'space-x-2'}>
                            {/* <Field as={Checkbox} name="isHeadline" /> */}
                            <Checkbox
                                name="isHeadline"
                                checked={values.isHeadline}
                                onCheckedChange={(e) => setFieldValue('isHeadline', e)}
                            />
                        </InputWrapper>

                        <InputWrapper label="Advertise It ?" error={errors.isAdvertise} touched={touched.isAdvertise} className={'space-x-2'}>
                            {/* <Field as={Checkbox} name="isAdvertise" /> */}
                            <Checkbox
                                name="isAdvertise"
                                checked={values.isAdvertise}
                                onCheckedChange={(e) => setFieldValue('isAdvertise', e)}
                            />
                        </InputWrapper>

                        <InputWrapper label="Publish Date" error={errors.date} touched={touched.date}>
                            <Field as={Input} name="date" type='date' />
                        </InputWrapper>

                        <InputWrapper label="Advertise Mail Time" error={errors.advertiseMailTime} touched={touched.advertiseMailTime}>
                            <Field as={Input} name="advertiseMailTime" type='date' disabled={!values?.isAdvertise}/>
                        </InputWrapper>
                    </div>

                    <div className='space-y-2'>
                        <InputWrapper label="Files" error={errors?.files} touched={touched?.files}>
                            {values?.files?.length > 0 && values?.files?.map((_, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <Input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => handleImageChangeForForm(setFieldValue, `files[${index}]`)(e)}
                                        className="file-input"
                                    />
                                    <Remove
                                        disabled={values?.files?.length === 1}
                                        onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'remove', 'files', index, 'deleteFiles')}
                                    />
                                </div>
                            ))}
                        </InputWrapper>
                        <Add label='Add File' onClick={() => handleArrayFieldChangeForForm({ values, setFieldValue }, 'add', 'files')} />
                    </div>

                    <InputWrapper label="Description" error={errors.description} touched={touched.description}>
                        <FormikSunEditor name="description" />
                    </InputWrapper>

                    <div className="flex items-center space-x-2">
                        <Reset onClick={resetForm} />
                        <Submit
                            disabled={mutation.isPending}
                            label={mutation.isPending ? 'Submitting...' : 'Submit'} // Dynamic label
                            icon={mutation.isPending ? <Spinner size="4" /> : <RiSendPlaneLine />} // Dynamic icon
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}
