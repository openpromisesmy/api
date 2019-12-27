export interface FindKeywordInObjectFieldsParams {
  object: {
    [key: string]: any;
  };
  fields: string[];
  keyword: string;
}

export interface PrintLengthParams {
  [key: string]: any;
}
