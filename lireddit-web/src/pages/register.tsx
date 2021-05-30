import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

interface RegisterProps {
	username: string;
}

export const Register: React.FC<RegisterProps> = ({ username }) => {
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={(values) => console.log(values)}
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
	);
};

export default Register;
