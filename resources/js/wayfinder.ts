export type RouteQueryOptions = {
    query?: Record<string, string | number | boolean | null | undefined>;
    mergeQuery?: Record<string, string | number | boolean | null | undefined>;
};

export type RouteDefinition<M extends string | string[] = string> = {
    url: string;
    method: M;
};

export type RouteFormDefinition<M extends string = string> = {
    action: string;
    method: M;
};

export function queryParams(options?: RouteQueryOptions): string {
    const params = options?.query ?? options?.mergeQuery;
    if (!params || Object.keys(params).length === 0) return '';

    const search = new URLSearchParams();
    for (const key of Object.keys(params)) {
        const value = (params as any)[key];
        if (value === undefined || value === null) continue;
        if (typeof value === 'object') {
            try {
                search.append(key, JSON.stringify(value));
            } catch {
                search.append(key, String(value));
            }
        } else {
            search.append(key, String(value));
        }
    }

    const q = search.toString();
    return q ? `?${q}` : '';
}

export function applyUrlDefaults<T extends Record<string, any>>(args: T): T {
    return args;
}

export default {
    queryParams,
};
