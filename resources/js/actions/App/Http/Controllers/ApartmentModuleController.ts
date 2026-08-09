import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::dashboard
 * @see app/Http/Controllers/ApartmentModuleController.php:46
 * @route '/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
export const reservation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reservation.url(options),
    method: 'get',
})

reservation.definition = {
    methods: ["get","head"],
    url: '/reservation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
reservation.url = (options?: RouteQueryOptions) => {
    return reservation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
reservation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reservation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
reservation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reservation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
    const reservationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reservation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
        reservationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reservation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::reservation
 * @see app/Http/Controllers/ApartmentModuleController.php:188
 * @route '/reservation'
 */
        reservationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reservation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reservation.form = reservationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::toggleRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
export const toggleRoom = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRoom.url(args, options),
    method: 'patch',
})

toggleRoom.definition = {
    methods: ["patch"],
    url: '/reservation/rooms/{room}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::toggleRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
toggleRoom.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleRoom.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::toggleRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
toggleRoom.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleRoom.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::toggleRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
    const toggleRoomForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleRoom.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::toggleRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:735
 * @route '/reservation/rooms/{room}/toggle'
 */
        toggleRoomForm.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleRoom.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleRoom.form = toggleRoomForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::reserveRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
export const reserveRoom = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reserveRoom.url(args, options),
    method: 'post',
})

reserveRoom.definition = {
    methods: ["post"],
    url: '/reservation/rooms/{room}/reserve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::reserveRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
reserveRoom.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reserveRoom.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::reserveRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
reserveRoom.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reserveRoom.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::reserveRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
    const reserveRoomForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reserveRoom.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::reserveRoom
 * @see app/Http/Controllers/ApartmentModuleController.php:321
 * @route '/reservation/rooms/{room}/reserve'
 */
        reserveRoomForm.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reserveRoom.url(args, options),
            method: 'post',
        })
    
    reserveRoom.form = reserveRoomForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::confirmCheckIn
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
export const confirmCheckIn = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmCheckIn.url(args, options),
    method: 'post',
})

confirmCheckIn.definition = {
    methods: ["post"],
    url: '/reservation/{reservation}/check-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::confirmCheckIn
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
confirmCheckIn.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { reservation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { reservation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    reservation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        reservation: typeof args.reservation === 'object'
                ? args.reservation.id
                : args.reservation,
                }

    return confirmCheckIn.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::confirmCheckIn
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
confirmCheckIn.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmCheckIn.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::confirmCheckIn
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
    const confirmCheckInForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmCheckIn.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::confirmCheckIn
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
        confirmCheckInForm.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmCheckIn.url(args, options),
            method: 'post',
        })
    
    confirmCheckIn.form = confirmCheckInForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::cancelReservation
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
export const cancelReservation = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancelReservation.url(args, options),
    method: 'patch',
})

cancelReservation.definition = {
    methods: ["patch"],
    url: '/reservation/rooms/{room}/cancel',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::cancelReservation
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
cancelReservation.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelReservation.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::cancelReservation
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
cancelReservation.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cancelReservation.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::cancelReservation
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
    const cancelReservationForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelReservation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::cancelReservation
 * @see app/Http/Controllers/ApartmentModuleController.php:422
 * @route '/reservation/rooms/{room}/cancel'
 */
        cancelReservationForm.patch = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelReservation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancelReservation.form = cancelReservationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
export const tenantManagement = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tenantManagement.url(options),
    method: 'get',
})

tenantManagement.definition = {
    methods: ["get","head"],
    url: '/tenant-management',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
tenantManagement.url = (options?: RouteQueryOptions) => {
    return tenantManagement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
tenantManagement.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tenantManagement.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
tenantManagement.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tenantManagement.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
    const tenantManagementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tenantManagement.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
        tenantManagementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tenantManagement.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::tenantManagement
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
        tenantManagementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tenantManagement.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tenantManagement.form = tenantManagementForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::storeTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:454
 * @route '/tenant-management/tenants'
 */
export const storeTenant = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTenant.url(options),
    method: 'post',
})

