declare module 'jsonapi-react' {

  interface TypeDef {
      type: string
  }
  type SchemaEntry = TypeDef & {
      relationships?: Record<any, TypeDef>
  }

  interface IPlugin {
    initialize(client: ApiClient): void
  }

  type Falsey = false | undefined | null

  type QueryArg<TQueryParams = any> = Falsey | string | [
    type: string,
    queryParams?: TQueryParams,
    ...queryKeys: any[],
  ]

  export type QueryAction = {
      type: string,
      keys?: string[]
  } & any
  export type QueryActionFunc = (action: QueryAction) => void

  type StringMap = { [key: string]: any }
  type DefaultTData = StringMap | StringMap[]

  interface IResult<TData = StringMap | StringMap[]> {
    data?: TData
    meta?: StringMap
    links?: StringMap
    error?: StringMap
    errors?: StringMap[]
    refetch?: () => void
    isLoading?: boolean
    isFetching?: boolean
    client: ApiClient
  }

  // a json:api type
  type Type = string
  type MutationReqData = { type: string, id?: string, attributes?: object, relationships?: object }
  interface MutationReq { 
    type: string 
    data: null | MutationReqData
  }

  interface IConfig {
    url?: string
    mediaType?: string
    cacheTime?: number
    staleTime?: number
    headers?: {}
    ssrMode?: boolean
    formatError?: (error) => any
    formatErrors?: (errors) => any
    fetch?: (url: string, options: {}) => Promise<{}>
    stringify?: <TQueryParams = any>(q: TQueryParams) => string
    serialize: (type: string, data: object, schema: Schema) => MutationReq
    fetchOptions?: {},
    invalidate?: Type[]
  }

    type MutationFunc<TData> = (
        queryArg: QueryArg,
        mutate: TData,
        config?: IConfig
    ) => Promise<IResult<TData>>


    export interface Schema {
        type: string,
        relationships?: any
        fields?: Record<string, any>
    }

    type QueryParams = any

  export class Serializer {
    serialize(type: string, attrs: undefined | null | object): MutationReq
  }

  export class ApiClient {
    constructor({
      ...args
    }: {
      schema?: Record<string, Schema>,
      plugins?: IPlugin[]
    } & IConfig)

    addHeader(key: string, value: string): ApiClient

    clearCache(): void

    delete(queryArg: QueryArg, config?: IConfig): Promise<IResult<void>>

    fetch<T = DefaultTData>(
        queryArg: QueryArg, 
        config?: IConfig
    ): Promise<IResult<T>>

    isFetching(): boolean

    mutate<T = DefaultTData>(
      queryArg: QueryArg,
      data: Partial<T>,
      config?: MutationConfig
    ): Promise<IResult<T>>

    removeHeader(key: string): ApiClient

    subscribe(f: QueryActionFunc): void
  }


  export function ApiProvider({
    children,
    client,
  }: {
    children: React.ReactNode
    client: ApiClient
  }): JSX.Element

  export const ApiContext: React.Context<any>

  export function renderWithData(
    element: JSX.Element,
    client: ApiClient,
    config?: {}
  ): [content: string, initialState: any]

  export function useClient(): ApiClient

  export function useIsFetching(): { isFetching: boolean }

    type MutationConfig = {
      invalidate?: Type | Type[]
      method?: string
      client?: ApiClient
    }

  export function useMutation<TData = StringMap | StringMap[]>(
    queryArg: QueryArg,
    config?: MutationConfig
  ): [mutate: MutationFunc<TData>]

  export function useQuery<TData = StringMap | StringMap[]>(
    queryArg: QueryArg,
    config?: {
      cacheTime?: number
      staleTime?: number
      ssr?: boolean
      client?: ApiClient
      initialData?: TData
    }
  ): IResult<TData>
}