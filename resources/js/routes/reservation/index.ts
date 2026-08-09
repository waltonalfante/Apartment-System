import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import rooms from './rooms'
/**
* @see \App\Http\Controllers\ApartmentModuleController::checkin
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
export const checkin = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkin.url(args, options),
    method: 'post',
})

checkin.definition = {
    methods: ["post"],
    url: '/reservation/{reservation}/check-in',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkin
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
checkin.url = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkin.definition.url
            .replace('{reservation}', parsedArgs.reservation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ApartmentModuleController::checkin
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
checkin.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkin.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ApartmentModuleController::checkin
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
    const checkinForm = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: checkin.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ApartmentModuleController::checkin
 * @see app/Http/Controllers/ApartmentModuleController.php:387
 * @route '/reservation/{reservation}/check-in'
 */
        checkinForm.post = (args: { reservation: number | { id: number } } | [reservation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: checkin.url(args, options),
            method: 'post',
        })
    
    checkin.form = checkinForm
const reservation = {
    rooms: Object.assign(rooms, rooms),
checkin: Object.assign(checkin, checkin),
}

export default reservation