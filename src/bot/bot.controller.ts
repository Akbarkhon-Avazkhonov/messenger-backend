import { Body, Controller, Post } from '@nestjs/common';
import { BotService } from './bot.service';
import { TokenDto } from './dto/token.dto';

@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  // @Post()
  // create(@Body() createBotDto: CreateBotDto) {
  //   return this.botService.create(createBotDto);
  // }
  // @Get()
  // signInWIthQrCode() {
  //   this.botService.signInWithQrCode();
  //   return this.botService.getQrCode();
  // }

  @Post()
  async signInWithQrCode(@Body() token: TokenDto) {
    return this.botService.signInWithQrCode(token.token);
  }
}
