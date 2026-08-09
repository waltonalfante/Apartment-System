import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ApartmentModuleController::toggle
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
export const toggle = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

toggle.definition = {
    methods: ["patch"],
    url: '/reservation/rooms/{room}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::toggle
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
toggle.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return toggle.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::toggle
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
toggle.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::toggle
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
    const toggleForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::toggle
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
        toggleForm.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggle.form = toggleForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::reserve
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
export const reserve = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reserve.url(args, options),
    method: 'post',
})

reserve.definition = {
    methods: ["post"],
    url: '/reservation/rooms/{room}/reserve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::reserve
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
reserve.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return reserve.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::reserve
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
reserve.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reserve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::reserve
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
    const reserveForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reserve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::reserve
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
        reserveForm.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reserve.url(args, options),
            method: 'post',
        })
    
    reserve.form = reserveForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::cancel
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
export const cancel = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

cancel.definition = {
    methods: ["patch"],
    url: '/reservation/rooms/{room}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::cancel
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
cancel.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return cancel.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::cancel
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
cancel.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancel.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::cancel
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
    const cancelForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::cancel
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
        cancelForm.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::photo
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
export const photo = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photo.url(args, options),
    method: 'post',
})

photo.definition = {
    methods: ["post"],
    url: '/reservation/rooms/{room}/photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::photo
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
photo.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { room: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { room: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    room: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        room: typeof args.room === 'object'
                ? args.room.id
                : args.room,
                }

    return photo.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::photo
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
photo.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: photo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::photo
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
    const photoForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: photo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::photo
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
        photoForm.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: photo.url(args, options),
            method: 'post',
        })
    
    photo.form = photoForm
const rooms = {
    toggle: Object.assign(toggle, toggle),
reserve: Object.assign(reserve, reserve),
cancel: Object.assign(cancel, cancel),
photo: Object.assign(photo, photo),
}

export default rooms