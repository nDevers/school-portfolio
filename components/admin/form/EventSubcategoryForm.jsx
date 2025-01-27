'use client';

import InputWrapper from '@/components/ui/input-wrapper';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { fetchData, postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import ComboboxFormik from '@/components/ui/ComboboxFormik';

export default function EventSubcategoryForm({ data }) {
    const queryClient = useQueryClient();
    const initialValues = {
        subCategory: data?.subCategory || '',
        category: data?.category || '',
    };

    const validationSchema = Yup.object({
        subCategory: Yup.string().required('Required field'),
        category: Yup.string().required('Required field'),
    });

    const submit = async (values) => {
        if (data) {
            await updateData(
                apiConfig?.UPDATE_EVENT_SUBCATEGORY + data?._id,
                values
            );
        } else {
            await postData(apiConfig?.CREATE_EVENT_SUBCATEGORY, values);
        }
    };

    const reset = () => {
        formik?.resetForm();
        queryClient.invalidateQueries(['sub-category']);
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => mutation.mutate(values),
        validateOnBlur: true,
        validateOnChange: true,
    });

    const mutation = useMutation({
        mutationKey: ['event-category'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    const { data: category } = useQuery({
        queryKey: ['category'],
        queryFn: async () => await fetchData(apiConfig?.GET_EVENT_CATEGORY),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            <div className='grid md:grid-cols-2 gap-2 w-full'>
                <InputWrapper
                    label='Subcategory'
                    error={formik.errors?.subCategory}
                    touched={formik.touched?.subCategory}
                >
                    <Input
                        name='subCategory'
                        placeholder='Subcategory'
                        value={formik.values?.subCategory}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Category'
                    error={formik.errors?.category}
                    touched={formik.touched?.category}
                >
                    <ComboboxFormik
                        select='_id'
                        display='category'
                        name='category'
                        formik={formik}
                        data={category}
                    />
                </InputWrapper>
            </div>

            <div className='flex items-center space-x-2'>
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
