import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import conversations from './conversations'
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
const communication = {
    conversations: Object.assign(conversations, conversations),
broadcast: Object.assign(broadcast, broadcast),
}

export default communication