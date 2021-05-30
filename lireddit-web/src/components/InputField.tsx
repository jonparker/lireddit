import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from "@chakra-ui/react";
import { FieldInputProps, useField } from "formik";
import * as React from "react";

type InputFieldProps = {
	name: string;
	placeholder: string;
	label: string;
	type?: string;
};

export const InputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
	const [field, { error }] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor="name">{label}</FormLabel>
			<Input
				{...field}
				id={field.name}
				type={props.type || "text"}
				{...props}
				placeholder={props.placeholder}
			/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};

export default InputField;
