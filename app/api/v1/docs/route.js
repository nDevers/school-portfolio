'use strict';

import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from '@/swaggerDoc';

import asyncHandler from '@/util/asyncHandler';

const handleDocs = async (response) => {
    response.setHeader('Content-Type', 'text/html');

    response.send(
        swaggerUi.generateHTML(swaggerSpec, {
            explorer: true,
        })
    );
};

export const POST = asyncHandler(handleDocs);
