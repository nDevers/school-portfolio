'use strict';

import { AboutUsModel } from '@/shared/prisma.model.shared';
import serviceShared from '@/shared/service.shared';

import asyncHandler from '@/util/asyncHandler';
import aboutUsSelectionCriteria from '@/app/api/v1/about-us/about.us.selection.criteria';

/**
 * Asynchronous handler function to retrieve the "About Us" entry by its unique identifier.
 *
 * @param {Object} request - The incoming request object containing necessary parameters such as the ID.
 * @param {Object} context - The context object containing information required for the execution of the function.
 * @returns {Promise<Object>} Resolves with the fetched "About Us" entry object or an error if the retrieval fails.
 */
export const handleGetAboutUsById = async (request, context) => {
    const selectionCriteria = aboutUsSelectionCriteria();

    return serviceShared.fetchEntryById(
        request,
        context,
        AboutUsModel,
        selectionCriteria,
        'About us'
    );
};

/**
 * @swagger
 * /api/v1/about-us/{id}:
 *   get:
 *     summary: Retrieve "About Us" entry by ID
 *     description: Fetches a specific "About Us" entry from the database using a unique identifier.
 *
 *     tags:
 *       - About Us
 *
 *     query:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the "About Us" entry to retrieve.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the "About Us" entry to retrieve.
 *
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved "About Us" entry.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutUs'
 *
 *       400:
 *         description: Bad Request - Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/errors/400'
 *
 *       404:
 *         description: Entry not found.
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
 *                   example: "No About us entry with the ID: '123' available at this time."
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
 * GET variable is assigned an asynchronous handler function.
 * This handler is responsible for processing GET requests, specifically those
 * related to retrieving information about "About Us" content by a given ID.
 *
 * The assigned function typically uses the `asyncHandler` utility to manage
 * asynchronous request processing and error handling.
 *
 * @type {Function}
 */
export const GET = asyncHandler(handleGetAboutUsById);
