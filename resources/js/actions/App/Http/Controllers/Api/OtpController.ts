import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\OtpController::send
 * @see app/Http/Controllers/Api/OtpController.php:20
 * @route '/api/send-otp'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/api/send-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\OtpController::send
 * @see app/Http/Controllers/Api/OtpController.php:20
 * @route '/api/send-otp'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OtpController::send
 * @see app/Http/Controllers/Api/OtpController.php:20
 * @route '/api/send-otp'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\OtpController::send
 * @see app/Http/Controllers/Api/OtpController.php:20
 * @route '/api/send-otp'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\OtpController::send
 * @see app/Http/Controllers/Api/OtpController.php:20
 * @route '/api/send-otp'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Api\OtpController::verify
 * @see app/Http/Controllers/Api/OtpController.php:38
 * @route '/api/verify-otp'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/api/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\OtpController::verify
 * @see app/Http/Controllers/Api/OtpController.php:38
 * @route '/api/verify-otp'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OtpController::verify
 * @see app/Http/Controllers/Api/OtpController.php:38
 * @route '/api/verify-otp'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\OtpController::verify
 * @see app/Http/Controllers/Api/OtpController.php:38
 * @route '/api/verify-otp'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\OtpController::verify
 * @see app/Http/Controllers/Api/OtpController.php:38
 * @route '/api/verify-otp'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Api\OtpController::resend
 * @see app/Http/Controllers/Api/OtpController.php:59
 * @route '/api/resend-otp'
 */
export const resend = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

resend.definition = {
    methods: ["post"],
    url: '/api/resend-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\OtpController::resend
 * @see app/Http/Controllers/Api/OtpController.php:59
 * @route '/api/resend-otp'
 */
resend.url = (options?: RouteQueryOptions) => {
    return resend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\OtpController::resend
 * @see app/Http/Controllers/Api/OtpController.php:59
 * @route '/api/resend-otp'
 */
resend.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resend.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\OtpController::resend
 * @see app/Http/Controllers/Api/OtpController.php:59
 * @route '/api/resend-otp'
 */
    const resendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: resend.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\OtpController::resend
 * @see app/Http/Controllers/Api/OtpController.php:59
 * @route '/api/resend-otp'
 */
        resendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: resend.url(options),
            method: 'post',
        })
    
    resend.form = resendForm
const OtpController = { send, verify, resend }

export default OtpController