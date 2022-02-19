import {
  Controller,
  Get,
  Req,
  Post,
  Query,
  UseGuards,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { TwoFactorAuthService } from '../twofactorauth/2fa.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
    private readonly _twoFAService: TwoFactorAuthService,
  ) { }


  @UseGuards(JwtAuthGuard)
  @Get('isAuthorized')
  isAuthenticated() {
    return true;
  }

  @Get('/oauth_page')
  getOauthPage() {
    return {
      page: 'https://api.intra.42.fr/oauth/authorize?client_id=802dd62932bab69d1e0168a42ed0567a6b83267c134fb2f62d583c14b2a4ce97&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code',
    };
  }

  @Post('/access_token')
  async authenticate(@Query() paninationQuery: any, @Res() response) {
    const { code, twoFA } = paninationQuery;
    const newUser: CreateUserDto = await this._authService.getUserData(code);
    if (!newUser) throw new BadRequestException('Invalid User or token');
    let userExist = await this._usersService.findByUserName(newUser.username);
    if (!userExist) {
      userExist = await this._usersService.create(newUser);
      return await this._authService.sendJwtAccessToken(response, userExist, false);
    }

    // const isValid2FACode = this._twoFAService.is2FactorAuthCodeValid(
    //   twoFA,
    //   userExist,
    // );
    // if (!isValid2FACode) return { twoFA: true, error: 'Invalid 2fa code!' };
    await this._authService.sendJwtAccessToken(response, userExist, false);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Req() req) {
    console.log('WTF');
    return req.user;
  }
}
