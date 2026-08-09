import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ApartmentModuleController::open
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
export const open = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: open.url(args, options),
    method: 'patch',
})

open.definition = {
    methods: ["patch"],
    url: '/communication/conversations/{conversation}/open',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::open
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
open.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return open.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::open
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
open.patch = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: open.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::open
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
    const openForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: open.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::open
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
        openForm.patch = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: open.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    open.form = openForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::create
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

create.definition = {
    methods: ["post"],
    url: '/communication/conversations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::create
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::create
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
create.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: create.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::create
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: create.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::create
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
        createForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: create.url(options),
            method: 'post',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::message
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
export const message = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(args, options),
    method: 'post',
})

message.definition = {
    methods: ["post"],
    url: '/communication/conversations/{conversation}/message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::message
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
message.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return message.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::message
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
message.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: message.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::message
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
    const messageForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: message.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::message
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
        messageForm.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: message.url(args, options),
            method: 'post',
        })
    
    message.form = messageForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
export const deleteMethod = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/communication/conversations/{conversation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
deleteMethod.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conversation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conversation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conversation: typeof args.conversation === 'object'
                ? args.conversation.id
                : args.conversation,
                }

    return deleteMethod.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
deleteMethod.delete = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
    const deleteMethodForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteMethod.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
        deleteMethodForm.delete = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const conversations = {
    open: Object.assign(open, open),
create: Object.assign(create, create),
message: Object.assign(message, message),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default conversations