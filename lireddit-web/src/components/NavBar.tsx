import { Box, Flex, Link } from "@chakra-ui/react"
import NextLink from "next/link"
import * as React from "react"
import { useMeQuery } from "../generated/graphql"

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [{ data, fetching }] = useMeQuery()
	let body = null

	if (fetching) {
		body = null
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<Link mr={2}>login</Link>
				</NextLink>
				<NextLink href="/register">
					<Link mr={2}>register</Link>
				</NextLink>
			</>
		)
	} else {
		body = (
			<Flex>
				<Box mr={2}>{data.me.username}</Box>
				<NextLink href="/logout">
					<Link>logout</Link>
				</NextLink>
			</Flex>
		)
	}
	return (
		<Flex bg="tan" p={4}>
			<Box ml={"auto"}>{body}</Box>
		</Flex>
	)
}

export default NavBar
