import {isEmail, isNotEmpty, isString, isStrongPassword,MinLength} from "class-validator";


export class RegisterDto {
    @isEmail({}, { message: "Не корректный email адрес"})
    @isNotEmpty({message: "Email не должен быть пустым"})
    emil: string

    @isString({}, {message: "Имя должно быть строчкой"})
    @isNotEmpty({message: "Имя не должно быть пустым"})
    @MinLength(2,{message: "Имя должно быть не короче 2 символов"})
    name: string

    @isNotEmpty({message:"Пароль не должен быть пустым"})
    @isStrongPassword({message: "'Пароль должен содержать минимум 1 заглавную букву, 1 строчную, 1 цифру и быть не короче 8 символов"},{
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
    password: string
}