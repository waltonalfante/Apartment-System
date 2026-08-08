import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import method2fa from './2fa'
/**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
export const method2faVerify = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: method2faVerify.url(options),
    method: 'get',
})

method2faVerify.definition = {
    methods: ["get","head"],
    url: '/auth/2fa-verify',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
method2faVerify.url = (options?: RouteQueryOptions) => {
    return method2faVerify.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
method2faVerify.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: method2faVerify.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
method2faVerify.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: method2faVerify.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
    const method2faVerifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: method2faVerify.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
        method2faVerifyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: method2faVerify.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:25
 * @route '/auth/2fa-verify'
 */
        method2faVerifyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: method2faVerify.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    method2faVerify.form = method2faVerifyForm
const auth = {
    2fa: Object.assign(method2fa, method2fa),
2faVerify: Object.assign(method2faVerify, method2faVerify),
}

export default auth