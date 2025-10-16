import { IsString, IsEmail, IsOptional, MinLength, IsPhoneNumber, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
    name: string;

    @IsOptional()
    @IsEmail({}, { message: 'Неверный формат email' })
    email: string;

    @IsOptional()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'Текущий пароль должен содержать минимум 6 символов' })
    currentPassword: string;

    @ValidateIf(o => o.currentPassword)
    @IsString()
    @MinLength(6, { message: 'Новый пароль должен содержать минимум 6 символов' })
    newPassword: string;
}