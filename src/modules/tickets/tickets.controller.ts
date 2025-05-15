import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { BuyTicketDto } from "./dto/buy-ticket.dto";

@ApiTags("tickets")
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Post("buy-ticket")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  buyTicket(@Body() buyTicketDto: BuyTicketDto, @Req() req: any) {
    return this.ticketsService.buyTicket(buyTicketDto, req);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param("id") id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param("id") id: string) {
    return this.ticketsService.remove(id);
  }
}
