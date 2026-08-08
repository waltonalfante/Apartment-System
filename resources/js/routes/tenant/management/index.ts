import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ApartmentModuleController::store
 * @see app/Http/Controllers/ApartmentModuleController.php:443
 * @route '/tenant-management/tenants'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/tenant-management/tenants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::store
 * @see app/Http/Controllers/ApartmentModuleController.php:443
 * @route '/tenant-management/tenants'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::store
 * @see app/Http/Controllers/ApartmentModuleController.php:443
 * @route '/tenant-management/tenants'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::store
 * @see app/Http/Controllers/ApartmentModuleController.php:443
 * @route '/tenant-management/tenants'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::store
 * @see app/Http/Controllers/ApartmentModuleController.php:443
 * @route '/tenant-management/tenants'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::update
 * @see app/Http/Controllers/ApartmentModuleController.php:516
 * @route '/tenant-management/tenants/{tenant}'
 */
export const update = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::update
 * @see app/Http/Controllers/ApartmentModuleController.php:516
 * @route '/tenant-management/tenants/{tenant}'
 */
update.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tenant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tenant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tenant: typeof args.tenant === 'object'
                ? args.tenant.id
                : args.tenant,
                }

    return update.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::update
 * @see app/Http/Controllers/ApartmentModuleController.php:516
 * @route '/tenant-management/tenants/{tenant}'
 */
update.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::update
 * @see app/Http/Controllers/ApartmentModuleController.php:516
 * @route '/tenant-management/tenants/{tenant}'
 */
    const updateForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::update
 * @see app/Http/Controllers/ApartmentModuleController.php:516
 * @route '/tenant-management/tenants/{tenant}'
 */
        updateForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::extend
 * @see app/Http/Controllers/ApartmentModuleController.php:690
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
export const extend = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: extend.url(args, options),
    method: 'patch',
})

extend.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}/extend-stay',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::extend
 * @see app/Http/Controllers/ApartmentModuleController.php:690
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
extend.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tenant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tenant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tenant: typeof args.tenant === 'object'
                ? args.tenant.id
                : args.tenant,
                }

    return extend.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::extend
 * @see app/Http/Controllers/ApartmentModuleController.php:690
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
extend.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: extend.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::extend
 * @see app/Http/Controllers/ApartmentModuleController.php:690
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
    const extendForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: extend.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::extend
 * @see app/Http/Controllers/ApartmentModuleController.php:690
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
        extendForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: extend.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    extend.form = extendForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::checkout
 * @see app/Http/Controllers/ApartmentModuleController.php:624
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
export const checkout = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: checkout.url(args, options),
    method: 'patch',
})

checkout.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}/checkout',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkout
 * @see app/Http/Controllers/ApartmentModuleController.php:624
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
checkout.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tenant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tenant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tenant: typeof args.tenant === 'object'
                ? args.tenant.id
                : args.tenant,
                }

    return checkout.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkout
 * @see app/Http/Controllers/ApartmentModuleController.php:624
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
checkout.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: checkout.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::checkout
 * @see app/Http/Controllers/ApartmentModuleController.php:624
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
    const checkoutForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkout.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::checkout
 * @see app/Http/Controllers/ApartmentModuleController.php:624
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
        checkoutForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkout.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    checkout.form = checkoutForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:609
 * @route '/tenant-management/tenants/{tenant}'
 */
export const deleteMethod = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/tenant-management/tenants/{tenant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:609
 * @route '/tenant-management/tenants/{tenant}'
 */
deleteMethod.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tenant: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tenant: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tenant: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tenant: typeof args.tenant === 'object'
                ? args.tenant.id
                : args.tenant,
                }

    return deleteMethod.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:609
 * @route '/tenant-management/tenants/{tenant}'
 */
deleteMethod.delete = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteMethod
 * @see app/Http/Controllers/ApartmentModuleController.php:609
 * @route '/tenant-management/tenants/{tenant}'
 */
    const deleteMethodForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/ApartmentModuleController.php:609
 * @route '/tenant-management/tenants/{tenant}'
 */
        deleteMethodForm.delete = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteMethod.form = deleteMethodForm
const management = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
extend: Object.assign(extend, extend),
checkout: Object.assign(checkout, checkout),
delete: Object.assign(deleteMethod, deleteMethod),
}

export default management