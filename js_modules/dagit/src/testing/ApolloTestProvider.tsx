import {ApolloClient, ApolloProvider} from '@apollo/client';
import {SchemaLink} from '@apollo/client/link/schema';
import {mergeResolvers} from '@graphql-tools/merge';
import {addMocksToSchema} from '@graphql-tools/mock';
import {makeExecutableSchema} from '@graphql-tools/schema';
import {loader} from 'graphql.macro';
import * as React from 'react';

import {AppCache} from 'src/AppCache';
import {defaultMocks} from 'src/testing/defaultMocks';

interface Props {
  children: React.ReactNode;
  mocks?: any;
}

const typeDefs = loader('../schema.graphql');
const schema = makeExecutableSchema({typeDefs});

export const ApolloTestProvider = (props: Props) => {
  const {children, mocks} = props;

  const client = React.useMemo(() => {
    const withMerge = mergeResolvers([defaultMocks, mocks]);
    const withMocks = addMocksToSchema({schema, mocks: withMerge});
    return new ApolloClient({
      cache: AppCache,
      link: new SchemaLink({schema: withMocks}),
    });
  }, [mocks]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