storeTenant.definition = {
    methods: ["post"],
    url: '/tenant-management/tenants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::storeTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:454
 * @route '/tenant-management/tenants'
 */
storeTenant.url = (options?: RouteQueryOptions) => {
    return storeTenant.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::storeTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:454
 * @route '/tenant-management/tenants'
 */
storeTenant.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeTenant.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::storeTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:454
 * @route '/tenant-management/tenants'
 */
    const storeTenantForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeTenant.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::storeTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:454
 * @route '/tenant-management/tenants'
 */
        storeTenantForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeTenant.url(options),
            method: 'post',
        })
    
    storeTenant.form = storeTenantForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::updateTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:527
 * @route '/tenant-management/tenants/{tenant}'
 */
export const updateTenant = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTenant.url(args, options),
    method: 'patch',
})

updateTenant.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:527
 * @route '/tenant-management/tenants/{tenant}'
 */
updateTenant.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateTenant.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:527
 * @route '/tenant-management/tenants/{tenant}'
 */
updateTenant.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTenant.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::updateTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:527
 * @route '/tenant-management/tenants/{tenant}'
 */
    const updateTenantForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTenant.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::updateTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:527
 * @route '/tenant-management/tenants/{tenant}'
 */
        updateTenantForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTenant.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateTenant.form = updateTenantForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::extendStay
 * @see app/Http/Controllers/ApartmentModuleController.php:701
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
export const extendStay = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: extendStay.url(args, options),
    method: 'patch',
})

extendStay.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}/extend-stay',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::extendStay
 * @see app/Http/Controllers/ApartmentModuleController.php:701
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
extendStay.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return extendStay.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::extendStay
 * @see app/Http/Controllers/ApartmentModuleController.php:701
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
extendStay.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: extendStay.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::extendStay
 * @see app/Http/Controllers/ApartmentModuleController.php:701
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
    const extendStayForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: extendStay.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::extendStay
 * @see app/Http/Controllers/ApartmentModuleController.php:701
 * @route '/tenant-management/tenants/{tenant}/extend-stay'
 */
        extendStayForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: extendStay.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    extendStay.form = extendStayForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::checkoutTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:635
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
export const checkoutTenant = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: checkoutTenant.url(args, options),
    method: 'patch',
})

checkoutTenant.definition = {
    methods: ["patch"],
    url: '/tenant-management/tenants/{tenant}/checkout',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkoutTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:635
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
checkoutTenant.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkoutTenant.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkoutTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:635
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
checkoutTenant.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: checkoutTenant.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::checkoutTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:635
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
    const checkoutTenantForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkoutTenant.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::checkoutTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:635
 * @route '/tenant-management/tenants/{tenant}/checkout'
 */
        checkoutTenantForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkoutTenant.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    checkoutTenant.form = checkoutTenantForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:620
 * @route '/tenant-management/tenants/{tenant}'
 */
export const deleteTenant = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteTenant.url(args, options),
    method: 'delete',
})

deleteTenant.definition = {
    methods: ["delete"],
    url: '/tenant-management/tenants/{tenant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:620
 * @route '/tenant-management/tenants/{tenant}'
 */
deleteTenant.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return deleteTenant.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:620
 * @route '/tenant-management/tenants/{tenant}'
 */
deleteTenant.delete = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteTenant.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:620
 * @route '/tenant-management/tenants/{tenant}'
 */
    const deleteTenantForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteTenant.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteTenant
 * @see app/Http/Controllers/ApartmentModuleController.php:620
 * @route '/tenant-management/tenants/{tenant}'
 */
        deleteTenantForm.delete = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteTenant.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteTenant.form = deleteTenantForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
export const billing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})

billing.definition = {
    methods: ["get","head"],
    url: '/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
billing.url = (options?: RouteQueryOptions) => {
    return billing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
billing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
billing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: billing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
    const billingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: billing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
        billingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::billing
 * @see app/Http/Controllers/ApartmentModuleController.php:780
 * @route '/billing'
 */
        billingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    billing.form = billingForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::updateBilling
 * @see app/Http/Controllers/ApartmentModuleController.php:841
 * @route '/billing/tenants/{tenant}'
 */
export const updateBilling = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBilling.url(args, options),
    method: 'patch',
})

