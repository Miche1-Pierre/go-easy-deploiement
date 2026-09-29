import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "@domain/entities/User";
import { UserRole } from "@domain/entities/enums";
import { RegisterDTO } from "@restapi/dto/auth/RegisterDTO";
import { HttpErrorMiddleware } from "@restapi/middlewares/HttpErrorMiddleware";
import { env } from "@shared/config/env";
import { LoginDTO } from "@restapi/dto/auth/LoginDTO";
import { AppDataSource } from "@shared/config/data-source";
import { Repository } from "typeorm";

export interface PublicUser {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export class AuthService {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  private toPublicUser(user: User): PublicUser {
    const { id, email, password, firstName, lastName, role } = user;
    return { id, email, password, firstName, lastName, role };
  }

  private signToken(user: User): string {
    const options: SignOptions = {
      expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(
      { sub: user.id, role: user.role, ver: user.tokenVersion },
      env.jwt.secret,
      { ...options, algorithm: "HS256" },
    );
  }

  async register(
    dto: RegisterDTO,
  ): Promise<{ user: PublicUser; token: string }> {
    const existing = await this.repository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new HttpErrorMiddleware(409, "E-mail déjà utilisé");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.repository.create({
      email: dto.email,
      password: passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? UserRole.TOURIST,
    });
    await this.repository.save(user);

    return { user: this.toPublicUser(user), token: this.signToken(user) };
  }

  async login(dto: LoginDTO): Promise<{ user: PublicUser; token: string }> {
    const user = await this.repository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new HttpErrorMiddleware(401, "Identifiants invalides");
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new HttpErrorMiddleware(401, "Identifiants invalides");
    }
    return { user: this.toPublicUser(user), token: this.signToken(user) };
  }

  async me(userId: number): Promise<PublicUser> {
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpErrorMiddleware(404, "Utilisateur introuvable");
    }
    return this.toPublicUser(user);
  }

  //incrémenter tokenVersion invalide d'un coup tous les JWT déjà émis pour cet
  //utilisateur : authnMiddleware compare ce compteur à celui inscrit dans le token
  async revokeTokens(userId: number): Promise<void> {
    await this.repository.increment({ id: userId }, "tokenVersion", 1);
  }
}
