'use client';
import { useState } from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import ComboboxFormik from '@/components/ui/ComboboxFormik';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { Checkbox } from '@/components/ui/checkbox';
import { handleCheckboxChange } from '@/util/formikHelpers';
import { Card, CardHeader } from '@/components/ui/card';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

const transactionTypes = [
    { id: 'disbursement', type: 'Disbursement' },
    { id: 'return', type: 'Return' },
];

export default function EventBudgetForm({ data }) {
    const [selectedEvent, setSelectedEvent] = useState(null);

    console.info(setSelectedEvent);

    const initialValues = {
        eventId: data?.eventId || '',
        budget: data?.budget || '',
        transactionType: data?.transactionType || '',
        hasBankDetails: data?.hasBankDetails || false,
        bankDetails: data?.bankDetails || {
            bankName: '',
            branchName: '',
        },
    };

    const validationSchema = Yup.object().shape({
        eventId: Yup.string().required('Please select an event'),
        budget: Yup.number()
            .required('Budget is required')
            .positive('Budget must be positive')
            .test(
                'budget-limit',
                'Budget exceeds the allowed Budget',
                (value) => {
                    // Check if previous budget is present
                    if (selectedEvent?.previousBudget) {
                        return value <= selectedEvent.previousBudget;
                    }
                    return true; // No limit if there's no previous budget
                }
            ),
        transactionType: Yup.string()
            .required('Transaction type is required')
            .test(
                'restrict-return',
                'Return action is not allowed without a previous budget',
                (value) => {
                    // Restrict "Return" action if there's no previous budget
                    if (!selectedEvent?.previousBudget && value === 'return') {
                        return false;
                    }
                    return true;
                }
            ),
        hasBankDetails: Yup.boolean(),
        bankDetails: Yup.lazy((_, { parent }) => {
            if (parent.hasBankDetails) {
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
            await updateData(apiConfig?.UPDATE_BUDGET + data?._id, values);
        } else {
            await postData(apiConfig?.CREATE_BUDGET, values);
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
        mutationKey: ['event-budget'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { data: event } = useQuery({
        queryKey: ['events'],
        queryFn: async () => await fetchData(apiConfig?.GET_EVENT),
    });

    // const { isLoading: eventDetailsLoading, data: eventDetails } = useQuery({
    //     queryKey: ['events', formik.values?.eventId],
    //     queryFn: async () => {
    //         const data = await fetchData(
    //             apiConfig?.GET_EVENT_BY_ID + formik.values?.eventId
    //         );
    //         if (data) {
    //             setSelectedEvent(data);
    //         }
    //     },
    //     enabled: !!formik.values?.eventId,
    // });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-3 gap-2 w-full'>
                <InputWrapper
                    label='Event'
                    error={formik.errors?.eventId}
                    touched={formik.touched?.eventId}
                >
                    <ComboboxFormik
                        select='_id'
                        display='title'
                        name='eventId'
                        formik={formik}
                        data={event}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Budget'
                    error={formik.errors?.budget}
                    touched={formik.touched?.budget}
                >
                    <Input
                        name='budget'
                        type='number'
                        placeholder='Budget'
                        value={formik.values?.budget}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Transaction Type'
                    error={formik.errors?.transactionType}
                    touched={formik.touched?.transactionType}
                >
                    <ComboboxFormik
                        select='id'
                        display='type'
                        name='transactionType'
                        formik={formik}
                        data={transactionTypes}
                    />
                </InputWrapper>
            </div>

            <label className='w-fit flex items-center space-x-2'>
                <span>Bank details required</span>
                <Checkbox
                    checked={formik.values.hasBankDetails}
                    onCheckedChange={handleCheckboxChange(
                        formik,
                        'hasBankDetails'
                    )}
                />
            </label>

            {formik.values.hasBankDetails && (
                <div className='grid gap-2 md:grid-cols-2'>
                    {['bankName', 'branchName'].map((field) => (
                        <InputWrapper
                            key={field}
                            label={
                                field.charAt(0).toUpperCase() + field.slice(1)
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
            )}

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending || mutation.isSuccess} />
            </div>

            {selectedEvent && (
                <Card>
                    <CardHeader>
                        <h2 className='text-lg font-semibold'>
                            Selected Event Details:
                        </h2>
                        <p>
                            <strong>Event Name:</strong> {selectedEvent?.title}
                        </p>
                        {selectedEvent?.previousBudget && (
                            <p>
                                <strong>Previous Budget:</strong> $
                                {selectedEvent?.previousBudget}
                            </p>
                        )}
                    </CardHeader>
                </Card>
            )}
        </form>
    );
}
