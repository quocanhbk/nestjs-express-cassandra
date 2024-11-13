import { FindSubQueryStatic } from './externals/express-cassandra.interface';

// Define relationship types as a union
type RelationType = 'MULTI' | 'SIMPLE' | 'MANY2ONE' | 'ONE2MANY' | 'ONE2ONE';

// Define direction type
type Direction = 'BOTH' | 'IN' | 'OUT';

// Define index types
type IndexType = 'Composite' | 'Mixed' | 'VertexCentric';

// Define order type
type OrderType = 'desc' | 'asc';
type GraphOrderType = 'incr' | 'decr';

// Improve cardinality type
type Cardinality = 'SINGLE' | 'LIST' | 'SET';

export interface EntityOptions<T extends object = object> {
  table_name?: string;

  key?: Array<keyof T | Array<keyof T>>;

  materialized_views?: Record<string, MaterializeViewStatic<T>>;

  clustering_order?: Partial<Record<keyof T, OrderType>>;

  options?: Readonly<EntityExtraOptions>;

  indexes?: Array<keyof T | string>;

  custom_indexes?: CustomIndexOptions[];

  methods?: Record<string, Function>;

  es_index_mapping?: {
    discover?: string;

    properties?: EsIndexPropertiesOptionsStatic<T>;
  };

  graph_mapping?: Partial<GraphMappingOptionsStatic<T>>;

  [index: string]: any;
}

export type ClusterOrder<T = any> = { [P in keyof T]?: 'desc' | 'asc' };

export interface MaterializeViewStatic<T> {
  select?: Array<keyof T>;

  key: Array<keyof T | Array<keyof T>>;

  clustering_order?: ClusterOrder<T>;

  filter?: FilterOptions<T>;
}

export interface EntityExtraOptions {
  timestamps?: {
    createdAt?: string;

    updatedAt?: string;
  };

  versions?: { key: string };
}

type FilterOptions<T> = Partial<{ [P in keyof T]: FindSubQueryStatic }>;

interface CustomIndexOptions {
  on: string;

  using: any;

  options: any;
}

type EsIndexPropertiesOptionsStatic<T> = {
  [P in keyof T]?: { type?: string; index?: string };
};

interface GraphMappingOptionsStatic<Entity extends object = object> {
  relations: {
    follow?: RelationType;

    mother?: RelationType;
  };

  properties: Record<
    string,
    {
      type?: JanusGraphDataTypes;

      cardinality?: Cardinality;
    }
  >;

  indexes: Record<
    string,
    {
      type?: IndexType;

      keys?: Array<keyof Entity | Record<string, never>>;

      label?: 'follow';

      direction?: Direction;

      order?: GraphOrderType;

      unique?: boolean;
    }
  >;
}

type JanusGraphDataTypes =
  | 'Integer'
  | 'String'
  | 'Character'
  | 'Boolean'
  | 'Byte'
  | 'Short'
  | 'Long'
  | 'Float'
  | 'Double'
  | 'Date'
  | 'Geoshape'
  | 'UUID';