updateBilling.definition = {
    methods: ["patch"],
    url: '/billing/tenants/{tenant}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateBilling
 * @see app/Http/Controllers/ApartmentModuleController.php:841
 * @route '/billing/tenants/{tenant}'
 */
updateBilling.url = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateBilling.definition.url
            .replace('{tenant}', parsedArgs.tenant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateBilling
 * @see app/Http/Controllers/ApartmentModuleController.php:841
 * @route '/billing/tenants/{tenant}'
 */
updateBilling.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateBilling.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::updateBilling
 * @see app/Http/Controllers/ApartmentModuleController.php:841
 * @route '/billing/tenants/{tenant}'
 */
    const updateBillingForm = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateBilling.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::updateBilling
 * @see app/Http/Controllers/ApartmentModuleController.php:841
 * @route '/billing/tenants/{tenant}'
 */
        updateBillingForm.patch = (args: { tenant: number | { id: number } } | [tenant: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateBilling.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateBilling.form = updateBillingForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
export const communication = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communication.url(options),
    method: 'get',
})

communication.definition = {
    methods: ["get","head"],
    url: '/communication',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
communication.url = (options?: RouteQueryOptions) => {
    return communication.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
communication.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: communication.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
communication.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: communication.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
    const communicationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: communication.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
        communicationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: communication.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::communication
 * @see app/Http/Controllers/ApartmentModuleController.php:757
 * @route '/communication'
 */
        communicationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: communication.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    communication.form = communicationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::openConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
export const openConversation = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: openConversation.url(args, options),
    method: 'patch',
})

openConversation.definition = {
    methods: ["patch"],
    url: '/communication/conversations/{conversation}/open',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::openConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
openConversation.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return openConversation.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::openConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
openConversation.patch = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: openConversation.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::openConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
    const openConversationForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: openConversation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::openConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1027
 * @route '/communication/conversations/{conversation}/open'
 */
        openConversationForm.patch = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: openConversation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    openConversation.form = openConversationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::createConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
export const createConversation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createConversation.url(options),
    method: 'post',
})

createConversation.definition = {
    methods: ["post"],
    url: '/communication/conversations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::createConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
createConversation.url = (options?: RouteQueryOptions) => {
    return createConversation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::createConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
createConversation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createConversation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::createConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
    const createConversationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createConversation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::createConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1091
 * @route '/communication/conversations'
 */
        createConversationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createConversation.url(options),
            method: 'post',
        })
    
    createConversation.form = createConversationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::sendMessage
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
export const sendMessage = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendMessage.url(args, options),
    method: 'post',
})

sendMessage.definition = {
    methods: ["post"],
    url: '/communication/conversations/{conversation}/message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::sendMessage
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
sendMessage.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return sendMessage.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::sendMessage
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
sendMessage.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendMessage.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::sendMessage
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
    const sendMessageForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendMessage.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::sendMessage
 * @see app/Http/Controllers/ApartmentModuleController.php:1046
 * @route '/communication/conversations/{conversation}/message'
 */
        sendMessageForm.post = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendMessage.url(args, options),
            method: 'post',
        })
    
    sendMessage.form = sendMessageForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
export const deleteConversation = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteConversation.url(args, options),
    method: 'delete',
})

deleteConversation.definition = {
    methods: ["delete"],
    url: '/communication/conversations/{conversation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
deleteConversation.url = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return deleteConversation.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::deleteConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
deleteConversation.delete = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteConversation.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
    const deleteConversationForm = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteConversation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::deleteConversation
 * @see app/Http/Controllers/ApartmentModuleController.php:1165
 * @route '/communication/conversations/{conversation}'
 */
        deleteConversationForm.delete = (args: { conversation: number | { id: number } } | [conversation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteConversation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteConversation.form = deleteConversationForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::broadcast
 * @see app/Http/Controllers/ApartmentModuleController.php:1120
 * @route '/communication/broadcast'
 */
export const broadcast = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: broadcast.url(options),
    method: 'post',
})

broadcast.definition = {
    methods: ["post"],
    url: '/communication/broadcast',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::broadcast
 * @see app/Http/Controllers/ApartmentModuleController.php:1120
 * @route '/communication/broadcast'
 */
broadcast.url = (options?: RouteQueryOptions) => {
    return broadcast.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::broadcast
 * @see app/Http/Controllers/ApartmentModuleController.php:1120
 * @route '/communication/broadcast'
 */
broadcast.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: broadcast.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::broadcast
 * @see app/Http/Controllers/ApartmentModuleController.php:1120
 * @route '/communication/broadcast'
 */
    const broadcastForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: broadcast.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::broadcast
 * @see app/Http/Controllers/ApartmentModuleController.php:1120
 * @route '/communication/broadcast'
 */
        broadcastForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: broadcast.url(options),
            method: 'post',
        })
    
    broadcast.form = broadcastForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
export const maintenance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maintenance.url(options),
    method: 'get',
})

