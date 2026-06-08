import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
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
      return {
        link: authLink.concat(httpLink.create({ uri: environment.apiUrl })),
        cache: new InMemoryCache(),
      };
    }),
  ],
};
