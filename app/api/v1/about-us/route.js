'use strict';

import { AboutUsModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';
import aboutUsSchema from '@/app/api/v1/about-us/about.us.schema';

import asyncHandler from '@/util/asyncHandler';
import aboutUsSelectionCriteria from '@/app/api/v1/about-us/about.us.selection.criteria';

/**
 * Asynchronous function to handle the retrieval of the career list.
 *
 * This function is responsible for fetching the list of entries based on
 * the "About us" selection criteria. It utilizes shared service logic to
 * retrieve the data and formats it according to the specific schema.
 *
 * @function
 * @async
 * @param {Object} request - The incoming request object containing relevant data for processing.
 * @param {Object} context - Contextual information for the current operation.
 * @returns {Promise<Object>} A promise that resolves to the list of entries.
 */
const handleGetCareerList = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryList(
        request,
        context,
        AboutUsModel,
        selectionCriteria,
        'About us',
        aboutUsSchema.getDataByQuery
    );
};

/**
 * @swagger
 * /api/v1/about-us:
 *   get:
 *     summary: Retrieve a list of "About Us" entries.
 *     description: Fetches a list of entries based on the "About Us" selection criteria. The response includes the relevant data formatted according to the schema.
 *
 *     tags:
 *       - About Us
 *
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter by the ID of the "About Us" entry.
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by the title of the "About Us" entry.
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by the description of the "About Us" entry.
 *       - in: query
 *         name: createdAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by the creation timestamp of the "About Us" entry.
 *       - in: query
 *         name: updatedAt
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by the last update timestamp of the "About Us" entry.
 *
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of entries.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AboutUs'
 *                 total:
 *                   type: integer
 *                   description: The total number of matching "About Us" entries.
 *
 *       400:
 *         description: Bad Request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/400'
 *
 *       404:
 *         description: No "About Us" entries found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "About us entry fetched successfully."
 *
 *       415:
 *         description: Unsupported Media Type - Unsupported content type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/415'
 *
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/500'
 */

/**
 * GET is an async function used to handle HTTP GET requests.
 * It leverages the `asyncHandler` utility to manage asynchronous
 * operations and error handling for the `handleGetCareerList` function.
 *
 * `handleGetCareerList` typically manages fetching and returning
 * a list of careers or related resources.
 *
 * The purpose of wrapping it in `asyncHandler` is to simplify error
 * handling by passing any thrown errors to the global error-handling middleware.
 */
export const GET = asyncHandler(handleGetCareerList);
