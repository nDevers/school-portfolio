'use client';
import React from 'react';
import InputWrapper from '@/components/ui/input-wrapper';
import Add from '@/components/button/Add';
import Remove from '@/components/button/Remove';
import Reset from '@/components/button/Reset';
import Submit from '@/components/button/Submit';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import {
    clearField,
    handleArrayFieldChange,
    handleImageChange,
} from '@/util/formikHelpers';
import { postData, updateData } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';
import { GoX } from 'react-icons/go';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getChangedValues } from '@/util/getChangedValues';

export default function ConfigurationForm({ data }) {
    const initialValues = {
        name: data?.name || '',
        description: data?.description || '',
        logo: '',
        dataImage: data?.logo || '',
        address: data?.address || '',
        emails: data?.emails || [''],
        deleteEmails: [],
        contacts: data?.contacts || [''],
        deleteContacts: [],
        socialLinks: data?.socialLinks || [''],
        deleteSocialLinks: [],
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required field'),
        description: Yup.string(),
        logo: Yup.mixed()
            // .required('Image is required')
            .test(
                'fileSize',
                'File size too large',
                (value) => !value || (value && value.size <= 2000000)
            ) // 2MB limit
            .test(
                'fileType',
                'Unsupported file format',
                (value) =>
                    !value ||
                    [
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/gif',
                    ].includes(value.type)
            ),
        address: Yup.string().required('Address is required'),
        emails: Yup.array()
            .of(
                Yup.string()
                    .email('Invalid email address')
                    .required('Email is required')
            )
            .min(1, 'At least one email is required'),
        contacts: Yup.array()
            .of(
                Yup.string()
                    .matches(
                        /^(?:\+?88)?01[3-9]\d{8}$/,
                        'Invalid Bangladeshi phone number'
                    )
                    .required('Contact number is required')
            )
            .min(1, 'At least one contact is required'),
        socialLinks: Yup.array()
            .of(
                Yup.string()
                    .url('Must be a valid URL')
                    .required('Social link is required')
            )
            .min(1, 'At least one social link is required'),
    });

    const submit = async (values) => {
        const changedValues = getChangedValues(initialValues, values);

        if (Object.keys(changedValues).length === 0) {
            toast.info('No changes detected.');
            return;
        }

        const formData = new FormData();

        // Helper to append values if not null or undefined
        const appendValue = (key, value) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    // For arrays, append each item
                    value.forEach((item) => formData.append(key, item));
                } else if (value instanceof File) {
                    // For files, append directly
                    formData.append(key, value);
                } else {
                    // For other types, append directly
                    formData.append(key, value);
                }
            }
        };

        // Append changed values to formData
        Object.entries(changedValues).forEach(([key, value]) => {
            if (key === 'logo' && value instanceof File) {
                formData.append('logo', value); // Special case for file input
            } else if (Array.isArray(value)) {
                value.forEach((item) => formData.append(key, item));
            } else {
                appendValue(key, value);
            }
        });

        if (data) {
            await updateData(apiConfig?.UPDATE_CONFIGURATION, formData);
        } else {
            await postData(apiConfig?.CREATE_CONFIGURATION, formData);
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
        mutationKey: ['configuration'],
        mutationFn: submit,
        onSuccess: () => reset(),
    });

    return (
        <form onSubmit={formik.handleSubmit} className='w-full space-y-10'>
            {(formik?.values?.logo || formik?.values?.dataImage) && (
                <div className='flex items-center justify-end relative'>
                    <img
                        src={
                            formik.values.logo instanceof File
                                ? URL.createObjectURL(formik.values.logo)
                                : formik?.values?.dataImage
                        }
                        alt='Selected Image'
                        className='w-24 h-24 object-cover border border-dashed rounded-md p-1'
                    />
                    <Button
                        type='button'
                        size='icon'
                        disabled={!formik.values.logo}
                        onClick={() => {
                            clearField(formik, 'logo');
                            formik.setFieldValue('dataImage', '');
                        }}
                        className='absolute -top-1 -right-1 w-6 h-6 bg-rose-500 hover:bg-rose-600 rounded-full'
                    >
                        <GoX />
                    </Button>
                </div>
            )}
            <div className='grid gap-2 w-full'>
                <InputWrapper
                    label='Name'
                    error={formik.errors?.name}
                    touched={formik.touched?.name}
                >
                    <Input
                        name='name'
                        placeholder='Your Name'
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Description'
                    error={formik.errors?.description}
                    touched={formik.touched?.description}
                >
                    <Textarea
                        name='description'
                        placeholder='Description of the Organization'
                        rows={3}
                        value={formik.values?.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Logo URL'
                    error={formik.errors?.logo}
                    touched={formik.touched?.logo}
                >
                    <Input
                        name='logo'
                        type='file'
                        accept='image/png, image/gif, image/jpeg, image/jpg'
                        onChange={handleImageChange(formik, 'logo')}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                <InputWrapper
                    label='Address'
                    error={formik.errors?.address}
                    touched={formik.touched?.address}
                >
                    <Input
                        name='address'
                        placeholder='Address'
                        value={formik.values?.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </InputWrapper>

                {/* Emails Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Emails'
                        error={formik.errors?.emails}
                        touched={formik.touched?.emails}
                    >
                        {formik.values.emails.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`emails[${index}]`}
                                    placeholder={`Email ${index + 1}`}
                                    value={formik.values.emails[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={formik.values.emails.length === 1}
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'emails',
                                            index,
                                            'deleteEmails'
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Email'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'emails')
                        }
                    />
                </div>

                {/* Contacts Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Contact Numbers'
                        error={formik.errors?.contacts}
                        touched={formik.touched?.contacts}
                    >
                        {formik.values.contacts.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`contacts[${index}]`}
                                    placeholder={`Contact Number ${index + 1}`}
                                    value={formik.values.contacts[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={
                                        formik.values.contacts.length === 1
                                    }
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'contacts',
                                            index,
                                            'deleteContacts'
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Contact'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'contacts')
                        }
                    />
                </div>

                {/* Social Links Field Array */}
                <div className='space-y-2'>
                    <InputWrapper
                        label='Social Links'
                        error={formik.errors?.socialLinks}
                        touched={formik.touched?.socialLinks}
                    >
                        {formik.values.socialLinks.map((_, index) => (
                            <div
                                key={index}
                                className='flex gap-2 items-center'
                            >
                                <Input
                                    name={`socialLinks[${index}]`}
                                    placeholder={`Social Link URL ${index + 1}`}
                                    value={formik.values.socialLinks[index]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className='flex-1'
                                />
                                <Remove
                                    disabled={
                                        formik.values.socialLinks.length === 1
                                    }
                                    onClick={() =>
                                        handleArrayFieldChange(
                                            formik,
                                            'remove',
                                            'socialLinks',
                                            index,
                                            'deleteSocialLinks'
                                        )
                                    }
                                />
                            </div>
                        ))}
                    </InputWrapper>
                    <Add
                        label='Add Social Link'
                        onClick={() =>
                            handleArrayFieldChange(formik, 'add', 'socialLinks')
                        }
                    />
                </div>
            </div>

            <div className='flex items-center space-x-2'>
                <Reset onClick={reset} />
                <Submit disabled={mutation.isPending} />
            </div>
        </form>
    );
}
