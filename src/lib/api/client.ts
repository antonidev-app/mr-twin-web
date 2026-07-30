import { PUBLIC_API_BASE_URL } from '$env/static/public';

export class ApiError extends Error {
	status: number;
	body: unknown;

	constructor(status: number, message: string, body: unknown) {
		super(message);
		this.status = status;
		this.body = body;
	}
}

type ApiFetchOptions = {
	method?: string;
	body?: unknown;
	token?: string | null;
	fetch?: typeof fetch;
	params?: Record<string, string | number | undefined>;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
	const f = options.fetch ?? fetch;
	const url = new URL(path, PUBLIC_API_BASE_URL);

	for (const [key, value] of Object.entries(options.params ?? {})) {
		if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
	}

	const headers: Record<string, string> = { Accept: 'application/json' };
	if (options.body !== undefined) headers['Content-Type'] = 'application/json';
	if (options.token) headers.Authorization = `Bearer ${options.token}`;

	const response = await f(url.toString(), {
		method: options.method ?? 'GET',
		headers,
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined
	});

	const isJson = response.headers.get('content-type')?.includes('application/json');
	const data = isJson ? await response.json() : null;

	if (!response.ok) {
		throw new ApiError(response.status, data?.message ?? response.statusText, data);
	}

	return data as T;
}
