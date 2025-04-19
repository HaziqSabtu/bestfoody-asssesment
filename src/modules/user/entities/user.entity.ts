export class User {
  public readonly id: string;
  public readonly firstName: string | null;
  public readonly lastName: string | null;
  public readonly email: string;
  public readonly password: string;
  public readonly createdAt: Date;

  constructor({
    id,
    firstName,
    lastName,
    email,
    password,
    createdAt,
  }: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    password: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
  }
}
