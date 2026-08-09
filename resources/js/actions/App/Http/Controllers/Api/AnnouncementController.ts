import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AnnouncementController::send
 * @see app/Http/Controllers/Api/AnnouncementController.php:17
 * @route '/api/send-announcement'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/api/send-announcement',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AnnouncementController::send
 * @see app/Http/Controllers/Api/AnnouncementController.php:17
 * @route '/api/send-announcement'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnnouncementController::send
 * @see app/Http/Controllers/Api/AnnouncementController.php:17
 * @route '/api/send-announcement'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AnnouncementController::send
 * @see app/Http/Controllers/Api/AnnouncementController.php:17
 * @route '/api/send-announcement'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AnnouncementController::send
 * @see app/Http/Controllers/Api/AnnouncementController.php:17
 * @route '/api/send-announcement'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AnnouncementController::index
 * @see app/Http/Controllers/Api/AnnouncementController.php:38
 * @route '/api/announcements'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const AnnouncementController = { send, index }

export default AnnouncementController