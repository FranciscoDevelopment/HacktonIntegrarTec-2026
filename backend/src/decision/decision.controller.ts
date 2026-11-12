import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { CreateDecisionDto } from './dto/create-decision.dto';

@Controller('decision')
export class DecisionController {
  constructor(private readonly decisionService: DecisionService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createDecisionDto: CreateDecisionDto) {
    return this.decisionService.decide(createDecisionDto);
  }
}
