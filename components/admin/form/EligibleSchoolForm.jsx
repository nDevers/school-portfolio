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

export default function EligibleSchoolForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        name: data?.name || '',
        address: data?.address || '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        address: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        // Convert the school name to uppercase
        const formattedValues = {
            ...values,
            name: values.name.toUpperCase(),
        };

        if (data) {
            await updateData(
                apiConfig?.UPDATE_ELIGIBLE_SCHOOL + data?._id,
                formattedValues
            );
        } else {
            await postData(apiConfig?.CREATE_ELIGIBLE_SCHOOL, formattedValues);
        }
        queryClient.invalidateQueries(['eligibleSchool']);
    };

    const reset = () => {
        formik?.resetForm();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['createEligibleSchool'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className="w-full space-y-10">
            <div className="grid gap-2 w-full">
                <InputWrapper
                    label="School Name"
                    error={formik.errors?.name}
                    touched={formik.touched?.name}
                >
                    <Input
                        name="name"
                        placeholder="School Name"
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label="School Address"
                    error={formik.errors?.address}
                    touched={formik.touched?.address}
                >
                    <Input
                        name="address"
                        placeholder="School Address"
                        value={formik.values?.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>
            </div>

            <div className="flex items-center space-x-2">
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
