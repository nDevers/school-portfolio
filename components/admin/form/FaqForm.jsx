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
import { getChangedValues } from '@/util/getChangedValues';
import { toast } from 'sonner';

export default function FaqForm({ data }) {
    const route = useRouter();
    const queryClient = useQueryClient();
    const initialValues = {
        question: data?.question || '',
        answer: data?.answer || '',
    };

    const validationSchema = Yup.object({
        question: Yup.string().required('Question is required'),
        answer: Yup.string().required('Answer is required'),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            toast.info('No changes detected.');
            return;
        }
        if (data) {
            await updateData(apiConfig?.UPDATE_FAQ + data?.id, changedValues);
        } else {
            await postData(apiConfig?.CREATE_FAQ, changedValues);
        }
        route.back();
        queryClient.invalidateQueries(['GET_FAQ']);
    };

    const mutation = useMutation({
        mutationFn: async (data) => await submit(data),
        // onSuccess,
    });

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={mutation.mutate}
        >
            {({ errors, touched, setFieldValue, resetForm }) => (
                <Form className="space-y-4">
                    <InputWrapper
                        label="Question"
                        error={errors.question}
                        touched={touched.question}
                    >
                        <Field
                            as={Input}
                            name="question"
                            placeholder="Write your question"
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Answer"
                        error={errors.answer}
                        touched={touched.answer}
                    >
                        <FormikSunEditor name="answer" />
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
