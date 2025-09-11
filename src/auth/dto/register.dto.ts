import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MinLength
} from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: "Не корректный email адрес" }) // Исправлено
    @IsNotEmpty({ message: "Email не должен быть пустым" })
    email: string;

    @IsString({ message: "Имя должно быть строчкой" })
    @IsNotEmpty({ message: "Имя не должно быть пустым" })
    @MinLength(2, { message: "Имя должно быть не короче 2 символов" })
    name: string;

    @IsNotEmpty({ message: "Пароль не должен быть пустым" })
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        {
            message: "Пароль должен содержать минимум 1 заглавную букву, 1 строчную, 1 цифру, 1 специальный символ и быть не короче 8 символов"
        }
    )
    password: string;
}