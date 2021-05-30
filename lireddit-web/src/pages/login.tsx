import { Box, Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import * as React from "react"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { useLoginMutation } from "../generated/graphql"

export const Login: React.FC = () => {
	const router = useRouter()
	const [, login] = useLoginMutation()
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({ options: values })
					if (response.data?.login.errors || !response.data?.login.user) {
						setErrors({ username: "username or password was invalid" })
					} else if (response.data?.login.user) {
						router.push("/")
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="username"
							placeholder="username"
							label="Username"
						/>
						<Box mt="8">
							<InputField
								name="password"
								placeholder="password"
								label="password"
								type="password"
							/>
						</Box>
						<Button
							colorScheme="teal"
							isDisabled={isSubmitting}
							type="submit"
							mt="4"
						>
							Login
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default Login
