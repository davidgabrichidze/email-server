import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { EmailDto, EmailsFindDto } from './dtos';

@ApiTags('emails')
@Controller({
  path: 'emails',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Post('find')
  find(@Body() payload: EmailsFindDto) {
    return this.appService.find(payload);
  }

  @Post('send')
  send(@Body() payload: EmailDto) {
    return this.appService.send(payload);
  }

  @Post('save')
  save(@Body() payload: EmailDto) {
    return this.appService.save(payload);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appService.delete({ ids: [id] });
  }

  @Patch(':id/mark-as-read')
  markRead(@Param('id') id: string) {
    return this.appService.markRead({ ids: [id], read: true });
  }

  @Patch(':id/mark-as-unread')
  markUnread(@Param('id') id: string) {
    return this.appService.markRead({ ids: [id], read: false });
  }
}
