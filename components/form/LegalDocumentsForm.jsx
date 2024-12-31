'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import FormikSunEditor from '@/components/admin/sun-editor/FormikSunEditor';
import Submit from '@/components/button/Submit';
import Reset from '@/components/button/Reset';
import { Field, Form, Formik } from 'formik';
import { Input } from '@/components/ui/input';
import * as Yup from 'yup';
import {
    handleArrayFieldChangeForForm,
    handleImageChangeForForm,
} from '@/util/formikHelpers';
import Add from '@/components/button/Add';
import Remove from '@/components/button/Remove';
import { Error } from '@/components/ui/error';

export default function LegalDocumentsForm({ data, onSubmit }) {
    const initialValues = {
        title: data?.title || '',
        effectiveDate: data?.effectiveDate || '',
        description: data?.description || '',
        documents: data?.documents || [
            {
                name: '',
                file: null,
            },
        ],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        effectiveDate: Yup.date().required('Effective Date is required'),
        description: Yup.string().required('Description is required'),
        documents: Yup.array().of(
            Yup.object({
                name: Yup.string().required('Document name is required'),
                file: Yup.mixed().required('File is required'),
            })
        ),
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, values, setFieldValue, resetForm }) => (
                <Form className='space-y-4'>
                    <InputWrapper
                        label='Title'
                        error={errors.title}
                        touched={touched.title}
                    >
                        <Field
                            as={Input}
                            name='title'
                            placeholder='Enter title'
                        />
                    </InputWrapper>

                    <InputWrapper
                        label='Effective Date'
                        error={errors.effectiveDate}
                        touched={touched.effectiveDate}
                    >
                        <Field as={Input} type='date' name='effectiveDate' />
                    </InputWrapper>

                    {/* Documents Field Array */}
                    <div className='space-y-2'>
                        <InputWrapper label='PDF Documents'>
                            {values.documents.map((document, index) => (
                                <div
                                    key={index}
                                    className='flex gap-2 items-start justify-between'
                                >
                                    <div className='w-full'>
                                        <Input
                                            name={`documents[${index}].name`}
                                            placeholder={`Document Name ${index + 1}`}
                                            value={document.name}
                                            onChange={(e) =>
                                                setFieldValue(
                                                    `documents[${index}].name`,
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <Error
                                            error={
                                                errors.documents?.[index]?.name
                                            }
                                            touched={
                                                touched.documents?.[index]?.name
                                            }
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <Input
                                            type='file'
                                            accept='application/pdf'
                                            onChange={(e) =>
                                                handleImageChangeForForm(
                                                    setFieldValue,
                                                    `documents[${index}].file`
                                                )(e)
                                            }
                                            className='file-input'
                                        />
                                        <Error
                                            error={
                                                errors.documents?.[index]?.file
                                            }
                                            touched={
                                                touched.documents?.[index]?.file
                                            }
                                        />
                                    </div>
                                    <div className='max-w-12 flex items-center'>
                                        <Remove
                                            disabled={
                                                values.documents.length === 1
                                            }
                                            onClick={() =>
                                                handleArrayFieldChangeForForm(
                                                    { values, setFieldValue },
                                                    'remove',
                                                    'documents',
                                                    index
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </InputWrapper>
                        <Add
                            label='Add Document'
                            onClick={() =>
                                handleArrayFieldChangeForForm(
                                    { values, setFieldValue },
                                    'add',
                                    'documents'
                                )
                            }
                        />
                    </div>

                    <InputWrapper
                        label='Description'
                        error={errors.description}
                        touched={touched.description}
                    >
                        <FormikSunEditor name='description' />
                    </InputWrapper>

                    <div className='flex items-center space-x-2'>
                        <Reset onClick={resetForm} />
                        <Submit />
                    </div>
                </Form>
            )}
        </Formik>
    );
}
