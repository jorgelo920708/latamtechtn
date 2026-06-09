import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

const ADMIN_TOKEN_KEY = 'admin_token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const authLink = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        if (token) {
          operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
            headers: { ...headers, Authorization: `Bearer ${token}` },
          }));
        }
        return forward(operation);
      });
      const http = authLink.concat(httpLink.create({ uri: environment.apiUrl }));

      // WebSocket link for real-time subscriptions (graphql-ws).
      const wsLink = new GraphQLWsLink(
        createClient({
          url: environment.apiUrl.replace(/^http/, 'ws'),
          lazy: true,
          retryAttempts: Infinity,
        }),
      );

      // Route subscriptions over the WebSocket, everything else over HTTP.
      const link = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === 'OperationDefinition' && def.operation === 'subscription';
        },
        wsLink,
        http,
      );

      return {
        link,
        cache: new InMemoryCache(),
      };
    }),
  ],
};
