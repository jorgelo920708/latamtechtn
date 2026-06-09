import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { CvController } from './cv.controller';
import { AppResolver } from './app.resolver';
import { PrismaService } from './prisma.service';
import { TalentLeadModule } from './talent-lead/talent-lead.module';
import { CandidateApplicationModule } from './candidate-application/candidate-application.module';
import { ContactRequestModule } from './contact-request/contact-request.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { StatsModule } from './stats/stats.module';
import { CompanyModule } from './company/company.module';
import { PubSubModule } from './realtime/pubsub.module';

@Module({
  imports: [
    PubSubModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }) => ({ req }),
    }),
    TalentLeadModule,
    CandidateApplicationModule,
    ContactRequestModule,
    AuthModule,
    MailModule,
    StatsModule,
    CompanyModule,
  ],
  controllers: [AppController, CvController],
  providers: [AppResolver, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
