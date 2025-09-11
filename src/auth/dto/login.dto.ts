import {IsEmail, IsNotEmpty, IsString} from "class-validator";


export class LoginDto {

    @IsEmail({}, {message: "Не корректный email адрес"})
    @IsNotEmpty({message: 'Email не должен быть пустым'})
    email: string;

    @IsString({message: "Пароль должен быть строкой"})
    @IsNotEmpty({message: "Пароль не должен быть пустым"})
    password: string;

}