import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EmailController::send
 * @see app/Http/Controllers/Api/EmailController.php:20
 * @route '/api/send-email'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/api/send-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EmailController::send
 * @see app/Http/Controllers/Api/EmailController.php:20
 * @route '/api/send-email'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EmailController::send
 * @see app/Http/Controllers/Api/EmailController.php:20
 * @route '/api/send-email'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EmailController::send
 * @see app/Http/Controllers/Api/EmailController.php:20
 * @route '/api/send-email'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EmailController::send
 * @see app/Http/Controllers/Api/EmailController.php:20
 * @route '/api/send-email'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Api\EmailController::sendAnnouncement
 * @see app/Http/Controllers/Api/EmailController.php:48
 * @route '/api/send-announcement-email'
 */
export const sendAnnouncement = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendAnnouncement.url(options),
    method: 'post',
})

sendAnnouncement.definition = {
    methods: ["post"],
    url: '/api/send-announcement-email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EmailController::sendAnnouncement
 * @see app/Http/Controllers/Api/EmailController.php:48
 * @route '/api/send-announcement-email'
 */
sendAnnouncement.url = (options?: RouteQueryOptions) => {
    return sendAnnouncement.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EmailController::sendAnnouncement
 * @see app/Http/Controllers/Api/EmailController.php:48
 * @route '/api/send-announcement-email'
 */
sendAnnouncement.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendAnnouncement.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EmailController::sendAnnouncement
 * @see app/Http/Controllers/Api/EmailController.php:48
 * @route '/api/send-announcement-email'
 */
    const sendAnnouncementForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendAnnouncement.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EmailController::sendAnnouncement
 * @see app/Http/Controllers/Api/EmailController.php:48
 * @route '/api/send-announcement-email'
 */
        sendAnnouncementForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendAnnouncement.url(options),
            method: 'post',
        })
    
    sendAnnouncement.form = sendAnnouncementForm
/**
* @see \App\Http\Controllers\Api\EmailController::sendTenantMessage
 * @see app/Http/Controllers/Api/EmailController.php:53
 * @route '/api/send-tenant-message'
 */
export const sendTenantMessage = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTenantMessage.url(options),
    method: 'post',
})

sendTenantMessage.definition = {
    methods: ["post"],
    url: '/api/send-tenant-message',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EmailController::sendTenantMessage
 * @see app/Http/Controllers/Api/EmailController.php:53
 * @route '/api/send-tenant-message'
 */
sendTenantMessage.url = (options?: RouteQueryOptions) => {
    return sendTenantMessage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EmailController::sendTenantMessage
 * @see app/Http/Controllers/Api/EmailController.php:53
 * @route '/api/send-tenant-message'
 */
sendTenantMessage.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTenantMessage.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EmailController::sendTenantMessage
 * @see app/Http/Controllers/Api/EmailController.php:53
 * @route '/api/send-tenant-message'
 */
    const sendTenantMessageForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendTenantMessage.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EmailController::sendTenantMessage
 * @see app/Http/Controllers/Api/EmailController.php:53
 * @route '/api/send-tenant-message'
 */
        sendTenantMessageForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendTenantMessage.url(options),
            method: 'post',
        })
    
    sendTenantMessage.form = sendTenantMessageForm
const EmailController = { send, sendAnnouncement, sendTenantMessage }

export default EmailController