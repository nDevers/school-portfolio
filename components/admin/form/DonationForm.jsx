'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Checkbox } from '@/components/ui/checkbox';
import { handleCheckboxChange } from '@/util/formikHelpers';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

export default function DonationForm({ data }) {
    const initialValues = {
        memberId: data?.memberId || '',
        amount: data?.amount || '',
        paymentMethodId: data?.paymentMethodId || '',
        hasBankDetails: data?.hasBankDetails || false,
        bankDetails: data?.bankDetails || {
            bankName: '',
            branchName: '',
        },
    };

    const validationSchema = Yup.object({
        memberId: Yup.string().required('Required field'),
        amount: Yup.number().required('Required field'),
        paymentMethodId: Yup.string().required('Required field'),
        hasBankDetails: Yup.boolean(),
        bankDetails: Yup.lazy((currentAddress, { parent }) => {
            // `parent` allows access to sibling values in validation context
            if (parent.hasBackDetails) {
                return Yup.object().shape({
                    bankName: Yup.string().required('Bank name is required'),
                    branchName: Yup.string().required(
                        'Branch name is required'
                    ),
                });
            } else {
                return Yup.object().shape({
                    bankName: Yup.string().nullable(),
                    branchName: Yup.string().nullable(),
                });
            }
        }),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(apiConfig?.UPDATE_DONATION + data?._id, values);
        } else {
            await postData(apiConfig?.CREATE_DONATION, values);
        }
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
        mutationKey: ['donation'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { isLoading: memberLoading, data: member } = useQuery({
        queryKey: ['member'],
        queryFn: async () => await fetchData(apiConfig?.GET_MEMBER_LIST),
    });

    const { isLoading: methodLoading, data: method } = useQuery({
        queryKey: ['payment-method'],
        queryFn: async () => await fetchData(apiConfig?.GET_PAYMENT_METHOD),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-3 gap-2 w-full'>
                <InputWrapper
                    label='Donor Name'
                    error={formik.errors?.memberId}
                    touched={formik.touched?.memberId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='name'
                        name='memberId'
                        formik={formik}
                        data={member}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Amount'
                    error={formik.errors?.amount}
                    touched={formik.touched?.amount}
                >
                    <Input
                        name='amount'
                        type='number'
                        placeholder='Amount'
                        value={formik.values?.amount}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Payment Method'
                    error={formik.errors?.paymentMethodId}
                    touched={formik.touched?.paymentMethodId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='type'
                        name='paymentMethodId'
                        formik={formik}
                        data={method}
                    />
                </InputWrapper>
            </div>

            <label className='w-fit flex items-center space-x-2'>
                <span>Has bank details</span>
                <Checkbox
                    checked={formik.values.hasBankDetails}
                    onCheckedChange={handleCheckboxChange(
                        formik,
                        'hasBankDetails'
                    )}
                />
            </label>

            {formik.values.hasBankDetails && (
                <>
                    <div className='grid gap-2 md:grid-cols-2'>
                        {['bankName', 'branchName'].map((field) => (
                            <InputWrapper
                                key={field}
                                label={
                                    field.charAt(0).toUpperCase() +
                                    field.slice(1)
                                }
                                error={formik.errors?.bankDetails?.[field]}
                                touched={formik.touched?.bankDetails?.[field]}
                            >
                                <Input
                                    name={`bankDetails.${field}`}
                                    placeholder={
                                        field.charAt(0).toUpperCase() +
                                        field.slice(1)
                                    }
                                    value={formik.values.bankDetails[field]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </InputWrapper>
                        ))}
                    </div>
                </>
            )}

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>
        </form>
    );
}
