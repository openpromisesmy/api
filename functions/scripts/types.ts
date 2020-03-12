export interface IFindKeywordInObjectFieldsParams {
  object: {
    [key: string]: any;
  };
  fields: string[];
  keyword: string;
}

export interface IPrintLengthParams {
  [key: string]: any;
}
