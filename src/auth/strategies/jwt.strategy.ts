import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {PrismaService} from "../../prisma/prisma.service";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService,
                private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("JWT_ACCESS_SECRET"),
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: {id: payload.sub},
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        })
        if(!user){
            throw new UnauthorizedException("Пользователь не найден")
        }
        return user;
    }

}

