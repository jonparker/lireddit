import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as React from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

const REGISTER_MUT = `
mutation Register($username:String!, $password: String!) {
    register(options: { username: $username, password: $password}) {
      user {
        username
      }
      errors {
        message
        field
      }
    }
  }      
  `;

export const Register: React.FC = () => {
	const [, register] = useMutation(REGISTER_MUT);
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: "", password: "" }}
				onSubmit={(values) => register(values)}
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
