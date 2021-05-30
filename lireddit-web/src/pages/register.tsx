import { Box, Button } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import * as React from "react"
import InputField from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { useRegisterMutation } from "../generated/graphql"
import { toErrorsMap } from "../utils/toErrorMap"
import { useRouter } from "next/router"

export const Register: React.FC = () => {
	const router = useRouter()
	const [, register] = useRegisterMutation()
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values)
					if (response.data?.register.errors) {
						setErrors(toErrorsMap(response.data?.register.errors))
					} else if (response.data?.register.user) {
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
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	)
}

export default Register
