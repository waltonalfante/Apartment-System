import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import managementD2a520 from './management'
/**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
export const management = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})

management.definition = {
    methods: ["get","head"],
    url: '/tenant-management',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
management.url = (options?: RouteQueryOptions) => {
    return management.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
management.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: management.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
management.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: management.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
    const managementForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: management.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
        managementForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: management.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ApartmentModuleController::management
 * @see app/Http/Controllers/ApartmentModuleController.php:112
 * @route '/tenant-management'
 */
        managementForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: management.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    management.form = managementForm
const tenant = {
    management: Object.assign(management, managementD2a520),
}

export default tenant