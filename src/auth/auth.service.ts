import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Model, PassportLocalModel } from 'mongoose';
import { IUser } from '../users/interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';

@Injectable()
export class AuthService {
constructor(private readonly usersService: UserService,private readonly projectService: ProjectService, @InjectModel('User') readonly userModel: PassportLocalModel<user>,private readonly jwtService: JwtService){}

async register(payload: createUserDto) {

try {
const user = new this.userModel({
email: payload.email,
username: payload.username
});
user.set('password', payload.password);
user.save();
const tokenProperties = this.createToken(user);
user.toSafeObject();
return tokenProperties;
} catch (error) {
throw error;
} 
}

    createToken(user) {
        console.log('get the expiration');
        const expiresIn = 3600;
        console.log('sign the token');
        console.log(user);

        const accessToken = jwt.sign({ id: user.id,
            email: user.username,
            firstname: user.firstName,
            lastname: user.lastName }, 'ILovePokemon', { expiresIn });
        console.log('return the token');
        console.log(accessToken);
        return {
            expiresIn,
            accessToken,
        };
    }
    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.usersService.findById(payload.id);
    }
}