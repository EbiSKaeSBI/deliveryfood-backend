import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
    NotFoundException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        const { email, name, password } = registerDto;

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() }
            });

            if (existingUser) {
                throw new ConflictException("Пользователь с таким email уже существует");
            }

            const hashedPassword = await this.hashPassword(password);

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

            // Генерируем токены после регистрации
            const tokens = await this.generateTokens(user);
            await this.saveRefreshToken(user.id, tokens.refreshToken);

            return {
                message: "Пользователь успешно зарегистрирован",
                user,
                ...tokens
            };

        } catch(error) {
            if(error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException("Ошибка регистрации");
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("Неверный email или пароль");
        }

        const tokens = await this.generateTokens(user);
        await this.saveRefreshToken(user.id, tokens.refreshToken);

        return {
            message: "Успешный вход в систему",
            user,
            ...tokens
        };
    }

    async logout(refreshToken: string) {
        await this.prisma.token.deleteMany({
            where: { refreshToken }
        });

        return { message: "Успешный выход из системы" };
    }

    async refreshTokens(refreshToken: string) {
        try {
            // Проверяем валидность токена
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET
            });

            // Проверяем существование токена в базе
            const tokenRecord = await this.prisma.token.findFirst({
                where: {
                    refreshToken,
                    userId: payload.sub
                },
                include: { user: true }
            });

            if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                throw new UnauthorizedException("Недействительный refresh token");
            }

            // Генерируем новые токены
            const user = tokenRecord.user;
            const tokens = await this.generateTokens(user);

            // Обновляем refresh token в базе
            await this.updateRefreshToken(refreshToken, tokens.refreshToken);

            return {
                message: "Токены успешно обновлены",
                ...tokens
            };

        } catch (error) {
            throw new UnauthorizedException("Недействительный refresh token");
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }

    private async generateTokens(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m'
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            })
        ]);

        return { accessToken, refreshToken };
    }

    private async saveRefreshToken(userId: string, refreshToken: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

        await this.prisma.token.deleteMany({
            where: { userId }
        })


        await this.prisma.token.create({
            data: {
                refreshToken,
                userId,
                expiresAt
            }
        });
    }

    private async updateRefreshToken(oldToken: string, newToken: string) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.token.update({
            where: { refreshToken: oldToken },
            data: {
                refreshToken: newToken,
                expiresAt
            }
        });
    }

    private async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Пользователь не найден");
        }

        return user;
    }

    async getProfile(userId: string) {
        return this.findById(userId);
    }
}