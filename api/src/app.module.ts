import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppResolver } from './app.resolver';
import { PrismaService } from './prisma.service';
import { TalentLeadModule } from './talent-lead/talent-lead.module';
import { CandidateApplicationModule } from './candidate-application/candidate-application.module';
import { ContactRequestModule } from './contact-request/contact-request.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req }) => ({ req }),
    }),
    TalentLeadModule,
    CandidateApplicationModule,
    ContactRequestModule,
  ],
  controllers: [AppController],
  providers: [AppResolver, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
