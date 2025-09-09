import {ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {RegisterDto} from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async register(registerDto: RegisterDto): Promise<void> {
        const { name, email, password } = RegisterDto;


    try {
        const existingUser = await this.prisma.user.findUnique({
        where: {
            email
        },
    });

    if (existingUser) {
        throw new ConflictException("Пользователь с таким email уже существует");
    }

    const hashedPassword = await this.hashedPassword(password);

    const user = await this.prisma.user.create({
        data: {
            email: email.toLowerCase().trim(),
            name: name.trim(),
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        },
    });

    return {
        message: "Пользователь успешно зарегистрирован",
        user,
    }





} catch(error) {
        if(error instanceof ConflictException) {
        throw error;
        }
        throw new InternalServerErrorException("Ошибка регистрации");
    }
    }
    private async hashedPassword(password: string): Promise<string>{
        const saltRounds = 10
        return bcrypt.hash(password, saltRounds)
    }

    async validateUser(email: string, password: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email.toLowerCase(),
            }
        })

        if (user && await bcrypt.compare(password, user.password)) {
            const {password: _, ...result } = user;
            return result
        }

        return null
    }

    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
}

