const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Roxiler Systems API',
        version: '1.0.0',
        description: 'Swagger documentation for the Roxiler Systems backend API.'
    },
    servers: [
        {
            url: '/api/v1',
            description: 'Local development server'
        }
    ],
    tags: [
        { name: 'Health', description: 'Server status and landing routes' },
        { name: 'Auth', description: 'Authentication and account management' },
        { name: 'Admin', description: 'Admin-only management endpoints' },
        { name: 'User Ratings', description: 'User store browsing and rating endpoints' },
        { name: 'Owner', description: 'Store owner dashboard endpoints' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            ApiSuccess: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Request successful' },
                    timestamp: { type: 'string', format: 'date-time' },
                    data: {}
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    statusCode: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Validation failed' },
                    timestamp: { type: 'string', format: 'date-time' },
                    data: {
                        nullable: true
                    }
                }
            },
            AuthRegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'address', 'password', 'confirmPassword'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 20,
                        maxLength: 60,
                        example: 'Johnathan Michael Doe Senior'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    address: {
                        type: 'string',
                        maxLength: 400,
                        example: '221B Baker Street, London'
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 16,
                        example: 'Password@1'
                    },
                    confirmPassword: {
                        type: 'string',
                        example: 'Password@1'
                    }
                }
            },
            AuthLoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    },
                    password: {
                        type: 'string',
                        example: 'Password@1'
                    }
                }
            },
            ForgotPasswordRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'john.doe@example.com'
                    }
                }
            },
            ResetPasswordRequest: {
                type: 'object',
                required: ['token', 'password', 'confirmPassword'],
                properties: {
                    token: {
                        type: 'string',
                        example: 'reset-token-here'
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 16,
                        example: 'Password@1'
                    },
                    confirmPassword: {
                        type: 'string',
                        example: 'Password@1'
                    }
                }
            },
            ChangePasswordRequest: {
                type: 'object',
                required: ['userId', 'currentPassword', 'newPassword'],
                properties: {
                    userId: {
                        type: 'string',
                        format: 'uuid',
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    },
                    currentPassword: {
                        type: 'string',
                        example: 'OldPassword@1'
                    },
                    newPassword: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 16,
                        example: 'NewPassword@1'
                    }
                }
            },
            RefreshTokenRequest: {
                type: 'object',
                properties: {
                    refreshToken: {
                        type: 'string',
                        description: 'Optional when the refresh token is already stored in the cookie.',
                        example: 'refresh-token-here'
                    }
                }
            },
            CreateStoreRequest: {
                type: 'object',
                required: ['name', 'email', 'address'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 3,
                        maxLength: 100,
                        example: 'Downtown Grocery'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'store@example.com'
                    },
                    address: {
                        type: 'string',
                        maxLength: 400,
                        example: '12 Market Road, New Delhi'
                    },
                    ownerId: {
                        type: 'string',
                        format: 'uuid',
                        nullable: true,
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    }
                }
            },
            CreateUserRequest: {
                type: 'object',
                required: ['name', 'email', 'address', 'password', 'role'],
                properties: {
                    name: {
                        type: 'string',
                        minLength: 20,
                        maxLength: 60,
                        example: 'Johnathan Michael Doe Senior'
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com'
                    },
                    address: {
                        type: 'string',
                        maxLength: 400,
                        example: '221B Baker Street, London'
                    },
                    password: {
                        type: 'string',
                        minLength: 8,
                        maxLength: 16,
                        example: 'Password@1'
                    },
                    role: {
                        type: 'string',
                        enum: ['USER', 'ADMIN', 'STORE_OWNER'],
                        example: 'USER'
                    }
                }
            },
            SubmitRatingRequest: {
                type: 'object',
                required: ['storeId', 'rating'],
                properties: {
                    storeId: {
                        type: 'string',
                        format: 'uuid',
                        example: '550e8400-e29b-41d4-a716-446655440000'
                    },
                    rating: {
                        type: 'integer',
                        minimum: 1,
                        maximum: 5,
                        example: 4
                    }
                }
            },
            StoreSummary: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    address: { type: 'string' },
                    owner_id: { type: 'string', format: 'uuid', nullable: true },
                    overall_rating: { type: 'number', example: 4.5 },
                    user_submitted_rating: { type: 'number', nullable: true, example: 5 }
                }
            },
            RatingRecord: {
                type: 'object',
                properties: {
                    rating_id: { type: 'string', format: 'uuid' },
                    rating: { type: 'integer', example: 4 },
                    created_at: { type: 'string', format: 'date-time' },
                    reviewer_name: { type: 'string' },
                    reviewer_email: { type: 'string', format: 'email' }
                }
            },
            OwnerDashboard: {
                type: 'object',
                properties: {
                    storeName: { type: 'string' },
                    averageRating: { type: 'number', example: 4.2 },
                    reviewersCount: { type: 'integer', example: 12 },
                    reviews: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/RatingRecord' }
                    }
                }
            },
            OwnerRatingUser: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    address: { type: 'string' }
                }
            },
            OwnerRatingItem: {
                type: 'object',
                properties: {
                    ratingId: { type: 'string', format: 'uuid' },
                    rating: { type: 'integer', example: 4 },
                    createdAt: { type: 'string', format: 'date-time' },
                    user: {
                        $ref: '#/components/schemas/OwnerRatingUser'
                    }
                }
            },
            OwnerRatings: {
                type: 'object',
                properties: {
                    storeName: { type: 'string' },
                    totalRatings: { type: 'integer', example: 12 },
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 10 },
                    totalPages: { type: 'integer', example: 2 },
                    ratings: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/OwnerRatingItem' }
                    }
                }
            },
            AdminStats: {
                type: 'object',
                properties: {
                    totalUsers: { type: 'integer', example: 100 },
                    totalStores: { type: 'integer', example: 12 },
                    totalRatings: { type: 'integer', example: 84 }
                }
            },
            UserDetails: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    address: { type: 'string' },
                    role: { type: 'string', enum: ['USER', 'ADMIN', 'STORE_OWNER'] },
                    created_at: { type: 'string', format: 'date-time' },
                    storeRating: { type: 'number', nullable: true, example: 4.5 }
                }
            }
        }
    },
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                responses: {
                    200: {
                        description: 'Server is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/ApiSuccess'
                                },
                                example: {
                                    success: true,
                                    message: 'Server is running'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new account',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthRegisterRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'User registered',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    400: { description: 'Validation failed' },
                    409: { description: 'Email already exists' }
                }
            }
        },
        '/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login and receive an access token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthLoginRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Login successful',
                        headers: {
                            'Set-Cookie': {
                                description: 'Refresh token cookie'
                            }
                        },
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    400: { description: 'Invalid credentials or validation failed' }
                }
            }
        },
        '/auth/refresh': {
            post: {
                tags: ['Auth'],
                summary: 'Refresh an access token',
                description: 'Uses the refreshToken cookie when available. You can also send refreshToken in the request body.',
                requestBody: {
                    required: false,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RefreshTokenRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Token refreshed',
                        headers: {
                            'Set-Cookie': {
                                description: 'Rotated refresh token cookie'
                            }
                        },
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Missing or invalid refresh token' }
                }
            }
        },
        '/auth/verify-email/{token}': {
            get: {
                tags: ['Auth'],
                summary: 'Verify an email token',
                parameters: [
                    {
                        name: 'token',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: { description: 'Email verified successfully' },
                    400: { description: 'Invalid verification token' }
                }
            }
        },
        '/auth/forgot-password': {
            post: {
                tags: ['Auth'],
                summary: 'Request a password reset link',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ForgotPasswordRequest' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Reset flow accepted' }
                }
            }
        },
        '/auth/reset-password': {
            post: {
                tags: ['Auth'],
                summary: 'Reset a password with a token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ResetPasswordRequest' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Password reset successfully' },
                    400: { description: 'Validation failed or token invalid' }
                }
            }
        },
        '/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get the current authenticated user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Authenticated user profile' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/auth/change-password': {
            patch: {
                tags: ['Auth'],
                summary: 'Change the current password',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ChangePasswordRequest' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Password changed successfully' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Log out the current user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Logged out successfully' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/admin/dashboard-stats': {
            get: {
                tags: ['Admin'],
                summary: 'Fetch admin dashboard metrics',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Dashboard statistics',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Admin access required' }
                }
            }
        },
        '/admin/stores': {
            post: {
                tags: ['Admin'],
                summary: 'Create a store',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateStoreRequest' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Store created successfully' },
                    400: { description: 'Validation failed' },
                    409: { description: 'Store email already registered' }
                }
            },
            get: {
                tags: ['Admin'],
                summary: 'List stores',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'sortBy', in: 'query', schema: { type: 'string' } },
                    { name: 'order', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'] } }
                ],
                responses: {
                    200: {
                        description: 'Store listings',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/ApiSuccess' }
                                    ]
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Admin access required' }
                }
            }
        },
        '/admin/users': {
            post: {
                tags: ['Admin'],
                summary: 'Create a user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateUserRequest' }
                        }
                    }
                },
                responses: {
                    201: { description: 'User created successfully' },
                    400: { description: 'Validation failed' },
                    409: { description: 'Email already exists' }
                }
            },
            get: {
                tags: ['Admin'],
                summary: 'List users',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'role', in: 'query', schema: { type: 'string', enum: ['USER', 'ADMIN', 'STORE_OWNER'] } },
                    { name: 'sortBy', in: 'query', schema: { type: 'string' } },
                    { name: 'order', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'] } }
                ],
                responses: {
                    200: { description: 'User listings' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Admin access required' }
                }
            }
        },
        '/admin/users/{id}': {
            get: {
                tags: ['Admin'],
                summary: 'Get user details by id',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string', format: 'uuid' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Detailed user information',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Admin access required' },
                    404: { description: 'User not found' }
                }
            }
        },
        '/user/stores': {
            get: {
                tags: ['User Ratings'],
                summary: 'Browse stores as an authenticated user',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' } }
                ],
                responses: {
                    200: {
                        description: 'Store list for the current user',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'User role required' }
                }
            }
        },
        '/user/submit': {
            post: {
                tags: ['User Ratings'],
                summary: 'Create or update a store rating',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SubmitRatingRequest' }
                        }
                    }
                },
                responses: {
                    200: { description: 'Rating saved successfully' },
                    400: { description: 'Validation failed' },
                    401: { description: 'Unauthorized' },
                    403: { description: 'User role required' }
                }
            }
        },
        '/owner/dashboard': {
            get: {
                tags: ['Owner'],
                summary: 'Get the store owner dashboard',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Owner dashboard data',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Store owner role required' },
                    404: { description: 'Store not found for owner' }
                }
            }
        },
        '/owner/ratings': {
            get: {
                tags: ['Owner'],
                summary: 'List users who rated the owner store',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by user name, email, or address' },
                    { name: 'rating', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 5 }, description: 'Filter by exact rating value' },
                    { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['createdAt', 'rating', 'userName', 'userEmail'] } },
                    { name: 'order', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'] } },
                    { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 } }
                ],
                responses: {
                    200: {
                        description: 'Owner store ratings',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ApiSuccess' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' },
                    403: { description: 'Store owner role required' },
                    404: { description: 'Store not found for owner' }
                }
            }
        },
        // Append the following endpoints into the swaggerDocument.paths structure of backend/src/docs/swagger.js:

        "/admin/unassigned-owners": {
            "get": {
                "tags": ["Admin"],
                "summary": "Fetch registered store owners with no commercial venue linkages",
                "security": [{ "bearerAuth": [] }],
                "responses": {
                    "200": {
                        "description": "Array list parsed successfully",
                        "content": {
                            "application/json": {
                                "example": {
                                    "success": true,
                                    "message": "Unassigned system store owners loaded successfully",
                                    "data": [
                                        { "label": "Johnathan Doe", "value": "550e8400-e29b-41d4-a716-446655440000" }
                                    ]
                                }
                            }
                        }
                    },
                    "401": { "description": "Unauthorized" },
                    "403": { "description": "Admin access required" }
                }
            }
        },
        "/admin/ratings": {
            "get": {
                "tags": ["Admin"],
                "summary": "Global platform administrative ratings registry ledger feed",
                "security": [{ "bearerAuth": [] }],
                "parameters": [
                    { "name": "search", "in": "query", "schema": { "type": "string" } },
                    { "name": "scoreFilter", "in": "query", "schema": { "type": "string" }, "description": "Filter by exact stars count or ALL" },
                    { "name": "sortBy", "in": "query", "schema": { "type": "string", "enum": ["submittedAt", "ratingValue"] } },
                    { "name": "order", "in": "query", "schema": { "type": "string", "enum": ["ASC", "DESC"] } }
                ],
                "responses": {
                    "200": { "description": "Platform ratings ledger parsed successfully" },
                    "401": { "description": "Unauthorized" }
                }
            }
        },
        "/user/history-log": {
            "get": {
                "tags": ["User Ratings"],
                "summary": "Fetch historical rating interaction tracking metrics logged by current user session",
                "security": [{ "bearerAuth": [] }],
                "parameters": [
                    { "name": "search", "in": "query", "schema": { "type": "string" } },
                    { "name": "sortBy", "in": "query", "schema": { "type": "string", "enum": ["loggedDate", "scoreSubmitted", "storeName"] } },
                    { "name": "order", "in": "query", "schema": { "type": "string", "enum": ["ASC", "DESC"] } }
                ],
                "responses": {
                    "200": { "description": "Personal evaluation logs fetched successfully" },
                    "401": { "description": "Unauthorized" }
                }
            }
        }
    }
};

export default swaggerDocument;
