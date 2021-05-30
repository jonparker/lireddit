import { ColorModeProvider, ThemeProvider } from "@chakra-ui/react"
import { createClient, dedupExchange, fetchExchange, Provider } from "urql"
import { Cache, cacheExchange, QueryInput } from "@urql/exchange-graphcache"
import {
	LoginMutation,
	MeDocument,
	MeQuery,
	RegisterMutation,
} from "../generated/graphql"

function betterUpdateQuery<Result, Query>(
	cache: Cache,
	qi: QueryInput,
	result: any,
	fn: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}

const client = createClient({
	url: "http://localhost:4000/graphql",
	fetchOptions: { credentials: "include" },
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					login: (res, args, cache, info) => {
						betterUpdateQuery<LoginMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							res,
							(result, query) => {
								if (result.login.errors) {
									return query
								} else {
									return {
										me: result.login.user,
									}
								}
							}
						)
					},
					register: (res, args, cache, info) => {
						betterUpdateQuery<RegisterMutation, MeQuery>(
							cache,
							{ query: MeDocument },
							res,
							(result, query) => {
								if (result.register.errors) {
									return query
								} else {
									return {
										me: result.register.user,
									}
								}
							}
						)
					},
				},
			},
		}),
		fetchExchange,
	],
})

import theme from "../theme"

function MyApp({ Component, pageProps }) {
	return (
		<Provider value={client}>
			<ThemeProvider theme={theme}>
				<ColorModeProvider
					options={{
						useSystemColorMode: true,
					}}
				>
					<Component {...pageProps} />
				</ColorModeProvider>
			</ThemeProvider>
		</Provider>
	)
}

export default MyApp
