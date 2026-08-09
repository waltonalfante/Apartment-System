import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PasswordController::forgot
 * @see app/Http/Controllers/Api/PasswordController.php:16
 * @route '/api/forgot-password'
 */
export const forgot = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgot.url(options),
    method: 'post',
})

forgot.definition = {
    methods: ["post"],
    url: '/api/forgot-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PasswordController::forgot
 * @see app/Http/Controllers/Api/PasswordController.php:16
 * @route '/api/forgot-password'
 */
forgot.url = (options?: RouteQueryOptions) => {
    return forgot.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PasswordController::forgot
 * @see app/Http/Controllers/Api/PasswordController.php:16
 * @route '/api/forgot-password'
 */
forgot.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forgot.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PasswordController::forgot
 * @see app/Http/Controllers/Api/PasswordController.php:16
 * @route '/api/forgot-password'
 */
    const forgotForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: forgot.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PasswordController::forgot
 * @see app/Http/Controllers/Api/PasswordController.php:16
 * @route '/api/forgot-password'
 */
        forgotForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: forgot.url(options),
            method: 'post',
        })
    
    forgot.form = forgotForm
/**
* @see \App\Http\Controllers\Api\PasswordController::reset
 * @see app/Http/Controllers/Api/PasswordController.php:29
 * @route '/api/reset-password'
 */
export const reset = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

reset.definition = {
    methods: ["post"],
    url: '/api/reset-password',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PasswordController::reset
 * @see app/Http/Controllers/Api/PasswordController.php:29
 * @route '/api/reset-password'
 */
reset.url = (options?: RouteQueryOptions) => {
    return reset.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PasswordController::reset
 * @see app/Http/Controllers/Api/PasswordController.php:29
 * @route '/api/reset-password'
 */
reset.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reset.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\PasswordController::reset
 * @see app/Http/Controllers/Api/PasswordController.php:29
 * @route '/api/reset-password'
 */
    const resetForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reset.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\PasswordController::reset
 * @see app/Http/Controllers/Api/PasswordController.php:29
 * @route '/api/reset-password'
 */
        resetForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reset.url(options),
            method: 'post',
        })
    
    reset.form = resetForm
const PasswordController = { forgot, reset }

export default PasswordController