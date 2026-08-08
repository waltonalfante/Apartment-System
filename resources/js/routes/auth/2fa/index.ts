import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::send
 * @see app/Http/Controllers/AuthController.php:16
 * @route '/auth/2fa/send'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/auth/2fa/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::send
 * @see app/Http/Controllers/AuthController.php:16
 * @route '/auth/2fa/send'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::send
 * @see app/Http/Controllers/AuthController.php:16
 * @route '/auth/2fa/send'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::send
 * @see app/Http/Controllers/AuthController.php:16
 * @route '/auth/2fa/send'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::send
 * @see app/Http/Controllers/AuthController.php:16
 * @route '/auth/2fa/send'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\AuthController::verify
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/auth/2fa/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/auth/2fa/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::verify
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/auth/2fa/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::verify
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/auth/2fa/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AuthController::verify
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/auth/2fa/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AuthController::verify
 * @see app/Http/Controllers/AuthController.php:45
 * @route '/auth/2fa/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const method2fa = {
    send: Object.assign(send, send),
verify: Object.assign(verify, verify),
}

export default method2fa