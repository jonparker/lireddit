import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";

@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export default class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req, em }: MyContext) {
		// you are not logged in
		if (!req.session.userid) {
			return null;
		}
		return await em.findOne(User, { id: req.session.userid });
	}

	@Mutation(() => UserResponse)
	async register(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { req, em }: MyContext
	): Promise<UserResponse> {
		const userExists = await em.findOne(User, { username: options.username });

		if (userExists || options.username.length <= 2) {
			return {
				errors: [
					{
						field: "username",
						message: userExists
							? "username already exists"
							: "username must be at least three characters",
					},
				],
			};
		}
		if (options.password.length <= 2) {
			return {
				errors: [
					{
						field: "password",
						message: "password must be longer than two characters",
					},
				],
			};
		}
		// password should be hashed
		const user = em.create(User, {
			username: options.username,
			password: options.password,
		});

		await em.persistAndFlush(user);
		// login user
		req.session.userid = user.id;

		return {
			user,
		};
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg("options") options: UsernamePasswordInput,
		@Ctx() { em, req }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });

		// yeah, should be hashed.
		const valid = user && user.password === options.password;

		if (!valid) {
			return {
				errors: [
					{
						field: "username or password",
						message: "invalid username or password",
					},
				],
			};
		}

		req.session.userid = user?.id;

		return { user: user || undefined };
	}
}