maintenance.definition = {
    methods: ["get","head"],
    url: '/maintenance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
maintenance.url = (options?: RouteQueryOptions) => {
    return maintenance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
maintenance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maintenance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
maintenance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: maintenance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
    const maintenanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: maintenance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
        maintenanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: maintenance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::maintenance
 * @see app/Http/Controllers/ApartmentModuleController.php:910
 * @route '/maintenance'
 */
        maintenanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: maintenance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    maintenance.form = maintenanceForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::storeMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:947
 * @route '/maintenance/reports'
 */
export const storeMaintenanceReport = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMaintenanceReport.url(options),
    method: 'post',
})

storeMaintenanceReport.definition = {
    methods: ["post"],
    url: '/maintenance/reports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::storeMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:947
 * @route '/maintenance/reports'
 */
storeMaintenanceReport.url = (options?: RouteQueryOptions) => {
    return storeMaintenanceReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::storeMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:947
 * @route '/maintenance/reports'
 */
storeMaintenanceReport.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMaintenanceReport.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::storeMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:947
 * @route '/maintenance/reports'
 */
    const storeMaintenanceReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMaintenanceReport.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::storeMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:947
 * @route '/maintenance/reports'
 */
        storeMaintenanceReportForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMaintenanceReport.url(options),
            method: 'post',
        })
    
    storeMaintenanceReport.form = storeMaintenanceReportForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::updateMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:1000
 * @route '/maintenance/reports/{report}'
 */
export const updateMaintenanceReport = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMaintenanceReport.url(args, options),
    method: 'patch',
})

updateMaintenanceReport.definition = {
    methods: ["patch"],
    url: '/maintenance/reports/{report}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:1000
 * @route '/maintenance/reports/{report}'
 */
updateMaintenanceReport.url = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { report: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { report: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    report: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        report: typeof args.report === 'object'
                ? args.report.id
                : args.report,
                }

    return updateMaintenanceReport.definition.url
            .replace('{report}', parsedArgs.report.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::updateMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:1000
 * @route '/maintenance/reports/{report}'
 */
updateMaintenanceReport.patch = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateMaintenanceReport.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::updateMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:1000
 * @route '/maintenance/reports/{report}'
 */
    const updateMaintenanceReportForm = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateMaintenanceReport.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::updateMaintenanceReport
 * @see app/Http/Controllers/ApartmentModuleController.php:1000
 * @route '/maintenance/reports/{report}'
 */
        updateMaintenanceReportForm.patch = (args: { report: number | { id: number } } | [report: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateMaintenanceReport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateMaintenanceReport.form = updateMaintenanceReportForm
/**
* @see \App\Http\Controllers\ApartmentModuleController::uploadRoomPhoto
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
export const uploadRoomPhoto = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadRoomPhoto.url(args, options),
    method: 'post',
})

uploadRoomPhoto.definition = {
    methods: ["post"],
    url: '/reservation/rooms/{room}/photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::uploadRoomPhoto
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
uploadRoomPhoto.url = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadRoomPhoto.definition.url
            .replace('{room}', parsedArgs.room.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::uploadRoomPhoto
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
uploadRoomPhoto.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadRoomPhoto.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::uploadRoomPhoto
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
    const uploadRoomPhotoForm = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadRoomPhoto.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::uploadRoomPhoto
 * @see app/Http/Controllers/ApartmentModuleController.php:974
 * @route '/reservation/rooms/{room}/photo'
 */
        uploadRoomPhotoForm.post = (args: { room: number | { id: number } } | [room: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadRoomPhoto.url(args, options),
            method: 'post',
        })
    
    uploadRoomPhoto.form = uploadRoomPhotoForm
const ApartmentModuleController = { dashboard, reservation, toggleRoom, reserveRoom, confirmCheckIn, cancelReservation, tenantManagement, storeTenant, updateTenant, extendStay, checkoutTenant, deleteTenant, billing, updateBilling, communication, openConversation, createConversation, sendMessage, deleteConversation, broadcast, maintenance, storeMaintenanceReport, updateMaintenanceReport, uploadRoomPhoto }

export default ApartmentModuleController